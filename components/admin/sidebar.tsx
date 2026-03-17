'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Files,
  MessageSquare,
  Mail,
  Users,
  Code,
  Home,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Profile } from '@/lib/types'

interface AdminSidebarProps {
  profile: Profile
}

const navItems = [
  { href: '/admin', label: 'لوحة التحكم', icon: LayoutDashboard, roles: ['admin', 'editor', 'moderator'] },
  { href: '/admin/posts', label: 'المقالات', icon: FileText, roles: ['admin', 'editor'] },
  { href: '/admin/categories', label: 'الأقسام', icon: FolderOpen, roles: ['admin', 'editor'] },
  { href: '/admin/pages', label: 'الصفحات', icon: Files, roles: ['admin'] },
  { href: '/admin/comments', label: 'التعليقات', icon: MessageSquare, roles: ['admin', 'editor', 'moderator'] },
  { href: '/admin/messages', label: 'الرسائل', icon: Mail, roles: ['admin'] },
  { href: '/admin/users', label: 'المستخدمين', icon: Users, roles: ['admin'] },
  { href: '/admin/dev', label: 'التطوير', icon: Code, roles: ['admin', 'editor'] },
]

export function AdminSidebar({ profile }: AdminSidebarProps) {
  const pathname = usePathname()

  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(profile.role)
  )

  return (
    <aside className="fixed top-0 right-0 z-40 h-screen w-64 bg-card border-l border-border hidden lg:block">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-center border-b border-border">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-xl">
              م
            </div>
            <div>
              <span className="font-bold text-lg">مكسب</span>
              <span className="text-xs text-muted-foreground block">لوحة الإدارة</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/admin' && pathname.startsWith(item.href))
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Home className="h-5 w-5" />
            العودة للموقع
          </Link>
        </div>
      </div>
    </aside>
  )
}
