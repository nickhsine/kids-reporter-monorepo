import {
  CreatePostEssayAnswerLikeMutationVariables,
  DeletePostEssayAnswerLikeMutationVariables,
} from '__generated__/operations/answers.generated'
import { useMutation } from '@tanstack/react-query'

import {
  createPostEssayAnswerLike,
  deletePostEssayAnswerLike,
} from '@/api/post-essay-answer-like'

export function useCreatePostEssayAnswerLikeMutation({
  accessToken,
}: {
  accessToken: string
}) {
  return useMutation({
    mutationFn: (variables: CreatePostEssayAnswerLikeMutationVariables) =>
      createPostEssayAnswerLike(variables, accessToken),
  })
}

export function useDeletePostEssayAnswerLikeMutation({
  accessToken,
}: {
  accessToken: string
}) {
  return useMutation({
    mutationFn: (variables: DeletePostEssayAnswerLikeMutationVariables) =>
      deletePostEssayAnswerLike(variables, accessToken),
  })
}
