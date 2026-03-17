import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Eye, User } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatRelativeDate, truncate, stripHtml } from '@/lib/utils'
import type { PostWithRelations } from '@/lib/types'

interface PostCardProps {
  post: PostWithRelations
  featured?: boolean
}

export function PostCard({ post, featured = false }: PostCardProps) {
  const excerpt = post.excerpt || truncate(stripHtml(post.content), 120)

  if (featured) {
    return (
      <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300">
        <Link href={`/post/${post.slug}`} className="block">
          <div className="relative aspect-[16/9] overflow-hidden">
            {post.cover_image ? (
              <Image
                src={post.cover_image}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <span className="text-6xl opacity-50">
                  {post.category?.emoji || '📝'}
                </span>
              </div>
            )}
            {post.category && (
              <Badge
                className="absolute top-4 right-4"
                style={{ backgroundColor: post.category.color }}
              >
                {post.category.emoji} {post.category.name}
              </Badge>
            )}
          </div>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors text-balance">
              {post.title}
            </h2>
            <p className="text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
              {excerpt}
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {post.author && (
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{post.author.display_name || 'مجهول'}</span>
                </div>
              )}
              {post.published_at && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatRelativeDate(post.published_at)}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{post.views}</span>
              </div>
            </div>
          </CardContent>
        </Link>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden group hover:shadow-md transition-all duration-300">
      <Link href={`/post/${post.slug}`} className="flex flex-col sm:flex-row">
        <div className="relative w-full sm:w-48 aspect-video sm:aspect-square overflow-hidden shrink-0">
          {post.cover_image ? (
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <span className="text-4xl opacity-50">
                {post.category?.emoji || '📝'}
              </span>
            </div>
          )}
        </div>
        <CardContent className="p-4 flex flex-col justify-center">
          {post.category && (
            <Badge
              variant="secondary"
              className="w-fit mb-2 text-xs"
            >
              {post.category.emoji} {post.category.name}
            </Badge>
          )}
          <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {excerpt}
          </p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {post.published_at && (
              <span>{formatRelativeDate(post.published_at)}</span>
            )}
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {post.views}
            </span>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
