import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Calendar, Eye, User, ArrowRight, Share2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { MainLayout } from '@/components/layout/main-layout'
import { PostCard } from '@/components/posts/post-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatDate, stripHtml, truncate } from '@/lib/utils'
import type { PostWithRelations } from '@/lib/types'
import { CommentsSection } from '@/components/posts/comments-section'

interface PostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('posts')
    .select('title, excerpt, content, cover_image')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!post) {
    return {
      title: 'المقال غير موجود | مكسب',
    }
  }

  const description = post.excerpt || truncate(stripHtml(post.content), 160)

  return {
    title: `${post.title} | مكسب`,
    description,
    openGraph: {
      title: post.title,
      description,
      images: post.cover_image ? [post.cover_image] : [],
    },
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // Fetch the post
  const { data: post } = await supabase
    .from('posts')
    .select(`
      *,
      category:categories(*),
      author:profiles(*)
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!post) {
    notFound()
  }

  // Increment view count (fire and forget)
  supabase
    .from('posts')
    .update({ views: (post.views || 0) + 1 })
    .eq('id', post.id)
    .then()

  // Fetch related posts from same category
  const { data: relatedPosts } = await supabase
    .from('posts')
    .select(`
      *,
      category:categories(*),
      author:profiles(*)
    `)
    .eq('status', 'published')
    .eq('category_id', post.category_id)
    .neq('id', post.id)
    .order('published_at', { ascending: false })
    .limit(3)

  const typedPost = post as PostWithRelations

  return (
    <MainLayout>
      <article className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">
            الرئيسية
          </Link>
          <ArrowRight className="h-4 w-4" />
          <Link href="/posts" className="hover:text-primary transition-colors">
            المقالات
          </Link>
          {typedPost.category && (
            <>
              <ArrowRight className="h-4 w-4" />
              <Link
                href={`/category/${typedPost.category.slug}`}
                className="hover:text-primary transition-colors"
              >
                {typedPost.category.name}
              </Link>
            </>
          )}
        </nav>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            {typedPost.category && (
              <Badge
                className="mb-4"
                style={{ backgroundColor: typedPost.category.color }}
              >
                {typedPost.category.emoji} {typedPost.category.name}
              </Badge>
            )}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-balance leading-tight">
              {typedPost.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
              {typedPost.author && (
                <div className="flex items-center gap-2">
                  {typedPost.author.avatar_url ? (
                    <Image
                      src={typedPost.author.avatar_url}
                      alt={typedPost.author.display_name || ''}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <span className="font-medium text-foreground">
                    {typedPost.author.display_name || 'مجهول'}
                  </span>
                </div>
              )}
              {typedPost.published_at && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(typedPost.published_at)}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{typedPost.views} مشاهدة</span>
              </div>
            </div>
          </header>

          {/* Cover Image */}
          {typedPost.cover_image && (
            <div className="relative aspect-video rounded-xl overflow-hidden mb-8">
              <Image
                src={typedPost.cover_image}
                alt={typedPost.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Content */}
          <div
            className="prose-ar text-lg leading-relaxed mb-12"
            dangerouslySetInnerHTML={{ __html: typedPost.content }}
          />

          {/* Share */}
          <Card className="mb-12">
            <CardContent className="p-6 flex items-center justify-between">
              <span className="font-medium">شارك هذا المقال</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(typedPost.title)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Share2 className="h-4 w-4 ml-2" />
                    تويتر
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Author Card */}
          {typedPost.author && (
            <Card className="mb-12">
              <CardContent className="p-6 flex items-start gap-4">
                {typedPost.author.avatar_url ? (
                  <Image
                    src={typedPost.author.avatar_url}
                    alt={typedPost.author.display_name || ''}
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    {typedPost.author.display_name || 'كاتب مجهول'}
                  </h3>
                  {typedPost.author.bio && (
                    <p className="text-muted-foreground">{typedPost.author.bio}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Comments */}
          <CommentsSection postId={typedPost.id} />
        </div>

        {/* Related Posts */}
        {relatedPosts && relatedPosts.length > 0 && (
          <section className="mt-16 pt-12 border-t border-border">
            <h2 className="text-2xl font-bold mb-8 text-center">
              مقالات ذات صلة
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {(relatedPosts as PostWithRelations[]).map((relatedPost) => (
                <PostCard key={relatedPost.id} post={relatedPost} featured />
              ))}
            </div>
          </section>
        )}
      </article>
    </MainLayout>
  )
}
