import React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import SubmitButton from "@/components/forms/common/submit-button"
import { CompanyData, WorkspaceData } from "@/types/interfaces"
import { useUser } from "@/context/user-context" // Import the useUser hook

type FormData = CompanyData & Partial<WorkspaceData> & { createdBy: string }

const ModalForm: React.FC<{
  type: "company" | "workspace"
  defaultValues?: FormData
  onSubmit: (data: FormData) => void
  isOpen: boolean
  onClose: () => void
  isPending: boolean
  label: string
  selectedCompanyId?: string | null
}> = ({ type, defaultValues, onSubmit, isOpen, onClose, isPending, label, selectedCompanyId }) => {
  const { userUUID } = useUser() // Get the current user's UUID
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: defaultValues || {}
  })

  const handleFormSubmit = (data: FormData) => {
    if (!userUUID) {
      console.error("User UUID is null")
      return
    }
    data.createdBy = userUUID // Set the createdBy field to the current user's UUID
    data.companyId = selectedCompanyId ?? "" // Fill company ID automatically
    onSubmit(data)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{type === "company" ? "Company" : "Workspace"} Details</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <Input {...register("name", { required: true })} placeholder="Name" />
          {errors.name && <span className="text-red-500">This field is required</span>}
          {type === "workspace" && (
            <>
              <Input {...register("type", { required: true })} placeholder="Type" />
              {errors.type && <span className="text-red-500">This field is required</span>}
              {/* Hide the companyId input and automatically fill it */}
              <input type="hidden" {...register("companyId")} />
              <Input {...register("description")} placeholder="Description" />
            </>
          )}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <SubmitButton isPending={isPending} label={label} />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ModalForm
