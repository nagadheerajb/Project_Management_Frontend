import api from "./index" // Reuse the configured axios instance
import { AxiosResponse } from "axios"
import { Task, TaskResponse } from "@/types/interfaces"

// Task API Methods

// 1. Create a Task
export const createTask = async (task: Task): Promise<TaskResponse> => {
  // Log task data before sending
  console.log("Sending task to backend:", task)

  if (!task.projectId || !task.createdUserId || !task.assignedUserId) {
    console.error("Some IDs are null or undefined:", {
      projectId: task.projectId,
      createdUserId: task.createdUserId,
      assignedUserId: task.assignedUserId
    })
  }

  try {
    const response: AxiosResponse<TaskResponse> = await api.post("/tasks", task)
    console.log("Response from backend:", response.data)
    return response.data
  } catch (error: any) {
    if (error.response) {
      console.error("Error response from backend:", error.response.data)
    } else {
      console.error("Error message:", error.message)
    }
    throw error
  }
}

// 2. Fetch All Tasks
export const fetchAllTasks = async (): Promise<TaskResponse> => {
  const response: AxiosResponse<TaskResponse> = await api.get("/tasks")
  return response.data
}

// 3. Fetch Tasks by Project
export const fetchTasksByProject = async (projectId: string): Promise<TaskResponse> => {
  const response: AxiosResponse<TaskResponse> = await api.get(`/tasks/project/${projectId}`)
  return response.data
}

// 4. Fetch Tasks Created by User
export const fetchTasksByCreatedUser = async (userId: string): Promise<TaskResponse> => {
  const response: AxiosResponse<TaskResponse> = await api.get(`/tasks/findByCreated/${userId}`)
  return response.data
}

// 5. Fetch Tasks Assigned to User
export const fetchTasksByAssignedUser = async (userId: string): Promise<TaskResponse> => {
  const response: AxiosResponse<TaskResponse> = await api.get(`/tasks/findByAssigned/${userId}`)
  return response.data
}

// 6. Fetch a Single Task
export const fetchTaskById = async (taskId: string): Promise<TaskResponse> => {
  const response: AxiosResponse<TaskResponse> = await api.get(`/tasks/${taskId}`)
  return response.data
}

// 7. Update a Task
export const updateTask = async (taskId: string, updates: Partial<Task>): Promise<TaskResponse> => {
  const response: AxiosResponse<TaskResponse> = await api.put(`/tasks/${taskId}`, updates)
  return response.data
}

// 8. Delete a Task
export const deleteTask = async (taskId: string): Promise<TaskResponse> => {
  const response: AxiosResponse<TaskResponse> = await api.delete(`/tasks/${taskId}`)
  return response.data
}
