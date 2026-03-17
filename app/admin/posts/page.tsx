import Link from 'next/link'
import { Plus, Edit, Eye, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatRelativeDate } from '@/lib/utils'
import { DeletePostButton } from '@/components/admin/delete-post-button'
import type { PostWithRelations } from '@/lib/types'

export default async function AdminPostsPage() {
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from('posts')
    .select(`
      *,
      category:categories(*),
      author:profiles(*)
    `)
    .order('created_at', { ascending: false })

  const statusLabels: Record<string, { label: string; className: string }> = {
    published: {
      label: 'منشور',
      className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    },
    draft: {
      label: 'مسودة',
      className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    },
    archived: {
      label: 'مؤرشف',
      className: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
    },
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">المقالات</h1>
          <p className="text-muted-foreground">إدارة جميع المقالات</p>
        </div>
        <Button asChild>
          <Link href="/admin/posts/new">
            <Plus className="h-4 w-4 ml-2" />
            مقال جديد
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {posts && posts.length > 0 ? (
            <div className="divide-y divide-border">
              {(posts as PostWithRelations[]).map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Link
                        href={`/admin/posts/${post.id}`}
                        className="font-medium hover:text-primary line-clamp-1"
                      >
                        {post.title}
                      </Link>
                      {post.featured && (
                        <Badge variant="secondary" className="text-xs">
                          مميز
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      {post.category && (
                        <span>
                          {post.category.emoji} {post.category.name}
                        </span>
                      )}
                      <span>{formatRelativeDate(post.created_at)}</span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {post.views}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        statusLabels[post.status].className
                      }`}
                    >
                      {statusLabels[post.status].label}
                    </span>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/posts/${post.id}`}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">تعديل</span>
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/post/${post.slug}`} target="_blank">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">معاينة</span>
                      </Link>
                    </Button>
                    <DeletePostButton postId={post.id} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">لا توجد مقالات بعد</p>
              <Button asChild>
                <Link href="/admin/posts/new">
                  <Plus className="h-4 w-4 ml-2" />
                  إنشاء أول مقال
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
