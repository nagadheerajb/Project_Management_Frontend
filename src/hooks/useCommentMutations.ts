import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  createComment,
  updateComment,
  deleteCommentById,
  deleteCommentsByTask
} from "@/api/comment"
import { Comment } from "@/types/interfaces"

export const useCommentMutations = () => {
  const queryClient = useQueryClient()

  // Create Comment Mutation
  const createCommentMutation = useMutation<Comment, Error, Comment>({
    mutationFn: createComment,
    onSuccess: (data) => {
      console.log("Comment created successfully:", data)
      queryClient.invalidateQueries({ queryKey: ["comments"] }) // Adjust query key if needed
    },
    onError: (error: Error) => {
      console.error("Error creating comment:", error)
    }
  })

  // Update Comment Mutation
  const updateCommentMutation = useMutation<Comment, Error, { id: string; updatedContent: string }>(
    {
      mutationFn: ({ id, updatedContent }) => updateComment(id, updatedContent),
      onSuccess: (data) => {
        console.log("Comment updated successfully:", data)
        queryClient.invalidateQueries({ queryKey: ["comments"] }) // Adjust query key if needed
      },
      onError: (error: Error) => {
        console.error("Error updating comment:", error)
      }
    }
  )

  // Delete Comment by ID Mutation
  const deleteCommentMutation = useMutation<void, Error, string>({
    mutationFn: deleteCommentById,
    onSuccess: () => {
      console.log("Comment deleted successfully")
      queryClient.invalidateQueries({ queryKey: ["comments"] }) // Adjust query key if needed
    },
    onError: (error: Error) => {
      console.error("Error deleting comment:", error)
    }
  })

  // Delete Comments by Task Mutation
  const deleteCommentsByTaskMutation = useMutation<void, Error, string>({
    mutationFn: deleteCommentsByTask,
    onSuccess: () => {
      console.log("All comments for the task deleted successfully")
      queryClient.invalidateQueries({ queryKey: ["comments"] }) // Adjust query key if needed
    },
    onError: (error: Error) => {
      console.error("Error deleting comments for task:", error)
    }
  })

  return {
    createCommentMutation,
    updateCommentMutation,
    deleteCommentMutation,
    deleteCommentsByTaskMutation
  }
}
