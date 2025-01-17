import api from "@/api"
import { Project } from "@/types/interfaces"

interface ProjectResponse {
  data: any
}

// Fetch projects for a given workspace
export const fetchProjects = async (workspaceId: string): Promise<Project[]> => {
  const response = await api.get(`/projects/workspace/${workspaceId}`)
  return response.data.data
}

// Create a new project
export const createProject = async (project: Project): Promise<ProjectResponse> => {
  const response = await api.post(`/projects`, project, {
    headers: { workspaceId: project.workspaceId }
  })
  return { data: response.data.data }
}

// Update an existing project
export const updateProject = async (
  id: string,
  updates: Partial<Project>
): Promise<ProjectResponse> => {
  const response = await api.put(`/projects/${id}`, updates, {
    headers: { workspaceId: updates.workspaceId }
  })
  return { data: response.data.data }
}

// Delete a project
export const deleteProject = async (id: string): Promise<ProjectResponse> => {
  await api.delete(`/projects/${id}`, {
    headers: { workspaceId: id }
  })
  // Return a mocked ProjectResponse as deleteProject does not return a response
  return { data: { id } }
}
