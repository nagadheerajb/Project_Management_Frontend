import { useMutation } from "@tanstack/react-query"
import { login } from "@/api/auth"

interface UseLoginMutationProps {
  onSuccess: () => void
  onError: (message: string) => void
}

export const useLoginMutation = ({ onSuccess, onError }: UseLoginMutationProps) => {
  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      // Log the response data from the mutation
      console.log("Login Mutation Success - Data:", data)

      // Extract and log the token
      const accessToken = data.data?.accessToken
      console.log("Access Token from Mutation:", accessToken)

      if (!accessToken) {
        throw new Error("Access token not found in the response.")
      }

      localStorage.setItem("jwt", accessToken) // Store the token in localStorage
      onSuccess() // Trigger success callback
    },
    onError: (error: any) => {
      // Log the error received in the mutation
      console.error("Login Mutation Error:", error)

      const message = error.message || "Login failed. Please try again."
      onError(message)
    }
  })

  return {
    mutate: mutation.mutate,
    isPending: mutation.status === "pending"
  }
}
