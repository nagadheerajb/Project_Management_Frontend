import React, { useState, useCallback } from "react"
import { usePermissions } from "@/hooks/usePermissions"
import { usePermissionMutations } from "@/hooks/usePermissionMutation"
import type { Permission } from "@/types/interfaces"
import { Button } from "@/components/ui/button"
import ModalFormHandler from "@/components/forms/common/ModalFormHandler"
import { Trash, Edit, Plus } from "lucide-react"
import { useUser } from "@/context/user-context"
import { ScrollArea } from "@/components/ui/scroll-area"

const PermissionManagementContent: React.FC = () => {
  const { data: permissions, isLoading, isError, error: apiError } = usePermissions()
  const { createPermissionMutation, updatePermissionMutation, deletePermissionMutation } =
    usePermissionMutations()
  const { userUUID } = useUser()

  const [isModalOpen, setModalOpen] = useState(false)
  const [editPermission, setEditPermission] = useState<Permission | null>(null)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleOpenModal = (permission?: Permission) => {
    setEditPermission(permission || null)
    setModalOpen(true)
  }

  const handleFormSubmit = (permissionData: Omit<Permission, "id" | "created_user">) => {
    if (!userUUID) {
      console.error("Error: User is not logged in")
      return
    }

    setIsPending(true)
    setError(null)

    if (editPermission) {
      updatePermissionMutation.mutate(
        { id: editPermission.id!, updatedPermission: permissionData },
        {
          onSuccess: () => {
            setModalOpen(false)
            setIsPending(false)
          },
          onError: (err) => {
            setError("Error updating permission")
            setIsPending(false)
          }
        }
      )
    } else {
      createPermissionMutation.mutate(permissionData, {
        onSuccess: () => {
          setModalOpen(false)
          setIsPending(false)
        },
        onError: (err) => {
          setError("Error creating permission")
          setIsPending(false)
        }
      })
    }
  }

  const handleDeletePermission = useCallback(
    (permissionId: string) => {
      if (confirm("Are you sure you want to delete this permission?")) {
        deletePermissionMutation.mutate(permissionId, {
          onSuccess: () => {
            console.log("Permission deleted successfully.")
          },
          onError: (err) => {
            console.error("Error deleting permission:", err)
          }
        })
      }
    },
    [deletePermissionMutation]
  )

  if (isLoading) return <div>Loading permissions...</div>
  if (isError) return <div>Error loading permissions: {apiError?.message}</div>

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Permissions Management</h1>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Permission
        </Button>
      </div>

      <ScrollArea className="max-h-[500px]">
        <table className="w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Type</th>
              <th className="text-left p-3">URL</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {permissions?.map((permission) => (
              <tr key={permission.id} className="border-b">
                <td className="p-3">{permission.name}</td>
                <td className="p-3">{permission.permissionType}</td>
                <td className="p-3">{permission.permissionUrl}</td>
                <td className="p-3 flex space-x-2">
                  <Button variant="secondary" onClick={() => handleOpenModal(permission)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeletePermission(permission.id!)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollArea>

      {isModalOpen && (
        <ModalFormHandler
          isOpen={isModalOpen}
          editType="permission"
          defaultValues={
            editPermission || {
              name: "",
              permissionUrl: "",
              permissionType: "GET" as const
            }
          }
          setModalOpen={setModalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleFormSubmit}
          isPending={isPending}
          setIsPending={setIsPending}
          error={error}
          setError={setError}
          label={editPermission ? "Update Permission" : "Create Permission"}
        />
      )}
    </div>
  )
}

export default PermissionManagementContent
