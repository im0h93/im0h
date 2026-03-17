import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/sidebar'
import { AdminHeader } from '@/components/admin/header'
import type { Profile } from '@/lib/types'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login?redirect=/admin')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile || !['admin', 'editor', 'moderator'].includes(profile.role)) {
    redirect('/')
  }

  const typedProfile = profile as Profile

  return (
    <div className="min-h-screen bg-muted/30">
      <AdminSidebar profile={typedProfile} />
      <div className="lg:pr-64">
        <AdminHeader profile={typedProfile} />
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
