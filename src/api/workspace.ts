import api from "@/api"
import { WorkspaceData } from "@/types"

// Fetch workspace details
export async function getWorkspaceDetails(workspaceId: string) {
  const response = await api.get(`/workspaces/${workspaceId}`)
  return response.data.data
}

// Create a new workspace
export const createWorkspace = async (data: WorkspaceData) => {
  const response = await api.post("/workspaces", data)
  return response.data.data
}

// Update an existing workspace
export const updateWorkspace = async (id: string, data: WorkspaceData) => {
  const response = await api.put(`/workspaces/${id}`, data)
  return response.data.data
}

// Delete a workspace
export const deleteWorkspace = async (id: string) => {
  const response = await api.delete(`/workspaces/${id}`)
  return response.data
}
