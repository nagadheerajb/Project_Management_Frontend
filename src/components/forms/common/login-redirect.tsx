import { useNavigate } from "react-router-dom"

const LoginRedirect: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="text-center">
      <p className="text-sm">
        Already have an account?{" "}
        <button
          onClick={() => navigate("/login")}
          className="text-purple-600 hover:underline font-bold"
        >
          Log in
        </button>
      </p>
    </div>
  )
}

export default LoginRedirect
