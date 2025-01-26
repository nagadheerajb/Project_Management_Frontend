import { useQuery } from "@tanstack/react-query"
import {
  fetchAllRolePermissions,
  fetchAllRolesByPermission,
  fetchAllPermissionsByRole
} from "@/api/rolepermission"
import { RolePermission } from "@/types/interfaces"

/**
 * Fetch all role-permission mappings in the workspace.
 * @returns Query result with all role-permission mappings.
 */
export const useRolePermissions = () => {
  return useQuery<RolePermission[], Error>({
    queryKey: ["rolePermissions"],
    queryFn: fetchAllRolePermissions
  })
}

/**
 * Fetch all roles associated with a specific permission.
 * @param permissionId - The ID of the permission to fetch associated roles for.
 * @returns Query result with role-permission mappings.
 */
export const useRolesByPermission = (permissionId: string) => {
  return useQuery<RolePermission[], Error>({
    queryKey: ["rolesByPermission", permissionId],
    queryFn: () => fetchAllRolesByPermission(permissionId),
    enabled: !!permissionId // Avoid fetching when permissionId is not provided
  })
}

/**
 * Fetch all permissions associated with a specific role.
 * @param roleId - The ID of the role to fetch associated permissions for.
 * @returns Query result with role-permission mappings.
 */
export const usePermissionsByRole = (roleId: string) => {
  return useQuery<RolePermission[], Error>({
    queryKey: ["permissionsByRole", roleId],
    queryFn: () => fetchAllPermissionsByRole(roleId),
    enabled: !!roleId // Avoid fetching when roleId is not provided
  })
}
