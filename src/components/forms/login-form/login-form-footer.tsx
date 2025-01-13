import { useNavigate } from "react-router-dom"
import SubmitButton from "../common/submit-button"

interface LoginFormFooterProps {
  isPending: boolean
}

const LoginFormFooter: React.FC<LoginFormFooterProps> = ({ isPending }) => {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col sm:flex-row sm:space-x-4 w-full">
      {/* Sign In Button */}
      <div className="flex-1">
        <SubmitButton isPending={isPending} label="Sign In" />
      </div>

      {/* Create Account Button */}
      <button
        type="button"
        onClick={() => navigate("/signup")}
        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 w-full"
      >
        Create Account
      </button>
    </div>
  )
}

export default LoginFormFooter
