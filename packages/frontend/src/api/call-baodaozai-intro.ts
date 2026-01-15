import {
  GetCallBaodaozaiIntroQuery,
  GetCallBaodaozaiIntroQueryVariables,
} from '__generated__/operations/content.generated'

import { sendRestGqlRequest } from '@/utils/send-rest-gql'

export async function getCallBaodaozaiIntroContent(
  variables: GetCallBaodaozaiIntroQueryVariables
): Promise<string | undefined> {
  const data = await sendRestGqlRequest<GetCallBaodaozaiIntroQuery>({
    operation: 'call-baodaozai-intro',
    method: 'GET',
    variables,
  })

  return data?.data?.data?.callBaodaozaiIntro?.content ?? undefined
}
