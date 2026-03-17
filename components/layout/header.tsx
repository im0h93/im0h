'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Sun, Moon, Search, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/components/theme-provider'
import { cn } from '@/lib/utils'
import type { Category, Profile } from '@/lib/types'

interface HeaderProps {
  categories: Category[]
  user: Profile | null
}

export function Header({ categories, user }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <header className="sticky top-0 z-50 w-full glass">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-xl">
              م
            </div>
            <span className="font-bold text-xl hidden sm:inline-block">مكسب</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/" className="px-3 py-2 text-sm font-medium hover:text-primary transition-colors">
              الرئيسية
            </Link>
            <Link href="/posts" className="px-3 py-2 text-sm font-medium hover:text-primary transition-colors">
              المقالات
            </Link>
            {categories.slice(0, 4).map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="px-3 py-2 text-sm font-medium hover:text-primary transition-colors"
              >
                <span className="ml-1">{category.emoji}</span>
                {category.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/search">
                <Search className="h-5 w-5" />
                <span className="sr-only">بحث</span>
              </Link>
            </Button>

            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              <span className="sr-only">تبديل الوضع</span>
            </Button>

            {user ? (
              <Button variant="ghost" size="icon" asChild>
                <Link href={user.role !== 'user' ? '/admin' : '/profile'}>
                  <User className="h-5 w-5" />
                  <span className="sr-only">الملف الشخصي</span>
                </Link>
              </Button>
            ) : (
              <Button variant="default" size="sm" asChild>
                <Link href="/auth/login">دخول</Link>
              </Button>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              <span className="sr-only">القائمة</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          'md:hidden overflow-hidden transition-all duration-300 ease-in-out glass-strong',
          mobileMenuOpen ? 'max-h-96' : 'max-h-0'
        )}
      >
        <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
          <Link
            href="/"
            className="px-3 py-2 text-sm font-medium hover:bg-accent rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            الرئيسية
          </Link>
          <Link
            href="/posts"
            className="px-3 py-2 text-sm font-medium hover:bg-accent rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            المقالات
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="px-3 py-2 text-sm font-medium hover:bg-accent rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="ml-1">{category.emoji}</span>
              {category.name}
            </Link>
          ))}
          <hr className="border-border my-2" />
          <Link
            href="/page/about"
            className="px-3 py-2 text-sm font-medium hover:bg-accent rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            من نحن
          </Link>
          <Link
            href="/page/contact"
            className="px-3 py-2 text-sm font-medium hover:bg-accent rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            اتصل بنا
          </Link>
        </nav>
      </div>
    </header>
  )
}
