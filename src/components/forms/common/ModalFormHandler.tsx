import type React from "react"
import ModalForm from "@/components/forms/common/modal-form"
import type {
  CompanyData,
  WorkspaceData,
  Project,
  Role,
  Permission,
  RolePermission
} from "@/types/interfaces"
import { useCompanyMutations } from "@/hooks/useCompanyMutations"
import { useWorkspaceMutations } from "@/hooks/useWorkspaceMutations"
import { useProjectMutations } from "@/hooks/useProjectMutations"
import { usePermissionMutations } from "@/hooks/usePermissionMutation"
import { useRoleMutations } from "@/hooks/useRoleMutation"
import { useRolePermissionMutations } from "@/hooks/useRolePermissionMutation"

type FormData = CompanyData &
  Partial<WorkspaceData> &
  Partial<Project> &
  Partial<Permission> &
  Partial<Role> &
  Partial<RolePermission> & {
    id?: string
    createdBy?: string
    projectId?: string
    workspaceId?: string
  }

const ModalFormHandler: React.FC<{
  isOpen: boolean
  editType: "company" | "workspace" | "project" | "permission" | "role" | "rolePermission" | null
  defaultValues: any
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  onClose: () => void
  isPending: boolean
  setIsPending: React.Dispatch<React.SetStateAction<boolean>>
  error: string | null
  setError: React.Dispatch<React.SetStateAction<string | null>>
  onSubmit: (data: any) => void
  label: string
  roles: Role[]
  permissions: Permission[]
}> = ({
  isOpen,
  editType,
  defaultValues,
  setModalOpen,
  onClose,
  isPending,
  setIsPending,
  error,
  setError,
  onSubmit,
  label,
  roles,
  permissions
}) => {
  const { createCompanyMutation, updateCompanyMutation } = useCompanyMutations()
  const { createWorkspaceMutation, updateWorkspaceMutation } = useWorkspaceMutations()
  const { createProjectMutation, updateProjectMutation } = useProjectMutations()
  const { createPermissionMutation, updatePermissionMutation } = usePermissionMutations()
  const { createRoleMutation, updateRoleMutation } = useRoleMutations()
  const { createRolePermissionMutation, updateRolePermissionMutation } =
    useRolePermissionMutations()

  const handleSubmit = (data: FormData) => {
    console.log("handleSubmit called with data:", data)
    if (isPending) return
    setIsPending(true)
    setError(null)

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
    } else if (editType === "permission") {
      if (defaultValues.id) {
        updatePermissionMutation.mutate(
          { id: defaultValues.id, updatedPermission: data as Permission },
          { onSuccess, onError }
        )
      } else {
        createPermissionMutation.mutate(data as Permission, { onSuccess, onError })
      }
    } else if (editType === "role") {
      if (defaultValues.id) {
        updateRoleMutation.mutate(
          { id: defaultValues.id, updatedRole: data as Role },
          { onSuccess, onError }
        )
      } else {
        createRoleMutation.mutate(data as Role, { onSuccess, onError })
      }
    } else if (editType === "rolePermission") {
      if (defaultValues.id) {
        updateRolePermissionMutation.mutate(
          { id: defaultValues.id, updatedRolePermission: data as RolePermission },
          { onSuccess, onError }
        )
      } else {
        createRolePermissionMutation.mutate(data as RolePermission, { onSuccess, onError })
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
      label={label}
      selectedCompanyId={defaultValues.companyId || null}
      error={error}
      roles={roles}
      permissions={permissions}
    />
  )
}

export default ModalFormHandler
