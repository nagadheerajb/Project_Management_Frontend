// Company Data
export interface CompanyData {
  name: string
  createdBy?: string // Made optional to handle different use cases
}

// Workspace Data
export interface WorkspaceData {
  name: string
  type: string
  companyId: string
  description?: string
}

// Workspace Interface
export interface Workspace {
  id: string
  roleId: string
  workspaceId: string
  userId: string
  workspaceName?: string
  companyId: string
  companyName: string
  color?: string
}

// Login Form Inputs
export interface LoginFormInputs {
  email: string
  password: string
}

export interface UserReadDTO {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  createdDate: string
  profileImage: string | null
}
