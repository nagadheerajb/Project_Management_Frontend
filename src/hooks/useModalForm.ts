import { useState } from "react"
import { useCompanyMutations } from "@/hooks/useCompanyMutations"
import { useWorkspaceMutations } from "@/hooks/useWorkspaceMutations"
import { useProjectMutations } from "@/hooks/useProjectMutations"
import { CompanyData, WorkspaceData, Project } from "@/types/interfaces"

type FormData = CompanyData &
  Partial<WorkspaceData> &
  Partial<Project> & {
    createdBy: string
    projectId: string
    workspaceId: string
  }

export const useModalForm = () => {
  const [isModalOpen, setModalOpen] = useState(false)
  const [editType, setEditType] = useState<"company" | "workspace" | "project" | null>(null)
  const [defaultValues, setDefaultValues] = useState<any>({})

  const { createCompanyMutation, updateCompanyMutation } = useCompanyMutations()
  const { createWorkspaceMutation, updateWorkspaceMutation } = useWorkspaceMutations()
  const { createProjectMutation, updateProjectMutation } = useProjectMutations()

  const handleEdit = (type: "company" | "workspace" | "project", details: any) => {
    setEditType(type)
    setDefaultValues(details || {})
    setModalOpen(true)
  }

  const handleSubmit = (data: FormData) => {
    const onSuccess = () => {
      setModalOpen(false)
      console.log(`${editType} ${data.id ? "updated" : "created"} successfully`)
    }

    const onError = (error: any) => {
      console.error(`Error ${data.id ? "updating" : "creating"} ${editType}:`, error)
    }

    if (editType === "company") {
      if (data.id) {
        updateCompanyMutation.mutate(
          { id: data.id, updates: data as CompanyData },
          { onSuccess, onError }
        )
      } else {
        createCompanyMutation.mutate(data as CompanyData, { onSuccess, onError })
      }
    } else if (editType === "workspace") {
      if (data.id) {
        updateWorkspaceMutation.mutate(
          { id: data.id, updates: data as WorkspaceData },
          { onSuccess, onError }
        )
      } else {
        createWorkspaceMutation.mutate(data as WorkspaceData, { onSuccess, onError })
      }
    } else if (editType === "project") {
      if (data.id) {
        updateProjectMutation.mutate(
          { id: data.id, updates: data as Project },
          { onSuccess, onError }
        )
      } else {
        createProjectMutation.mutate(data as Project, { onSuccess, onError })
      }
    }
  }

  return {
    isModalOpen,
    setModalOpen,
    editType,
    defaultValues,
    handleEdit,
    handleSubmit
  }
}
