import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createWorkspace, updateWorkspace, deleteWorkspace } from "@/api/workspace"
import { WorkspaceData } from "@/types/interfaces"

interface WorkspaceResponse {
  data: any // Define the response structure if known
}

export const useWorkspaceMutations = () => {
  const queryClient = useQueryClient()

  const createWorkspaceMutation = useMutation<WorkspaceResponse, Error, WorkspaceData>({
    mutationFn: createWorkspace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] })
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
    onSuccess: () => {
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
    onSuccess: () => {
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
