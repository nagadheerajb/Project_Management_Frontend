import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { signUp, SignUpFormInputs } from "@/api/auth"

interface UseSignUpMutationProps {
  onSuccess: () => void
  onError: (message: string) => void
}

export const useSignUpMutation = ({ onSuccess, onError }: UseSignUpMutationProps) => {
  const navigate = useNavigate()

  const mutation = useMutation<void, Error, SignUpFormInputs>({
    mutationFn: signUp,
    onSuccess: () => {
      onSuccess() // Trigger success callback
      setTimeout(() => navigate("/login"), 3000) // Redirect after 3 seconds
    },
    onError: (error) => {
      const message = error.message || "Sign-up failed. Please try again."
      onError(message)
    }
  })

  return {
    mutate: mutation.mutate,
    isPending: mutation.status === "pending"
  }
}
