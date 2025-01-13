import api from "@/api"
import { UserReadDTO } from "@/types"

export const fetchCurrentUser = async (): Promise<UserReadDTO> => {
  const response = await api.get("/users/me")
  return response.data.data
}
