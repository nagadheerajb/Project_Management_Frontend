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
      queryClient.invalidateQueries({ queryKey: ["tasks"] }) // Refetch tasks after creation
    },
    onError: (error: Error) => {
      console.error("Error creating task:", error.message)
    }
  })

  // Update Task Mutation
  const updateTaskMutation = useMutation<
    TaskResponse,
    Error,
    { id: string; updates: Partial<Task> }
  >({
    mutationFn: ({ id, updates }) => updateTask(id, updates),
    onSuccess: (data) => {
      console.log("Task updated successfully:", data)
      queryClient.invalidateQueries({ queryKey: ["tasks"] }) // Refetch tasks after update
    },
    onError: (error: Error) => {
      console.error("Error updating task:", error.message)
    }
  })

  // Delete Task Mutation
  const deleteTaskMutation = useMutation<TaskResponse, Error, string>({
    mutationFn: deleteTask,
    onSuccess: () => {
      console.log("Task deleted successfully")
      queryClient.invalidateQueries({ queryKey: ["tasks"] }) // Refetch tasks after deletion
    },
    onError: (error: Error) => {
      console.error("Error deleting task:", error.message)
    }
  })

  return {
    createTaskMutation,
    updateTaskMutation,
    deleteTaskMutation
  }
}
