import FirstNameInput from "@/components/forms/common/first-name-input"
import LastNameInput from "@/components/forms/common/last-name-input"
import EmailInput from "@/components/forms/common/email-input"
import PasswordInput from "@/components/forms/common/password-input"
import ErrorMessage from "@/components/forms/common/error-message"

interface SignUpFormBodyProps {
  firstName: string
  setFirstName: React.Dispatch<React.SetStateAction<string>>
  lastName: string
  setLastName: React.Dispatch<React.SetStateAction<string>>
  email: string
  setEmail: React.Dispatch<React.SetStateAction<string>>
  password: string
  setPassword: React.Dispatch<React.SetStateAction<string>>
  showPassword: boolean
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>
  successMessage: string
  errorMessage: string
  isPending: boolean
}

const SignUpFormBody: React.FC<SignUpFormBodyProps> = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  successMessage,
  errorMessage,
  isPending
}) => (
  <div className="space-y-4">
    {successMessage && (
      <div className="text-green-500 text-sm text-center mb-4">{successMessage}</div>
    )}
    <ErrorMessage message={errorMessage} />
    <FirstNameInput firstName={firstName} setFirstName={setFirstName} disabled={isPending} />
    <LastNameInput lastName={lastName} setLastName={setLastName} disabled={isPending} />
    <EmailInput email={email} setEmail={setEmail} disabled={isPending} />
    <PasswordInput
      password={password}
      setPassword={setPassword}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      disabled={isPending}
    />
  </div>
)

export default SignUpFormBody
