import type React from "react"
import { useState, useCallback, useEffect } from "react"
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

const DashboardContent: React.FC = () => {
  const { selectedWorkspace, selectedCompany, selectedType } = useWorkspace()
  const { userUUID } = useUser()
  const [isModalOpen, setModalOpen] = useState(false)
  const [editType, setEditType] = useState<"company" | "workspace" | "project" | null>(null)
  const [defaultValues, setDefaultValues] = useState<any>({})
  const [formKey, setFormKey] = useState(0)
  const { handleDelete, isPending, setIsPending } = useWorkspaceActions()
  const [error, setError] = useState<string | null>(null)
  const [roles, setRoles] = useState<Role[]>([]) // Added roles state
  const [permissions, setPermissions] = useState<Permission[]>([]) // Added permissions state

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
    <div className="container mx-auto p-6 max-w-7xl">
      <AnimatePresence mode="wait">
        {selectedType === "workspace" && selectedWorkspace && (
          <motion.div
            key="workspace"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <WorkspaceDetailsSection
              selectedWorkspace={selectedWorkspace}
              onEdit={handleEdit}
              onDelete={(id) => handleDelete("workspace", id)}
              onCreateProject={(workspaceId) => handleEdit("project", { workspaceId })}
              onDeleteProject={handleDeleteProject}
            />
          </motion.div>
        )}
        {selectedType === "company" && selectedCompany && (
          <motion.div
            key="company"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
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
          // Handle form submission based on editType
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
