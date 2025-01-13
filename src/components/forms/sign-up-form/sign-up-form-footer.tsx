import SubmitButton from "@/components/forms/common/submit-button"

interface SignUpFormFooterProps {
  isPending: boolean
}

const SignUpFormFooter: React.FC<SignUpFormFooterProps> = ({ isPending }) => (
  <div>
    <SubmitButton isPending={isPending} label="Sign Up" />
  </div>
)

export default SignUpFormFooter
