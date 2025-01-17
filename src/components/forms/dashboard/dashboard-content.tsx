import React, { useState, useCallback, useEffect } from "react"
import { useWorkspace } from "@/context/workspace-context"
import { useUser } from "@/context/user-context"
import { useCompanyMutations } from "@/hooks/useCompanyMutations"
import { useProjectMutations } from "@/hooks/useProjectMutations"
import ModalFormHandler from "@/components/forms/common/ModalFormHandler"
import WorkspaceDetailsSection from "./WorkspaceDetailsSection"
import CompanyDetailsSection from "./CompanyDetailsSection"
import { useWorkspaceActions } from "@/hooks/useWorkspaceActions"

const DashboardContent: React.FC = () => {
  const { selectedWorkspace, selectedCompany, selectedType } = useWorkspace()
  const { userUUID } = useUser()
  const [isModalOpen, setModalOpen] = useState(false)
  const [editType, setEditType] = useState<"company" | "workspace" | "project" | null>(null)
  const [defaultValues, setDefaultValues] = useState<any>({})
  const [formKey, setFormKey] = useState(0)
  const { handleDelete, isPending, setIsPending } = useWorkspaceActions()
  const [error, setError] = useState<string | null>(null)

  const { deleteCompanyMutation } = useCompanyMutations()
  const { deleteProjectMutation } = useProjectMutations()

  useEffect(() => {
    console.log("DashboardContent - Selected Workspace:", selectedWorkspace)
    console.log("DashboardContent - Selected Company:", selectedCompany)
  }, [selectedWorkspace, selectedCompany])

  const handleEdit = useCallback((type: "company" | "workspace" | "project", details: any) => {
    setEditType(type)
    setDefaultValues(details || {})
    setModalOpen(true)
    setFormKey((prevKey) => prevKey + 1)
    setError(null)
  }, [])

  const handleDeleteProject = useCallback(
    (projectId: string) => {
      console.log("Deleting project with ID:", projectId)
      if (!projectId.match(/^[0-9a-fA-F-]{36}$/)) {
        console.error("Invalid project ID:", projectId)
        return
      }
      deleteProjectMutation.mutate(projectId, {
        onSuccess: () => {
          console.log("Project deleted successfully")
        },
        onError: (error) => {
          console.error("Error deleting project:", error.message)
        }
      })
    },
    [deleteProjectMutation]
  )

  const handleCloseModal = useCallback(() => {
    setModalOpen(false)
    setEditType(null)
    setDefaultValues({})
  }, [])

  return (
    <div>
      <div className="space-y-6">
        {selectedType === "workspace" && selectedWorkspace && (
          <WorkspaceDetailsSection
            selectedWorkspace={selectedWorkspace}
            onEdit={handleEdit}
            onDelete={(id) => handleDelete("workspace", id)}
            onCreateProject={(workspaceId) => handleEdit("project", { workspaceId })}
            onDeleteProject={handleDeleteProject}
          />
        )}
        {selectedType === "company" && selectedCompany && (
          <CompanyDetailsSection
            selectedCompany={selectedCompany}
            onEdit={(details) => handleEdit("company", details)}
            onDelete={(id) => deleteCompanyMutation.mutate(id)}
          />
        )}
        <ModalFormHandler
          key={formKey}
          isOpen={isModalOpen}
          editType={editType}
          defaultValues={defaultValues}
          setModalOpen={setModalOpen}
          onClose={handleCloseModal}
          isPending={isPending}
          setIsPending={setIsPending}
          error={error}
          setError={setError}
        />
      </div>
    </div>
  )
}

export default DashboardContent
