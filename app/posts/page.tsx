import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { MainLayout } from '@/components/layout/main-layout'
import { PostCard } from '@/components/posts/post-card'
import type { PostWithRelations } from '@/lib/types'

export const metadata: Metadata = {
  title: 'جميع المقالات | مكسب',
  description: 'تصفح جميع المقالات المنشورة على منصة مكسب',
}

export default async function PostsPage() {
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from('posts')
    .select(`
      *,
      category:categories(*),
      author:profiles(*)
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">جميع المقالات</h1>
          <p className="text-muted-foreground mb-8">
            تصفح جميع المقالات المنشورة على منصة مكسب
          </p>

          {posts && posts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {(posts as PostWithRelations[]).map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                لا توجد مقالات منشورة حالياً
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
