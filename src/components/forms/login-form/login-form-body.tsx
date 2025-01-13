import EmailInput from "../common/email-input"
import PasswordInput from "../common/password-input"
import ErrorMessage from "../common/error-message"

interface LoginFormBodyProps {
  email: string
  setEmail: React.Dispatch<React.SetStateAction<string>>
  password: string
  setPassword: React.Dispatch<React.SetStateAction<string>>
  showPassword: boolean
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>
  errorMessage: string
}

const LoginFormBody: React.FC<LoginFormBodyProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  errorMessage
}) => (
  <div className="space-y-4">
    <ErrorMessage message={errorMessage} />
    <EmailInput email={email} setEmail={setEmail} />
    <PasswordInput
      password={password}
      setPassword={setPassword}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
    />
  </div>
)

export default LoginFormBody
