interface SignUpFormData {
  email: string
  password: string
  firstName: string
  lastName: string
}

export const validateSignUpForm = ({
  email,
  password,
  firstName,
  lastName
}: SignUpFormData): string | null => {
  if (!email || !password || !firstName || !lastName) {
    return "All fields are required."
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    return "Please enter a valid email address."
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters long."
  }

  return null
}
