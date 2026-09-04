import { describe, it, expect } from 'vitest'
import { parseRssXml, filterByCategory } from './rss'

const SAMPLE_RSS = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>kong6985</title>
    <item>
      <title>프로그래머스 풀이 - 두 수의 합</title>
      <link>https://kong6985.tistory.com/1</link>
      <pubDate>Thu, 01 Jan 2026 10:00:00 +0900</pubDate>
      <description>두 수의 합 풀이 설명...</description>
      <category>코딩테스트</category>
    </item>
    <item>
      <title>일상 포스트</title>
      <link>https://kong6985.tistory.com/2</link>
      <pubDate>Fri, 02 Jan 2026 10:00:00 +0900</pubDate>
      <description>일상 내용...</description>
      <category>일상</category>
    </item>
  </channel>
</rss>`

describe('parseRssXml', () => {
  it('RSS XML에서 포스트 목록을 파싱한다', () => {
    const posts = parseRssXml(SAMPLE_RSS)
    expect(posts).toHaveLength(2)
    expect(posts[0].title).toBe('프로그래머스 풀이 - 두 수의 합')
    expect(posts[0].link).toBe('https://kong6985.tistory.com/1')
    expect(posts[0].category).toBe('코딩테스트')
    expect(posts[0].description).toBeTruthy()
    expect(posts[0].pubDate).toBeTruthy()
  })

  it('빈 XML이면 빈 배열을 반환한다', () => {
    const posts = parseRssXml('<rss><channel></channel></rss>')
    expect(posts).toHaveLength(0)
  })
})

describe('filterByCategory', () => {
  it('카테고리로 포스트를 필터링한다', () => {
    const posts = parseRssXml(SAMPLE_RSS)
    const filtered = filterByCategory(posts, '코딩테스트')
    expect(filtered).toHaveLength(1)
    expect(filtered[0].title).toContain('프로그래머스')
  })
})
