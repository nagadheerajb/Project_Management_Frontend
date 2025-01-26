import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu"
import { MoreVertical } from "lucide-react"

const WorkspaceDetails: React.FC<{
  workspaceDetails: any
  onEdit: () => void
  onDelete: (id: string) => void
}> = ({ workspaceDetails, onEdit, onDelete }) => {
  console.log("WorkspaceDetails - workspaceDetails:", workspaceDetails)

  return (
    <Card className="shadow-md border border-gray-200">
      <CardHeader className="flex justify-between items-center">
        <div>
          <CardTitle className="text-xl font-bold">{workspaceDetails?.name}</CardTitle>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <MoreVertical className="h-5 w-5 text-gray-500" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(workspaceDetails?.id)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <span className="font-medium text-gray-600">Description:</span>
          <span>{workspaceDetails.description || "N/A"}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="font-medium text-gray-600">Type:</span>
          <span className="px-2 py-1 text-sm bg-gray-100 text-gray-600 rounded">
            {workspaceDetails.type || "N/A"}
          </span>
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
