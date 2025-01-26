import api from "./index"
import { AxiosResponse } from "axios"
import { RolePermission } from "@/types/interfaces"

/**
 * Create a new role-permission association.
 * @param rolePermission - The role-permission data to be created.
 * @returns The created role-permission.
 */
export const createRolePermission = async (
  rolePermission: RolePermission
): Promise<RolePermission> => {
  try {
    const response: AxiosResponse<{ data: RolePermission }> = await api.post(
      "/rolePermissions",
      rolePermission
    )
    return response.data.data
  } catch (error: any) {
    console.error("Error creating role-permission:", error.response?.data || error.message)
    throw new Error("Failed to create role-permission. Please try again.")
  }
}

/**
 * Fetch a role-permission by its ID.
 * @param rolePermissionId - The ID of the role-permission to fetch.
 * @returns The fetched role-permission.
 */
export const fetchRolePermissionById = async (
  rolePermissionId: string
): Promise<RolePermission> => {
  try {
    const response: AxiosResponse<{ data: RolePermission }> = await api.get(
      `/rolePermissions/${rolePermissionId}`
    )
    return response.data.data
  } catch (error: any) {
    console.error("Error fetching role-permission by ID:", error.response?.data || error.message)
    throw new Error("Failed to fetch role-permission. Please try again.")
  }
}

/**
 * Update a role-permission association by its ID.
 * @param rolePermissionId - The ID of the role-permission to update.
 * @param updatedRolePermission - The updated role-permission data.
 * @returns The updated role-permission.
 */
export const updateRolePermission = async (
  rolePermissionId: string,
  updatedRolePermission: RolePermission
): Promise<RolePermission> => {
  try {
    const response: AxiosResponse<{ data: RolePermission }> = await api.put(
      `/rolePermissions/${rolePermissionId}`,
      updatedRolePermission
    )
    return response.data.data
  } catch (error: any) {
    console.error("Error updating role-permission:", error.response?.data || error.message)
    throw new Error("Failed to update role-permission. Please try again.")
  }
}

/**
 * Fetch all roles associated with a permission.
 * @param permissionId - The ID of the permission to fetch associated roles for.
 * @returns A list of role-permission associations.
 */
export const fetchAllRolesByPermission = async (
  permissionId: string
): Promise<RolePermission[]> => {
  try {
    const response: AxiosResponse<{ data: RolePermission[] }> = await api.get(
      `/rolePermissions/findAllRoles/${permissionId}`
    )
    return response.data.data
  } catch (error: any) {
    console.error("Error fetching roles by permission ID:", error.response?.data || error.message)
    throw new Error("Failed to fetch roles by permission. Please try again.")
  }
}

/**
 * Fetch all permissions associated with a role.
 * @param roleId - The ID of the role to fetch associated permissions for.
 * @returns A list of role-permission associations.
 */
export const fetchAllPermissionsByRole = async (roleId: string): Promise<RolePermission[]> => {
  try {
    const response: AxiosResponse<{ data: RolePermission[] }> = await api.get(
      `/rolePermissions/findAllPermissions/${roleId}`
    )
    return response.data.data
  } catch (error: any) {
    console.error("Error fetching permissions by role ID:", error.response?.data || error.message)
    throw new Error("Failed to fetch permissions by role. Please try again.")
  }
}

/**
 * Fetch all role-permission associations.
 * @returns A list of all role-permission associations.
 */
export const fetchAllRolePermissions = async (): Promise<RolePermission[]> => {
  try {
    const response: AxiosResponse<{ data: RolePermission[] }> = await api.get("/rolePermissions")
    return response.data.data
  } catch (error: any) {
    console.error("Error fetching all role-permissions:", error.response?.data || error.message)
    throw new Error("Failed to fetch role-permissions. Please try again.")
  }
}

/**
 * Delete a role-permission association by its ID.
 * @param rolePermissionId - The ID of the role-permission to delete.
 */
export const deleteRolePermissionById = async (rolePermissionId: string): Promise<void> => {
  try {
    await api.delete(`/rolePermissions/${rolePermissionId}`)
  } catch (error: any) {
    console.error("Error deleting role-permission:", error.response?.data || error.message)
    throw new Error("Failed to delete role-permission. Please try again.")
  }
}
