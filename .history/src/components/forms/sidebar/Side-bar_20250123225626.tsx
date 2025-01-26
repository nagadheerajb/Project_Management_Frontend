import React, { useState } from "react"
import { cn } from "@/lib/utils"
import SidebarHeader from "@/components/forms/sidebar/SidebarHeader"
import SidebarNav from "@/components/forms/sidebar/SidebarNav"
import ModalForm from "@/components/forms/common/modal-form"
import { useUser } from "@/context/user-context"
import { useCompanyMutations } from "@/hooks/useCompanyMutations"
import { useWorkspaceMutations } from "@/hooks/useWorkspaceMutations"
import { useSidebar } from "@/components/ui/sidebar"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getMyCompanies } from "@/api/company"
import { CompanyData, WorkspaceData } from "@/types/interfaces"

async function fetchCompanies(): Promise<CompanyData[]> {
  const response = await getMyCompanies()
  return response
}

const Sidebar: React.FC = () => {
  const { open } = useSidebar()
  const [isModalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState<"company" | "workspace" | null>(null)
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null)
  const { userUUID } = useUser()
  const { createCompanyMutation } = useCompanyMutations()
  const { createWorkspaceMutation } = useWorkspaceMutations()
  const queryClient = useQueryClient()

  const { data: companies = [], isLoading: isLoadingCompanies } = useQuery({
    queryKey: ["companies"],
    queryFn: fetchCompanies,
    onError: (err) => {
      console.error("Error fetching companies:", err)
    }
  })

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
          // Invalidate queries to refetch the updated data
          queryClient.invalidateQueries({ queryKey: ["companies"] })
          queryClient.invalidateQueries({ queryKey: ["workspaces"] })
        },
        onError: (err) => {
          console.error("Error creating company:", err)
        }
      })
    } else if (modalType === "workspace") {
      createWorkspaceMutation.mutate(data as WorkspaceData, {
        onSuccess: () => {
          setModalOpen(false)
          queryClient.invalidateQueries({ queryKey: ["workspaces"] })
          queryClient.invalidateQueries({ queryKey: ["companies"] })
        },
        onError: (err) => {
          console.error("Error creating workspace:", err)
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
        <SidebarNav
          handleAddWorkspaceClick={handleAddWorkspaceClick}
          companies={companies}
          isLoadingCompanies={isLoadingCompanies}
        />
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
          error={null}
          roles={[]} // Pass roles if applicable
          permissions={[]} // Pass permissions if applicable
        />
      )}
    </>
  )
}

export default Sidebar
