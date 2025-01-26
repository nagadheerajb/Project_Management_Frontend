import React, { useState, useCallback, useEffect, useRef } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import ReactPaginate from "react-paginate"
import { fetchCommentsByTask } from "@/api/comment"
import { useCommentMutations } from "@/hooks/useCommentMutations"
import { Comment, PaginatedResponse } from "@/types/interfaces"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { useUser } from "@/context/user-context"
import { MoreVertical } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

interface CommentsProps {
  taskId: string
}

type SortOrder = "createdDate,DESC" | "createdDate,ASC"

const defaultPaginatedFields: PaginatedResponse<Comment> = {
  content: [],
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
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const [editedContent, setEditedContent] = useState("")
  const [currentPage, setCurrentPage] = useState(0)
  const [sortOrder, setSortOrder] = useState<SortOrder>("createdDate,DESC")
  const pageSize = 2
  const { user } = useUser()
  const { createCommentMutation, updateCommentMutation, deleteCommentMutation } =
    useCommentMutations()
  const queryClient = useQueryClient()
  const latestCommentRef = useRef<HTMLDivElement>(null)

  const {
    data: commentsResponse = defaultPaginatedFields,
    isLoading,
    error,
    refetch
  } = useQuery<PaginatedResponse<Comment>>({
    queryKey: ["comments", taskId, currentPage, sortOrder],
    queryFn: () => fetchCommentsByTask(taskId, currentPage, pageSize, sortOrder)
  })

  useEffect(() => {
    if (commentsResponse.totalPages > 0 && currentPage >= commentsResponse.totalPages) {
      setCurrentPage(commentsResponse.totalPages - 1)
    }
  }, [commentsResponse.totalPages, currentPage])

  const handleAddComment = useCallback(async () => {
    if (newComment.trim() && user) {
      await createCommentMutation.mutateAsync({
        taskId,
        content: newComment,
        createdBy: user.id
      })
      setNewComment("")
      await queryClient.invalidateQueries({ queryKey: ["comments", taskId] })
      await refetch()

      // Scroll to the latest comment
      setTimeout(() => {
        latestCommentRef.current?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    }
  }, [newComment, user, taskId, createCommentMutation, queryClient, refetch])

  const handleEditComment = useCallback(
    async (commentId: string) => {
      if (editedContent.trim()) {
        await updateCommentMutation.mutateAsync({ id: commentId, updatedContent: editedContent })
        setEditingCommentId(null)
        setEditedContent("")
        queryClient.invalidateQueries({ queryKey: ["comments", taskId] })
      }
    },
    [editedContent, updateCommentMutation, queryClient, taskId]
  )

  const handleDeleteComment = useCallback(
    async (commentId: string) => {
      await deleteCommentMutation.mutateAsync(commentId)
      queryClient.invalidateQueries({ queryKey: ["comments", taskId] })
    },
    [deleteCommentMutation, queryClient, taskId]
  )

  const handlePageChange = (selectedObject: { selected: number }) => {
    setCurrentPage(selectedObject.selected)
  }

  const handleSortChange = (value: string) => {
    setSortOrder(value as SortOrder)
    setCurrentPage(0)
  }

  if (isLoading) return <div>Loading comments...</div>
  if (error) return <div>Error loading comments</div>

  const comments = commentsResponse.content
  const totalPages = commentsResponse.totalPages

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Comments</h3>
        <Select value={sortOrder} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdDate,DESC">Newest first</SelectItem>
            <SelectItem value="createdDate,ASC">Oldest first</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        {comments.length > 0 ? (
          comments.map((comment: Comment, index: number) => (
            <div
              key={comment.id}
              className="flex justify-between items-start bg-gray-100 p-2 rounded"
              ref={index === 0 ? latestCommentRef : null}
            >
              {editingCommentId === comment.id ? (
                <div className="flex-1 mr-2">
                  <Input
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full"
                  />
                  <div className="mt-2">
                    <Button size="sm" onClick={() => handleEditComment(comment.id!)}>
                      Save
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingCommentId(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex-1">
                    <p className="text-sm">{comment.content}</p>
                    <p className="text-xs text-gray-500">
                      By {comment.createdBy} on {new Date(comment.createdDate!).toLocaleString()}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setEditingCommentId(comment.id!)
                          setEditedContent(comment.content)
                        }}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => comment.id && handleDeleteComment(comment.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
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
          forcePage={currentPage}
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
