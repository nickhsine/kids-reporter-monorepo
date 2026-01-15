import { GetPostQuery } from '__generated__/operations/content.generated'
import Link from 'next/link'

import { RecursiveNonNullable } from '@/types/utils'

export type Tag = RecursiveNonNullable<
  GetPostQuery['post']
>['tagsOrdered'][number]

type TagsProp = {
  title?: string
  tags: Tag[]
  fill?: boolean
}

export const Tags = (props: TagsProp) => {
  const title = props?.title
  const tags = props?.tags

  return (
    <div className="flex flex-col items-center">
      {title && (
        <h3 className="rpjr-post-tags__heading">
          <i className="icon-rpjr-icon-tag">
            <i className="path1 text-color-theme"></i>
            <i className="path2"></i>
          </i>
          &nbsp;&nbsp;{title}
        </h3>
      )}
      {tags?.length > 0 && (
        <div
          style={{ columnGap: '15px', rowGap: '30px' }}
          className="mx-auto mt-6 mb-0 ml-auto flex w-full max-w-xl flex-wrap items-center justify-center"
        >
          {tags.map((tag, index) => {
            return (
              tag && (
                <Link
                  key={`post-tag-${index}`}
                  style={
                    props?.fill
                      ? {
                          background: 'var(--theme-color) !important',
                          color: 'black !important',
                        }
                      : {}
                  }
                  className={'rpjr-post_tags__tag-item rpjr-btn rpjr-btn-tag'}
                  href={`/tag/${tag.slug}`}
                >
                  #&nbsp;{tag.name}
                </Link>
              )
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Tags
