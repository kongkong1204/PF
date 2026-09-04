import { fetchTistoryPosts } from '@/lib/rss'
import { TistoryPostCard } from '@/components/TistoryPostCard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Coding Test — 효석',
  description: '효석의 코딩테스트 풀이 모음 (티스토리)',
}

export default async function CodingTestPage() {
  const posts = await fetchTistoryPosts()

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Coding Test</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-2">
        티스토리 블로그에 작성한 코딩테스트 풀이 모음입니다.
      </p>
      <a
        href="https://kong6985.tistory.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-green-600 dark:text-green-400 hover:underline mb-10 inline-block"
      >
        블로그 바로가기 →
      </a>

      {posts.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">포스트를 불러오지 못했습니다.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {posts.map((post) => (
            <TistoryPostCard key={post.link} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
