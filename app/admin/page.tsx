import Link from 'next/link'
import { FileText, FolderOpen, MessageSquare, Mail, Eye, TrendingUp, Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatRelativeDate } from '@/lib/utils'
import type { Post, Comment, ContactSubmission } from '@/lib/types'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Fetch stats
  const { count: postsCount } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })

  const { count: publishedCount } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published')

  const { count: categoriesCount } = await supabase
    .from('categories')
    .select('*', { count: 'exact', head: true })

  const { count: pendingComments } = await supabase
    .from('comments')
    .select('*', { count: 'exact', head: true })
    .eq('is_approved', false)

  const { count: unreadMessages } = await supabase
    .from('contact_submissions')
    .select('*', { count: 'exact', head: true })
    .eq('is_read', false)

  // Fetch total views
  const { data: viewsData } = await supabase
    .from('posts')
    .select('views')
  const totalViews = viewsData?.reduce((sum, post) => sum + (post.views || 0), 0) || 0

  // Fetch recent posts
  const { data: recentPosts } = await supabase
    .from('posts')
    .select('id, title, slug, status, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  // Fetch pending comments
  const { data: pendingCommentsList } = await supabase
    .from('comments')
    .select('id, content, guest_name, created_at, post_id')
    .eq('is_approved', false)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">لوحة التحكم</h1>
          <p className="text-muted-foreground">مرحباً بك في لوحة إدارة مكسب</p>
        </div>
        <Button asChild>
          <Link href="/admin/posts/new">
            <Plus className="h-4 w-4 ml-2" />
            مقال جديد
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              إجمالي المقالات
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{postsCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              {publishedCount || 0} منشور
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              الأقسام
            </CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categoriesCount || 0}</div>
            <p className="text-xs text-muted-foreground">قسم نشط</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              المشاهدات
            </CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews.toLocaleString('ar-SA')}</div>
            <p className="text-xs text-muted-foreground">مشاهدة إجمالية</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              بانتظار المراجعة
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(pendingComments || 0) + (unreadMessages || 0)}</div>
            <p className="text-xs text-muted-foreground">
              {pendingComments || 0} تعليق، {unreadMessages || 0} رسالة
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Posts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>أحدث المقالات</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/posts">عرض الكل</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentPosts && recentPosts.length > 0 ? (
              <div className="space-y-4">
                {(recentPosts as Post[]).map((post) => (
                  <div key={post.id} className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/admin/posts/${post.id}`}
                        className="font-medium hover:text-primary line-clamp-1"
                      >
                        {post.title}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {formatRelativeDate(post.created_at)}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        post.status === 'published'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}
                    >
                      {post.status === 'published' ? 'منشور' : 'مسودة'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                لا توجد مقالات بعد
              </p>
            )}
          </CardContent>
        </Card>

        {/* Pending Comments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>تعليقات بانتظار الموافقة</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/comments">عرض الكل</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {pendingCommentsList && pendingCommentsList.length > 0 ? (
              <div className="space-y-4">
                {(pendingCommentsList as Comment[]).map((comment) => (
                  <div key={comment.id} className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm line-clamp-2">{comment.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {comment.guest_name || 'زائر'} - {formatRelativeDate(comment.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                لا توجد تعليقات معلقة
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
