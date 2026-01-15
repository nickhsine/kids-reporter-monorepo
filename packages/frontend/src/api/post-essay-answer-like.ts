import {
  CreatePostEssayAnswerLikeMutation,
  CreatePostEssayAnswerLikeMutationVariables,
  DeletePostEssayAnswerLikeMutation,
  DeletePostEssayAnswerLikeMutationVariables,
} from '__generated__/operations/answers.generated'

import { sendRestGqlRequest } from '@/utils/send-rest-gql'

export const createPostEssayAnswerLike = async (
  variables: CreatePostEssayAnswerLikeMutationVariables,
  accessToken: string
) => {
  const response = await sendRestGqlRequest<CreatePostEssayAnswerLikeMutation>({
    operation: 'create-post-essay-answer-like',
    method: 'POST',
    variables,
    authToken: accessToken,
  })
  return response?.data?.data?.createPostEssayAnswerLike
}

export const deletePostEssayAnswerLike = async (
  variables: DeletePostEssayAnswerLikeMutationVariables,
  accessToken: string
) => {
  const response = await sendRestGqlRequest<DeletePostEssayAnswerLikeMutation>({
    operation: 'delete-post-essay-answer-like',
    method: 'POST',
    variables,
    authToken: accessToken,
  })
  return response?.data?.data?.deletePostEssayAnswerLike
}
