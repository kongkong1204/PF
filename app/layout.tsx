import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://kongkong1204.github.io'),
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
  robots: { index: true, follow: true },
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
