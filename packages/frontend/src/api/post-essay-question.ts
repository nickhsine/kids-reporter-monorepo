import { GetEssayQuestionEssayAnswersQuery } from '__generated__/operations/answers.generated'
import {
  PostEssayAnswerOrderByInput,
  PostEssayQuestionWhereUniqueInput,
} from '__generated__/types'

import { sendRestGqlRequest } from '@/utils/send-rest-gql'

export const getPostEssayQuestionEssayAnswers = async ({
  where,
  answerOrderBy,
  answerTake,
  answerSkip,
}: {
  where: PostEssayQuestionWhereUniqueInput
  answerOrderBy: PostEssayAnswerOrderByInput[]
  answerTake: number
  answerSkip: number
}) => {
  const response = await sendRestGqlRequest<GetEssayQuestionEssayAnswersQuery>({
    operation: 'post-essay-question-answers',
    method: 'GET',
    variables: {
      where,
      answerOrderBy,
      answerTake,
      answerSkip,
    },
  })
  return response?.data?.data?.postEssayQuestion?.answers ?? []
}
