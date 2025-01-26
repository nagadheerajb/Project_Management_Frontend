import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { MoreVertical } from "lucide-react"
import { formatDate } from "@/utils/format-date" // Import formatDate

const WorkspaceDetails: React.FC<{
  workspaceDetails: any
  onEdit: () => void
  onDelete: (id: string) => void
}> = ({ workspaceDetails, onEdit, onDelete }) => {
  const displayName =
    `${workspaceDetails.firstName || ""} ${workspaceDetails.lastName || ""}`.trim() || "N/A"

  return (
    <Card className="w-full shadow-md border border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-bold">{workspaceDetails?.name}</CardTitle>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>Edit Workspace</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(workspaceDetails?.id)}>
                Delete Workspace
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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
          <span>{formatDate(workspaceDetails.createdDate) || "N/A"}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="font-medium text-gray-600">Created By:</span>
          <span>{displayName}</span>
        </div>
      </CardContent>
    </Card>
  )
}

export default WorkspaceDetails
