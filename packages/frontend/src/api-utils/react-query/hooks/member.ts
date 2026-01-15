import {
  UpdateMemberProfileMutation,
  UpdateMemberProfileMutationVariables,
} from '__generated__/operations/members.generated'
import { useMutation, UseMutationOptions } from '@tanstack/react-query'

import { updateMemberProfile } from '@/api/member'

export const useUpdateMemberProfileMutation = ({
  accessToken,
  memberId,
  options,
}: {
  accessToken: string
  memberId: string
  options?: UseMutationOptions<
    UpdateMemberProfileMutation | undefined,
    Error,
    Pick<UpdateMemberProfileMutationVariables, 'data'>
  >
}) => {
  return useMutation({
    mutationFn: (
      variables: Pick<UpdateMemberProfileMutationVariables, 'data'>
    ) => updateMemberProfile({ memberId, accessToken, data: variables.data }),
    ...options,
  })
}
