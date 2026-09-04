import type { TistoryPost } from '@/lib/rss'

export function TistoryPostCard({ post }: { post: TistoryPost }) {
  const date = new Date(post.pubDate).toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <a
      href={post.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block border border-gray-200 dark:border-gray-800 rounded-xl p-5 hover:border-green-400 dark:hover:border-green-600 hover:shadow-md transition-all"
    >
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-1.5">{date}</p>
      <h2 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
        {post.title}
      </h2>
      {post.description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{post.description}</p>
      )}
      <span className="text-xs text-green-600 dark:text-green-400 mt-3 inline-block">티스토리에서 읽기 →</span>
    </a>
  )
}
