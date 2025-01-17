import React from "react"
import { cn } from "@/lib/utils"
import SidebarHeader from "@/components/forms/sidebar/SidebarHeader"
import SidebarNav from "@/components/forms/sidebar/SidebarNav"
import ModalForm from "@/components/forms/common/modal-form"
import { useUser } from "@/context/user-context"
import { useCompanyMutations } from "@/hooks/useCompanyMutations"
import { useWorkspaceMutations } from "@/hooks/useWorkspaceMutations"
import { CompanyData, WorkspaceData } from "@/types/interfaces"
import { useSidebar } from "@/components/ui/sidebar"
import { useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const Sidebar: React.FC = () => {
  const { open } = useSidebar()
  const [isModalOpen, setModalOpen] = React.useState(false)
  const [modalType, setModalType] = React.useState<"company" | "workspace" | null>(null)
  const [selectedCompanyId, setSelectedCompanyId] = React.useState<string | null>(null)
  const { userUUID } = useUser()
  const { createCompanyMutation } = useCompanyMutations()
  const { createWorkspaceMutation } = useWorkspaceMutations()
  const queryClient = useQueryClient()

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
    data.createdBy = userUUID
    if (modalType === "company") {
      createCompanyMutation.mutate(data as CompanyData, {
        onSuccess: () => {
          setModalOpen(false)
          queryClient.invalidateQueries({ queryKey: ["workspaces"] })
        },
        onError: () => {
          // Handle error
        }
      })
    } else if (modalType === "workspace") {
      createWorkspaceMutation.mutate(data as WorkspaceData, {
        onSuccess: () => {
          setModalOpen(false)
          queryClient.invalidateQueries({ queryKey: ["workspaces"] })
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
          "transition-all duration-300 bg-background h-screen flex-shrink-0 border-r",
          open ? "w-64" : "w-16"
        )}
      >
        <SidebarHeader />
        <div className="p-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" className="w-full" onClick={handleAddCompanyClick}>
                  <Plus className="mr-2 h-4 w-4" />
                  {open ? "Add Company" : ""}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Add Company</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
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
          onSubmit={handleFormSubmit}
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
