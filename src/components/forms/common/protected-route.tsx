import { Navigate } from "react-router-dom"
import jwtDecode from "jwt-decode"

interface DecodedToken {
  exp: number // Expiration time in seconds
}

const isTokenValid = (): boolean => {
  const token = localStorage.getItem("jwt")
  if (!token) return false

  try {
    const { exp } = jwtDecode<DecodedToken>(token)
    return Date.now() < exp * 1000 // Check if token is expired
  } catch {
    return false // Invalid token
  }
}

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (!isTokenValid()) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
