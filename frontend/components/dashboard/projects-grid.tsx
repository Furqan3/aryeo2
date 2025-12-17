"use client"

import { ProjectCard } from "./project-card"

interface Project {
  id: string
  name: string
  propertyInfo: any
  images: string[]
  lastEditedAt: Date
  createdAt: Date
}

interface ProjectsGridProps {
  projects: Project[]
}

export function ProjectsGrid({ projects }: ProjectsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}
