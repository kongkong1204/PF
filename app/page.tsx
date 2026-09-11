import Image from 'next/image'
import Link from 'next/link'
import { profile } from '@/data/profile'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '효석 — 포트폴리오',
  description: '경상국립대학교 컴퓨터공학과 효석의 개인 포트폴리오',
}

const allSkills = [
  ...profile.skills.mobile,
  ...profile.skills.web,
  ...profile.skills.backend,
  ...profile.skills.cs,
]

export default function HomePage() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-16 md:py-24">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-10 md:gap-16">
        {/* 사진 */}
        <div className="flex-shrink-0">
          <div className="relative w-36 h-36 md:w-48 md:h-48 rounded-full overflow-hidden ring-4 ring-green-500 dark:ring-green-400">
            <Image
              src="/profile.jpg"
              alt={`${profile.name} 프로필 사진`}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* 텍스트 */}
        <div className="flex-1 text-center md:text-left">
          <p className="text-sm font-semibold text-green-600 dark:text-green-400 tracking-widest uppercase mb-2">
            Computer Engineer
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-2">
            {profile.name}
          </h1>
          <p className="text-base text-gray-500 dark:text-gray-400 mb-4">
            {profile.school} · {profile.year}
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed max-w-md mx-auto md:mx-0">
            공기업 취직 희망.
          </p>

          <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-8">
            {allSkills.slice(0, 8).map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>

          <div className="flex gap-3 justify-center md:justify-start">
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              GitHub
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="px-5 py-2.5 border border-green-600 dark:border-green-400 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950 rounded-lg text-sm font-semibold transition-colors"
            >
              이메일
            </a>
            <Link
              href="/projects"
              className="px-5 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-sm font-semibold transition-colors"
            >
              Projects →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
