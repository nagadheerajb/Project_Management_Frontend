import { useState } from "react"
import { useLoginMutation } from "@/hooks/useLoginMutation"
import { validateLoginForm } from "@/utils/validate-login-form"
import LoginFormHeader from "./login-form-header"
import LoginFormBody from "./login-form-body"
import LoginFormFooter from "./login-form-footer"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface LoginFormProps {
  onLoginSuccess: () => void
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const { mutate, isPending } = useLoginMutation({
    onSuccess: () => onLoginSuccess(),
    onError: (message: string) => setErrorMessage(message)
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")

    const validationError = validateLoginForm({ email, password })
    if (validationError) {
      setErrorMessage(validationError)
      return
    }

    mutate({ email, password })
  }

  return (
    <Card className="w-[350px] shadow-2xl">
      <form onSubmit={handleSubmit}>
        <LoginFormHeader />
        <CardContent>
          <LoginFormBody
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            errorMessage={errorMessage}
          />
        </CardContent>
        <CardFooter>
          <LoginFormFooter isPending={isPending} />
        </CardFooter>
      </form>
    </Card>
  )
}

export default LoginForm
