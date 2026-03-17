import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PostEditor } from '@/components/admin/post-editor'
import type { Category, Post } from '@/lib/types'

interface EditPostPageProps {
  params: Promise<{ id: string }>
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !post) {
    notFound()
  }

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">تعديل المقال</h1>
        <p className="text-muted-foreground">تعديل: {post.title}</p>
      </div>

      <PostEditor
        post={post as Post}
        categories={(categories as Category[]) || []}
        authorId={post.author_id}
      />
    </div>
  )
}
