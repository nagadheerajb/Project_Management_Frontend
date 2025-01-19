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

// Project Data
export interface Project {
  id: string
  name: string
  description?: string
  createdDate: string
  startDate: string
  endDate?: string
  createdByUserId: string
  workspaceId: string
  status: boolean
}

// Task Interfaces
export interface Task {
  id?: string
  name: string
  description: string
  createdDate?: string
  resolvedDate?: string
  dueDate?: string
  attachments?: string[]
  taskStatus: "TODO" | "IN_DEVELOPMENT" | "COMPLETE" | "RELEASED"
  projectId: string
  createdUserId: string
  assignedUserId: string
  priority: "LOW_PRIORITY" | "MEDIUM_PRIORITY" | "HIGH_PRIORITY"
}

export interface TaskResponse {
  data: Task | Task[]
  status: string
  code: number
  errors: any[]
}

// Interfaces for request and response data
export interface Comment {
  id?: string
  taskId: string
  content: string
  createdBy: string
  createdDate?: string
}

export interface PaginatedResponse<T> {
  content: T[]
  pageable: {
    pageNumber: number
    pageSize: number
    offset: number
    paged: boolean
    unpaged: boolean
  }
  totalElements: number
  totalPages: number
  last: boolean
  first: boolean
  sort: {
    empty: boolean
    sorted: boolean
    unsorted: boolean
  }
  numberOfElements: number
  size: number
  number: number
  empty: boolean
}
