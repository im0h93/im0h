'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Check, X, Trash2, ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatRelativeDate } from '@/lib/utils'

interface CommentWithPost {
  id: string
  content: string
  guest_name: string | null
  guest_email: string | null
  is_approved: boolean
  created_at: string
  post: {
    id: string
    title: string
    slug: string
  }
  author: {
    display_name: string | null
  } | null
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<CommentWithPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('pending')

  const fetchComments = async () => {
    const supabase = createClient()

    let query = supabase
      .from('comments')
      .select(`
        *,
        post:posts(id, title, slug),
        author:profiles(display_name)
      `)
      .order('created_at', { ascending: false })

    if (filter === 'pending') {
      query = query.eq('is_approved', false)
    } else if (filter === 'approved') {
      query = query.eq('is_approved', true)
    }

    const { data } = await query

    setComments((data as CommentWithPost[]) || [])
    setIsLoading(false)
  }

  useEffect(() => {
    fetchComments()
  }, [filter])

  const handleApprove = async (id: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('comments')
        .update({ is_approved: true })
        .eq('id', id)

      if (error) throw error

      fetchComments()
    } catch (error) {
      console.error('Error approving comment:', error)
      alert('حدث خطأ أثناء الموافقة على التعليق')
    }
  }

  const handleReject = async (id: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('comments')
        .update({ is_approved: false })
        .eq('id', id)

      if (error) throw error

      fetchComments()
    } catch (error) {
      console.error('Error rejecting comment:', error)
      alert('حدث خطأ أثناء رفض التعليق')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا التعليق؟')) return

    try {
      const supabase = createClient()
      const { error } = await supabase.from('comments').delete().eq('id', id)

      if (error) throw error

      fetchComments()
    } catch (error) {
      console.error('Error deleting comment:', error)
      alert('حدث خطأ أثناء حذف التعليق')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">جاري التحميل...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">التعليقات</h1>
        <p className="text-muted-foreground">إدارة تعليقات المقالات</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'pending' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('pending')}
        >
          بانتظار الموافقة
        </Button>
        <Button
          variant={filter === 'approved' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('approved')}
        >
          الموافق عليها
        </Button>
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          الكل
        </Button>
      </div>

      {/* Comments List */}
      <Card>
        <CardContent className="p-0">
          {comments.length > 0 ? (
            <div className="divide-y divide-border">
              {comments.map((comment) => (
                <div key={comment.id} className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">
                          {comment.author?.display_name || comment.guest_name || 'زائر'}
                        </span>
                        {comment.guest_email && (
                          <span className="text-sm text-muted-foreground">
                            ({comment.guest_email})
                          </span>
                        )}
                        <Badge variant={comment.is_approved ? 'default' : 'secondary'}>
                          {comment.is_approved ? 'موافق عليه' : 'معلق'}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-2">{comment.content}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{formatRelativeDate(comment.created_at)}</span>
                        {comment.post && (
                          <Link
                            href={`/post/${comment.post.slug}`}
                            target="_blank"
                            className="flex items-center gap-1 hover:text-primary"
                          >
                            {comment.post.title}
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {!comment.is_approved && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleApprove(comment.id)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      {comment.is_approved && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleReject(comment.id)}
                          className="text-yellow-600 hover:text-yellow-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(comment.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {filter === 'pending'
                  ? 'لا توجد تعليقات معلقة'
                  : 'لا توجد تعليقات'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
