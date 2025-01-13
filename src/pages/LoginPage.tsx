import { useNavigate } from "react-router-dom"
import LoginForm from "../components/forms/login-form/login-form"

export default function LoginPage() {
  const navigate = useNavigate()

  const handleLoginSuccess = () => {
    navigate("/dashboard") // Adjust this path based on your routes
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-pink-500">
      <LoginForm onLoginSuccess={handleLoginSuccess} />
    </div>
  )
}
