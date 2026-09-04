import { profile } from '@/data/profile'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact — 효석',
  description: '효석에게 연락하기',
}

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Contact</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-12">언제든지 연락 주세요!</p>

      <div className="space-y-6">
        <div className="flex items-center gap-4 p-5 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-green-400 dark:hover:border-green-600 transition-colors">
          <div className="w-10 h-10 bg-green-100 dark:bg-green-950 rounded-lg flex items-center justify-center text-green-600 dark:text-green-400 text-lg">✉️</div>
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Email</p>
            <a href={`mailto:${profile.email}`} className="text-gray-900 dark:text-white font-medium hover:text-green-600 dark:hover:text-green-400 transition-colors">
              {profile.email}
            </a>
          </div>
        </div>

        <div className="flex items-center gap-4 p-5 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-green-400 dark:hover:border-green-600 transition-colors">
          <div className="w-10 h-10 bg-green-100 dark:bg-green-950 rounded-lg flex items-center justify-center text-green-600 dark:text-green-400 text-lg">🐙</div>
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">GitHub</p>
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-gray-900 dark:text-white font-medium hover:text-green-600 dark:hover:text-green-400 transition-colors">
              @{profile.githubHandle}
            </a>
          </div>
        </div>

        <div className="flex items-center gap-4 p-5 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-green-400 dark:hover:border-green-600 transition-colors">
          <div className="w-10 h-10 bg-green-100 dark:bg-green-950 rounded-lg flex items-center justify-center text-green-600 dark:text-green-400 text-lg">📄</div>
          <div className="flex-1">
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">이력서</p>
            <a href="/resume.pdf" download className="text-gray-900 dark:text-white font-medium hover:text-green-600 dark:hover:text-green-400 transition-colors">
              이력서 다운로드 (PDF)
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
