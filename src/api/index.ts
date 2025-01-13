import axios from "axios"

// Determine the base URL based on the environment
const isDevelopment = import.meta.env.MODE === "development"
let baseURL = "http://localhost:9099/api/v1"

if (!isDevelopment) {
  baseURL = "http://localhost:9099/api/v1"
}

// Create an axios instance with the base URL
const api = axios.create({
  baseURL
})

// Attach the JWT token to every request for authenticated routes and the workspace ID where necessary
api.interceptors.request.use(
  (config) => {
    console.log("inside src/api/index.ts")

    // Exclude login and signup routes from requiring Authorization headers
    if (config.url?.includes("/auth/login") || config.url?.includes("/auth/signup")) {
      return config // Skip adding the token for these endpoints
    }

    // Retrieve the JWT token from localStorage and trim any whitespace
    let token = localStorage.getItem("jwt")
    if (token) {
      token = token.trim()
      console.log("Token after trimming:", token)
      config.headers["Authorization"] = `Bearer ${token}`
    }

    // Only add the workspace ID header for endpoints that require it
    if (
      !config.url?.includes("/workspace-users/my-workspaces") &&
      !config.url?.includes("/auth/login") &&
      !config.url?.includes("/auth/signup") &&
      !config.url?.includes("/users/me")
    ) {
      let workspaceId = localStorage.getItem("workspaceId")
      if (workspaceId) {
        config.headers["workspaceId"] = workspaceId
      }
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Use this to handle errors gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 500) {
      throw new Error(error.response.data)
    }
    return Promise.reject(error)
  }
)

export default api
