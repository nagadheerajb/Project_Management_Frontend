import React from "react"
import EditButton from "@/components/forms/dashboard/EditButton"
import DeleteButton from "@/components/forms/dashboard/DeleteButton"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

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
    <div>
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold">Project Details</h3>
        <div className="space-x-2 flex">
          <EditButton onClick={onEdit} />
          <DeleteButton onClick={() => onDelete(project.id)} id={project.id} />
          <Button onClick={handleViewTasks} variant="default" size="sm">
            View Tasks
          </Button>
        </div>
      </div>
      <div className="p-4 border rounded-md">
        <h4 className="text-xl font-semibold">{project.name}</h4>
        <p>{project.description}</p>
        <p>
          <strong>Created Date:</strong> {new Date(project.createdDate).toLocaleString()}
        </p>
        <p>
          <strong>Start Date:</strong> {new Date(project.startDate).toLocaleDateString()}
        </p>
        <p>
          <strong>End Date:</strong>{" "}
          {project.endDate ? new Date(project.endDate).toLocaleDateString() : "N/A"}
        </p>
        <p>
          <strong>Created By:</strong> {project.createdByUserId}
        </p>
        <p>
          <strong>Status:</strong> {project.status ? "Active" : "Inactive"}
        </p>
      </div>
    </div>
  )
}

export default ProjectDetails
