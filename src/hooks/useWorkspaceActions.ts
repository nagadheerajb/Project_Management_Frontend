import { useWorkspaceMutations } from "@/hooks/useWorkspaceMutations"
import { useCallback, useState } from "react"

export const useWorkspaceActions = () => {
  const { deleteWorkspaceMutation } = useWorkspaceMutations()
  const [isPending, setIsPending] = useState(false)

  const handleDelete = useCallback(
    (type: "workspace", id: string) => {
      console.log("handleDelete called with:", { type, id })
      if (!id || typeof id !== "string" || !id.match(/^[0-9a-fA-F-]{36}$/)) {
        console.error("Invalid ID for deletion:", { type, id })
        return
      }

      setIsPending(true)
      deleteWorkspaceMutation.mutate(id, {
        onSuccess: () => {
          console.log("Workspace deleted successfully")
        },
        onError: (error) => {
          console.error("Error deleting workspace:", error)
        },
        onSettled: () => {
          setIsPending(false)
        }
      })
    },
    [deleteWorkspaceMutation]
  )

  return {
    handleDelete,
    isPending,
    setIsPending
  }
}
