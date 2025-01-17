import React from "react"
import LogoutButton from "@/components/forms/common/logout-button"
import { useWorkspace } from "@/context/workspace-context"

interface HeaderProps {
  title?: string // Optional title prop
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { selectedWorkspace, selectedCompany, selectedType } = useWorkspace()

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">
        {title // If a title prop is passed, use it; otherwise, fallback to default logic
          ? title
          : selectedType === "workspace"
          ? "Workspace Dashboard"
          : selectedType === "company"
          ? "Company Dashboard"
          : "Dashboard"}
      </h1>
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600">
          {selectedType === "workspace"
            ? `Workspace: ${selectedWorkspace}`
            : selectedType === "company"
            ? `Company: ${selectedCompany}`
            : ""}
        </span>
        <LogoutButton />
      </div>
    </header>
  )
}

export default Header
