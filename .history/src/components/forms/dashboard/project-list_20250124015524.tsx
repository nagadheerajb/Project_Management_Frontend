import React from "react"

const ProjectList: React.FC<{
  projects: any[]
  onProjectClick: (project: any) => void
}> = ({ projects, onProjectClick }) => {
  if (!projects || projects.length === 0) {
    return <div className="text-gray-600">No projects available.</div>
  }

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <div
          key={project?.id || Math.random()} // Use a fallback key if `id` is missing
          className="p-4 border rounded-lg shadow-sm hover:shadow-md transition cursor-pointer"
          onClick={() => project && onProjectClick(project)} // Only call if project is valid
        >
          <h4 className="text-lg font-semibold">{project?.name || "Unnamed Project"}</h4>
          <p className="text-sm text-gray-600">
            {project?.description || "No description available"}
          </p>
        </div>
      ))}
    </div>
  )
}

export default ProjectList
