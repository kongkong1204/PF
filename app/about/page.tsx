import { profile } from '@/data/profile'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About — 효석',
  description: '효석의 자기소개, 학력, 기술 스택, 연구 관심사',
}

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-8">About</h1>

      <section className="mb-12">
        <h2 className="text-lg font-bold text-green-600 dark:text-green-400 mb-3">소개</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
          {profile.intro}
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-lg font-bold text-green-600 dark:text-green-400 mb-3">학력 · 스펙</h2>
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
            <span className="text-sm text-gray-500 dark:text-gray-400 sm:w-24 shrink-0">학교</span>
            <span className="text-gray-800 dark:text-gray-200">{profile.school} · {profile.year}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
            <span className="text-sm text-gray-500 dark:text-gray-400 sm:w-24 shrink-0">학점</span>
            <span className="text-gray-800 dark:text-gray-200">{profile.gpa}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4">
            <span className="text-sm text-gray-500 dark:text-gray-400 sm:w-24 shrink-0">자격증</span>
            <div className="flex flex-wrap gap-2">
              {profile.certifications.map((cert) => (
                <span key={cert} className="px-2.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-sm">
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-lg font-bold text-green-600 dark:text-green-400 mb-3">기술 스택</h2>
        <div className="space-y-4">
          {Object.entries(profile.skills).map(([category, skills]) => (
            <div key={category} className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
              <span className="text-sm text-gray-500 dark:text-gray-400 sm:w-24 shrink-0 capitalize">
                {category}
              </span>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-green-600 dark:text-green-400 mb-3">연구 관심사</h2>
        <p className="text-gray-700 dark:text-gray-300">{profile.researchInterest}</p>
      </section>
    </div>
  )
}
