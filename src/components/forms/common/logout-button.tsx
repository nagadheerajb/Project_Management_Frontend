import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button" // Reuse your ShadCN button

const LogoutButton: React.FC = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("jwt") // Clear the token
    navigate("/login") // Redirect to the login page
  }

  return (
    <Button
      variant="ghost" // Use a cleaner variant for dropdown
      onClick={handleLogout}
      className="text-red-600 hover:text-red-700 flex items-center justify-start w-full"
    >
      Logout
    </Button>
  )
}

export default LogoutButton
