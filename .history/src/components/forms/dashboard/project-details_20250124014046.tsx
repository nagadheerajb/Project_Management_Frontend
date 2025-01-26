import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, AlertCircle, MoreVertical } from "lucide-react"

const ProjectDetails: React.FC<{
  project: any
  onEdit: () => void
  onDelete: (id: string) => void
}> = ({ project, onEdit, onDelete }) => {
  return (
    <Card className="w-full shadow-md border border-gray-200">
      <CardHeader className="flex justify-between items-start pb-4">
        <div className="flex flex-col space-y-2">
          <CardTitle className="text-xl font-bold">{project.name}</CardTitle>
          <Badge variant={project.status ? "default" : "secondary"}>
            {project.status ? "Active" : "Inactive"}
          </Badge>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>Edit Project</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(project.id)}>Delete Project</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Start Date: {new Date(project.startDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>
              End Date: {project.endDate ? new Date(project.endDate).toLocaleDateString() : "N/A"}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>Created By: {project.createdByUserId}</span>
          </div>
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
            <span>Description: {project.description}</span>
          </div>
        </div>
        <div className="mt-4">
          <Button
            onClick={() =>
              (window.location.href = `/taskboards?projectId=${project.id}&workspaceId=${project.workspaceId}`)
            }
          >
            View Tasks
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProjectDetails
