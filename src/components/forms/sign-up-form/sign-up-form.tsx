import { useState } from "react"
import { useSignUpMutation } from "@/hooks/useSignUpMutation"
import SignUpFormHeader from "@/components/forms/sign-up-form/sign-up-form-header"
import SignUpFormBody from "@/components/forms/sign-up-form/sign-up-form-body"
import SignUpFormFooter from "@/components/forms/sign-up-form/sign-up-form-footer"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { validateSignUpForm } from "@/utils/validate-sign-up-form"

interface SignUpFormProps {
  onSignUpSuccess?: () => void // Optional callback for success
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSignUpSuccess }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const { mutate, isPending } = useSignUpMutation({
    onSuccess: () => {
      setSuccessMessage("Sign-up successful! Redirecting to login...")
      onSignUpSuccess?.()
    },
    onError: (message: string) => setErrorMessage(message)
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")
    setSuccessMessage("")

    const validationError = validateSignUpForm({ email, password, firstName, lastName })
    if (validationError) {
      setErrorMessage(validationError)
      return
    }

    mutate({ email, password, firstName, lastName })
  }

  return (
    <Card className="w-[350px] shadow-2xl">
      <form onSubmit={handleSubmit}>
        <SignUpFormHeader />
        <CardContent>
          <SignUpFormBody
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            successMessage={successMessage}
            errorMessage={errorMessage}
            isPending={isPending}
          />
        </CardContent>
        <CardFooter>
          <SignUpFormFooter isPending={isPending} />
        </CardFooter>
      </form>
    </Card>
  )
}

export default SignUpForm
