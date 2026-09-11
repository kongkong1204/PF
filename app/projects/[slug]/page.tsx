import { projects } from '@/data/projects'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)
  if (!project) return {}
  return { title: `${project.title} — 효석`, description: project.summary }
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)
  if (!project) notFound()

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/projects" className="text-sm text-green-600 dark:text-green-400 hover:underline mb-8 inline-block">
        ← Projects
      </Link>

      <div className="w-16 h-1.5 rounded-full mb-6" style={{ backgroundColor: project.accentColor }} />
      <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">{project.title}</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">{project.summary}</p>

      <div className="border-l-4 border-green-500 dark:border-green-400 pl-4 mb-8 py-2 bg-green-50 dark:bg-green-950 rounded-r-lg">
        <p className="text-green-800 dark:text-green-200 text-sm font-medium">{project.highlight}</p>
      </div>

      <section className="mb-8">
        <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">Tech Stack</h2>
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <span key={tech} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">
              {tech}
            </span>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">Overview</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">{project.description}</p>
      </section>

      <div className="flex flex-wrap gap-3">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg text-sm font-semibold hover:opacity-80 transition-opacity"
          >
            GitHub에서 보기 →
          </a>
        )}
        {project.awardUrl && (
          <a
            href={project.awardUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg text-sm font-semibold hover:border-gray-900 dark:hover:border-white transition-colors"
          >
            수상 결과 보기 →
          </a>
        )}
      </div>
    </div>
  )
}
