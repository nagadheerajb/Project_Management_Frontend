import api from "./index"
import { AxiosResponse } from "axios"
import { Comment, PaginatedResponse } from "@/types/interfaces"

/**
 * Create a new comment for a task.
 * @param comment - The comment data to be created.
 * @returns The created comment.
 */
export const createComment = async (comment: Comment): Promise<Comment> => {
  try {
    const response: AxiosResponse<{ data: Comment }> = await api.post("/comments", comment)
    return response.data.data
  } catch (error: any) {
    console.error("Error creating comment:", error.response?.data || error.message)
    throw new Error("Failed to create comment. Please try again.")
  }
}

/**
 * Fetch a single comment by its ID.
 * @param commentId - The ID of the comment to fetch.
 * @returns The fetched comment.
 */
export const fetchCommentById = async (commentId: string): Promise<Comment> => {
  try {
    const response: AxiosResponse<{ data: Comment }> = await api.get(`/comments/${commentId}`)
    return response.data.data
  } catch (error: any) {
    console.error("Error fetching comment by ID:", error.response?.data || error.message)
    throw new Error("Failed to fetch comment. Please try again.")
  }
}

/**
 * Fetch all comments for a specific task with pagination.
 * @param taskId - The ID of the task to fetch comments for.
 * @param page - The page number (default: 0).
 * @param size - The page size (default: 10).
 * @param sort - Sorting options (e.g., "createdDate,ASC").
 * @returns Paginated response containing comments.
 */
export const fetchCommentsByTask = async (
  taskId: string,
  page: number = 0,
  size: number = 10,
  sort: string = "createdDate,ASC"
): Promise<PaginatedResponse<Comment>> => {
  try {
    const response: AxiosResponse<{ data: PaginatedResponse<Comment> }> = await api.get(
      `/comments/tasks/${taskId}/comments`,
      { params: { page, size, sort } }
    )
    return response.data.data
  } catch (error: any) {
    console.error("Error fetching comments for task:", error.response?.data || error.message)
    throw new Error("Failed to fetch comments. Please try again.")
  }
}

/**
 * Update an existing comment by its ID.
 * @param commentId - The ID of the comment to update.
 * @param updatedContent - The updated content of the comment.
 * @returns The updated comment.
 */
export const updateComment = async (
  commentId: string,
  updatedContent: string
): Promise<Comment> => {
  try {
    const response: AxiosResponse<{ data: Comment }> = await api.put(`/comments/${commentId}`, {
      content: updatedContent
    })
    return response.data.data
  } catch (error: any) {
    console.error("Error updating comment:", error.response?.data || error.message)
    throw new Error("Failed to update comment. Please try again.")
  }
}

/**
 * Delete a specific comment by its ID.
 * @param commentId - The ID of the comment to delete.
 */
export const deleteCommentById = async (commentId: string): Promise<void> => {
  try {
    await api.delete(`/comments/${commentId}`)
  } catch (error: any) {
    console.error("Error deleting comment:", error.response?.data || error.message)
    throw new Error("Failed to delete comment. Please try again.")
  }
}

/**
 * Delete all comments for a specific task.
 * @param taskId - The ID of the task whose comments are to be deleted.
 */
export const deleteCommentsByTask = async (taskId: string): Promise<void> => {
  try {
    await api.delete(`/comments/tasks/${taskId}/comments`)
  } catch (error: any) {
    console.error("Error deleting comments for task:", error.response?.data || error.message)
    throw new Error("Failed to delete comments. Please try again.")
  }
}
