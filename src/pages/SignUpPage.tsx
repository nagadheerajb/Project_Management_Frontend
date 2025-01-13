import SignUpForm from "@/components/forms/sign-up-form/sign-up-form"
import LoginRedirect from "@/components/forms/common/login-redirect"

const SignUpPage: React.FC = () => {
  const handleSignUpSuccess = () => {
    console.log("Sign-up successful!")
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="space-y-6">
        {/* Sign-Up Form */}
        <SignUpForm onSignUpSuccess={handleSignUpSuccess} />

        {/* Reusable Login Redirect */}
        <LoginRedirect />
      </div>
    </div>
  )
}

export default SignUpPage
