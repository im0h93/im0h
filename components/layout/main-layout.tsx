import { createClient } from '@/lib/supabase/server'
import { Header } from './header'
import { Footer } from './footer'
import type { Category, Profile } from '@/lib/types'

interface MainLayoutProps {
  children: React.ReactNode
}

export async function MainLayout({ children }: MainLayoutProps) {
  const supabase = await createClient()

  // Fetch categories
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order')

  // Fetch current user profile
  const { data: { user } } = await supabase.auth.getUser()
  let profile: Profile | null = null

  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    profile = data
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header categories={(categories as Category[]) || []} user={profile} />
      <main className="flex-1">{children}</main>
      <Footer categories={(categories as Category[]) || []} />
    </div>
  )
}
