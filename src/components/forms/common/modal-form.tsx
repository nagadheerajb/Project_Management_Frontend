import React, { useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useForm, Controller } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CompanyData, WorkspaceData, Project } from "@/types/interfaces"
import { useUser } from "@/context/user-context"

type FormData = CompanyData &
  Partial<WorkspaceData> &
  Partial<Project> & {
    createdBy: string
    projectId: string
    workspaceId: string
  }

const ModalForm: React.FC<{
  type: "company" | "workspace" | "project"
  defaultValues?: FormData
  onSubmit: (data: FormData) => void
  isOpen: boolean
  onClose: () => void
  isPending: boolean
  label: string
  selectedCompanyId?: string | null
  error: string | null
}> = ({
  type,
  defaultValues,
  onSubmit,
  isOpen,
  onClose,
  isPending,
  label,
  selectedCompanyId,
  error
}) => {
  const { userUUID } = useUser()
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: defaultValues || {}
  })

  useEffect(() => {
    if (isOpen) {
      reset(defaultValues || {})
    }
  }, [isOpen, defaultValues, reset])

  const handleFormSubmit = (data: FormData) => {
    if (!userUUID) {
      console.error("User UUID is null")
      return
    }

    data.createdBy = userUUID
    data.companyId = selectedCompanyId ?? ""
    data.workspaceId = defaultValues?.workspaceId || ""
    data.projectId = defaultValues?.id || ""

    onSubmit(data)
  }

  const formatDateForInput = (dateString: string | undefined) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toISOString().split("T")[0]
  }

  const validateEndDate = (endDate: string) => {
    const startDate = watch("startDate")
    if (!startDate) return true
    return new Date(endDate) >= new Date(startDate) || "End date must be after start date"
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {type === "company" ? "Company" : type === "workspace" ? "Workspace" : "Project"}{" "}
            Details
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {type === "project" && defaultValues?.id ? (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <p className="text-muted-foreground">{defaultValues.name}</p>
              <input type="hidden" {...register("name")} defaultValue={defaultValues.name} />
            </div>
          ) : (
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
          {error && <p className="text-sm text-destructive">{error}</p>}{" "}
          {/* Display error message */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : label}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ModalForm
