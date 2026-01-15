import {
  GetTopicProjectsQuery,
  GetTopicProjectsQueryVariables,
} from '__generated__/operations/content.generated'

import { sendRestGqlRequest } from '@/utils/send-rest-gql'

export const getTopicProjects = async (
  variables: GetTopicProjectsQueryVariables
) => {
  const response = await sendRestGqlRequest<GetTopicProjectsQuery>({
    operation: 'topic-projects',
    method: 'GET',
    variables,
  })

  return response?.data?.data?.projects
}
