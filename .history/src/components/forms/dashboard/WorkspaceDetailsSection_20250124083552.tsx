import React, { useEffect, useState } from "react"
import { getWorkspaceDetails } from "@/api/workspace"
import { fetchProjects } from "@/api/project"
import ProjectCollapsible from "./ProjectCollapsible"
import WorkspaceDetails from "@/components/forms/dashboard/workspace-details"
import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"

const WorkspaceDetailsSection: React.FC<{
  selectedWorkspace: string
  onEdit: (type: "company" | "workspace" | "project", details: any) => void
  onDelete: (id: string) => void
  onCreateProject: (workspaceId: string) => void
  onDeleteProject: (id: string) => void
}> = ({ selectedWorkspace, onEdit, onDelete, onCreateProject, onDeleteProject }) => {
  const [workspaceDetails, setWorkspaceDetails] = useState<any>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    if (selectedWorkspace.match(/^[0-9a-fA-F-]{36}$/)) {
      Promise.all([getWorkspaceDetails(selectedWorkspace), fetchProjects(selectedWorkspace)])
        .then(([workspaceData, projectsData]) => {
          const augmentedWorkspaceData = {
            ...workspaceData,
            displayName: `${workspaceData.firstName || ""} ${workspaceData.lastName || ""}`.trim()
          }
          setWorkspaceDetails(augmentedWorkspaceData)
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
            onCreateProject={async () => await onCreateProject(selectedWorkspace)}
            onEditProject={(project) =>
              onEdit("project", { ...project, workspaceId: selectedWorkspace })
            }
            onDeleteProject={onDeleteProject}
            onRefresh={() => {
              setIsLoading(true)
              Promise.all([
                getWorkspaceDetails(selectedWorkspace),
                fetchProjects(selectedWorkspace)
              ])
                .then(([workspaceData, projectsData]) => {
                  const augmentedWorkspaceData = {
                    ...workspaceData,
                    displayName: `${workspaceData.firstName || ""} ${
                      workspaceData.lastName || ""
                    }`.trim()
                  }
                  setWorkspaceDetails(augmentedWorkspaceData)
                  setProjects(projectsData)
                  setIsLoading(false)
                })
                .catch((err) => {
                  console.error("Error refreshing data:", err)
                  setIsLoading(false)
                })
            }}
          />
        </>
      )}
    </motion.div>
  )
}

export default WorkspaceDetailsSection
