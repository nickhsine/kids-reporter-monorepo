import {
  CreatePostEssayAnswerMutation,
  CreatePostEssayAnswerMutationVariables,
  GetAllPostEssayAnswersQuery,
  GetAllPostEssayAnswersQueryVariables,
  GetPostEssayAnswersQuery,
  GetPostEssayAnswersQueryVariables,
  UpdatePostEssayAnswerMutation,
  UpdatePostEssayAnswerMutationVariables,
} from '__generated__/operations/answers.generated'
import { PostEssayAnswerOrderByInput } from '__generated__/types'

import { sendRestGqlRequest } from '@/utils/send-rest-gql'

export const getPostEssayAnswersByMemberId = async (
  memberId: string,
  accessToken: string,
  postSlug?: string
) => {
  const variables: GetPostEssayAnswersQueryVariables = {
    where: {
      member: { id: { equals: memberId } },
      ...(postSlug && { question: { post: { slug: { equals: postSlug } } } }),
    },
  }
  const response = await sendRestGqlRequest<GetPostEssayAnswersQuery>({
    operation: 'post-essay-answers',
    method: 'GET',
    variables,
    authToken: accessToken,
  })
  return response?.data?.data?.postEssayAnswers ?? []
}

export const getAllPostEssayAnswers = async (
  orderBy?: PostEssayAnswerOrderByInput[],
  take?: number
) => {
  const variables: GetAllPostEssayAnswersQueryVariables = {
    orderBy: orderBy ?? [],
    take: take ?? 10,
  }
  const response = await sendRestGqlRequest<GetAllPostEssayAnswersQuery>({
    operation: 'all-post-essay-answers',
    method: 'GET',
    variables,
  })
  return response?.data?.data?.postEssayAnswers ?? []
}

export const createPostEssayAnswer = async (
  variables: CreatePostEssayAnswerMutationVariables,
  accessToken: string
) => {
  const response = await sendRestGqlRequest<CreatePostEssayAnswerMutation>({
    operation: 'create-post-essay-answer',
    method: 'POST',
    variables,
    authToken: accessToken,
  })
  return response?.data?.data?.createPostEssayAnswer
}

export const updatePostEssayAnswer = async (
  variables: UpdatePostEssayAnswerMutationVariables,
  accessToken: string
) => {
  const response = await sendRestGqlRequest<UpdatePostEssayAnswerMutation>({
    operation: 'update-post-essay-answer',
    method: 'POST',
    variables,
    authToken: accessToken,
  })

  return response?.data?.data?.updatePostEssayAnswer
}
