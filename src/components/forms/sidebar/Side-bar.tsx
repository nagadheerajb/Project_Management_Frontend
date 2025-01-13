import React from "react"
import { cn } from "@/lib/utils"
import SidebarHeader from "@/components/forms/sidebar/SidebarHeader"
import SidebarButton from "@/components/forms/sidebar/SidebarButton"
import SidebarNav from "@/components/forms/sidebar/SidebarNav"
import ModalForm from "@/components/forms/common/modal-form"
import { useUser } from "@/context/user-context"
import { useCompanyMutations } from "@/hooks/useCompanyMutations"
import { useWorkspaceMutations } from "@/hooks/useWorkspaceMutations"
import { CompanyData, WorkspaceData } from "@/types/interfaces"
import { useSidebar } from "@/components/ui/sidebar"
import { useQueryClient } from "@tanstack/react-query" // Import useQueryClient

const Sidebar: React.FC = () => {
  const { open } = useSidebar() // Ensure open is destructured correctly
  const [isModalOpen, setModalOpen] = React.useState(false)
  const [modalType, setModalType] = React.useState<"company" | "workspace" | null>(null)
  const [selectedCompanyId, setSelectedCompanyId] = React.useState<string | null>(null)
  const { userUUID } = useUser() // Get the current user's UUID
  const { createCompanyMutation } = useCompanyMutations()
  const { createWorkspaceMutation } = useWorkspaceMutations()
  const queryClient = useQueryClient() // Initialize queryClient

  const handleAddCompanyClick = () => {
    setModalType("company")
    setModalOpen(true)
  }

  const handleAddWorkspaceClick = (companyId: string) => {
    setModalType("workspace")
    setSelectedCompanyId(companyId)
    setModalOpen(true)
  }

  const handleFormSubmit = (data: CompanyData & Partial<WorkspaceData> & { createdBy: string }) => {
    if (!userUUID) {
      console.error("User UUID is null")
      return
    }
    data.createdBy = userUUID // Set the createdBy field to the current user's UUID
    if (modalType === "company") {
      createCompanyMutation.mutate(data as CompanyData, {
        onSuccess: () => {
          setModalOpen(false)
          queryClient.invalidateQueries({ queryKey: ["workspaces"] }) // Invalidate the workspaces query
        },
        onError: () => {
          // Handle error
        }
      })
    } else if (modalType === "workspace") {
      createWorkspaceMutation.mutate(data as WorkspaceData, {
        onSuccess: () => {
          setModalOpen(false)
          queryClient.invalidateQueries({ queryKey: ["workspaces"] }) // Invalidate the workspaces query
        },
        onError: () => {
          // Handle error
        }
      })
    }
  }

  return (
    <>
      <aside
        className={cn(
          "transition-all duration-300 bg-gray-100 h-screen flex-shrink-0 border-r",
          open ? "w-64" : "w-16"
        )}
      >
        <SidebarHeader />
        <SidebarButton onClick={handleAddCompanyClick} label="Add Company" />
        <SidebarButton
          onClick={() => handleAddWorkspaceClick(selectedCompanyId!)}
          label="Add Workspace"
        />
        <SidebarNav handleAddWorkspaceClick={handleAddWorkspaceClick} />
      </aside>

      {isModalOpen && (
        <ModalForm
          type={modalType!}
          defaultValues={
            modalType === "company"
              ? { name: "", createdBy: userUUID ?? "" }
              : {
                  name: "",
                  type: "",
                  companyId: selectedCompanyId ?? "",
                  createdBy: userUUID ?? ""
                }
          }
          onSubmit={handleFormSubmit} // Handle form submission
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          isPending={false}
          label="Save"
          selectedCompanyId={selectedCompanyId}
        />
      )}
    </>
  )
}

export default Sidebar
