import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createTask, updateTask, deleteTask } from "@/api/task"
import { Task, TaskResponse } from "@/types/interfaces"

export const useTaskMutations = () => {
  const queryClient = useQueryClient()

  // Create Task Mutation
  const createTaskMutation = useMutation<TaskResponse, Error, Task>({
    mutationFn: createTask,
    onSuccess: (data) => {
      console.log("Task created successfully:", data)
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
    },
    onError: (error: Error) => {
      console.error("Error creating task:", error)
      if (error.message) {
        console.error("Server response:", error.message)
      }
    }
  })

  // Update Task Mutation
  const updateTaskMutation = useMutation<
    TaskResponse,
    Error,
    { id: string; updates: Partial<Task> }
  >({
    mutationFn: ({ id, updates }) => {
      console.log("Updating task with id:", id, "Updates:", updates)
      return updateTask(id, updates)
    },
    onSuccess: (data) => {
      console.log("Task updated successfully:", data)
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
    },
    onError: (error: Error) => {
      console.error("Error updating task:", error)
      if (error.message) {
        console.error("Server response:", error.message)
      }
    }
  })

  // Delete Task Mutation
  const deleteTaskMutation = useMutation<TaskResponse, Error, string>({
    mutationFn: deleteTask,
    onSuccess: () => {
      console.log("Task deleted successfully")
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
    },
    onError: (error: Error) => {
      console.error("Error deleting task:", error)
      if (error.message) {
        console.error("Server response:", error.message)
      }
    }
  })

  return {
    createTaskMutation,
    updateTaskMutation,
    deleteTaskMutation
  }
}
