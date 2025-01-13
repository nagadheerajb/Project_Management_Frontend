import React, { useEffect, useState } from "react"
import { useWorkspace } from "@/context/workspace-context"
import { getWorkspaceDetails } from "@/api/workspace"
import { getCompanyDetails } from "@/api/company"
import { useCompanyMutations } from "@/hooks/useCompanyMutations"
import { useWorkspaceMutations } from "@/hooks/useWorkspaceMutations"
import ModalForm from "@/components/forms/common/modal-form"
import { useUser } from "@/context/user-context" // Import the useUser hook
import "@/styles/tailwind.css"
import DetailsCard from "@/components/forms/dashboard/DetailsCard"
import EditButton from "@/components/forms/dashboard/EditButton"
import DeleteButton from "@/components/forms/dashboard/DeleteButton"

const DashboardContent: React.FC = () => {
  const { selectedWorkspace, selectedCompany, selectedType } = useWorkspace()
  const [workspaceDetails, setWorkspaceDetails] = useState<any>(null)
  const [companyDetails, setCompanyDetails] = useState<any>(null)
  const [isModalOpen, setModalOpen] = useState(false)
  const [editType, setEditType] = useState<"company" | "workspace" | null>(null)
  const [defaultValues, setDefaultValues] = useState<any>({})
  const [isPending, setIsPending] = useState(false)

  const { userUUID } = useUser() // Use the useUser hook to get the current user's UUID
  const { createCompanyMutation, updateCompanyMutation, deleteCompanyMutation } =
    useCompanyMutations()
  const { createWorkspaceMutation, updateWorkspaceMutation, deleteWorkspaceMutation } =
    useWorkspaceMutations()

  useEffect(() => {
    if (selectedWorkspace && selectedType === "workspace") {
      getWorkspaceDetails(selectedWorkspace).then((data) => setWorkspaceDetails(data))
    }
  }, [selectedWorkspace, selectedType])

  useEffect(() => {
    if (selectedCompany && selectedType === "company") {
      getCompanyDetails(selectedCompany).then((data) => setCompanyDetails(data))
    }
  }, [selectedCompany, selectedType])

  const handleEdit = (type: "company" | "workspace") => {
    setEditType(type)
    if (type === "company" && companyDetails) {
      setDefaultValues(companyDetails)
    } else if (type === "workspace" && workspaceDetails) {
      setDefaultValues(workspaceDetails)
    }
    setModalOpen(true)
  }

  const handleDelete = (type: "company" | "workspace") => {
    if (type === "company" && selectedCompany) {
      deleteCompanyMutation.mutate(selectedCompany)
    } else if (type === "workspace" && selectedWorkspace) {
      deleteWorkspaceMutation.mutate(selectedWorkspace)
    }
  }

  const handleSubmit = (data: any) => {
    setIsPending(true)
    if (userUUID) {
      data.createdBy = userUUID // Include the current user's UUID in the createdBy field
    }

    if (editType === "company" && selectedCompany) {
      updateCompanyMutation.mutate(
        { id: selectedCompany, updates: data },
        {
          onSuccess: () => setIsPending(false),
          onError: () => setIsPending(false),
          onSettled: () => setModalOpen(false)
        }
      )
    } else if (editType === "workspace" && selectedWorkspace) {
      updateWorkspaceMutation.mutate(
        { id: selectedWorkspace, updates: data },
        {
          onSuccess: () => setIsPending(false),
          onError: () => setIsPending(false),
          onSettled: () => setModalOpen(false)
        }
      )
    }
  }

  return (
    <div>
      <div className="space-y-6">
        {selectedType === "workspace" && workspaceDetails && (
          <>
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">{workspaceDetails?.name}</h2>
              <div className="space-x-2">
                <EditButton onClick={() => handleEdit("workspace")} />
                <DeleteButton onClick={() => handleDelete("workspace")} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DetailsCard title="Workspace" details={workspaceDetails} />
              {/* Add more cards for other workspace-related information */}
            </div>
          </>
        )}

        {selectedType === "company" && companyDetails && (
          <>
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">{companyDetails.name}</h2>
              <div className="space-x-2">
                <EditButton onClick={() => handleEdit("company")} />
                <DeleteButton onClick={() => handleDelete("company")} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DetailsCard title="Company" details={companyDetails} />
              {/* Add more cards for other company-related information */}
            </div>
          </>
        )}

        <ModalForm
          type={editType!}
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          isPending={isPending}
          label="Save"
        />
      </div>

      <div className="flex items-center justify-center h-full">
        <p className="text-xl text-gray-500">
          Please select a company or workspace from the sidebar.
        </p>
      </div>
    </div>
  )
}

export default DashboardContent
