import Link from 'next/link'
import type { Project } from '@/data/projects'

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:border-green-400 dark:hover:border-green-600 hover:shadow-md transition-all"
    >
      <div
        className="w-12 h-1 rounded-full mb-4 transition-all group-hover:w-20"
        style={{ backgroundColor: project.accentColor }}
      />
      {project.status && (
        <span className="inline-block mb-2 px-2 py-0.5 bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 rounded-full text-xs font-semibold">
          {project.status}
        </span>
      )}
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
        {project.title}
      </h2>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{project.summary}</p>
      <div className="flex flex-wrap gap-2">
        {project.techStack.map((tech) => (
          <span key={tech} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded text-xs font-medium">
            {tech}
          </span>
        ))}
      </div>
    </Link>
  )
}
