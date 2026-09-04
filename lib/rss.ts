import { XMLParser } from 'fast-xml-parser'

export type TistoryPost = {
  title: string
  link: string
  pubDate: string
  description: string
  category: string
}

export function parseRssXml(xml: string): TistoryPost[] {
  const parser = new XMLParser({ isArray: (name) => name === 'item' })
  const result = parser.parse(xml)
  const items: Record<string, unknown>[] = result?.rss?.channel?.item ?? []
  return items.map((item) => ({
    title: String(item.title ?? ''),
    link: String(item.link ?? ''),
    pubDate: String(item.pubDate ?? ''),
    description: String(item.description ?? '').replace(/<[^>]+>/g, '').slice(0, 150),
    category: String(item.category ?? ''),
  }))
}

export function filterByCategory(posts: TistoryPost[], category: string): TistoryPost[] {
  return posts.filter((p) => p.category === category)
}

export async function fetchTistoryPosts(categoryFilter?: string): Promise<TistoryPost[]> {
  const res = await fetch('https://kong6985.tistory.com/rss', { cache: 'force-cache' })
  const xml = await res.text()
  const posts = parseRssXml(xml)
  if (!categoryFilter) return posts
  return filterByCategory(posts, categoryFilter)
}
