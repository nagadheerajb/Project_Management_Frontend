import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createPermission, updatePermission, deletePermissionById } from "@/api/permission"
import type { Permission } from "@/types/interfaces"
import { useUser } from "@/context/user-context"

export const usePermissionMutations = () => {
  const queryClient = useQueryClient()
  const { userUUID } = useUser()

  const createPermissionMutation = useMutation<
    Permission,
    Error,
    Omit<Permission, "id" | "created_user">
  >({
    mutationFn: async (permission) => {
      if (!userUUID) {
        throw new Error("User is not logged in")
      }
      return await createPermission({
        name: permission.name,
        permissionUrl: permission.permissionUrl,
        permissionType: permission.permissionType,
        created_user: userUUID
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] })
    },
    onError: (error: Error) => {
      console.error("Error creating permission:", error)
    }
  })

  const updatePermissionMutation = useMutation<
    Permission,
    Error,
    { id: string; updatedPermission: Omit<Permission, "id" | "created_user"> }
  >({
    mutationFn: async ({ id, updatedPermission }) => {
      return await updatePermission(id, updatedPermission)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] })
    },
    onError: (error: Error) => {
      console.error("Error updating permission:", error)
    }
  })

  const deletePermissionMutation = useMutation<void, Error, string>({
    mutationFn: deletePermissionById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] })
    },
    onError: (error: Error) => {
      console.error("Error deleting permission:", error)
    }
  })

  return {
    createPermissionMutation,
    updatePermissionMutation,
    deletePermissionMutation
  }
}
