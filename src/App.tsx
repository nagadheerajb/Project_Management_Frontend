import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import LoginPage from "./pages/LoginPage"
import Home from "./pages/home"
import Dashboard from "./pages/Dashboard"
import SignUpPage from "./pages/SignUpPage"
import ErrorBoundary from "./components/forms/common/ErrorBoundary"
import ProtectedRoute from "./components/forms/common/protected-route"
import { WorkspaceProvider } from "@/context/workspace-context"
import { UserProvider } from "@/context/user-context" // Import UserProvider
import "@/styles/tailwind.css"

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ErrorBoundary>
          <UserProvider>
            {" "}
            {/* Wrap with UserProvider */}
            <WorkspaceProvider>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/home" element={<Home />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/login" />} />
              </Routes>
            </WorkspaceProvider>
          </UserProvider>
        </ErrorBoundary>
      </Router>
    </QueryClientProvider>
  )
}

export default App
