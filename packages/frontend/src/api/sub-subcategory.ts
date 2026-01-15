import {
  GetSubSubcategoryPostsQuery,
  GetSubSubcategoryPostsQueryVariables,
} from '__generated__/operations/content.generated'

import { sendRestGqlRequest } from '@/utils/send-rest-gql'

export const getSubSubcategoryPosts = async (
  variables: GetSubSubcategoryPostsQueryVariables
) => {
  const response = await sendRestGqlRequest<GetSubSubcategoryPostsQuery>({
    operation: 'sub-subcategory-posts',
    method: 'GET',
    variables,
  })
  return response?.data?.data?.subSubcategory
}
