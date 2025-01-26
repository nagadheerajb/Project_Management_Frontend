import api from "./index"
import { AxiosResponse } from "axios"
import { Role } from "@/types/interfaces"

/**
 * Create a new role.
 * @param role - The role data to be created.
 * @returns The created role.
 */
export const createRole = async (role: Role): Promise<Role> => {
  try {
    const response: AxiosResponse<{ data: Role }> = await api.post("/roles", role)
    return response.data.data
  } catch (error: any) {
    console.error("Error creating role:", error.response?.data || error.message)
    throw new Error("Failed to create role. Please try again.")
  }
}

/**
 * Fetch a role by its ID.
 * @param roleId - The ID of the role to fetch.
 * @returns The fetched role.
 */
export const fetchRoleById = async (roleId: string): Promise<Role> => {
  try {
    const response: AxiosResponse<{ data: Role }> = await api.get(`/roles/${roleId}`)
    return response.data.data
  } catch (error: any) {
    console.error("Error fetching role by ID:", error.response?.data || error.message)
    throw new Error("Failed to fetch role. Please try again.")
  }
}

/**
 * Update a role by its ID.
 * @param roleId - The ID of the role to update.
 * @param updatedRole - The updated role data.
 * @returns The updated role.
 */
export const updateRole = async (roleId: string, updatedRole: Role): Promise<Role> => {
  try {
    const response: AxiosResponse<{ data: Role }> = await api.put(`/roles/${roleId}`, updatedRole)
    return response.data.data
  } catch (error: any) {
    console.error("Error updating role:", error.response?.data || error.message)
    throw new Error("Failed to update role. Please try again.")
  }
}

/**
 * Search for a role by its name.
 * @param roleName - The name of the role to search for.
 * @returns The matching role.
 */
export const searchRoleByName = async (roleName: string): Promise<Role> => {
  try {
    const response: AxiosResponse<{ data: Role }> = await api.get(`/roles/search/${roleName}`)
    return response.data.data
  } catch (error: any) {
    console.error("Error searching role by name:", error.response?.data || error.message)
    throw new Error("Failed to search for role. Please try again.")
  }
}

/**
 * Fetch all roles in the workspace.
 * @returns A list of all roles.
 */
export const fetchAllRoles = async (): Promise<Role[]> => {
  try {
    const response: AxiosResponse<{ data: Role[] }> = await api.get("/roles")
    return response.data.data
  } catch (error: any) {
    console.error("Error fetching all roles:", error.response?.data || error.message)
    throw new Error("Failed to fetch roles. Please try again.")
  }
}

/**
 * Delete a role by its ID.
 * @param roleId - The ID of the role to delete.
 */
export const deleteRoleById = async (roleId: string): Promise<void> => {
  try {
    await api.delete(`/roles/${roleId}`)
  } catch (error: any) {
    console.error("Error deleting role:", error.response?.data || error.message)
    throw new Error("Failed to delete role. Please try again.")
  }
}
