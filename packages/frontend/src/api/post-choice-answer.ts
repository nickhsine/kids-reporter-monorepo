import {
  CreatePostChoiceAnswerMutation,
  CreatePostChoiceAnswerMutationVariables,
  GetPostChoiceAnswersQuery,
  GetPostChoiceAnswersQueryVariables,
  UpdatePostChoiceAnswerMutation,
  UpdatePostChoiceAnswerMutationVariables,
} from '__generated__/operations/answers.generated'

import { sendRestGqlRequest } from '@/utils/send-rest-gql'

export const getPostChoiceAnswersByMemberId = async (
  memberId: string,
  accessToken: string,
  postSlug?: string
) => {
  const variables: GetPostChoiceAnswersQueryVariables = {
    where: {
      member: { id: { equals: memberId } },
      ...(postSlug && { question: { post: { slug: { equals: postSlug } } } }),
    },
  }

  const response = await sendRestGqlRequest<GetPostChoiceAnswersQuery>({
    operation: 'post-choice-answers',
    method: 'GET',
    variables,
    authToken: accessToken,
  })
  return response?.data?.data?.postChoiceAnswers ?? []
}
export const createPostChoiceAnswer = async (
  variables: CreatePostChoiceAnswerMutationVariables,
  accessToken: string
) => {
  const response = await sendRestGqlRequest<CreatePostChoiceAnswerMutation>({
    operation: 'create-post-choice-answer',
    method: 'POST',
    variables,
    authToken: accessToken,
  })
  return response?.data?.data?.createPostChoiceAnswer
}

export const updatePostChoiceAnswer = async (
  variables: UpdatePostChoiceAnswerMutationVariables,
  accessToken: string
) => {
  const response = await sendRestGqlRequest<UpdatePostChoiceAnswerMutation>({
    operation: 'update-post-choice-answer',
    method: 'POST',
    variables,
    authToken: accessToken,
  })
  return response?.data?.data?.updatePostChoiceAnswer
}
