import {
  GetMemberProfileQuery,
  GetMemberProfileQueryVariables,
  UpdateMemberProfileMutation,
  UpdateMemberProfileMutationVariables,
} from '__generated__/operations/members.generated'

import { sendRestGqlRequest } from '@/utils/send-rest-gql'

export const getMemberProfileByTwreporterUserId = async ({
  twreporterUserId,
  accessToken,
}: {
  twreporterUserId: string
  accessToken: string
}) => {
  const variables: GetMemberProfileQueryVariables = {
    where: {
      twreporter_user_id: twreporterUserId,
    },
  }

  const response = await sendRestGqlRequest<GetMemberProfileQuery>({
    operation: 'member-profile',
    method: 'GET',
    variables,
    authToken: accessToken,
  })

  return response?.data?.data?.member
}

export const getMemberProfileByMemberId = async ({
  memberId,
  accessToken,
  abortSignal,
}: {
  memberId: string
  accessToken: string
  abortSignal?: AbortSignal
}) => {
  const variables: GetMemberProfileQueryVariables = {
    where: {
      id: memberId,
    },
  }

  const response = await sendRestGqlRequest<GetMemberProfileQuery>({
    operation: 'member-profile',
    method: 'GET',
    variables,
    authToken: accessToken,
    signal: abortSignal,
  })

  return response?.data?.data?.member
}

export const updateMemberProfile = async ({
  memberId,
  accessToken,
  data,
}: {
  memberId: string
  accessToken: string
  data: UpdateMemberProfileMutationVariables['data']
}) => {
  const response = await sendRestGqlRequest<UpdateMemberProfileMutation>({
    operation: 'update-member-profile',
    method: 'POST',
    variables: {
      where: { id: memberId },
      data,
    },
    authToken: accessToken,
  })

  return response?.data?.data
}
