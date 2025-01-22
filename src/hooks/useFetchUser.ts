import { useState, useEffect } from "react"
import { fetchUserById } from "@/api/user"
import { UserReadDTO } from "@/types/interfaces"

export const useFetchUser = (userId: string) => {
  const [userDetails, setUserDetails] = useState<UserReadDTO | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDetails = async () => {
      if (!userId) {
        setUserDetails(null)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const user = await fetchUserById(userId)
        setUserDetails(user)
      } catch (err) {
        console.error(`Failed to fetch user details for userId: ${userId}`, err)
        setError("Failed to fetch user details")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDetails()
  }, [userId])

  return { userDetails, isLoading, error }
}
