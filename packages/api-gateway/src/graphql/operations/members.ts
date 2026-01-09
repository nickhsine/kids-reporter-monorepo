import { ensureRecord, Operation, parseVars, toInt } from './shared.js'

export const operations: Record<string, Operation> = {
  'member-profile': {
    method: 'GET',
    auth: 'auth',
    operationName: 'GetMemberProfile',
    document: `
      query GetMemberProfile($where: MemberWhereUniqueInput!) {
        member(where: $where) {
          id
          name
          email
          nickname
          contactEmail
          twreporter_user_id
          showBaodaozai
          essayQuestionCount
          avatar { id fileUrl }
          createdAt
        }
      }
    `,
    buildVariables: (req) => {
      const input = ensureRecord(parseVars(req), 'Missing variables')
      return { where: ensureRecord(input.where, 'Missing where') }
    },
  },
  'update-member-profile': {
    method: 'POST',
    auth: 'auth',
    operationName: 'UpdateMemberProfile',
    document: `
      mutation UpdateMemberProfile(
        $where: MemberWhereUniqueInput!
        $data: MemberUpdateInput!
      ) {
        updateMember(where: $where, data: $data) {
          id
          name
          nickname
          contactEmail
          showBaodaozai
          essayQuestionCount
          avatar { id }
        }
      }
    `,
    buildVariables: (req) => {
      const input = ensureRecord(parseVars(req), 'Missing variables')
      return {
        where: ensureRecord(input.where, 'Missing where'),
        data: ensureRecord(input.data, 'Missing data'),
      }
    },
  },
  'member-posts-with-answers': {
    method: 'GET',
    auth: 'auth',
    operationName: 'GetMemberPostsWithAnswers',
    document: `
      query GetMemberPostsWithAnswers(
        $take: Int
        $nextCursor: String
      ) {
        getMemberPostsWithAnswers(
          take: $take
          cursor: $nextCursor
        )
      }
    `,
    buildVariables: (req) => {
      const input = ensureRecord(parseVars(req), 'Missing variables')
      return {
        take: toInt(input.take),
        nextCursor:
          typeof input.nextCursor === 'string' ? input.nextCursor : undefined,
      }
    },
  },
  'delete-member-avatar': {
    method: 'POST',
    auth: 'auth',
    operationName: 'DeleteMemberAvatar',
    document: `
      mutation DeleteMemberAvatar($where: MemberAvatarWhereUniqueInput!) {
        deleteMemberAvatar(where: $where) {
          id
        }
      }
    `,
    buildVariables: (req) => {
      const input = ensureRecord(parseVars(req), 'Missing variables')
      return { where: ensureRecord(input.where, 'Missing where') }
    },
  },
  'member-essay-answers-has-liked': {
    method: 'GET',
    auth: 'auth',
    operationName: 'GetMemberEssayAnswersHasLiked',
    document: `
      query GetMemberEssayAnswersHasLiked($essayAnswerIds: [ID!]!) {
        getMemberEssayAnswersHasLiked(essayAnswerIds: $essayAnswerIds) {
          essayAnswerId
          hasLiked
        }
      }
    `,
    buildVariables: (req) => {
      const input = ensureRecord(parseVars(req), 'Missing variables')
      if (!Array.isArray(input.essayAnswerIds)) {
        throw new Error('Missing essayAnswerIds')
      }
      return { essayAnswerIds: input.essayAnswerIds }
    },
  },
}
