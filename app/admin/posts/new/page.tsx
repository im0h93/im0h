import { createClient } from '@/lib/supabase/server'
import { PostEditor } from '@/components/admin/post-editor'
import type { Category } from '@/lib/types'

export default async function NewPostPage() {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order')

  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">مقال جديد</h1>
        <p className="text-muted-foreground">إنشاء مقال جديد</p>
      </div>

      <PostEditor
        categories={(categories as Category[]) || []}
        authorId={user?.id || ''}
      />
    </div>
  )
}
