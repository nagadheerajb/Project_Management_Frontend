import { useQuery } from "@tanstack/react-query"
import api from "@/api"

export const useWorkspaceDetails = (workspaceId: string | null) => {
  return useQuery(
    ["workspaceDetails", workspaceId],
    () => api.get(`/workspaces/${workspaceId}`).then((res) => res.data.data),
    { enabled: !!workspaceId }
  )
}
