import { CardHeader, CardTitle } from "@/components/ui/card"

const SignUpFormHeader: React.FC = () => (
  <CardHeader className="space-y-1">
    <CardTitle className="text-2xl font-bold text-center">Sign Up</CardTitle>
    <p className="text-center">Create an account by filling out the form below</p>
  </CardHeader>
)

export default SignUpFormHeader
