'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Menu, X, Sun, Moon, LogOut, User, Bell } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/components/theme-provider'
import type { Profile } from '@/lib/types'

interface AdminHeaderProps {
  profile: Profile
}

export function AdminHeader({ profile }: AdminHeaderProps) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const roleLabels: Record<string, string> = {
    admin: 'مدير',
    editor: 'محرر',
    moderator: 'مشرف',
  }

  return (
    <header className="sticky top-0 z-30 h-16 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="flex h-full items-center justify-between px-4 lg:px-8">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        {/* Mobile Logo */}
        <Link href="/admin" className="lg:hidden flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
            م
          </div>
        </Link>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">الإشعارات</span>
          </Button>

          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">تبديل الوضع</span>
          </Button>

          {/* User Menu */}
          <div className="flex items-center gap-3 pr-3 border-r border-border">
            <div className="text-left hidden sm:block">
              <p className="text-sm font-medium">{profile.display_name || 'مستخدم'}</p>
              <p className="text-xs text-muted-foreground">{roleLabels[profile.role]}</p>
            </div>
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profile.display_name || ''}
                width={36}
                height={36}
                className="rounded-full"
              />
            ) : (
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
            )}
          </div>

          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
            <span className="sr-only">تسجيل الخروج</span>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 z-50 bg-background">
          <nav className="p-4 space-y-1">
            <Link
              href="/admin"
              className="block px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              لوحة التحكم
            </Link>
            <Link
              href="/admin/posts"
              className="block px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              المقالات
            </Link>
            <Link
              href="/admin/categories"
              className="block px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              الأقسام
            </Link>
            <Link
              href="/admin/comments"
              className="block px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              التعليقات
            </Link>
            <Link
              href="/"
              className="block px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              العودة للموقع
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
