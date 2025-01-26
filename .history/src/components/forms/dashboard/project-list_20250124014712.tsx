import React from "react"

const ProjectList: React.FC<{
  projects: any[]
  onProjectClick: (project: any) => void
}> = ({ projects, onProjectClick }) => {
  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <div
          key={project.id}
          className="p-4 border rounded-lg shadow-sm hover:shadow-md transition cursor-pointer"
          onClick={() => onProjectClick(project)}
        >
          <h4 className="text-lg font-semibold">{project.name}</h4>
          <p className="text-sm text-gray-600">
            {project.description || "No description available"}
          </p>
        </div>
      ))}
    </div>
  )
}

export default ProjectList
