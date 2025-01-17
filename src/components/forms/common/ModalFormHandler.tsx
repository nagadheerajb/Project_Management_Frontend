import React from "react"
import ModalForm from "@/components/forms/common/modal-form"
import { CompanyData, WorkspaceData, Project } from "@/types/interfaces"
import { useCompanyMutations } from "@/hooks/useCompanyMutations"
import { useWorkspaceMutations } from "@/hooks/useWorkspaceMutations"
import { useProjectMutations } from "@/hooks/useProjectMutations"

type FormData = CompanyData &
  Partial<WorkspaceData> &
  Partial<Project> & {
    createdBy: string
    projectId: string
    workspaceId: string
  }

const ModalFormHandler: React.FC<{
  isOpen: boolean
  editType: "company" | "workspace" | "project" | null
  defaultValues: any
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  onClose: () => void
  isPending: boolean // Added prop
  setIsPending: React.Dispatch<React.SetStateAction<boolean>> // Added prop
  error: string | null // Added prop
  setError: React.Dispatch<React.SetStateAction<string | null>> // Added prop
}> = ({
  isOpen,
  editType,
  defaultValues,
  setModalOpen,
  onClose,
  isPending,
  setIsPending,
  error,
  setError
}) => {
  const { createCompanyMutation, updateCompanyMutation } = useCompanyMutations()
  const { createWorkspaceMutation, updateWorkspaceMutation } = useWorkspaceMutations()
  const { createProjectMutation, updateProjectMutation } = useProjectMutations()

  const handleSubmit = (data: FormData) => {
    console.log("handleSubmit called with data:", data)
    setIsPending(true) // Set loading state
    setError(null) // Reset error state

    const onSuccess = () => {
      setModalOpen(false)
      setIsPending(false)
      console.log(`${editType} ${defaultValues.id ? "updated" : "created"} successfully`)
    }

    const onError = (error: any) => {
      setIsPending(false)
      setError(`Error ${defaultValues.id ? "updating" : "creating"} ${editType}: ${error.message}`)
      console.error(`Error ${defaultValues.id ? "updating" : "creating"} ${editType}:`, error)
    }

    if (editType === "company") {
      if (defaultValues.id) {
        updateCompanyMutation.mutate(
          { id: defaultValues.id, updates: data as CompanyData },
          { onSuccess, onError }
        )
      } else {
        createCompanyMutation.mutate(data as CompanyData, { onSuccess, onError })
      }
    } else if (editType === "workspace") {
      if (defaultValues.id) {
        updateWorkspaceMutation.mutate(
          { id: defaultValues.id, updates: data as WorkspaceData },
          { onSuccess, onError }
        )
      } else {
        createWorkspaceMutation.mutate(data as WorkspaceData, { onSuccess, onError })
      }
    } else if (editType === "project") {
      if (defaultValues.id) {
        updateProjectMutation.mutate(
          { id: defaultValues.id, updates: data as Project },
          { onSuccess, onError }
        )
      } else {
        createProjectMutation.mutate(data as Project, { onSuccess, onError })
      }
    }
  }

  return (
    <ModalForm
      type={editType!}
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      isOpen={isOpen}
      onClose={onClose}
      isPending={isPending}
      label={defaultValues.id ? "Update" : "Create"}
      selectedCompanyId={defaultValues.companyId || null}
      error={error} // Added prop
    />
  )
}

export default ModalFormHandler
