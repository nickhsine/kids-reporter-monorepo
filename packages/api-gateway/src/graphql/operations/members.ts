import gql from 'graphql-tag'

import { ensureRecord, Operation, toInt } from './shared.js'

export const operations: Record<string, Operation> = {
  'member-profile': {
    method: 'GET',
    auth: 'auth',
    operationName: 'GetMemberProfile',
    document: gql`
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
          avatar {
            id
            fileUrl
          }
          createdAt
        }
      }
    `,
    buildVariables: (input) => {
      return { where: ensureRecord(input.where, 'Missing where') }
    },
  },
  'update-member-profile': {
    method: 'POST',
    auth: 'auth',
    operationName: 'UpdateMemberProfile',
    document: gql`
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
          avatar {
            id
          }
        }
      }
    `,
    buildVariables: (input) => {
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
    document: gql`
      query GetMemberPostsWithAnswers($take: Int, $nextCursor: String) {
        getMemberPostsWithAnswers(take: $take, cursor: $nextCursor)
      }
    `,
    buildVariables: (input) => {
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
    document: gql`
      mutation DeleteMemberAvatar($where: MemberAvatarWhereUniqueInput!) {
        deleteMemberAvatar(where: $where) {
          id
        }
      }
    `,
    buildVariables: (input) => {
      return { where: ensureRecord(input.where, 'Missing where') }
    },
  },
  'member-essay-answers-has-liked': {
    method: 'GET',
    auth: 'auth',
    operationName: 'GetMemberEssayAnswersHasLiked',
    document: gql`
      query GetMemberEssayAnswersHasLiked($essayAnswerIds: [ID!]!) {
        getMemberEssayAnswersHasLiked(essayAnswerIds: $essayAnswerIds) {
          essayAnswerId
          hasLiked
        }
      }
    `,
    buildVariables: (input) => {
      if (!Array.isArray(input.essayAnswerIds)) {
        throw new Error('Missing essayAnswerIds')
      }
      return { essayAnswerIds: input.essayAnswerIds }
    },
  },
}
