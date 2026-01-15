import { CreateMemberAvatarMutation } from '__generated__/operations/member-avatar.generated'
import { DeleteMemberAvatarMutation } from '__generated__/operations/members.generated'
import axios, { AxiosResponse } from 'axios'
import { print } from 'graphql/language/printer'

import { API_URL, INTERNAL_API_URL } from '@/constants'
import envVars from '@/environment-variables'
import { sendRestGqlRequest } from '@/utils/send-rest-gql'

import { CREATE_MEMBER_AVATAR_MUTATION } from './graphql/member-avatar'

export const uploadMemberAvatar = async (
  file: File,
  accessToken: string,
  fileName?: string
) => {
  const url =
    typeof window === 'undefined' && !envVars.isProduction
      ? INTERNAL_API_URL
      : API_URL

  // Create multipart form data for file upload
  const formData = new FormData()

  // Prepare operations with file set to null
  // Include name field (using filename without extension as default)
  const newFileName =
    fileName || file.name.replace(/\.[^/.]+$/, '') || 'memberAvatar'
  const operations = {
    query: print(CREATE_MEMBER_AVATAR_MUTATION),
    variables: {
      data: {
        name: newFileName,
        imageFile: {
          upload: null,
        },
      },
    },
  }

  // Map file index to variable path
  const map = {
    '1': ['variables.data.imageFile.upload'],
  }

  formData.append('operations', JSON.stringify(operations))
  formData.append('map', JSON.stringify(map))
  formData.append('1', file)

  const response: AxiosResponse<{ data: CreateMemberAvatarMutation }> =
    await axios.post(url, formData, {
      headers: {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        'apollo-require-preflight': 'true',
      },
      withCredentials: true,
    })

  return response?.data?.data?.item
}

export const deleteMemberAvatar = async (
  avatarId: string,
  accessToken: string
) => {
  const response = await sendRestGqlRequest<DeleteMemberAvatarMutation>({
    operation: 'delete-member-avatar',
    method: 'POST',
    variables: {
      where: { id: avatarId },
    },
    authToken: accessToken,
  })

  return response?.data?.data?.deleteMemberAvatar
}
