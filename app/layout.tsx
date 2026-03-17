import type { Metadata, Viewport } from 'next'
import { Cairo } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
})

export const metadata: Metadata = {
  title: 'مكسب | MAKSAB',
  description: 'منصة عربية للمحتوى التقني والتعليمي - مقالات، دروس، وأخبار التقنية',
  keywords: ['مدونة عربية', 'تقنية', 'برمجة', 'تطوير الذات', 'أعمال'],
  authors: [{ name: 'MAKSAB Team' }],
  openGraph: {
    title: 'مكسب | MAKSAB',
    description: 'منصة عربية للمحتوى التقني والتعليمي',
    type: 'website',
    locale: 'ar_SA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'مكسب | MAKSAB',
    description: 'منصة عربية للمحتوى التقني والتعليمي',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={`${cairo.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
