import { ensureRecord, Operation, parseVars, toInt } from './shared.js'

export const operations: Record<string, Operation> = {
  'post-choice-answers': {
    method: 'GET',
    auth: 'auth',
    operationName: 'GetPostChoiceAnswers',
    document: `
      query GetPostChoiceAnswers($where: PostChoiceAnswerWhereInput!) {
        postChoiceAnswers(where: $where) {
          id
          question { id }
          member { id }
          choiceIndex
          correct
        }
      }
    `,
    buildVariables: (req) => {
      const input = ensureRecord(parseVars(req), 'Missing variables')
      return { where: ensureRecord(input.where, 'Missing where') }
    },
  },
  'create-post-choice-answer': {
    method: 'POST',
    auth: 'auth',
    operationName: 'CreatePostChoiceAnswer',
    document: `
      mutation CreatePostChoiceAnswer($data: PostChoiceAnswerCreateInput!) {
        createPostChoiceAnswer(data: $data) {
          question { id }
          choiceIndex
          correct
        }
      }
    `,
    buildVariables: (req) => {
      const input = ensureRecord(parseVars(req), 'Missing variables')
      return { data: ensureRecord(input.data, 'Missing data') }
    },
  },
  'update-post-choice-answer': {
    method: 'POST',
    auth: 'auth',
    operationName: 'UpdatePostChoiceAnswer',
    document: `
      mutation UpdatePostChoiceAnswer(
        $id: ID!
        $data: PostChoiceAnswerUpdateInput!
      ) {
        updatePostChoiceAnswer(where: { id: $id }, data: $data) {
          id
          choiceIndex
          correct
        }
      }
    `,
    buildVariables: (req) => {
      const input = ensureRecord(parseVars(req), 'Missing variables')
      const id = input.id
      if (typeof id !== 'string') {
        throw new Error('Missing id')
      }
      return { id, data: ensureRecord(input.data, 'Missing data') }
    },
  },
  'post-essay-answers': {
    method: 'GET',
    auth: 'auth',
    operationName: 'GetPostEssayAnswers',
    document: `
      query GetPostEssayAnswers($where: PostEssayAnswerWhereInput!) {
        postEssayAnswers(where: $where) {
          id
          question { id }
          member { id }
          content
        }
      }
    `,
    buildVariables: (req) => {
      const input = ensureRecord(parseVars(req), 'Missing variables')
      return { where: ensureRecord(input.where, 'Missing where') }
    },
  },
  'all-post-essay-answers': {
    method: 'GET',
    cacheTtl: 60,
    auth: 'public',
    operationName: 'GetAllPostEssayAnswers',
    document: `
      query GetAllPostEssayAnswers(
        $orderBy: [PostEssayAnswerOrderByInput!]!
        $take: Int
  ) {
    postEssayAnswers(orderBy: $orderBy, take: $take) {
      id
      question { id }
      member {
            id
            avatar { fileUrl }
            nickname
            name
          }
          content
          likesCount
        }
      }
    `,
    buildVariables: (req) => {
      const input = ensureRecord(parseVars(req), 'Missing variables')
      return {
        orderBy: Array.isArray(input.orderBy)
          ? input.orderBy
          : [{ createdAt: 'desc' }],
        take: toInt(input.take),
      }
    },
  },
  'create-post-essay-answer': {
    method: 'POST',
    auth: 'auth',
    operationName: 'CreatePostEssayAnswer',
    document: `
      mutation CreatePostEssayAnswer($data: PostEssayAnswerCreateInput!) {
        createPostEssayAnswer(data: $data) {
          question { id }
          content
        }
      }
    `,
    buildVariables: (req) => {
      const input = ensureRecord(parseVars(req), 'Missing variables')
      return { data: ensureRecord(input.data, 'Missing data') }
    },
  },
  'update-post-essay-answer': {
    method: 'POST',
    auth: 'auth',
    operationName: 'UpdatePostEssayAnswer',
    document: `
      mutation UpdatePostEssayAnswer(
        $id: ID!
        $data: PostEssayAnswerUpdateInput!
      ) {
        updatePostEssayAnswer(where: { id: $id }, data: $data) {
          id
          content
        }
      }
    `,
    buildVariables: (req) => {
      const input = ensureRecord(parseVars(req), 'Missing variables')
      const id = input.id
      if (typeof id !== 'string') {
        throw new Error('Missing id')
      }
      return { id, data: ensureRecord(input.data, 'Missing data') }
    },
  },
  'post-essay-question-answers': {
    method: 'GET',
    auth: 'public',
    operationName: 'GetEssayQuestionEssayAnswers',
    document: `
      query GetEssayQuestionEssayAnswers(
        $where: PostEssayQuestionWhereUniqueInput!
        $answerOrderBy: [PostEssayAnswerOrderByInput!]!
        $answerTake: Int!
        $answerSkip: Int
      ) {
        postEssayQuestion(where: $where) {
          id
          title
          hint
          answers(orderBy: $answerOrderBy, take: $answerTake, skip: $answerSkip) {
            id
            content
            member {
              id
              avatar { fileUrl id }
              name
              nickname
              email
            }
            likesCount
          }
        }
      }
    `,
    buildVariables: (req) => {
      const input = ensureRecord(parseVars(req), 'Missing variables')
      return {
        where: ensureRecord(input.where, 'Missing where'),
        answerOrderBy: Array.isArray(input.answerOrderBy)
          ? input.answerOrderBy
          : [ensureRecord(input.answerOrderBy, 'Missing answerOrderBy')],
        answerTake: toInt(input.answerTake),
        answerSkip: toInt(input.answerSkip),
      }
    },
  },
  'create-post-essay-answer-like': {
    method: 'POST',
    auth: 'auth',
    operationName: 'CreatePostEssayAnswerLike',
    document: `
      mutation CreatePostEssayAnswerLike(
        $data: PostEssayAnswerLikeCreateInput!
      ) {
        createPostEssayAnswerLike(data: $data) {
          answer { id }
          member { id }
        }
      }
    `,
    buildVariables: (req) => {
      const input = ensureRecord(parseVars(req), 'Missing variables')
      return { data: ensureRecord(input.data, 'Missing data') }
    },
  },
  'delete-post-essay-answer-like': {
    method: 'POST',
    auth: 'auth',
    operationName: 'DeletePostEssayAnswerLike',
    document: `
      mutation DeletePostEssayAnswerLike(
        $where: PostEssayAnswerLikeWhereUniqueInput!
      ) {
        deletePostEssayAnswerLike(where: $where) {
          id
        }
      }
    `,
    buildVariables: (req) => {
      const input = ensureRecord(parseVars(req), 'Missing variables')
      return { where: ensureRecord(input.where, 'Missing where') }
    },
  },
}
