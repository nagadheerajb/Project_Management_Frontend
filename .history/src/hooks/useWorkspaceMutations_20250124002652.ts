import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createWorkspace, updateWorkspace, deleteWorkspace } from "@/api/workspace"
import { WorkspaceData } from "@/types/interfaces"
import { refreshToken } from "@/api/auth" // Import the refreshToken function

interface WorkspaceResponse {
  data: any // Define the response structure if known
}

export const useWorkspaceMutations = () => {
  const queryClient = useQueryClient()

  const handleTokenRefresh = async () => {
    try {
      const currentToken = localStorage.getItem("jwt")
      if (currentToken) {
        const newToken = await refreshToken(currentToken)
        localStorage.setItem("jwt", newToken.accessToken)
        console.log("Token refreshed successfully")
      } else {
        console.error("No token found for refreshing")
      }
    } catch (error) {
      console.error("Error refreshing token:", error)
    }
  }

  const createWorkspaceMutation = useMutation<WorkspaceResponse, Error, WorkspaceData>({
    mutationFn: createWorkspace,
    onSuccess: async () => {
      await handleTokenRefresh() // Refresh the token after workspace creation
      queryClient.invalidateQueries({ queryKey: ["workspaces"] }) // Refetch the workspace data
    },
    onError: (error: Error) => {
      console.error("Error creating workspace:", error.message)
    },
    onSettled: () => {
      console.log("Create workspace mutation settled")
    }
  })

  const updateWorkspaceMutation = useMutation<
    WorkspaceResponse,
    Error,
    { id: string; updates: WorkspaceData }
  >({
    mutationFn: ({ id, updates }) => updateWorkspace(id, updates),
    onSuccess: async () => {
      await handleTokenRefresh() // Refresh the token after workspace update
      queryClient.invalidateQueries({ queryKey: ["workspaces"] })
    },
    onError: (error: Error) => {
      console.error("Error updating workspace:", error.message)
    },
    onSettled: () => {
      console.log("Update workspace mutation settled")
    }
  })

  const deleteWorkspaceMutation = useMutation<WorkspaceResponse, Error, string>({
    mutationFn: (id) => deleteWorkspace(id),
    onSuccess: async () => {
      await handleTokenRefresh() // Refresh the token after workspace deletion
      queryClient.invalidateQueries({ queryKey: ["workspaces"] })
    },
    onError: (error: Error) => {
      console.error("Error deleting workspace:", error.message)
    },
    onSettled: () => {
      console.log("Delete workspace mutation settled")
    }
  })

  return { createWorkspaceMutation, updateWorkspaceMutation, deleteWorkspaceMutation }
}
