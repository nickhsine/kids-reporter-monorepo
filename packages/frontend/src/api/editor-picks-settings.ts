import {
  GetEditorPicksSettingsQuery,
  GetEditorPicksSettingsQueryVariables,
} from '__generated__/operations/content.generated'

import { sendRestGqlRequest } from '@/utils/send-rest-gql'

export const getEditorPicksSettings = async (
  variables: GetEditorPicksSettingsQueryVariables
) => {
  const response = await sendRestGqlRequest<GetEditorPicksSettingsQuery>({
    operation: 'editor-picks-settings',
    method: 'GET',
    variables,
  })
  return response?.data?.data?.editorPicksSettings
}
