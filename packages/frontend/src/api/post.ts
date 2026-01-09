import {
  GetLatestPostsQuery,
  GetLatestPostsQueryVariables,
  GetPostEssayQuestionsQuery,
  GetPostMetaQuery,
  GetPostMetaQueryVariables,
  GetPostQuery,
  GetPostQueryVariables,
  GetPostsEssayAnswersWithLikesQuery,
  GetPostsEssayAnswersWithLikesQueryVariables,
} from '__generated__/operations/post.generated'

import { sendRestGqlRequest } from '@/utils/send-rest-gql'

export const getLatestPosts = async (
  variables: GetLatestPostsQueryVariables
) => {
  const response = await sendRestGqlRequest<GetLatestPostsQuery>({
    operation: 'latest-posts',
    method: 'GET',
    variables,
  })
  return response?.data?.data?.posts
}

export const getPost = async (variables: GetPostQueryVariables) => {
  const response = await sendRestGqlRequest<GetPostQuery>({
    operation: 'post-detail',
    method: 'GET',
    variables,
  })
  return response?.data?.data?.post
}

export const getPostMeta = async (
  variables: GetPostMetaQueryVariables
): Promise<GetPostMetaQuery['post']> => {
  const response = await sendRestGqlRequest<GetPostMetaQuery>({
    operation: 'post-meta',
    method: 'GET',
    variables,
  })
  return response?.data?.data?.post
}

export const getPostsEssayAnswersWithLikes = async (
  variables: GetPostsEssayAnswersWithLikesQueryVariables
) => {
  const response = await sendRestGqlRequest<GetPostsEssayAnswersWithLikesQuery>(
    {
      operation: 'posts-essay-answers-with-likes',
      method: 'GET',
      variables,
    }
  )
  return response?.data?.data?.posts
}

export const getPostEssayQuestionsByPostSlug = async ({
  slug,
}: {
  slug: string
}) => {
  const response = await sendRestGqlRequest<GetPostEssayQuestionsQuery>({
    operation: 'post-essay-questions',
    method: 'GET',
    variables: { where: { slug } },
  })
  return response?.data?.data?.post
}
