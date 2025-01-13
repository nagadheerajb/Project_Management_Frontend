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
      variant="destructive"
      onClick={handleLogout}
      className="text-white bg-red-600 hover:bg-red-700"
    >
      Logout
    </Button>
  )
}

export default LogoutButton
