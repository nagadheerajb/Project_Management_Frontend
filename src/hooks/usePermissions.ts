import { useQuery } from "@tanstack/react-query"
import { fetchAllPermissions, fetchPermissionById } from "@/api/permission"
import { Permission } from "@/types/interfaces"

/**
 * Fetch all permissions in the workspace.
 * @returns Query result with all permissions.
 */
export const usePermissions = () => {
  return useQuery<Permission[], Error>({
    queryKey: ["permissions"],
    queryFn: fetchAllPermissions
  })
}

/**
 * Fetch a specific permission by ID.
 * @param id - The ID of the permission to fetch.
 * @returns Query result with the permission.
 */
export const usePermission = (id: string) => {
  return useQuery<Permission, Error>({
    queryKey: ["permission", id],
    queryFn: () => fetchPermissionById(id),
    enabled: !!id // Avoid fetching when ID is not provided
  })
}
