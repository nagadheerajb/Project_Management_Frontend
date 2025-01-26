import { useQuery } from "@tanstack/react-query"
import { fetchAllRoles, fetchRoleById } from "@/api/role"
import { Role } from "@/types/interfaces"

/**
 * Fetch all roles in the workspace.
 * @returns Query result with all roles.
 */
export const useRoles = () => {
  return useQuery<Role[], Error>({
    queryKey: ["roles"],
    queryFn: fetchAllRoles
  })
}

/**
 * Fetch a specific role by ID.
 * @param id - The ID of the role to fetch.
 * @returns Query result with the role.
 */
export const useRole = (id: string) => {
  return useQuery<Role, Error>({
    queryKey: ["role", id],
    queryFn: () => fetchRoleById(id),
    enabled: !!id // Avoid fetching when ID is not provided
  })
}
