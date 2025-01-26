import React from "react"

const ProjectList: React.FC<{
  projects: any[]
  onProjectClick: (project: any) => void
}> = ({ projects, onProjectClick }) => {
  const handleProjectClick = (project: any) => {
    onProjectClick(project) // Notify parent to update the selected project
  }

  return (
    <div>
      <div className="space-y-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="p-4 border rounded-md cursor-pointer"
            onClick={() => handleProjectClick(project)}
          >
            <h4 className="text-xl font-semibold">{project.name}</h4>
            <p>{project.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProjectList
