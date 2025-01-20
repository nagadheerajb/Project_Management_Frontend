import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  createRolePermission,
  updateRolePermission,
  deleteRolePermissionById
} from "@/api/rolepermission"
import { RolePermission } from "@/types/interfaces"

export const useRolePermissionMutations = () => {
  const queryClient = useQueryClient()

  // Create RolePermission Mutation
  const createRolePermissionMutation = useMutation<RolePermission, Error, RolePermission>({
    mutationFn: createRolePermission,
    onSuccess: (data) => {
      console.log("RolePermission created successfully:", data)
      queryClient.invalidateQueries({ queryKey: ["rolePermissions"] })
    },
    onError: (error: Error) => {
      console.error("Error creating role-permission:", error)
    }
  })

  // Update RolePermission Mutation
  const updateRolePermissionMutation = useMutation<
    RolePermission,
    Error,
    { id: string; updatedRolePermission: RolePermission }
  >({
    mutationFn: ({ id, updatedRolePermission }) => updateRolePermission(id, updatedRolePermission),
    onSuccess: (data) => {
      console.log("RolePermission updated successfully:", data)
      queryClient.invalidateQueries({ queryKey: ["rolePermissions"] })
    },
    onError: (error: Error) => {
      console.error("Error updating role-permission:", error)
    }
  })

  // Delete RolePermission Mutation
  const deleteRolePermissionMutation = useMutation<void, Error, string>({
    mutationFn: deleteRolePermissionById,
    onSuccess: () => {
      console.log("RolePermission deleted successfully")
      queryClient.invalidateQueries({ queryKey: ["rolePermissions"] })
    },
    onError: (error: Error) => {
      console.error("Error deleting role-permission:", error)
    }
  })

  return {
    createRolePermissionMutation,
    updateRolePermissionMutation,
    deleteRolePermissionMutation
  }
}
