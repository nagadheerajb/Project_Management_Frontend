import type React from "react"
import { useState } from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import ProjectList from "@/components/forms/dashboard/project-list"
import ProjectDetails from "@/components/forms/dashboard/project-details"
import { ChevronDown, Plus } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"

const ProjectCollapsible: React.FC<{
  projects: any[]
  onCreateProject: () => void
  onEditProject: (details: any) => void
  onDeleteProject: (id: string) => void
}> = ({ projects, onCreateProject, onEditProject, onDeleteProject }) => {
  const [isCollapsibleOpen, setCollapsibleOpen] = useState(true)
  const [selectedProject, setSelectedProject] = useState<any>(null)

  const handleProjectClick = (project: any) => {
    setSelectedProject(project)
    setCollapsibleOpen(false)
  }

  return (
    <div className="space-y-4">
      <Collapsible
        open={isCollapsibleOpen}
        onOpenChange={setCollapsibleOpen}
        className="border rounded-lg p-4"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <h3 className="text-2xl font-semibold">Projects</h3>
          <div className="flex items-center space-x-2">
            <Button onClick={onCreateProject} size="sm">
              <Plus className="mr-2 h-4 w-4" /> New Project
            </Button>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isCollapsibleOpen ? "rotate-180" : ""
                  }`}
                />
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>
        <CollapsibleContent>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ProjectList projects={projects} onProjectClick={handleProjectClick} />
          </motion.div>
        </CollapsibleContent>
      </Collapsible>
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ProjectDetails
              project={selectedProject}
              onEdit={() => onEditProject(selectedProject)}
              onDelete={() => onDeleteProject(selectedProject.id)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProjectCollapsible
