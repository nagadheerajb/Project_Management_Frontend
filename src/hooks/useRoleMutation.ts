import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query"
import { createRole, updateRole, deleteRoleById } from "@/api/role"
import type { Role } from "@/types/interfaces"

export const useRoleMutations = () => {
  const queryClient = useQueryClient()

  // Create Role Mutation
  const createRoleMutation = useMutation<Role, Error, Role>({
    mutationFn: createRole,
    onSuccess: (data) => {
      console.log("Role created successfully:", data)
      queryClient.invalidateQueries({ queryKey: ["roles", data.companyId] })
    },
    onError: (error: Error) => {
      console.error("Error creating role:", error)
    }
  })

  // Update Role Mutation
  const updateRoleMutation = useMutation<Role, Error, { id: string; updatedRole: Role }>({
    mutationFn: ({ id, updatedRole }) => updateRole(id, updatedRole),
    onSuccess: (data) => {
      console.log("Role updated successfully:", data)
      queryClient.invalidateQueries({ queryKey: ["roles", data.companyId] })
    },
    onError: (error: Error) => {
      console.error("Error updating role:", error)
    }
  })

  // Delete Role Mutation
  const deleteRoleMutation = useMutation<void, Error, { id: string; companyId: string }>({
    mutationFn: ({ id, companyId }) => deleteRoleById(id),
    onSuccess: (_, { companyId }) => {
      console.log("Role deleted successfully")
      queryClient.invalidateQueries({ queryKey: ["roles", companyId] })
    },
    onError: (error: Error) => {
      console.error("Error deleting role:", error)
    }
  })

  return {
    createRoleMutation: createRoleMutation as UseMutationResult<Role, Error, Role>,
    updateRoleMutation: updateRoleMutation as UseMutationResult<
      Role,
      Error,
      { id: string; updatedRole: Role }
    >,
    deleteRoleMutation: deleteRoleMutation as UseMutationResult<
      void,
      Error,
      { id: string; companyId: string }
    >
  }
}
