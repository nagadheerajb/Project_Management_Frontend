import React, { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { fetchCurrentUser } from "@/api/user"
import { UserReadDTO } from "@/types/interfaces"

// Define the shape of the user context
interface UserContextType {
  user: UserReadDTO | null
  userUUID: string | null
}

interface UserProviderProps {
  children: ReactNode
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserReadDTO | null>(null)
  const [userUUID, setUserUUID] = useState<string | null>(null)

  useEffect(() => {
    // Fetch the user's details from the backend when the component mounts
    const getCurrentUser = async () => {
      try {
        const userData = await fetchCurrentUser()
        setUser(userData)
        setUserUUID(userData.id)
        localStorage.setItem("userUUID", userData.id)
      } catch (error) {
        console.error("Failed to fetch user data", error)
      }
    }

    getCurrentUser()
  }, [])

  return <UserContext.Provider value={{ user, userUUID }}>{children}</UserContext.Provider>
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
