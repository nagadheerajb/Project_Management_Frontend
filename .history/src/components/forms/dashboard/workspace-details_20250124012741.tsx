import React from "react"
import DetailsCard from "@/components/forms/dashboard/DetailsCard"
import EditButton from "@/components/forms/dashboard/EditButton"
import DeleteButton from "@/components/forms/dashboard/DeleteButton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const WorkspaceDetails: React.FC<{
  workspaceDetails: any
  onEdit: () => void
  onDelete: (id: string) => void
}> = ({ workspaceDetails, onEdit, onDelete }) => {
  console.log("WorkspaceDetails - workspaceDetails:", workspaceDetails)

  return (
    <Card className="shadow-md border border-gray-200">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-2xl font-bold">{workspaceDetails?.name}</CardTitle>
        <div className="flex space-x-2">
          <EditButton onClick={onEdit} />
          {workspaceDetails?.id &&
          typeof workspaceDetails.id === "string" &&
          workspaceDetails.id.match(/^[0-9a-fA-F-]{36}$/) ? (
            <DeleteButton id={workspaceDetails.id} onClick={() => onDelete(workspaceDetails.id)} />
          ) : (
            <p className="text-red-500">Invalid Workspace ID</p>
          )}
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <span className="font-medium text-gray-600">Description:</span>
          <span>{workspaceDetails.description || "N/A"}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="font-medium text-gray-600">Type:</span>
          <Badge variant="outline" className="capitalize">
            {workspaceDetails.type || "N/A"}
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <span className="font-medium text-gray-600">Created Date:</span>
          <span>{workspaceDetails.createdDate || "N/A"}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="font-medium text-gray-600">Created By:</span>
          <span>{workspaceDetails.createdBy || "N/A"}</span>
        </div>
      </CardContent>
    </Card>
  )
}

export default WorkspaceDetails
