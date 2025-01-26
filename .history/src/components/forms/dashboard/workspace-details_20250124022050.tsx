import type React from "react"
import { useEffect, useState } from "react"
import { getWorkspaceDetails } from "@/api/workspace"
import { fetchProjects } from "@/api/project"
import ProjectCollapsible from "./ProjectCollapsible"
import WorkspaceDetails from "@/components/forms/dashboard/workspace-details"
import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"

interface WorkspaceDetailsSectionProps {
  selectedWorkspace: string
  onEdit: (type: "company" | "workspace" | "project", details: any) => void
  onDelete: (id: string) => void
  onCreateProject: (workspaceId: string) => Promise<any>
  onDeleteProject: (id: string) => void
}

const WorkspaceDetailsSection: React.FC<WorkspaceDetailsSectionProps> = ({
  selectedWorkspace,
  onEdit,
  onDelete,
  onCreateProject,
  onDeleteProject
}) => {
  const [workspaceDetails, setWorkspaceDetails] = useState<any>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    if (selectedWorkspace.match(/^[0-9a-fA-F-]{36}$/)) {
      Promise.all([getWorkspaceDetails(selectedWorkspace), fetchProjects(selectedWorkspace)])
        .then(([workspaceData, projectsData]) => {
          setWorkspaceDetails(workspaceData)
          setProjects(projectsData)
          setIsLoading(false)
        })
        .catch((err) => {
          console.error("Error fetching data:", err)
          setIsLoading(false)
        })
    } else {
      console.error("Invalid selectedWorkspace:", selectedWorkspace)
      setIsLoading(false)
    }
  }, [selectedWorkspace])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
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
            onRefresh={() => {
              // Implement a function to refresh the workspace data
              // This could be a call to refetch the workspace query
            }}
          />
        </>
      )}
    </motion.div>
  )
}

export default WorkspaceDetailsSection
