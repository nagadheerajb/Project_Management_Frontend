import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createProject, updateProject, deleteProject } from "@/api/project"
import { Project } from "@/types/interfaces"

interface ProjectResponse {
  data: any // Define the response structure if known
}

export const useProjectMutations = () => {
  const queryClient = useQueryClient()

  const createProjectMutation = useMutation<ProjectResponse, Error, Project>({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
    },
    onError: (error: Error) => {
      console.error("Error creating project:", error.message)
    },
    onSettled: () => {
      console.log("Create project mutation settled")
    }
  })

  const updateProjectMutation = useMutation<
    ProjectResponse,
    Error,
    { id: string; updates: Partial<Project> }
  >({
    mutationFn: ({ id, updates }) => updateProject(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
    },
    onError: (error: Error) => {
      console.error("Error updating project:", error.message)
    },
    onSettled: () => {
      console.log("Update project mutation settled")
    }
  })

  const deleteProjectMutation = useMutation<ProjectResponse, Error, string>({
    mutationFn: (id) => deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
    },
    onError: (error: Error) => {
      console.error("Error deleting project:", error.message)
    },
    onSettled: () => {
      console.log("Delete project mutation settled")
    }
  })

  return { createProjectMutation, updateProjectMutation, deleteProjectMutation }
}
