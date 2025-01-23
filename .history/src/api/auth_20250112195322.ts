import api from "../api"

export interface LoginFormInputs {
  email: string
  password: string
}

export interface SignUpFormInputs {
  email: string
  password: string
  firstName: string
  lastName: string
}

export const login = async (data: LoginFormInputs) => {
  try {
    // Log the payload being sent to the backend
    console.log("Login Payload:", data)

    const response = await api.post("/auth/login", data)

    // Log the complete response received from the backend
    console.log("Login API Response:", response.data)

    // Extract and log the accessToken
    const accessToken = response.data.data?.accessToken
    console.log("Extracted Access Token:", accessToken)

    if (!accessToken) {
      throw new Error("Access token not found in the response.")
    }

    localStorage.setItem("jwt", accessToken) // Store token in localStorage
    return response.data
  } catch (error: any) {
    // Log the error details
    console.error("Error during login:", error)

    if (error.response) {
      const apiErrorMessage =
        error.response.data.errors?.[0]?.message || "An error occurred while logging in."
      throw new Error(apiErrorMessage)
    } else if (error.request) {
      throw new Error("No response received from the server. Please try again later.")
    } else {
      throw new Error("An unexpected error occurred. Please try again.")
    }
  }
}

export const signUp = async (data: SignUpFormInputs) => {
  try {
    const response = await api.post("/auth/signup", data)
    return response.data
  } catch (error: any) {
    if (error.response) {
      const apiErrorMessage =
        error.response.data.errors?.[0]?.message || "An error occurred while signing up."
      throw new Error(apiErrorMessage)
    } else if (error.request) {
      throw new Error("No response received from the server. Please try again later.")
    } else {
      throw new Error("An unexpected error occurred. Please try again.")
    }
  }
}
