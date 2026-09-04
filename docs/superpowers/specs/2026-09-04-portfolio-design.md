# 효석 개인 포트폴리오 사이트 — 설계 문서

**작성일**: 2026-09-04  
**대상**: 신입 개발자 취업 + 대학원 지원 겸용 개인 포트폴리오 웹사이트

---

## 1. 개요

경상국립대학교 컴퓨터공학과 21학번 4학년 효석의 개인 포트폴리오 사이트.  
Next.js App Router 기반 완전 정적 사이트(static export)로, 서버 런타임 없이 Vercel 또는 GitHub Pages에 배포한다.

---

## 2. 확정된 설계 결정

| 항목 | 결정 |
|---|---|
| 프레임워크 | Next.js (App Router) + TypeScript |
| 스타일링 | Tailwind CSS |
| 배포 방식 | `output: 'export'` 정적 사이트 |
| 호스팅 | Vercel 또는 GitHub Pages |
| 디자인 톤 | 라이트/다크 토글 지원 |
| 액센트 색상 | 그린 (`#16a34a` 라이트 / `#4ade80` 다크) |
| 홈 히어로 레이아웃 | 좌우 스플릿 (사진 좌 · 텍스트 우, 모바일은 세로 전환) |
| 데이터 관리 | TypeScript 파일 (`data/projects.ts`, `data/profile.ts`) |
| 테마 시스템 | `next-themes` + Tailwind `dark:` variant |
| RSS XML 파서 | `fast-xml-parser` |

---

## 3. 개인 정보

| 항목 | 값 |
|---|---|
| 이름 | 효석 |
| 소속 | 경상국립대학교 컴퓨터공학 · 21학번 · 4학년 |
| 이메일 | dlgytjr6985@gmail.com |
| GitHub | https://github.com/kongkong1204 |
| Tistory | https://kong6985.tistory.com |
| Tistory RSS | https://kong6985.tistory.com/rss |
| 학점 | 3.6 / 4.5 |
| 연구 관심사 | Computer Vision |
| 자격증 | 정보처리기사, SQLD, ADsP, 한국사 |
| 프로필 사진 | `/Users/mac_kong/Downloads/KakaoTalk_Photo_2026-09-04-09-14-17.jpeg` → `public/profile.jpg`로 복사 |

---

## 4. 사이트 구조

| 라우트 | 페이지 | 주요 내용 |
|---|---|---|
| `/` | Home | HeroSection (좌우 스플릿), 기술 태그, GitHub·이메일 버튼 |
| `/about` | About | 자기소개, 학력·학점·자격증, 기술 스택, 연구 관심사 |
| `/projects` | Projects | ProjectCard 목록 (3개) |
| `/projects/[slug]` | 프로젝트 상세 | 문제의식·기술·결과, GitHub 링크, 스크린샷 갤러리 |
| `/coding-test` | Coding Test | Tistory RSS 빌드 타임 fetch → 포스트 목록 |
| `/contact` | Contact | 이메일, GitHub, 이력서 PDF 다운로드 |

---

## 5. 디렉토리 구조

```
PF/
├── app/
│   ├── layout.tsx              # 공통 레이아웃, Navbar, Footer, ThemeProvider
│   ├── page.tsx                # Home
│   ├── about/page.tsx
│   ├── projects/
│   │   ├── page.tsx            # 카드 목록
│   │   └── [slug]/page.tsx     # 상세 (generateStaticParams)
│   ├── coding-test/page.tsx    # RSS fetch (Server Component, 빌드 타임)
│   └── contact/page.tsx
├── components/
│   ├── Navbar.tsx              # 반응형 네비 + 햄버거 메뉴
│   ├── Footer.tsx
│   ├── ThemeToggle.tsx         # ☀️/🌙 토글 버튼
│   ├── ProjectCard.tsx         # 카드 목록용
│   └── TistoryPostCard.tsx     # RSS 포스트 카드
├── data/
│   ├── profile.ts              # 개인 정보 상수
│   └── projects.ts             # 프로젝트 3개 데이터
├── lib/
│   └── rss.ts                  # Tistory RSS fetch·파싱 유틸
├── public/
│   ├── profile.jpg             # 프로필 사진
│   └── resume.pdf              # 이력서 (추후 추가)
└── next.config.ts
```

---

## 6. 데이터 타입

### `data/profile.ts`
```ts
export const profile = {
  name: "효석",
  school: "경상국립대학교 컴퓨터공학",
  year: "21학번 · 4학년",
  email: "dlgytjr6985@gmail.com",
  github: "https://github.com/kongkong1204",
  tistory: "https://kong6985.tistory.com",
  gpa: "3.6 / 4.5",
  researchInterest: "Computer Vision — 컴퓨터 비전 및 이미지 인식 분야에 관심이 있습니다.",
  certifications: ["정보처리기사", "SQLD", "ADsP", "한국사"],
  skills: {
    mobile: ["Flutter", "Dart"],
    web: ["Next.js", "React", "TypeScript", "Vanilla JS"],
    backend: ["Python", "Node.js"],
    tools: ["Git", "Roboflow", "AppSheet"],
    cs: ["C", "C++", "Java"],
  },
}
```

### `data/projects.ts`
```ts
export type Project = {
  slug: string
  title: string
  summary: string
  techStack: string[]
  githubUrl?: string
  highlight: string
  description: string
}

export const projects: Project[] = [
  {
    slug: "cruxfinder",
    title: "CruxFinder",
    summary: "Flutter 기반 클라이밍 루트 추천 앱",
    techStack: ["Flutter", "Dart", "Python", "Roboflow", "A* Algorithm"],
    githubUrl: "https://github.com/kongkong1204/CruxFinder",
    highlight: "졸업작품 — 비전 모델로 홀드를 인식하고 A* 경로 탐색으로 루트를 자동 제안",
    description: "...",
  },
  {
    slug: "hyojason",
    title: "효자손",
    summary: "사회복지 사각지대 노인을 위한 앱",
    techStack: ["AppSheet", "Google Sheets"],
    highlight: "경남 SW경진대회 수상작",
    description: "...",
  },
  {
    slug: "mesojang",
    title: "메소장",
    summary: "메이플스토리 경매장 시세 추적 웹",
    techStack: ["Vanilla JS", "SVG"],
    highlight: "약 52주치 시세 데이터를 inline SVG로 시각화, 외부 의존성 없음",
    description: "...",
  },
]
```

---

## 7. Tistory RSS 연동

- **엔드포인트**: `https://kong6985.tistory.com/rss`
- **파서**: `fast-xml-parser`
- **위치**: `lib/rss.ts` — Server Component에서만 호출 (클라이언트 fetch 금지, CORS)
- **표시 항목**: 제목, 게시일, 요약, 원문 링크 (새 탭 이동)
- **카테고리 필터**: 빌드 시 실제 RSS를 fetch해서 `<category>` 필드값을 확인한 뒤 상수로 고정. 확인 전까지는 전체 포스트 노출.
- **재빌드**: 새 글은 재빌드 시 자동 반영

```ts
// lib/rss.ts
export type TistoryPost = {
  title: string
  link: string
  pubDate: string
  description: string
}

export async function fetchTistoryPosts(): Promise<TistoryPost[]> {
  const res = await fetch("https://kong6985.tistory.com/rss", { cache: "no-store" })
  const xml = await res.text()
  // fast-xml-parser로 파싱 후 반환
}
```

---

## 8. 테마 시스템

- `next-themes`의 `ThemeProvider`를 `app/layout.tsx`에 삽입
- `attribute="class"` 설정 → `<html class="dark">` 토글
- Tailwind `dark:` variant로 라이트/다크 스타일 적용
- 라이트: 흰 배경 (`#ffffff`), 그린 액센트 (`#16a34a`)
- 다크: 어두운 배경 (`#0f172a`), 그린 액센트 (`#4ade80`)

---

## 9. 디자인 시스템

- **폰트**: Geist Sans (Next.js 기본) 또는 시스템 폰트
- **반응형**: 모바일 우선, 브레이크포인트 `md` (768px) 기준
- **히어로**: `md:` 이상에서 좌우 스플릿, 그 아래는 사진 위·텍스트 아래
- **SEO**: 페이지별 `<title>`, `<meta description>`, Open Graph 태그
- **접근성**: 시맨틱 마크업, `alt` 텍스트, 키보드 네비게이션

---

## 10. 구현 순서

1. Next.js 프로젝트 생성 + `output: 'export'` + Tailwind + `next-themes` 설치
2. 공통 레이아웃 (Navbar · Footer · ThemeToggle)
3. `data/profile.ts`, `data/projects.ts` 작성
4. Home 페이지 (HeroSection)
5. About 페이지
6. Projects 목록 + 상세 페이지 (`generateStaticParams`)
7. `lib/rss.ts` + Coding Test 페이지
8. Contact 페이지
9. 반응형·다크모드 점검, SEO 메타태그
10. Vercel 배포

---

## 11. 미확정 항목 (추후 추가)

- 이력서 PDF (`public/resume.pdf`) — Contact 다운로드 버튼은 파일 없으면 비활성
- 프로젝트 스크린샷 (효자손, 메소장) — 없으면 색상 플레이스홀더
- 자기소개 상세 텍스트 (`data/projects.ts`의 `description` 필드)
- 연구 관심사 상세 문구 (현재: "Computer Vision")
