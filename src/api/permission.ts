import api from "./index"
import { AxiosResponse } from "axios"
import { Permission } from "@/types/interfaces"

/**
 * Create a new permission.
 * @param permission - The permission data to be created.
 * @returns The created permission.
 */
export const createPermission = async (permission: Permission): Promise<Permission> => {
  try {
    const response: AxiosResponse<{ data: Permission }> = await api.post("/permissions", permission)
    return response.data.data
  } catch (error: any) {
    console.error("Error creating permission:", error.response?.data || error.message)
    throw new Error("Failed to create permission. Please try again.")
  }
}

/**
 * Fetch a permission by its ID.
 * @param permissionId - The ID of the permission to fetch.
 * @returns The fetched permission.
 */
export const fetchPermissionById = async (permissionId: string): Promise<Permission> => {
  try {
    const response: AxiosResponse<{ data: Permission }> = await api.get(
      `/permissions/${permissionId}`
    )
    return response.data.data
  } catch (error: any) {
    console.error("Error fetching permission by ID:", error.response?.data || error.message)
    throw new Error("Failed to fetch permission. Please try again.")
  }
}

/**
 * Update a permission by its ID.
 * @param permissionId - The ID of the permission to update.
 * @param updatedPermission - The updated permission data.
 * @returns The updated permission.
 */
export const updatePermission = async (
  permissionId: string,
  updatedPermission: Permission
): Promise<Permission> => {
  try {
    const response: AxiosResponse<{ data: Permission }> = await api.put(
      `/permissions/${permissionId}`,
      updatedPermission
    )
    return response.data.data
  } catch (error: any) {
    console.error("Error updating permission:", error.response?.data || error.message)
    throw new Error("Failed to update permission. Please try again.")
  }
}

/**
 * Search for a permission by its name.
 * @param permissionName - The name of the permission to search for.
 * @returns The matching permission.
 */
export const searchPermissionByName = async (permissionName: string): Promise<Permission> => {
  try {
    const response: AxiosResponse<{ data: Permission }> = await api.get(
      `/permissions/search/${permissionName}`
    )
    return response.data.data
  } catch (error: any) {
    console.error("Error searching permission by name:", error.response?.data || error.message)
    throw new Error("Failed to search for permission. Please try again.")
  }
}

/**
 * Fetch all permissions in the workspace.
 * @returns A list of all permissions.
 */
export const fetchAllPermissions = async (): Promise<Permission[]> => {
  try {
    const response: AxiosResponse<{ data: Permission[] }> = await api.get("/permissions")
    return response.data.data
  } catch (error: any) {
    console.error("Error fetching all permissions:", error.response?.data || error.message)
    throw new Error("Failed to fetch permissions. Please try again.")
  }
}

/**
 * Delete a permission by its ID.
 * @param permissionId - The ID of the permission to delete.
 */
export const deletePermissionById = async (permissionId: string): Promise<void> => {
  try {
    await api.delete(`/permissions/${permissionId}`)
  } catch (error: any) {
    console.error("Error deleting permission:", error.response?.data || error.message)
    throw new Error("Failed to delete permission. Please try again.")
  }
}
