import React, { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import ReactPaginate from "react-paginate"
import { fetchCommentsByTask } from "@/api/comment"
import { useCommentMutations } from "@/hooks/useCommentMutations"
import { Comment, PaginatedResponse } from "@/types/interfaces"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useUser } from "@/context/user-context"

interface CommentsProps {
  taskId: string
}

const defaultPaginatedFields = {
  totalPages: 0,
  totalElements: 0,
  pageable: {
    pageNumber: 0,
    pageSize: 0,
    offset: 0,
    paged: false,
    unpaged: true
  },
  last: false,
  first: true,
  sort: {
    empty: true,
    sorted: false,
    unsorted: true
  },
  numberOfElements: 0,
  size: 0,
  number: 0,
  empty: true
}

const Comments: React.FC<CommentsProps> = ({ taskId }) => {
  const [newComment, setNewComment] = useState("")
  const [currentPage, setCurrentPage] = useState(0) // Page index (starts from 0)
  const [pageSize] = useState(2) // Fixed page size
  const { user } = useUser()
  const { createCommentMutation, deleteCommentMutation } = useCommentMutations()

  // UseQuery with correct typing and object-based configuration
  const {
    data: commentsResponse = { content: [], ...defaultPaginatedFields },
    isLoading,
    error,
    refetch
  } = useQuery<PaginatedResponse<Comment>>({
    queryKey: ["comments", taskId, currentPage],
    queryFn: () => fetchCommentsByTask(taskId, currentPage, pageSize, "createdDate,ASC"),
    enabled: !!taskId
  })

  const handleAddComment = async () => {
    if (newComment.trim() && user) {
      await createCommentMutation.mutateAsync({
        taskId,
        content: newComment,
        createdBy: user.id
      })
      setNewComment("")
      refetch()
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    await deleteCommentMutation.mutateAsync(commentId)
    refetch()
  }

  const handlePageChange = (selectedObject: { selected: number }) => {
    setCurrentPage(selectedObject.selected)
  }

  if (isLoading) return <div>Loading comments...</div>
  if (error) return <div>Error loading comments</div>

  const comments = commentsResponse.content // Safe access
  const totalPages = commentsResponse.totalPages // Safe access

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Comments</h3>
      <div className="space-y-2">
        {comments.length > 0 ? (
          comments.map((comment: Comment) => (
            <div
              key={comment.id}
              className="flex justify-between items-start bg-gray-100 p-2 rounded"
            >
              <div>
                <p className="text-sm">{comment.content}</p>
                <p className="text-xs text-gray-500">
                  By {comment.createdBy} on {new Date(comment.createdDate!).toLocaleString()}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => comment.id && handleDeleteComment(comment.id)}
              >
                Delete
              </Button>
            </div>
          ))
        ) : (
          <div>No comments found</div>
        )}
      </div>
      <div className="mt-4 flex space-x-2">
        <Input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
        />
        <Button onClick={handleAddComment}>Add</Button>
      </div>
      <div className="mt-4">
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={2}
          marginPagesDisplayed={1}
          onPageChange={handlePageChange}
          containerClassName="flex space-x-2"
          pageClassName="px-3 py-1 border rounded"
          activeClassName="bg-blue-500 text-white"
          previousLabel="Prev"
          nextLabel="Next"
          breakLabel="..."
          disabledClassName="opacity-50 cursor-not-allowed"
        />
      </div>
    </div>
  )
}

export default Comments
