import React, { useEffect, useState } from "react"
import { getWorkspaceDetails } from "@/api/workspace"
import { fetchProjects } from "@/api/project"
import ProjectCollapsible from "./ProjectCollapsible"
import WorkspaceDetails from "@/components/forms/dashboard/workspace-details"

const WorkspaceDetailsSection: React.FC<{
  selectedWorkspace: string
  onEdit: (type: "company" | "workspace" | "project", details: any) => void
  onDelete: (id: string) => void
  onCreateProject: (workspaceId: string) => void
  onDeleteProject: (id: string) => void
}> = ({ selectedWorkspace, onEdit, onDelete, onCreateProject, onDeleteProject }) => {
  const [workspaceDetails, setWorkspaceDetails] = useState<any>(null)
  const [projects, setProjects] = useState<any[]>([])

  useEffect(() => {
    if (selectedWorkspace.match(/^[0-9a-fA-F-]{36}$/)) {
      getWorkspaceDetails(selectedWorkspace)
        .then(setWorkspaceDetails)
        .catch((err) => console.error("Error fetching workspace details:", err))

      fetchProjects(selectedWorkspace)
        .then(setProjects)
        .catch((err) => console.error("Error fetching projects:", err))
    } else {
      console.error("Invalid selectedWorkspace:", selectedWorkspace)
    }
  }, [selectedWorkspace])

  return (
    <>
      {workspaceDetails && (
        <>
          <WorkspaceDetails
            workspaceDetails={workspaceDetails}
            onEdit={() => onEdit("workspace", workspaceDetails)}
            onDelete={(id) => onDelete(id)}
          />
          <ProjectCollapsible
            projects={projects}
            onCreateProject={() => onCreateProject(selectedWorkspace)}
            onEditProject={(project) =>
              onEdit("project", { ...project, workspaceId: selectedWorkspace })
            }
            onDeleteProject={onDeleteProject}
          />
        </>
      )}
    </>
  )
}

export default WorkspaceDetailsSection
