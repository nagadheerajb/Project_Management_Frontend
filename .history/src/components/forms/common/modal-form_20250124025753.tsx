import type React from "react"
import { useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useForm, Controller } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type {
  CompanyData,
  WorkspaceData,
  Project,
  Permission,
  Role,
  RolePermission
} from "@/types/interfaces"
import { useUser } from "@/context/user-context"

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

const ModalForm: React.FC<{
  type: "company" | "workspace" | "project" | "permission" | "role" | "rolePermission"
  defaultValues?: FormData
  onSubmit: (data: any) => void
  isOpen: boolean
  onClose: () => void
  isPending: boolean
  label: string
  selectedCompanyId?: string | null
  error: string | null
  roles: Role[]
  permissions: Permission[]
}> = ({
  type,
  defaultValues,
  onSubmit,
  isOpen,
  onClose,
  isPending,
  label,
  selectedCompanyId,
  error,
  roles = [],
  permissions = []
}) => {
  const { userUUID } = useUser()
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
    watch
  } = useForm<FormData>({
    defaultValues: defaultValues || {}
  })

  const submittingRef = useRef(false)

  useEffect(() => {
    if (isOpen) {
      reset(defaultValues || {})
      submittingRef.current = false
    }
  }, [isOpen, defaultValues, reset])

  const handleFormSubmit = (data: FormData) => {
    if (submittingRef.current) return
    submittingRef.current = true

    if (!userUUID) {
      console.error("User UUID is null")
      submittingRef.current = false
      return
    }

    let submissionData: any = {
      ...data
    }

    if (type === "project") {
      // Include fields specific to projects
      submissionData = {
        ...submissionData,
        description: data.description || "",
        workspaceId: data.workspaceId || "",
        startDate: data.startDate || "",
        endDate: data.endDate || "",
        createdByUserId: userUUID, // Include the user UUID
        status: true // Set status to true
      }
    } else if (type === "role") {
      // Logic for roles
      submissionData = {
        ...submissionData,
        id: data.id,
        name: data.name || "",
        companyId: data.companyId || selectedCompanyId || ""
      }
    } else if (type === "rolePermission") {
      // Logic for role-permission mapping
      submissionData = {
        ...submissionData,
        id: data.id,
        roleId: data.roleId || "",
        permissionId: data.permissionId || ""
      }
    }

    onSubmit(submissionData) // Submit the prepared data
  }

  const formatDateForInput = (dateString: string | undefined) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toISOString().split("T")[0]
  }

  const validateEndDate = (endDate: string | undefined) => {
    if (!endDate) return true
    const startDate = watch("startDate")
    if (!startDate) return true
    return new Date(endDate) >= new Date(startDate) || "End date must be after start date"
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {type === "company"
              ? "Company"
              : type === "workspace"
              ? "Workspace"
              : type === "project"
              ? "Project"
              : type === "permission"
              ? "Permission"
              : type === "role"
              ? "Role"
              : "Role-Permission"}{" "}
            Details
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {type !== "rolePermission" && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register("name", { required: true })} placeholder="Name" />
              {errors.name && <p className="text-sm text-destructive">This field is required</p>}
            </div>
          )}
          {type === "workspace" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Input id="type" {...register("type", { required: true })} placeholder="Type" />
                {errors.type && <p className="text-sm text-destructive">This field is required</p>}
              </div>
              <input type="hidden" {...register("companyId")} />
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" {...register("description")} placeholder="Description" />
              </div>
            </>
          )}
          {type === "project" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" {...register("description")} placeholder="Description" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Controller
                  name="startDate"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Input
                      id="startDate"
                      {...field}
                      type="date"
                      placeholder="Start Date"
                      defaultValue={formatDateForInput(defaultValues?.startDate)}
                    />
                  )}
                />
                {errors.startDate && (
                  <p className="text-sm text-destructive">This field is required</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Controller
                  name="endDate"
                  control={control}
                  rules={{
                    required: true,
                    validate: validateEndDate
                  }}
                  render={({ field }) => (
                    <Input
                      id="endDate"
                      {...field}
                      type="date"
                      placeholder="End Date"
                      defaultValue={formatDateForInput(defaultValues?.endDate)}
                    />
                  )}
                />
                {errors.endDate && (
                  <p className="text-sm text-destructive">{errors.endDate.message}</p>
                )}
              </div>
              <input
                type="hidden"
                {...register("workspaceId")}
                value={defaultValues?.workspaceId || ""}
              />
              <input type="hidden" {...register("projectId")} value={defaultValues?.id || ""} />
            </>
          )}
          {type === "permission" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="permissionUrl">Permission URL</Label>
                <Input
                  id="permissionUrl"
                  {...register("permissionUrl", { required: true })}
                  placeholder="Permission URL"
                />
                {errors.permissionUrl && (
                  <p className="text-sm text-destructive">This field is required</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="permissionType">Permission Type</Label>
                <Controller
                  name="permissionType"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <select {...field} className="w-full p-2 border rounded">
                      <option value="">Select Permission Type</option>
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                      <option value="DELETE">DELETE</option>
                    </select>
                  )}
                />
                {errors.permissionType && (
                  <p className="text-sm text-destructive">This field is required</p>
                )}
              </div>
            </>
          )}
          {type === "role" && (
            <>
              <input type="hidden" {...register("id")} defaultValue={defaultValues?.id || ""} />
              <input
                type="hidden"
                {...register("companyId")}
                defaultValue={selectedCompanyId || ""}
              />
            </>
          )}
          {type === "rolePermission" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="roleId">Role</Label>
                <Controller
                  name="roleId"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <select {...field} className="w-full p-2 border rounded">
                      <option value="">Select Role</option>
                      {roles?.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.roleId && (
                  <p className="text-sm text-destructive">This field is required</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="permissionId">Permission</Label>
                <Controller
                  name="permissionId"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <select {...field} className="w-full p-2 border rounded">
                      <option value="">Select Permission</option>
                      {permissions?.map((permission) => (
                        <option key={permission.id} value={permission.id}>
                          {permission.name}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.permissionId && (
                  <p className="text-sm text-destructive">This field is required</p>
                )}
              </div>
            </>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || submittingRef.current}>
              {isPending ? "Saving..." : label}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ModalForm
