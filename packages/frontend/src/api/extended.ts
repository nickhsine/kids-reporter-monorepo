import {
  GetMemberEssayAnswersHasLikedQuery,
  GetMemberEssayAnswersHasLikedQueryVariables,
  GetMemberPostsWithAnswersQueryVariables,
} from '__generated__/operations/members.generated'

import { sendRestGqlRequest } from '@/utils/send-rest-gql'

export type GetMemberPostsWithAnswersQuerySchema = {
  getMemberPostsWithAnswers: {
    posts: {
      id: string
      title: string
      slug: string
      publishedDate: string
      essayAnswers: {
        id: string
        content: string
        likesCount: number
        createdAt: string
        updatedAt: string
        question: {
          id: string
          title: string
          hint: string | null
          post: {
            id: string
          }
        }
      }[]
      choiceAnswers: {
        id: string
        choiceIndex: number
        correct: boolean
        createdAt: string
        updatedAt: string
        question: {
          id: string
          title: string
          options: { content: string; isCorrectAnswer: boolean }[]
          reason: string | null
          post: {
            id: string
          }
        }
      }[]
      lastAnsweredTime: string
    }[]
    nextCursor: string | null
  }
}

export const getMemberPostsWithAnswers = async (
  variables: GetMemberPostsWithAnswersQueryVariables & { accessToken: string }
) => {
  const { accessToken, ...restVariables } = variables
  const response =
    await sendRestGqlRequest<GetMemberPostsWithAnswersQuerySchema>({
      operation: 'member-posts-with-answers',
      method: 'GET',
      variables: restVariables,
      authToken: accessToken,
    })
  return response?.data?.data?.getMemberPostsWithAnswers
}

export const getMemberEssayAnswersHasLiked = async (
  variables: GetMemberEssayAnswersHasLikedQueryVariables & {
    accessToken: string
  }
) => {
  const { accessToken, ...restVariables } = variables
  const response = await sendRestGqlRequest<GetMemberEssayAnswersHasLikedQuery>(
    {
      operation: 'member-essay-answers-has-liked',
      method: 'GET',
      variables: restVariables,
      authToken: accessToken,
    }
  )
  return response?.data?.data?.getMemberEssayAnswersHasLiked
}
