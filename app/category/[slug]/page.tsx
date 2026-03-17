import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { MainLayout } from '@/components/layout/main-layout'
import { PostCard } from '@/components/posts/post-card'
import type { Category, PostWithRelations } from '@/lib/types'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: category } = await supabase
    .from('categories')
    .select('name, description')
    .eq('slug', slug)
    .single()

  if (!category) {
    return {
      title: 'القسم غير موجود | مكسب',
    }
  }

  return {
    title: `${category.name} | مكسب`,
    description: category.description || `تصفح مقالات قسم ${category.name}`,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // Fetch category
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!category) {
    notFound()
  }

  // Fetch posts in this category
  const { data: posts } = await supabase
    .from('posts')
    .select(`
      *,
      category:categories(*),
      author:profiles(*)
    `)
    .eq('status', 'published')
    .eq('category_id', category.id)
    .order('published_at', { ascending: false })

  const typedCategory = category as Category

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Category Header */}
          <div className="text-center mb-12">
            <span className="text-6xl mb-4 block">{typedCategory.emoji}</span>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {typedCategory.name}
            </h1>
            {typedCategory.description && (
              <p className="text-muted-foreground text-lg">
                {typedCategory.description}
              </p>
            )}
          </div>

          {/* Posts Grid */}
          {posts && posts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {(posts as PostWithRelations[]).map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                لا توجد مقالات في هذا القسم حالياً
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
