import React, { useState, useCallback } from "react"
import { useRolePermissions } from "@/hooks/useRolePermissions"
import { useRoles } from "@/hooks/useRoles"
import { usePermissions } from "@/hooks/usePermissions"
import { useRolePermissionMutations } from "@/hooks/useRolePermissionMutations"
import { type RolePermission, Role, Permission } from "@/types/interfaces"
import { Button } from "@/components/ui/button"
import ModalFormHandler from "@/components/forms/common/ModalFormHandler"
import { Trash, Edit, Plus } from "lucide-react"
import { useUser } from "@/context/user-context"
import { ScrollArea } from "@/components/ui/scroll-area"

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

  const handleFormSubmit = (data: any) => {
    const payload: RolePermission = {
      ...data,
      created_user: userUUID || undefined
    }

    if (editRolePermission?.id) {
      updateRolePermissionMutation.mutate(
        { id: editRolePermission.id, updatedRolePermission: payload },
        {
          onSuccess: () => {
            handleCloseModal()
          },
          onError: (err: Error) => {
            setFormError(err.message)
          }
        }
      )
    } else {
      createRolePermissionMutation.mutate(payload, {
        onSuccess: () => {
          handleCloseModal()
        },
        onError: (err: Error) => {
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

      <div className="overflow-x-auto">
        <ScrollArea className="h-[500px] w-full rounded-md border p-2">
          <table className="w-full">
            <thead className="bg-gray-200 sticky top-0">
              <tr>
                <th className="text-left p-3">Role</th>
                <th className="text-left p-3">Permission</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rolePermissions?.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center p-4 text-gray-500">
                    No Role-Permission mappings found.
                  </td>
                </tr>
              )}
              {rolePermissions?.map((rolePermission) => (
                <tr key={rolePermission.id} className="border-b">
                  <td className="p-3">
                    {roles?.find((role) => role.id === rolePermission.roleId)?.name ||
                      "Unknown Role"}
                  </td>
                  <td className="p-3">
                    {permissions?.find(
                      (permission) => permission.id === rolePermission.permissionId
                    )?.name || "Unknown Permission"}
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
        </ScrollArea>
      </div>

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
