import type React from "react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, AlertCircle } from "lucide-react"

const ProjectDetails: React.FC<{
  project: any
  onEdit: () => void
  onDelete: (id: string) => void
}> = ({ project, onEdit, onDelete }) => {
  const navigate = useNavigate()

  const handleViewTasks = () => {
    navigate("/taskboards", {
      state: { projectId: project.id, workspaceId: project.workspaceId }
    })
  }

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">{project.name}</CardTitle>
        <Badge variant={project.status ? "default" : "secondary"}>
          {project.status ? "Active" : "Inactive"}
        </Badge>
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
        <div className="flex flex-wrap justify-end gap-2 mt-4">
          <Button onClick={onEdit} variant="outline">
            Edit
          </Button>
          <Button onClick={() => onDelete(project.id)} variant="destructive">
            Delete
          </Button>
          <Button onClick={handleViewTasks}>View Tasks</Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProjectDetails
