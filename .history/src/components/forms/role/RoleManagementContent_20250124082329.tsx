import type React from "react"
import { useState, useCallback, useEffect } from "react"
import { useRoles } from "@/hooks/useRoles"
import { useRoleMutations } from "@/hooks/useRoleMutations"
import type { Role } from "@/types/interfaces"
import { Button } from "@/components/ui/button"
import ModalForm from "@/components/forms/common/modal-form"
import { Trash, Edit, Plus } from "lucide-react"
import { useUser } from "@/context/user-context"
import { useLocation } from "react-router-dom"
import { ScrollArea } from "@/components/ui/scroll-area"

const RoleManagementContent: React.FC = () => {
  const { data: roles, isLoading, isError, error, refetch } = useRoles()
  const { createRoleMutation, updateRoleMutation, deleteRoleMutation } = useRoleMutations()
  const { userUUID } = useUser()
  const location = useLocation()

  const [isModalOpen, setModalOpen] = useState(false)
  const [editRole, setEditRole] = useState<Role | null>(null)
  const [isPending, setIsPending] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [companyId, setCompanyId] = useState<string | null>(null)

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const companyIdFromUrl = searchParams.get("companyId")
    if (companyIdFromUrl) {
      setCompanyId(companyIdFromUrl)
    }
  }, [location.search])

  const handleOpenModal = (role?: Role) => {
    setEditRole(role || null)
    setModalOpen(true)
    setFormError(null)
  }

  const handleFormSubmit = (roleData: Partial<Role>) => {
    setIsPending(true)
    setFormError(null)

    const rolePayload: Role = {
      name: roleData.name!,
      companyId: companyId!,
      created_user: userUUID || undefined
    }

    if (editRole) {
      updateRoleMutation.mutate(
        { id: editRole.id!, updatedRole: rolePayload },
        {
          onSuccess: () => {
            console.log("Role updated successfully.")
            setModalOpen(false)
            setIsPending(false)
            refetch() // Refetch roles after successful update
          },
          onError: (err) => {
            console.error("Error updating role:", err)
            setFormError("Failed to update role. Please try again.")
            setIsPending(false)
          }
        }
      )
    } else {
      createRoleMutation.mutate(rolePayload, {
        onSuccess: () => {
          console.log("Role created successfully.")
          setModalOpen(false)
          setIsPending(false)
          refetch() // Refetch roles after successful creation
        },
        onError: (err) => {
          console.error("Error creating role:", err)
          setFormError("Failed to create role. Please try again.")
          setIsPending(false)
        }
      })
    }
  }

  const handleDeleteRole = useCallback(
    (roleId: string) => {
      if (confirm("Are you sure you want to delete this role?")) {
        deleteRoleMutation.mutate(
          { id: roleId, companyId: companyId! },
          {
            onSuccess: () => {
              console.log("Role deleted successfully.")
              refetch() // Refetch roles after successful deletion
            },
            onError: (err) => {
              console.error("Error deleting role:", err)
            }
          }
        )
      }
    },
    [deleteRoleMutation, companyId, refetch]
  )

  if (isLoading) return <div>Loading roles...</div>
  if (isError) return <div>Error loading roles: {error?.message}</div>

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Roles Management</h1>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Role
        </Button>
      </div>

      <div className="relative">
        <div className="absolute top-0 left-0 right-0 bg-gray-200 z-10">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
          </table>
        </div>
        <ScrollArea className="h-[calc(100vh-200px)] w-full rounded-md border">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {roles?.map((role) => (
                    <tr key={role.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{role.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {role.createdDate ? new Date(role.createdDate).toLocaleDateString() : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <Button variant="secondary" onClick={() => handleOpenModal(role)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" onClick={() => handleDeleteRole(role.id!)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ScrollArea>
      </div>

      {isModalOpen && (
        <ModalForm
          type="role"
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleFormSubmit}
          defaultValues={editRole || { name: "", companyId: companyId || "" }}
          isPending={isPending}
          label={editRole ? "Update Role" : "Create Role"}
          error={formError}
          selectedCompanyId={companyId}
        />
      )}
    </div>
  )
}

export default RoleManagementContent
