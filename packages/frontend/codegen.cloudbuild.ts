import { CodegenConfig } from '@graphql-codegen/cli'

const schemaPath = 'schema.graphql'
const documents = 'graphql/operations/**/*.ts'

// Generated artifacts are written to packages/frontend/__generated__ so that
// imports can use the "__generated__/" alias configured in tsconfig.json.
const config: CodegenConfig = {
  overwrite: true,
  schema: schemaPath,
  documents,
  generates: {
    '__generated__/types.ts': {
      plugins: ['typescript'],
      config: {
        maybeValue: 'T | undefined',
        inputMaybeValue: 'T | undefined',
        enumsAsTypes: true,
        scalars: {
          DateTime: 'string',
          JSON: 'any',
          PasswordState: 'string',
        },
      },
    },
    '__generated__/operations': {
      plugins: ['typescript-operations'],
      preset: 'near-operation-file',
      presetConfig: {
        extension: '.generated.ts',
        // baseTypesPath is resolved *from the generated file location*.
        // generated ops: ./__generated__/operations/*.generated.ts
        // base types:    ./__generated__/types.ts
        baseTypesPath: '../types.ts',

        // folder is resolved *from each operation file's directory*.
        //
        // from: ./graphql/operations/<operation-file>.ts (directory)
        // to:   ./__generated__/operations
        //
        // ⚠️ NOTE:
        // This relative path assumes operation files are only one level deep.
        // If operations become nested (operations/**), this value may need adjustment
        // because each additional subfolder adds one more ".." to the relative path.
        folder: '../../__generated__/operations',
      },
      config: {
        maybeValue: 'T | undefined',
        inputMaybeValue: 'T | undefined',
        scalars: {
          DateTime: 'string',
          JSON: 'any',
          PasswordState: 'string',
        },
      },
    },
  },
  hooks: {
    afterAllFileWrite: ['prettier --write __generated__/**/*.ts'],
  },
}

export default config
