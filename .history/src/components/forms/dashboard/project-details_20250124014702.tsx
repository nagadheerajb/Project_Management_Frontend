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
import { useNavigate } from "react-router-dom"

const ProjectDetails: React.FC<{
  project: any
  onEdit: () => void
  onDelete: (id: string) => void
}> = ({ project, onEdit, onDelete }) => {
  const navigate = useNavigate()

  const handleViewTasks = () => {
    if (!project.id || !project.workspaceId) {
      console.error("No Project ID or Workspace ID provided. Cannot navigate to taskboards.")
      alert(
        "No Project ID or Workspace ID provided. Please navigate from the project details page."
      )
      return
    }
    navigate("/taskboards", {
      state: { projectId: project.id, workspaceId: project.workspaceId }
    })
  }

  return (
    <Card className="w-full shadow-md border border-gray-200">
      <CardHeader className="flex flex-row justify-between items-start pb-4">
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
            <span>Description: {project.description || "No description provided"}</span>
          </div>
        </div>
        <div className="mt-4">
          <Button onClick={handleViewTasks}>View Tasks</Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProjectDetails
