// @ts-ignore `@twreporter/errors` does not have typescript definition file yet
import _errors from '@twreporter/errors'
import express from 'express'

import consts from '../constants.js'
import { buildAuthContext } from '../graphql/auth.js'
import { callCmsGraphql } from '../graphql/cms-client.js'
import { operations } from '../graphql/operations.js'
import { ensureRecord, parseVars } from '../graphql/operations/shared.js'

const errors = _errors.default
const statusCodes = consts.statusCodes
const MAX_LOG_BODY_BYTES = 1024
const CLIENT_GQL_ERROR_CODES = new Set([
  'BAD_USER_INPUT',
  'GRAPHQL_VALIDATION_FAILED',
])

const logResponse = (
  res: express.Response,
  status: number,
  payload: unknown
) => {
  let serialized = ''
  let serializeError: string | undefined
  try {
    serialized = JSON.stringify(payload)
  } catch (err) {
    serialized = '"[unserializable payload]"'
    serializeError = (err as Error).message
  }

  const byteLength = Buffer.byteLength(serialized, 'utf8')
  const errorInfo = serializeError
    ? { unserializable: true, serializeError }
    : null
  let bodyForLog: unknown = errorInfo
  if (!bodyForLog) {
    if (status === statusCodes.ok) {
      bodyForLog = { byteLength }
    } else if (byteLength > MAX_LOG_BODY_BYTES) {
      bodyForLog = {
        truncated: true,
        byteLength,
        preview: serialized.slice(0, MAX_LOG_BODY_BYTES),
      }
    } else {
      bodyForLog = payload
    }
  }

  console.log(
    JSON.stringify({
      severity: 'INFO',
      message: 'GraphQL REST response',
      status,
      body: bodyForLog,
      ...res?.locals?.globalLogFields,
    })
  )

  return res.status(status).json(payload)
}

export function createGqlRestRouter({
  apiOrigin,
  headlessAccount,
}: {
  apiOrigin: string
  headlessAccount: { email: string; password: string }
}) {
  const router = express.Router()

  // Register method-specific handlers for each operation
  Object.entries(operations).forEach(([operationName, op]) => {
    const method = op.method.toLowerCase() as keyof express.Router
    const methodFn = router[method]

    if (typeof methodFn === 'function') {
      ;(
        methodFn as (
          this: express.Router,
          path: string,
          handler: express.RequestHandler
        ) => void
      ).call(router, `/api/rest/${operationName}`, async (req, res) => {
        let variables
        try {
          const input = ensureRecord(parseVars(req), 'Missing variables')
          variables = op.buildVariables(input)
        } catch (err) {
          return logResponse(res, statusCodes.badRequest, {
            status: 'fail',
            data: {
              message: 'buildVariables fails. ' + (err as Error).message,
            },
          })
        }

        let authContext
        try {
          authContext = await buildAuthContext({
            req,
            apiOrigin,
            headlessAccount,
            auth: op.auth,
          })
        } catch (err) {
          return logResponse(res, statusCodes.badRequest, {
            status: 'fail',
            data: {
              message: 'buildAuthContext fails. ' + (err as Error).message,
            },
          })
        }

        try {
          const gqlRes = await callCmsGraphql({
            apiOrigin,
            document: op.document,
            variables,
            operationName: op.operationName,
            headers: authContext.headers,
            originalCookie: authContext.originalCookie,
            mode: authContext.mode,
            tokenManager: authContext.tokenManager,
          })

          if (op.auth === 'auth') {
            res.set('Cache-Control', 'no-store')
          } else if (op.cacheTtl && op.method === 'GET') {
            res.set('Cache-Control', `public, max-age=${op.cacheTtl}`)
          }

          const gqlPayload = gqlRes?.data

          if (gqlPayload?.errors?.length) {
            const hasClientError = gqlPayload.errors.some(
              (error: { extensions?: { code?: string } }) =>
                CLIENT_GQL_ERROR_CODES.has(error?.extensions?.code ?? '')
            )
            return logResponse(
              res,
              hasClientError
                ? statusCodes.badRequest
                : statusCodes.internalServerError,
              {
                status: 'error',
                message: 'CMS GraphQL responded with errors',
                errors: gqlPayload.errors,
              }
            )
          }

          return logResponse(res, statusCodes.ok, {
            status: 'success',
            data: gqlPayload?.data ?? {},
          })
        } catch (err) {
          const annotatedErr = errors.helpers.wrap(
            err,
            'GraphQLRestError',
            'Failed to call CMS GraphQL'
          )
          console.log(
            JSON.stringify({
              severity: 'ERROR',
              message: errors.helpers.printAll(annotatedErr, {
                withStack: true,
                withPayload: true,
              }),
              ...res?.locals?.globalLogFields,
            })
          )
          return logResponse(res, statusCodes.internalServerError, {
            status: 'error',
            message: 'Failed to process request',
          })
        }
      })
    }
  })

  router.all('/api/rest/:operation', (req, res) => {
    const op = operations[req.params.operation]
    if (!op) {
      return logResponse(res, statusCodes.badRequest, {
        status: 'fail',
        data: {
          message: `Unknown operation: '${req.params.operation}'. Available operations: [${Object.keys(operations).join(', ')}]`,
        },
      })
    }
    return logResponse(res, statusCodes.methodNotAllowed, {
      status: 'fail',
      data: { message: `Use ${op.method}` },
    })
  })

  return router
}
