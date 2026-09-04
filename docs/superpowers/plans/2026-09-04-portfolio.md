# Portfolio Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 효석의 개인 포트폴리오 사이트를 Next.js 15 App Router 기반 정적 사이트로 구축하고 Vercel에 배포 가능한 상태로 만든다.

**Architecture:** Next.js `output: 'export'`로 순수 정적 HTML/CSS/JS를 생성. 데이터는 `data/*.ts` TypeScript 파일에 하드코딩, Tistory 포스트는 빌드 타임 RSS fetch로 가져온다. 라이트/다크 테마는 `next-themes` + Tailwind `darkMode: 'class'` 조합으로 구현.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS v3, next-themes, fast-xml-parser, Vitest

---

## File Map

| 파일 | 역할 |
|---|---|
| `next.config.ts` | `output: 'export'`, `images.unoptimized: true` |
| `tailwind.config.ts` | `darkMode: 'class'`, content 경로 |
| `app/layout.tsx` | HTML shell, ThemeProvider, Navbar, Footer |
| `app/globals.css` | Tailwind 지시어, 기본 CSS 변수 |
| `app/page.tsx` | Home — HeroSection |
| `app/about/page.tsx` | About — 소개·학력·스킬·연구 |
| `app/projects/page.tsx` | Projects — 카드 목록 |
| `app/projects/[slug]/page.tsx` | 프로젝트 상세 (generateStaticParams) |
| `app/coding-test/page.tsx` | Tistory RSS 포스트 목록 |
| `app/contact/page.tsx` | Contact — 이메일·GitHub·이력서 |
| `components/ThemeProvider.tsx` | next-themes 클라이언트 래퍼 |
| `components/Navbar.tsx` | 반응형 네비게이션 (클라이언트) |
| `components/Footer.tsx` | 공통 푸터 |
| `components/ThemeToggle.tsx` | ☀️/🌙 토글 버튼 (클라이언트) |
| `components/ProjectCard.tsx` | 프로젝트 카드 (서버) |
| `components/TistoryPostCard.tsx` | RSS 포스트 카드 (서버) |
| `data/profile.ts` | 개인 정보 상수 |
| `data/projects.ts` | Project 타입 + 3개 프로젝트 데이터 |
| `lib/rss.ts` | RSS fetch·파싱 유틸 |
| `lib/rss.test.ts` | RSS 파싱 단위 테스트 |
| `public/profile.jpg` | 프로필 사진 |

---

## Task 1: 프로젝트 초기화 및 설정

**Files:**
- Create: `next.config.ts`
- Create: `tailwind.config.ts`
- Create: `public/profile.jpg`

- [ ] **Step 1: Next.js 프로젝트 생성**

```bash
cd /Users/mac_kong/PF
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --no-src-dir \
  --import-alias "@/*" \
  --no-turbopack
```

프롬프트에 기존 파일 덮어쓸지 물으면 `y` 선택.

- [ ] **Step 2: 추가 패키지 설치**

```bash
cd /Users/mac_kong/PF
npm install next-themes fast-xml-parser
npm install -D vitest @vitest/coverage-v8
```

- [ ] **Step 3: `next.config.ts` 설정**

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
}

export default nextConfig
```

- [ ] **Step 4: `tailwind.config.ts`에 darkMode 추가**

파일을 열어 `darkMode: 'class'`를 추가한다.

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
export default config
```

- [ ] **Step 5: Vitest 설정 파일 생성**

`vitest.config.ts` 파일을 생성:

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
  },
})
```

`package.json`의 `scripts`에 추가:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 6: 프로필 사진 복사**

```bash
cp /Users/mac_kong/Downloads/KakaoTalk_Photo_2026-09-04-09-14-17.jpeg /Users/mac_kong/PF/public/profile.jpg
```

- [ ] **Step 7: 빌드 테스트**

```bash
cd /Users/mac_kong/PF
npm run build
```

Expected: `out/` 디렉토리 생성, 오류 없음.

- [ ] **Step 8: 커밋**

```bash
git init
git add next.config.ts tailwind.config.ts vitest.config.ts package.json package-lock.json public/profile.jpg
git commit -m "feat: initialize Next.js project with static export config"
```

---

## Task 2: 데이터 레이어

**Files:**
- Create: `data/profile.ts`
- Create: `data/projects.ts`

- [ ] **Step 1: `data/profile.ts` 작성**

```ts
export const profile = {
  name: '효석',
  school: '경상국립대학교 컴퓨터공학',
  year: '21학번 · 4학년',
  email: 'dlgytjr6985@gmail.com',
  github: 'https://github.com/kongkong1204',
  githubHandle: 'kongkong1204',
  tistory: 'https://kong6985.tistory.com',
  gpa: '3.6 / 4.5',
  researchInterest: 'Computer Vision — 이미지 인식 및 객체 탐지 분야에 관심이 있습니다.',
  certifications: ['정보처리기사', 'SQLD', 'ADsP', '한국사'],
  skills: {
    mobile: ['Flutter', 'Dart'],
    web: ['Next.js', 'React', 'TypeScript', 'JavaScript'],
    backend: ['Python', 'Node.js'],
    cs: ['C', 'C++', 'Java'],
    tools: ['Git', 'Roboflow', 'AppSheet', 'SVG'],
  },
  intro: `안녕하세요! 경상국립대학교 컴퓨터공학과 4학년 효석입니다.
알고리즘과 모바일·웹 개발에 관심이 많으며, 실제 문제를 코드로 해결하는 것을 즐깁니다.
Computer Vision 분야에도 관심을 갖고 졸업작품에서 Roboflow를 활용한 프로젝트를 진행했습니다.`,
}
```

- [ ] **Step 2: `data/projects.ts` 작성**

```ts
export type Project = {
  slug: string
  title: string
  summary: string
  techStack: string[]
  githubUrl?: string
  highlight: string
  description: string
  accentColor: string
}

export const projects: Project[] = [
  {
    slug: 'cruxfinder',
    title: 'CruxFinder',
    summary: 'Flutter 기반 클라이밍 루트 추천 앱',
    techStack: ['Flutter', 'Dart', 'Python', 'Roboflow', 'A* Algorithm'],
    githubUrl: 'https://github.com/kongkong1204/CruxFinder',
    highlight: '졸업작품 — 컴퓨터 비전으로 홀드를 인식하고 A* 경로 탐색으로 최적 루트를 자동 제안',
    description: `클라이밍 입문자가 루트(문제)를 파악하기 어렵다는 문제에서 출발했습니다.
Roboflow 컴퓨터 비전 모델로 벽면의 홀드를 인식하고,
A* 경로탐색 알고리즘으로 시작 홀드에서 탑홀드까지의 최적 경로를 계산해 추천합니다.
Flutter로 크로스플랫폼 앱을 구현해 iOS/Android 모두 지원합니다.`,
    accentColor: '#16a34a',
  },
  {
    slug: 'hyojason',
    title: '효자손',
    summary: '사회복지 사각지대 노인을 위한 앱',
    techStack: ['AppSheet', 'Google Sheets'],
    highlight: '경남 SW경진대회 수상작 — 노코딩 플랫폼으로 실제 서비스 수준의 앱 구현',
    description: `사회복지 사각지대에 놓인 노인분들이 필요한 복지 서비스를 쉽게 찾고 신청할 수 있도록 돕는 앱입니다.
구글 노코딩 플랫폼 AppSheet를 활용해 빠르게 프로토타입을 구현했으며,
경남 SW경진대회에서 수상하는 성과를 거뒀습니다.`,
    accentColor: '#2563eb',
  },
  {
    slug: 'mesojang',
    title: '메소장',
    summary: '메이플스토리 경매장 시세 추적 웹',
    techStack: ['Vanilla JS', 'SVG'],
    highlight: '약 52주치 시세 데이터를 외부 라이브러리 없이 inline SVG로 시각화',
    description: `메이플스토리 인게임 경매장의 아이템 시세를 추적하고 시각화하는 웹 서비스입니다.
순수 Vanilla JS와 inline SVG만으로 약 52주치 가격 데이터를 차트로 표현했습니다.
외부 의존성 없이 정적 파일로만 동작하는 것이 특징입니다.`,
    accentColor: '#dc2626',
  },
]
```

- [ ] **Step 3: TypeScript 타입 검사**

```bash
cd /Users/mac_kong/PF
npx tsc --noEmit
```

Expected: 오류 없음.

- [ ] **Step 4: 커밋**

```bash
git add data/
git commit -m "feat: add profile and projects data"
```

---

## Task 3: RSS 유틸리티 + 테스트

**Files:**
- Create: `lib/rss.ts`
- Create: `lib/rss.test.ts`

- [ ] **Step 1: 실패하는 테스트 작성**

`lib/rss.test.ts`:

```ts
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
```

- [ ] **Step 2: 테스트 실행 — 실패 확인**

```bash
cd /Users/mac_kong/PF
npm test
```

Expected: FAIL — `lib/rss.ts` 모듈을 찾을 수 없음.

- [ ] **Step 3: `lib/rss.ts` 구현**

```ts
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
  const res = await fetch('https://kong6985.tistory.com/rss', { cache: 'no-store' })
  const xml = await res.text()
  const posts = parseRssXml(xml)
  if (!categoryFilter) return posts
  return filterByCategory(posts, categoryFilter)
}
```

- [ ] **Step 4: 테스트 실행 — 통과 확인**

```bash
npm test
```

Expected: PASS — 3 tests passed.

- [ ] **Step 5: 커밋**

```bash
git add lib/
git commit -m "feat: add Tistory RSS parser with tests"
```

---

## Task 4: 공통 레이아웃 (ThemeProvider · Navbar · Footer · ThemeToggle)

**Files:**
- Create: `components/ThemeProvider.tsx`
- Create: `components/Navbar.tsx`
- Create: `components/Footer.tsx`
- Create: `components/ThemeToggle.tsx`
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: `components/ThemeProvider.tsx` 작성**

```tsx
'use client'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light" enableSystem={false}>
      {children}
    </NextThemesProvider>
  )
}
```

- [ ] **Step 2: `components/ThemeToggle.tsx` 작성**

```tsx
'use client'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="w-9 h-9" />

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="테마 전환"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}
```

- [ ] **Step 3: `components/Navbar.tsx` 작성**

```tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { ThemeToggle } from './ThemeToggle'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/coding-test', label: 'Coding Test' },
  { href: '/contact', label: 'Contact' },
]

export function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur border-b border-gray-200 dark:border-gray-800">
      <nav className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-green-600 dark:text-green-400 text-lg">
          효석
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                pathname === link.href
                  ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <ThemeToggle />
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300"
            aria-label="메뉴"
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-950 px-4 py-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`block py-2 text-sm font-medium ${
                pathname === link.href
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
```

- [ ] **Step 4: `components/Footer.tsx` 작성**

```tsx
export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 py-6 mt-16">
      <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
        © 2026 효석 · Built with Next.js & Tailwind CSS
      </div>
    </footer>
  )
}
```

- [ ] **Step 5: `app/globals.css` 수정**

기존 내용을 아래로 교체:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-white text-gray-900 dark:bg-slate-950 dark:text-gray-100;
  }
}
```

- [ ] **Step 6: `app/layout.tsx` 수정**

```tsx
import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '효석 — 포트폴리오',
  description: '경상국립대학교 컴퓨터공학과 효석의 개인 포트폴리오',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={geist.className}>
        <ThemeProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 7: 개발 서버로 확인**

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 열어 Navbar·ThemeToggle·Footer 정상 동작 확인.
다크모드 토글 클릭 시 테마 전환 확인.

- [ ] **Step 8: 커밋**

```bash
git add components/ app/layout.tsx app/globals.css
git commit -m "feat: add layout, navbar, footer, and theme toggle"
```

---

## Task 5: Home 페이지

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: `app/page.tsx` 작성**

```tsx
import Image from 'next/image'
import Link from 'next/link'
import { profile } from '@/data/profile'

export const metadata = {
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
            알고리즘과 모바일·웹 개발에 관심이 많은 신입 개발자입니다.
            실제 문제를 코드로 해결하는 것을 즐깁니다.
          </p>

          {/* 기술 태그 */}
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

          {/* 버튼 */}
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
```

- [ ] **Step 2: 개발 서버로 확인**

```bash
npm run dev
```

`http://localhost:3000` 에서 히어로 섹션 확인:
- 프로필 사진이 원형으로 표시되는지
- 모바일(창 폭 줄이기)에서 사진이 위로 올라가는지
- 다크모드에서 색상이 올바른지

- [ ] **Step 3: 커밋**

```bash
git add app/page.tsx
git commit -m "feat: add home page with hero section"
```

---

## Task 6: About 페이지

**Files:**
- Create: `app/about/page.tsx`

- [ ] **Step 1: `app/about/page.tsx` 작성**

```tsx
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

      {/* 자기소개 */}
      <section className="mb-12">
        <h2 className="text-lg font-bold text-green-600 dark:text-green-400 mb-3">소개</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
          {profile.intro}
        </p>
      </section>

      {/* 학력·스펙 */}
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
                <span
                  key={cert}
                  className="px-2.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-sm"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 기술 스택 */}
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
                  <span
                    key={skill}
                    className="px-3 py-1 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 연구 관심사 */}
      <section>
        <h2 className="text-lg font-bold text-green-600 dark:text-green-400 mb-3">연구 관심사</h2>
        <p className="text-gray-700 dark:text-gray-300">{profile.researchInterest}</p>
      </section>
    </div>
  )
}
```

- [ ] **Step 2: 확인**

`http://localhost:3000/about` 에서 모든 섹션이 올바르게 표시되는지 확인.

- [ ] **Step 3: 커밋**

```bash
git add app/about/
git commit -m "feat: add about page"
```

---

## Task 7: Projects 목록 페이지 + ProjectCard 컴포넌트

**Files:**
- Create: `components/ProjectCard.tsx`
- Create: `app/projects/page.tsx`

- [ ] **Step 1: `components/ProjectCard.tsx` 작성**

```tsx
import Link from 'next/link'
import type { Project } from '@/data/projects'

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:border-green-400 dark:hover:border-green-600 hover:shadow-md transition-all"
    >
      {/* 색상 accent bar */}
      <div
        className="w-12 h-1 rounded-full mb-4 transition-all group-hover:w-20"
        style={{ backgroundColor: project.accentColor }}
      />

      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
        {project.title}
      </h2>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{project.summary}</p>

      <div className="flex flex-wrap gap-2">
        {project.techStack.map((tech) => (
          <span
            key={tech}
            className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded text-xs font-medium"
          >
            {tech}
          </span>
        ))}
      </div>
    </Link>
  )
}
```

- [ ] **Step 2: `app/projects/page.tsx` 작성**

```tsx
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
```

- [ ] **Step 3: 확인**

`http://localhost:3000/projects` 에서 카드 3개가 표시되고 호버 효과가 동작하는지 확인.

- [ ] **Step 4: 커밋**

```bash
git add components/ProjectCard.tsx app/projects/page.tsx
git commit -m "feat: add projects list page and ProjectCard component"
```

---

## Task 8: 프로젝트 상세 페이지

**Files:**
- Create: `app/projects/[slug]/page.tsx`

- [ ] **Step 1: `app/projects/[slug]/page.tsx` 작성**

```tsx
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
  return {
    title: `${project.title} — 효석`,
    description: project.summary,
  }
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)
  if (!project) notFound()

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link
        href="/projects"
        className="text-sm text-green-600 dark:text-green-400 hover:underline mb-8 inline-block"
      >
        ← Projects
      </Link>

      {/* 헤더 */}
      <div
        className="w-16 h-1.5 rounded-full mb-6"
        style={{ backgroundColor: project.accentColor }}
      />
      <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">
        {project.title}
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">{project.summary}</p>

      {/* 강조 포인트 */}
      <div className="border-l-4 border-green-500 dark:border-green-400 pl-4 mb-8 py-2 bg-green-50 dark:bg-green-950 rounded-r-lg">
        <p className="text-green-800 dark:text-green-200 text-sm font-medium">{project.highlight}</p>
      </div>

      {/* 기술 스택 */}
      <section className="mb-8">
        <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">
          Tech Stack
        </h2>
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* 상세 설명 */}
      <section className="mb-8">
        <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">
          Overview
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
          {project.description}
        </p>
      </section>

      {/* 링크 */}
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
    </div>
  )
}
```

- [ ] **Step 2: 확인**

`http://localhost:3000/projects/cruxfinder` — 상세 페이지 표시 확인.
`http://localhost:3000/projects/hyojason` — GitHub 버튼 없는 것 확인.

- [ ] **Step 3: 커밋**

```bash
git add app/projects/
git commit -m "feat: add project detail page with static params"
```

---

## Task 9: Coding Test 페이지 + TistoryPostCard

**Files:**
- Create: `components/TistoryPostCard.tsx`
- Create: `app/coding-test/page.tsx`

- [ ] **Step 1: `components/TistoryPostCard.tsx` 작성**

```tsx
import type { TistoryPost } from '@/lib/rss'

export function TistoryPostCard({ post }: { post: TistoryPost }) {
  const date = new Date(post.pubDate).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
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
      <span className="text-xs text-green-600 dark:text-green-400 mt-3 inline-block">
        티스토리에서 읽기 →
      </span>
    </a>
  )
}
```

- [ ] **Step 2: `app/coding-test/page.tsx` 작성**

```tsx
import { fetchTistoryPosts } from '@/lib/rss'
import { TistoryPostCard } from '@/components/TistoryPostCard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Coding Test — 효석',
  description: '효석의 코딩테스트 풀이 모음 (티스토리)',
}

export default async function CodingTestPage() {
  let posts = await fetchTistoryPosts()

  // RSS의 실제 category 필드를 확인해 필터 적용
  // 빌드 시 console.log(posts.map(p => p.category)) 로 카테고리명 확인 후 아래 수정
  // posts = posts.filter(p => p.category === '코딩테스트')

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
```

> **카테고리 필터링 주의:** 빌드 시 `npm run build` 실행 후 터미널 출력에서 RSS의 실제 category 필드명을 확인한다. 확인 후 주석 처리된 filter 라인을 활성화한다.

- [ ] **Step 3: 빌드로 RSS 카테고리 확인**

```bash
# coding-test/page.tsx의 주석 처리된 console.log를 임시 활성화:
# console.log('categories:', [...new Set(posts.map(p => p.category))])
npm run build 2>&1 | grep categories
```

출력된 카테고리명으로 filter 조건 업데이트 후 console.log 제거.

- [ ] **Step 4: 커밋**

```bash
git add components/TistoryPostCard.tsx app/coding-test/
git commit -m "feat: add coding test page with Tistory RSS integration"
```

---

## Task 10: Contact 페이지

**Files:**
- Create: `app/contact/page.tsx`

- [ ] **Step 1: `app/contact/page.tsx` 작성**

```tsx
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
        {/* 이메일 */}
        <div className="flex items-center gap-4 p-5 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-green-400 dark:hover:border-green-600 transition-colors">
          <div className="w-10 h-10 bg-green-100 dark:bg-green-950 rounded-lg flex items-center justify-center text-green-600 dark:text-green-400 text-lg">
            ✉️
          </div>
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Email</p>
            <a
              href={`mailto:${profile.email}`}
              className="text-gray-900 dark:text-white font-medium hover:text-green-600 dark:hover:text-green-400 transition-colors"
            >
              {profile.email}
            </a>
          </div>
        </div>

        {/* GitHub */}
        <div className="flex items-center gap-4 p-5 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-green-400 dark:hover:border-green-600 transition-colors">
          <div className="w-10 h-10 bg-green-100 dark:bg-green-950 rounded-lg flex items-center justify-center text-green-600 dark:text-green-400 text-lg">
            🐙
          </div>
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">GitHub</p>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-900 dark:text-white font-medium hover:text-green-600 dark:hover:text-green-400 transition-colors"
            >
              @{profile.githubHandle}
            </a>
          </div>
        </div>

        {/* 이력서 PDF */}
        <div className="flex items-center gap-4 p-5 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-green-400 dark:hover:border-green-600 transition-colors">
          <div className="w-10 h-10 bg-green-100 dark:bg-green-950 rounded-lg flex items-center justify-center text-green-600 dark:text-green-400 text-lg">
            📄
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">이력서</p>
            <a
              href="/resume.pdf"
              download
              className="text-gray-900 dark:text-white font-medium hover:text-green-600 dark:hover:text-green-400 transition-colors"
            >
              이력서 다운로드 (PDF)
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
```

> **이력서 PDF 준비 전:** `public/resume.pdf`가 없으면 다운로드 링크가 404를 반환한다. 파일이 준비되면 `public/resume.pdf`에 넣는다.

- [ ] **Step 2: 확인**

`http://localhost:3000/contact` 에서 카드 3개 확인. 이메일 클릭 시 메일 앱 열리는지 확인.

- [ ] **Step 3: 커밋**

```bash
git add app/contact/
git commit -m "feat: add contact page"
```

---

## Task 11: SEO 및 Open Graph 메타태그

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: `app/layout.tsx`의 metadata 확장**

기존 `metadata` 상수를 아래로 교체:

```ts
export const metadata: Metadata = {
  title: {
    default: '효석 — 포트폴리오',
    template: '%s — 효석',
  },
  description: '경상국립대학교 컴퓨터공학과 효석의 개인 포트폴리오. Flutter, Next.js, Python 개발자.',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: '효석 포트폴리오',
    title: '효석 — 포트폴리오',
    description: '경상국립대학교 컴퓨터공학과 효석의 개인 포트폴리오',
    images: [{ url: '/profile.jpg', width: 400, height: 400, alt: '효석 프로필' }],
  },
  robots: {
    index: true,
    follow: true,
  },
}
```

- [ ] **Step 2: 타입 체크**

```bash
npx tsc --noEmit
```

Expected: 오류 없음.

- [ ] **Step 3: 커밋**

```bash
git add app/layout.tsx
git commit -m "feat: add OpenGraph and SEO metadata"
```

---

## Task 12: 빌드 검증 및 배포 설정

**Files:**
- Create: `.gitignore` (확인)
- Create: `vercel.json` (필요 시)

- [ ] **Step 1: 최종 빌드**

```bash
cd /Users/mac_kong/PF
npm run build
```

Expected: `out/` 디렉토리 생성, 오류 없음.
경고가 있어도 빌드 성공이면 OK.

- [ ] **Step 2: 정적 사이트 로컬 미리보기**

```bash
npx serve out -p 4000
```

브라우저에서 `http://localhost:4000` 열어 전체 네비게이션 확인:
- `/` → `/about` → `/projects` → `/projects/cruxfinder` → `/coding-test` → `/contact`
- 라이트/다크 토글 동작 확인
- 모바일 뷰(창 폭 375px 이하) 햄버거 메뉴 동작 확인

- [ ] **Step 3: `.gitignore` 확인**

`.gitignore`에 아래 항목이 있는지 확인. 없으면 추가:

```
out/
.next/
.superpowers/
node_modules/
```

- [ ] **Step 4: 최종 커밋**

```bash
git add -A
git commit -m "chore: final build verification and gitignore update"
```

- [ ] **Step 5: Vercel 배포 (선택)**

```bash
npx vercel --prod
```

또는 GitHub에 push 후 Vercel 대시보드에서 import.

---

## 미확정 항목 (추후)

| 항목 | 처리 방법 |
|---|---|
| 이력서 PDF | `public/resume.pdf`에 파일 추가 |
| Tistory 카테고리 필터 | Task 9 Step 3에서 실제 category명 확인 후 filter 활성화 |
| 프로젝트 스크린샷 | `public/screenshots/` 에 추가 후 ProjectDetail에 `<Image>` 추가 |
| 자기소개 상세 텍스트 | `data/profile.ts`의 `intro` 필드 수정 |
