import type React from "react"
import { useState, useCallback } from "react"
import { useWorkspace } from "@/context/workspace-context"
import { useUser } from "@/context/user-context"
import { useCompanyMutations } from "@/hooks/useCompanyMutations"
import { useProjectMutations } from "@/hooks/useProjectMutations"
import ModalFormHandler from "@/components/forms/common/ModalFormHandler"
import WorkspaceDetailsSection from "./WorkspaceDetailsSection"
import CompanyDetailsSection from "./CompanyDetailsSection"
import { useWorkspaceActions } from "@/hooks/useWorkspaceActions"
import { motion, AnimatePresence } from "framer-motion"
import type { Role, Permission } from "@/types/interfaces"
import ProjectCollapsible from "@/components/forms/dashboard/ProjectCollapsible"

const DashboardContent: React.FC = () => {
  const { selectedWorkspace, selectedCompany, selectedType } = useWorkspace()
  const { userUUID } = useUser()
  const [isModalOpen, setModalOpen] = useState(false)
  const [editType, setEditType] = useState<"company" | "workspace" | "project" | null>(null)
  const [defaultValues, setDefaultValues] = useState<any>({})
  const [formKey, setFormKey] = useState(0)
  const { handleDelete, isPending, setIsPending } = useWorkspaceActions()
  const [error, setError] = useState<string | null>(null)
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])

  const { deleteCompanyMutation } = useCompanyMutations()
  const { deleteProjectMutation } = useProjectMutations()

  const handleEdit = useCallback((type: "company" | "workspace" | "project", details: any) => {
    setEditType(type)
    setDefaultValues(details || {})
    setModalOpen(true)
    setFormKey((prevKey) => prevKey + 1)
    setError(null)
  }, [])

  const handleDeleteProject = useCallback(
    (projectId: string) => {
      if (!projectId.match(/^[0-9a-fA-F-]{36}$/)) {
        console.error("Invalid project ID:", projectId)
        return
      }
      deleteProjectMutation.mutate(projectId)
    },
    [deleteProjectMutation]
  )

  const handleCloseModal = useCallback(() => {
    setModalOpen(false)
    setEditType(null)
    setDefaultValues({})
  }, [])

  return (
    <div className="h-full overflow-auto">
      <div className="p-6">
        <AnimatePresence mode="wait">
          {(!selectedType || (!selectedWorkspace && !selectedCompany)) && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center min-h-[calc(100vh-8rem)]"
            >
              <div className="text-center text-muted-foreground">
                Welcome to Project Management Dashboard. Please select a company or workspace from
                the sidebar to view details.
              </div>
            </motion.div>
          )}
          {selectedType === "workspace" && selectedWorkspace && (
            <motion.div
              key="workspace"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <WorkspaceDetailsSection
                selectedWorkspace={selectedWorkspace}
                onEdit={handleEdit}
                onDelete={(id) => handleDelete("workspace", id)}
                onCreateProject={(workspaceId) => handleEdit("project", { workspaceId })}
                onDeleteProject={handleDeleteProject}
              >
                <ProjectCollapsible
                  projects={selectedWorkspace.projects || []}
                  onCreateProject={() =>
                    handleEdit("project", { workspaceId: selectedWorkspace.id })
                  }
                  onEditProject={(details) => handleEdit("project", details)}
                  onDeleteProject={handleDeleteProject}
                  onRefresh={() => {
                    // Implement a function to refresh the workspace data
                    // This could be a call to refetch the workspace query
                  }}
                />
              </WorkspaceDetailsSection>
            </motion.div>
          )}
          {selectedType === "company" && selectedCompany && (
            <motion.div
              key="company"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CompanyDetailsSection
                selectedCompany={selectedCompany}
                onEdit={(details) => handleEdit("company", details)}
                onDelete={(id) => deleteCompanyMutation.mutate(id)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ModalFormHandler
        key={formKey}
        isOpen={isModalOpen}
        editType={editType}
        defaultValues={defaultValues}
        setModalOpen={setModalOpen}
        onClose={handleCloseModal}
        isPending={isPending}
        setIsPending={setIsPending}
        error={error}
        setError={setError}
        onSubmit={(data) => {
          console.log("Form submitted:", data)
          if (editType === "company") {
            // Handle company submission
          } else if (editType === "workspace") {
            // Handle workspace submission
          } else if (editType === "project") {
            // Handle project submission
          }
        }}
        label={editType ? `${defaultValues.id ? "Update" : "Create"} ${editType}` : ""}
        roles={roles}
        permissions={permissions}
      />
    </div>
  )
}

export default DashboardContent
