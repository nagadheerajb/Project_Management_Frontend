import type React from "react"
import { useState, useCallback } from "react"
import { useRolePermissions } from "@/hooks/useRolePermissions"
import { useRoles } from "@/hooks/useRoles"
import { usePermissions } from "@/hooks/usePermissions"
import { useRolePermissionMutations } from "@/hooks/useRolePermissionMutation"
import { type RolePermission, Role, Permission } from "@/types/interfaces"
import { Button } from "@/components/ui/button"
import ModalFormHandler from "@/components/forms/common/ModalFormHandler"
import { Trash, Edit, Plus } from "lucide-react"
import { useUser } from "@/context/user-context"

const RolePermissionManagementContent: React.FC = () => {
  const { data: rolePermissions, isLoading, isError, error } = useRolePermissions()
  const { data: roles, isLoading: isRolesLoading, isError: isRolesError } = useRoles()
  const {
    data: permissions,
    isLoading: isPermissionsLoading,
    isError: isPermissionsError
  } = usePermissions()
  const {
    createRolePermissionMutation,
    deleteRolePermissionMutation,
    updateRolePermissionMutation
  } = useRolePermissionMutations()
  const { userUUID } = useUser()

  const [isModalOpen, setModalOpen] = useState(false)
  const [editRolePermission, setEditRolePermission] = useState<RolePermission | null>(null)
  const [isPending, setIsPending] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const handleOpenModal = (rolePermission?: RolePermission) => {
    setEditRolePermission(rolePermission || null)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditRolePermission(null)
    setFormError(null)
  }

  const handleFormSubmit = (data: RolePermission) => {
    const payload = {
      ...data,
      created_user: userUUID
    }

    if (editRolePermission?.id) {
      updateRolePermissionMutation.mutate(
        { id: editRolePermission.id, updatedRolePermission: payload },
        {
          onSuccess: () => {
            console.log("RolePermission updated successfully.")
            handleCloseModal()
          },
          onError: (err: Error) => {
            console.error("Error updating role-permission:", err)
            setFormError(err.message)
          }
        }
      )
    } else {
      createRolePermissionMutation.mutate(payload, {
        onSuccess: () => {
          console.log("RolePermission created successfully.")
          handleCloseModal()
        },
        onError: (err: Error) => {
          console.error("Error creating role-permission:", err)
          setFormError(err.message)
        }
      })
    }
  }

  const handleDeleteRolePermission = useCallback(
    (rolePermissionId: string) => {
      if (confirm("Are you sure you want to delete this role-permission mapping?")) {
        deleteRolePermissionMutation.mutate(rolePermissionId, {
          onSuccess: () => {
            console.log("RolePermission deleted successfully.")
          },
          onError: (err: Error) => {
            console.error("Error deleting role-permission:", err)
          }
        })
      }
    },
    [deleteRolePermissionMutation]
  )

  if (isLoading || isRolesLoading || isPermissionsLoading) return <div>Loading...</div>
  if (isError || isRolesError || isPermissionsError) return <div>Error loading data</div>

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Role-Permission Management</h1>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="mr-2 h-4 w-4" />
          Assign Permission to Role
        </Button>
      </div>

      <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="text-left p-3">Role</th>
            <th className="text-left p-3">Permission</th>
            <th className="text-left p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rolePermissions?.map((rolePermission) => (
            <tr key={rolePermission.id} className="border-b">
              <td className="p-3">
                {roles?.find((role) => role.id === rolePermission.roleId)?.name || "Unknown Role"}
              </td>
              <td className="p-3">
                {permissions?.find((permission) => permission.id === rolePermission.permissionId)
                  ?.name || "Unknown Permission"}
              </td>
              <td className="p-3 flex space-x-2">
                <Button variant="secondary" onClick={() => handleOpenModal(rolePermission)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteRolePermission(rolePermission.id!)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ModalFormHandler
        isOpen={isModalOpen}
        editType="rolePermission"
        defaultValues={editRolePermission || { roleId: "", permissionId: "" }}
        setModalOpen={setModalOpen}
        onClose={handleCloseModal}
        isPending={isPending}
        setIsPending={setIsPending}
        error={formError}
        setError={setFormError}
        onSubmit={handleFormSubmit}
        label={editRolePermission ? "Update Role-Permission" : "Assign Permission"}
        roles={roles || []}
        permissions={permissions || []}
      />
    </div>
  )
}

export default RolePermissionManagementContent
