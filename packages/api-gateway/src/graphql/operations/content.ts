import {
  ensureArray,
  ensureRecord,
  normalizeBoolean,
  normalizeOrderBy,
  Operation,
  postContentFragment,
  toInt,
} from './shared.js'

export const operations: Record<string, Operation> = {
  'latest-posts': {
    method: 'GET',
    cacheTtl: 120,
    auth: 'public',
    operationName: 'GetLatestPosts',
    document: `
      ${postContentFragment}
      query GetLatestPosts($orderBy: [PostOrderByInput!]!, $take: Int) {
        posts(orderBy: $orderBy, take: $take) {
          ...PostContent
        }
      }
    `,
    buildVariables: (input) => {
      const take = toInt(input.take)
      const orderBy = normalizeOrderBy(input.orderBy, [
        { publishedDate: 'desc' },
      ])
      return { orderBy, take }
    },
  },
  'editor-picks-settings': {
    method: 'GET',
    cacheTtl: 120,
    auth: 'public',
    operationName: 'GetEditorPicksSettings',
    document: `
      ${postContentFragment}
      query GetEditorPicksSettings($take: Int) {
        editorPicksSettings(take: $take) {
          id
          editorPicksOfPostsOrdered {
            ...PostContent
          }
          editorPicksOfTags { name slug }
        }
      }
    `,
    buildVariables: (input) => {
      return { take: toInt(input.take) }
    },
  },
  'call-baodaozai-intro': {
    method: 'GET',
    cacheTtl: 300,
    auth: 'public',
    operationName: 'GetCallBaodaozaiIntro',
    document: `
      query GetCallBaodaozaiIntro($where: CallBaodaozaiIntroWhereUniqueInput!) {
        callBaodaozaiIntro(where: $where) {
          id
          page
          content
        }
      }
    `,
    buildVariables: (input) => {
      const where = ensureRecord(input.where, 'Missing where')
      const page = where.page
      if (typeof page !== 'string') {
        throw new Error('Missing where.page')
      }
      return { where: { page } }
    },
  },
  'category-posts': {
    method: 'GET',
    cacheTtl: 120,
    auth: 'public',
    operationName: 'GetCategoryPosts',
    document: `
      ${postContentFragment}
      query GetCategoryPosts(
        $where: CategoryWhereUniqueInput!
        $take: Int
        $skip: Int
      ) {
        category(where: $where) {
          relatedPosts(take: $take, skip: $skip) {
            ...PostContent
          }
          relatedPostsCount
        }
      }
    `,
    buildVariables: (input) => {
      return {
        where: ensureRecord(input.where, 'Missing where'),
        take: toInt(input.take),
        skip: toInt(input.skip),
      }
    },
  },
  'category-metadata': {
    method: 'GET',
    cacheTtl: 120,
    auth: 'public',
    operationName: 'GetCategoryMetadata',
    document: `
      query GetCategoryMetadata(
        $categoryWhere: CategoryWhereUniqueInput!
        $subcategoryWhere: SubcategoryWhereInput!
      ) {
        category(where: $categoryWhere) {
          ogTitle
          ogDescription
          ogImage { resized { medium } }
          subcategories(where: $subcategoryWhere) {
            ogTitle
            ogDescription
            ogImage { resized { medium } }
          }
        }
      }
    `,
    buildVariables: (input) => {
      return {
        categoryWhere: ensureRecord(
          input.categoryWhere,
          'Missing categoryWhere'
        ),
        subcategoryWhere: ensureRecord(
          input.subcategoryWhere,
          'Missing subcategoryWhere'
        ),
      }
    },
  },
  'category-subcategories-and-theme-color': {
    method: 'GET',
    cacheTtl: 120,
    auth: 'public',
    operationName: 'GetCategorySubcategoriesAndThemeColor',
    document: `
      query GetCategorySubcategoriesAndThemeColor(
        $where: CategoryWhereUniqueInput!
      ) {
        category(where: $where) {
          subcategories { name slug }
          themeColor
        }
      }
    `,
    buildVariables: (input) => {
      return { where: ensureRecord(input.where, 'Missing where') }
    },
  },
  'subcategory-posts': {
    method: 'GET',
    cacheTtl: 120,
    auth: 'public',
    operationName: 'GetSubcategoryPosts',
    document: `
      ${postContentFragment}
      query GetSubcategoryPosts(
        $where: SubcategoryWhereUniqueInput!
        $take: Int
        $skip: Int
      ) {
        subcategory(where: $where) {
          relatedPosts(take: $take, skip: $skip) {
            ...PostContent
          }
          relatedPostsCount
          category { slug }
        }
      }
    `,
    buildVariables: (input) => {
      return {
        where: ensureRecord(input.where, 'Missing where'),
        take: toInt(input.take),
        skip: toInt(input.skip),
      }
    },
  },
  'sub-subcategory-posts': {
    method: 'GET',
    cacheTtl: 120,
    auth: 'public',
    operationName: 'GetSubSubcategoryPosts',
    document: `
      ${postContentFragment}
      query GetSubSubcategoryPosts(
        $where: SubSubcategoryWhereUniqueInput!
        $take: Int
        $skip: Int
        $orderBy: [PostOrderByInput!]!
      ) {
        subSubcategory(where: $where) {
          relatedPosts(take: $take, skip: $skip, orderBy: $orderBy) {
            ...PostContent
          }
          relatedPostsCount
          subcategory {
            slug
            category { slug }
          }
        }
      }
    `,
    buildVariables: (input) => {
      return {
        where: ensureRecord(input.where, 'Missing where'),
        take: toInt(input.take),
        skip: toInt(input.skip),
        orderBy: ensureArray(input.orderBy, 'Missing orderBy'),
      }
    },
  },
  'topic-projects': {
    method: 'GET',
    cacheTtl: 120,
    auth: 'public',
    operationName: 'GetTopicProjects',
    document: `
      query GetTopicProjects($orderBy: [ProjectOrderByInput!]!, $take: Int) {
        projects(orderBy: $orderBy, take: $take) {
          title
          subtitle
          slug
          heroImage { resized { small } }
        }
      }
    `,
    buildVariables: (input) => {
      return {
        orderBy: ensureArray(input.orderBy, 'Missing orderBy'),
        take: toInt(input.take),
      }
    },
  },
  'post-detail': {
    method: 'GET',
    cacheTtl: 120,
    auth: 'public',
    operationName: 'GetPost',
    document: `
      ${postContentFragment}
      query GetPost(
        $where: PostWhereUniqueInput!
        $orderBy: [NewsReadingGroupItemOrderByInput!]!
        $take: Int
        $relatedPostsWhere: PostWhereInput!
        $postEssayQuestionsTake: Int
        $postChoiceQuestionsTake: Int
      ) {
        post(where: $where) {
          opening
          title
          showBaodaozai
          newsReadingGroup { items(orderBy: $orderBy) { name embedCode } }
          brief
          content
          publishedDate
          heroImage {
            imageFile { width height }
            resized { small medium large }
          }
          heroCaption
          authors {
            avatar { resized { tiny } }
            bio
            id
            name
            slug
          }
          authorsJSON
          tagsOrdered { name slug }
          TWReporterRelatedPostsJSON
          relatedPostsOrdered {
            title
            slug
            publishedDate
            heroImage { resized { small medium large } }
            ogDescription
            subSubcategoriesOrdered {
              name
              slug
              subcategory {
                name
                slug
                category { name slug themeColor }
              }
            }
          }
          subtitle
          subSubcategoriesOrdered {
            name
            slug
            subcategory {
              name
              slug
              category { name slug themeColor }
            }
          }
          mainProject { title slug }
          projects {
            title
            slug
            relatedPosts(take: $take, where: $relatedPostsWhere) {
              ...PostContent
            }
          }
          postEssayQuestions(take: $postEssayQuestionsTake) {
            id
            title
            hint
          }
          postChoiceQuestions(take: $postChoiceQuestionsTake) {
            id
            title
            options
            reason
          }
        }
      }
    `,
    buildVariables: (input) => {
      return {
        where: ensureRecord(input.where, 'Missing where'),
        orderBy: ensureArray(input.orderBy, 'Missing orderBy'),
        take: toInt(input.take),
        relatedPostsWhere: ensureRecord(
          input.relatedPostsWhere,
          'Missing relatedPostsWhere'
        ),
        postEssayQuestionsTake: toInt(input.postEssayQuestionsTake),
        postChoiceQuestionsTake: toInt(input.postChoiceQuestionsTake),
      }
    },
  },
  'post-meta': {
    method: 'GET',
    cacheTtl: 120,
    auth: 'public',
    operationName: 'GetPostMeta',
    document: `
      query GetPostMeta($where: PostWhereUniqueInput!) {
        post(where: $where) {
          publishedDate
          ogDescription
          ogTitle
          ogImage { resized { small } }
          subSubcategoriesOrdered {
            name
            slug
            subcategory {
              name
              slug
              category { name slug themeColor }
            }
          }
        }
      }
    `,
    buildVariables: (input) => {
      return { where: ensureRecord(input.where, 'Missing where') }
    },
  },
  'posts-count': {
    method: 'GET',
    cacheTtl: 120,
    auth: 'public',
    operationName: 'PostsCount',
    document: `
      query PostsCount {
        postsCount
      }
    `,
    buildVariables: () => ({}),
  },
  'posts-paged': {
    method: 'GET',
    cacheTtl: 120,
    auth: 'public',
    operationName: 'GetPosts',
    document: `
      ${postContentFragment}
      query GetPosts($orderBy: [PostOrderByInput!]!, $take: Int, $skip: Int) {
        posts(orderBy: $orderBy, take: $take, skip: $skip) {
          ...PostContent
        }
      }
    `,
    buildVariables: (input) => {
      return {
        orderBy: normalizeOrderBy(input.orderBy, [{ publishedDate: 'desc' }]),
        take: toInt(input.take),
        skip: toInt(input.skip),
      }
    },
  },
  'posts-essay-answers-with-likes': {
    method: 'GET',
    auth: 'public',
    operationName: 'GetPostsEssayAnswersWithLikes',
    document: `
      query GetPostsEssayAnswersWithLikes(
        $orderBy: [PostOrderByInput!]!
        $take: Int
        $skip: Int
        $answerOrderBy: [PostEssayAnswerOrderByInput!]!
        $answerTake: Int
        $where: PostWhereInput!
      ) {
        posts(orderBy: $orderBy, take: $take, skip: $skip, where: $where) {
          id
          title
          slug
          heroImage { resized { medium } }
          subSubcategoriesOrdered { name }
          postEssayQuestions {
            id
            title
            hint
            answers(orderBy: $answerOrderBy, take: $answerTake) {
              id
              content
              member {
                id
                avatar { id fileUrl }
                name
                nickname
                email
              }
              likesCount
            }
          }
        }
      }
    `,
    buildVariables: (input) => {
      return {
        orderBy: normalizeOrderBy(input.orderBy, [{ publishedDate: 'desc' }]),
        take: toInt(input.take),
        skip: toInt(input.skip),
        answerOrderBy: normalizeOrderBy(input.answerOrderBy, [
          { createdAt: 'desc' },
        ]),
        answerTake: toInt(input.answerTake),
        where: ensureRecord(input.where, 'Missing where'),
      }
    },
  },
  'post-essay-questions': {
    method: 'GET',
    cacheTtl: 120,
    auth: 'public',
    operationName: 'GetPostEssayQuestions',
    document: `
      query GetPostEssayQuestions($where: PostWhereUniqueInput!) {
        post(where: $where) {
          id
          slug
          title
          heroImage { resized { medium } }
          postEssayQuestions { id title hint }
          subSubcategoriesOrdered { name }
        }
      }
    `,
    buildVariables: (input) => {
      return { where: ensureRecord(input.where, 'Missing where') }
    },
  },
  'tag-posts': {
    method: 'GET',
    cacheTtl: 120,
    auth: 'public',
    operationName: 'GetTagPosts',
    document: `
      ${postContentFragment}
      query GetTagPosts(
        $where: TagWhereUniqueInput!
        $take: Int
        $skip: Int
        $orderBy: [PostOrderByInput!]!
      ) {
        tag(where: $where) {
          posts(orderBy: $orderBy, take: $take, skip: $skip) {
            ...PostContent
          }
          postsCount
          name
        }
      }
    `,
    buildVariables: (input) => {
      return {
        where: ensureRecord(input.where, 'Missing where'),
        orderBy: normalizeOrderBy(input.orderBy, [{ publishedDate: 'desc' }]),
        take: toInt(input.take),
        skip: toInt(input.skip),
      }
    },
  },
  'tag-meta': {
    method: 'GET',
    cacheTtl: 120,
    auth: 'public',
    operationName: 'GetTagMeta',
    document: `
      query GetTagMeta($where: TagWhereUniqueInput!) {
        tag(where: $where) {
          ogDescription
          ogTitle
          ogImage { resized { small } }
        }
      }
    `,
    buildVariables: (input) => {
      return { where: ensureRecord(input.where, 'Missing where') }
    },
  },
  'project-detail': {
    method: 'GET',
    cacheTtl: 120,
    auth: 'public',
    operationName: 'GetProject',
    document: `
      ${postContentFragment}
      fragment ImageEntity on Photo {
        resized { small medium large }
      }
      query GetProject($where: ProjectWhereUniqueInput!) {
        project(where: $where) {
          title
          titlePosition
          subtitle
          content
          credits
          publishedDate
          heroImage { ...ImageEntity }
          mobileHeroImage { ...ImageEntity }
          relatedPostsOrdered {
            title
            slug
            publishedDate
            heroImage { ...ImageEntity }
            ogDescription
            subSubcategoriesOrdered {
              name
              slug
              subcategory {
                name
                slug
                category { name slug themeColor }
              }
            }
          }
        }
      }
    `,
    buildVariables: (input) => {
      return { where: ensureRecord(input.where, 'Missing where') }
    },
  },
  'project-meta': {
    method: 'GET',
    cacheTtl: 120,
    auth: 'public',
    operationName: 'GetProjectMeta',
    document: `
      query GetProjectMeta($where: ProjectWhereUniqueInput!) {
        project(where: $where) {
          publishedDate
          ogDescription
          ogTitle
          ogImage { resized { small } }
        }
      }
    `,
    buildVariables: (input) => {
      return { where: ensureRecord(input.where, 'Missing where') }
    },
  },
  'projects-paged': {
    method: 'GET',
    cacheTtl: 120,
    auth: 'public',
    operationName: 'GetProjects',
    document: `
      ${postContentFragment}
      query GetProjects(
        $orderBy: [ProjectOrderByInput!]!
        $take: Int
        $skip: Int
        $includeRelatedPosts: Boolean!
      ) {
        projects(orderBy: $orderBy, take: $take, skip: $skip) {
          title
          slug
          ogDescription
          heroImage { resized { medium } }
          publishedDate
          relatedPostsOrdered @include(if: $includeRelatedPosts) {
            ...PostContent
          }
        }
        projectsCount
      }
    `,
    buildVariables: (input) => {
      return {
        orderBy: normalizeOrderBy(input.orderBy, [{ publishedDate: 'desc' }]),
        take: toInt(input.take),
        skip: toInt(input.skip),
        includeRelatedPosts: normalizeBoolean(input.includeRelatedPosts),
      }
    },
  },
  'project-related-posts-count': {
    method: 'GET',
    cacheTtl: 120,
    auth: 'public',
    operationName: 'GetProjectRelatedPostsCount',
    document: `
      query GetProjectRelatedPostsCount(
        $where: ProjectWhereUniqueInput!
      ) {
        project(where: $where) {
          relatedPostsCount
        }
      }
    `,
    buildVariables: (input) => {
      return { where: ensureRecord(input.where, 'Missing where') }
    },
  },
  'author-posts': {
    method: 'GET',
    cacheTtl: 120,
    auth: 'public',
    operationName: 'GetAuthorPosts',
    document: `
      ${postContentFragment}
      query GetAuthorPosts(
        $where: AuthorWhereUniqueInput!
        $take: Int
        $skip: Int
        $orderBy: [PostOrderByInput!]!
      ) {
        author(where: $where) {
          bio
          name
          email
          avatar { resized { tiny } }
          posts(orderBy: $orderBy, take: $take, skip: $skip) {
            ...PostContent
          }
          postsCount
        }
      }
    `,
    buildVariables: (input) => {
      return {
        where: ensureRecord(input.where, 'Missing where'),
        orderBy: normalizeOrderBy(input.orderBy, [{ publishedDate: 'desc' }]),
        take: toInt(input.take),
        skip: toInt(input.skip),
      }
    },
  },
  'author-meta': {
    method: 'GET',
    cacheTtl: 120,
    auth: 'public',
    operationName: 'GetAuthorMeta',
    document: `
      query GetAuthorMeta($where: AuthorWhereUniqueInput!) {
        author(where: $where) {
          slug
          name
          bio
          image { resized { small } }
        }
      }
    `,
    buildVariables: (input) => {
      return { where: ensureRecord(input.where, 'Missing where') }
    },
  },
  'author-avatar': {
    method: 'GET',
    cacheTtl: 120,
    auth: 'public',
    operationName: 'GetAuthorAvatar',
    document: `
      query GetAuthorAvatar($where: AuthorWhereUniqueInput!) {
        author(where: $where) {
          avatar { resized { tiny } }
        }
      }
    `,
    buildVariables: (input) => {
      return { where: ensureRecord(input.where, 'Missing where') }
    },
  },
  'author-posts-count': {
    method: 'GET',
    cacheTtl: 120,
    auth: 'public',
    operationName: 'GetAuthorPostsCount',
    document: `
      query GetAuthorPostsCount($where: AuthorWhereUniqueInput!) {
        author(where: $where) {
          postsCount
        }
      }
    `,
    buildVariables: (input) => {
      return { where: ensureRecord(input.where, 'Missing where') }
    },
  },
  'posts-sitemap': {
    method: 'GET',
    cacheTtl: 300,
    auth: 'public',
    operationName: 'GetPostsForSitemap',
    document: `
      query GetPostsForSitemap($where: PostWhereInput!) {
        posts(where: $where) {
          slug
          publishedDate
        }
      }
    `,
    buildVariables: (input) => {
      return { where: ensureRecord(input.where, 'Missing where') }
    },
  },
  'projects-sitemap': {
    method: 'GET',
    cacheTtl: 300,
    auth: 'public',
    operationName: 'GetProjectsForSitemap',
    document: `
      query GetProjectsForSitemap($where: ProjectWhereInput!) {
        projects(where: $where) {
          slug
          publishedDate
        }
      }
    `,
    buildVariables: (input) => {
      return { where: ensureRecord(input.where, 'Missing where') }
    },
  },
}
