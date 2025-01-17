import { useQuery } from "@tanstack/react-query"
import { fetchTasksByProject } from "@/api/task" // Adjust as per your API
import { Task } from "@/types/interfaces"

export const useTasks = (projectId: string | undefined) => {
  return useQuery({
    queryKey: ["tasks", projectId],
    queryFn: () => {
      const response = fetchTasksByProject(projectId!)
      console.log("Fetched Tasks:", response) // Log the response
      return response
    },
    enabled: !!projectId,
    staleTime: 1000 * 60 * 5 // Cache for 5 minutes
  })
}
