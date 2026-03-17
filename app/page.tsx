import Link from 'next/link'
import { ArrowLeft, TrendingUp, Clock, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { MainLayout } from '@/components/layout/main-layout'
import { PostCard } from '@/components/posts/post-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { PostWithRelations, Category } from '@/lib/types'

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch featured posts
  const { data: featuredPosts } = await supabase
    .from('posts')
    .select(`
      *,
      category:categories(*),
      author:profiles(*)
    `)
    .eq('status', 'published')
    .eq('featured', true)
    .order('published_at', { ascending: false })
    .limit(3)

  // Fetch recent posts
  const { data: recentPosts } = await supabase
    .from('posts')
    .select(`
      *,
      category:categories(*),
      author:profiles(*)
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(6)

  // Fetch popular posts (by views)
  const { data: popularPosts } = await supabase
    .from('posts')
    .select(`
      *,
      category:categories(*),
      author:profiles(*)
    `)
    .eq('status', 'published')
    .order('views', { ascending: false })
    .limit(5)

  // Fetch categories
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order')

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              <span>منصة عربية للمحتوى المميز</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
              اكتشف عالماً من{' '}
              <span className="text-primary">المعرفة</span>
              {' '}والإلهام
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              مقالات تقنية، دروس تعليمية، ونصائح للتطوير الذاتي. كل ما تحتاجه للنمو والتطور في مكان واحد.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/posts">
                  تصفح المقالات
                  <ArrowLeft className="h-4 w-4 mr-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/page/about">تعرف علينا</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 border-y border-border bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {(categories as Category[])?.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-card border border-border hover:border-primary hover:bg-primary/5 transition-all text-sm font-medium"
              >
                <span>{category.emoji}</span>
                <span>{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts && featuredPosts.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">مقالات مميزة</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(featuredPosts as PostWithRelations[]).map((post) => (
                <PostCard key={post.id} post={post} featured />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent & Popular Posts */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Posts */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <Clock className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold">أحدث المقالات</h2>
                </div>
                <Button variant="ghost" asChild>
                  <Link href="/posts">
                    عرض الكل
                    <ArrowLeft className="h-4 w-4 mr-2" />
                  </Link>
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {(recentPosts as PostWithRelations[])?.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </div>

            {/* Popular Posts Sidebar */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <TrendingUp className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">الأكثر قراءة</h2>
              </div>
              <Card>
                <CardContent className="p-0 divide-y divide-border">
                  {(popularPosts as PostWithRelations[])?.map((post, index) => (
                    <Link
                      key={post.id}
                      href={`/post/${post.slug}`}
                      className="flex items-start gap-4 p-4 hover:bg-muted/50 transition-colors"
                    >
                      <span className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium line-clamp-2 text-sm mb-1">
                          {post.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {post.views} مشاهدة
                        </p>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                هل لديك ما تشاركه؟
              </h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                انضم إلى فريق الكتّاب في مكسب وشارك معرفتك مع آلاف القراء العرب.
              </p>
              <Button size="lg" asChild>
                <Link href="/page/contact">تواصل معنا</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </MainLayout>
  )
}
