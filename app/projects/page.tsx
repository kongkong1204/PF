import { projects } from '@/data/projects'
import { ProjectCard } from '@/components/ProjectCard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects — 효석',
  description: '효석의 프로젝트 포트폴리오',
}

export default function ProjectsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Projects</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-10">진행한 프로젝트들입니다.</p>
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  )
}
