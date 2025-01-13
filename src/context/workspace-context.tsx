import React, { createContext, useContext, useState } from "react"

interface WorkspaceContextType {
  selectedWorkspace: string | null
  setSelectedWorkspace: (workspaceId: string) => void
  selectedCompany: string | null
  setSelectedCompany: (companyId: string) => void
  selectedType: "company" | "workspace" | null
  setSelectedType: (type: "company" | "workspace" | null) => void
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined)

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(null)
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<"company" | "workspace" | null>(null)

  return (
    <WorkspaceContext.Provider
      value={{
        selectedWorkspace,
        setSelectedWorkspace,
        selectedCompany,
        setSelectedCompany,
        selectedType,
        setSelectedType
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  )
}

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext)
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider")
  }
  return context
}

export const useCompany = () => {
  const context = useContext(WorkspaceContext)
  if (!context) {
    throw new Error("useCompany must be used within a WorkspaceProvider")
  }
  return {
    selectedCompany: context.selectedCompany,
    setSelectedCompany: context.setSelectedCompany
  }
}
