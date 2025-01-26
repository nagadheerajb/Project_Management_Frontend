import api from "@/api"
import { UserReadDTO } from "@/types"

// Fetch the current logged-in user's details
export const fetchCurrentUser = async (): Promise<UserReadDTO> => {
  const response = await api.get("/users/me")
  return response.data.data
}

// Fetch all users
export const fetchAllUsers = async (): Promise<UserReadDTO[]> => {
  const response = await api.get("/users")
  return response.data.data // Assuming `data` contains the array of users
}

// Fetch a specific user's details by their ID
export const fetchUserById = async (userId: string): Promise<UserReadDTO> => {
  const response = await api.get(`/users/${userId}`)
  return response.data.data // Assuming `data` contains the user object
}
