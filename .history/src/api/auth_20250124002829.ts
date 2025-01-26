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
    console.log("Login Payload:", data)

    const response = await api.post("/auth/login", data)

    console.log("Login API Response:", response.data)

    const accessToken = response.data.data?.accessToken
    console.log("Extracted Access Token:", accessToken)

    if (!accessToken) {
      throw new Error("Access token not found in the response.")
    }

    localStorage.setItem("jwt", accessToken) // Store token in localStorage
    return response.data
  } catch (error: any) {
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

export const refreshToken = async (currentToken: string) => {
  try {
    const response = await api.post("/auth/refresh-token", { token: currentToken })

    console.log("Refresh Token API Response:", response.data)

    const newAccessToken = response.data.data?.accessToken
    console.log("Extracted New Access Token:", newAccessToken)

    if (!newAccessToken) {
      throw new Error("Access token not found in the response.")
    }

    localStorage.setItem("jwt", newAccessToken) // Update the token in localStorage
    return { accessToken: newAccessToken }
  } catch (error: any) {
    console.error("Error during token refresh:", error)

    if (error.response) {
      const apiErrorMessage =
        error.response.data.errors?.[0]?.message || "An error occurred while refreshing the token."
      throw new Error(apiErrorMessage)
    } else if (error.request) {
      throw new Error("No response received from the server. Please try again later.")
    } else {
      throw new Error("An unexpected error occurred. Please try again.")
    }
  }
}
