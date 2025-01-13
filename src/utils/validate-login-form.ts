interface LoginFormData {
  email: string
  password: string
}

export const validateLoginForm = ({ email, password }: LoginFormData): string | null => {
  if (!email || !password) {
    return "Email and password are required."
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    return "Please enter a valid email address."
  }

  return null
}
