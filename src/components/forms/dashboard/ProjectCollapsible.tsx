import React, { useState } from "react"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import ProjectList from "@/components/forms/dashboard/project-list"
import ProjectDetails from "@/components/forms/dashboard/project-details"
import { HiChevronDown, HiPlus } from "react-icons/hi"

const ProjectCollapsible: React.FC<{
  projects: any[]
  onCreateProject: () => void
  onEditProject: (details: any) => void
  onDeleteProject: (id: string) => void
}> = ({ projects, onCreateProject, onEditProject, onDeleteProject }) => {
  const [isCollapsibleOpen, setCollapsibleOpen] = useState(true)
  const [selectedProject, setSelectedProject] = useState<any>(null)

  const handleProjectClick = (project: any) => {
    setSelectedProject(project) // Update selected project state
    setCollapsibleOpen(false) // Collapse project list for better focus
  }

  return (
    <div>
      <div
        className="flex items-center cursor-pointer"
        onClick={() => setCollapsibleOpen(!isCollapsibleOpen)}
      >
        <h3 className="text-2xl font-semibold">Projects</h3>
        <HiPlus onClick={onCreateProject} className="ml-4 cursor-pointer" />
        <HiChevronDown
          className={`ml-auto transition-transform ${
            isCollapsibleOpen ? "rotate-0" : "rotate-180"
          }`}
        />
      </div>
      <Collapsible open={isCollapsibleOpen} onOpenChange={setCollapsibleOpen}>
        <CollapsibleContent>
          <ProjectList projects={projects} onProjectClick={handleProjectClick} />
        </CollapsibleContent>
      </Collapsible>
      {selectedProject && (
        <ProjectDetails
          project={selectedProject}
          onEdit={() => onEditProject(selectedProject)}
          onDelete={() => onDeleteProject(selectedProject.id)}
        />
      )}
    </div>
  )
}

export default ProjectCollapsible
