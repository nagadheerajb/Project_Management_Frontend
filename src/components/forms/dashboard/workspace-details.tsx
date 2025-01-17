import React from "react"
import DetailsCard from "@/components/forms/dashboard/DetailsCard"
import EditButton from "@/components/forms/dashboard/EditButton"
import DeleteButton from "@/components/forms/dashboard/DeleteButton"

const WorkspaceDetails: React.FC<{
  workspaceDetails: any
  onEdit: () => void
  onDelete: (id: string) => void
}> = ({ workspaceDetails, onEdit, onDelete }) => {
  console.log("WorkspaceDetails - workspaceDetails:", workspaceDetails)

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">{workspaceDetails?.name}</h2>
        <div className="space-x-2">
          <EditButton onClick={onEdit} />
          {workspaceDetails?.id &&
          typeof workspaceDetails.id === "string" &&
          workspaceDetails.id.match(/^[0-9a-fA-F-]{36}$/) ? (
            <DeleteButton
              id={workspaceDetails.id} // Pass the ID explicitly
              onClick={() => {
                console.log("DeleteButton clicked with ID:", workspaceDetails.id)
                onDelete(workspaceDetails.id)
              }}
            />
          ) : (
            <p className="text-red-500">Invalid Workspace ID</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DetailsCard title="Workspace" details={workspaceDetails} />
        {/* Add more cards for other workspace-related information */}
      </div>
    </div>
  )
}

export default WorkspaceDetails
