import {
  CreatePostEssayAnswerMutationVariables,
  UpdatePostEssayAnswerMutationVariables,
} from '__generated__/operations/answers.generated'
import { PostEssayAnswerOrderByInput } from '__generated__/types'
import { useMutation, useQuery } from '@tanstack/react-query'

import {
  createPostEssayAnswer,
  getAllPostEssayAnswers,
  getPostEssayAnswersByMemberId,
  updatePostEssayAnswer,
} from '@/api/post-essay-answer'

const POST_ESSAY_ANSWERS_QUERY_KEY = 'post-essay-answers'

export function usePostEssayAnswersQuery({
  memberId,
  accessToken,
  postSlug,
}: {
  memberId: string
  accessToken: string
  postSlug?: string
}) {
  return useQuery({
    queryKey: usePostEssayAnswersQuery.getQueryKey({ memberId, postSlug }),
    queryFn: () =>
      getPostEssayAnswersByMemberId(memberId, accessToken, postSlug),
    enabled: !!memberId && !!accessToken,
    staleTime: Infinity,
  })
}
usePostEssayAnswersQuery.getQueryKey = ({
  memberId,
  postSlug,
}: {
  memberId: string
  postSlug?: string
}) => [POST_ESSAY_ANSWERS_QUERY_KEY, memberId, postSlug ?? 'all-posts']

export function useAllPostEssayAnswersQuery({
  orderBy,
  take,
}: {
  orderBy?: PostEssayAnswerOrderByInput[]
  take?: number
}) {
  return useQuery({
    queryKey: useAllPostEssayAnswersQuery.getQueryKey({ orderBy, take }),
    queryFn: () => getAllPostEssayAnswers(orderBy, take),
    staleTime: Infinity,
  })
}

useAllPostEssayAnswersQuery.getQueryKey = ({
  orderBy,
  take,
}: {
  orderBy?: PostEssayAnswerOrderByInput[]
  take?: number
}) => [
  POST_ESSAY_ANSWERS_QUERY_KEY,
  'all-members',
  'all-posts',
  ...(orderBy ? [orderBy] : []),
  ...(take ? [take] : []),
]

export function useCreatePostEssayAnswerMutation({
  accessToken,
}: {
  accessToken: string
}) {
  return useMutation({
    mutationFn: (variables: CreatePostEssayAnswerMutationVariables) =>
      createPostEssayAnswer(variables, accessToken),
  })
}

export function useUpdatePostEssayAnswerMutation({
  accessToken,
}: {
  accessToken: string
}) {
  return useMutation({
    mutationFn: (variables: UpdatePostEssayAnswerMutationVariables) =>
      updatePostEssayAnswer(variables, accessToken),
  })
}
