import { CardHeader, CardTitle } from "@/components/ui/card"

const LoginFormHeader: React.FC = () => (
  <CardHeader className="space-y-1">
    <CardTitle className="text-2xl font-bold text-center">Sign in</CardTitle>
    <p className="text-center">Enter your email and password to access your account</p>
  </CardHeader>
)

export default LoginFormHeader
