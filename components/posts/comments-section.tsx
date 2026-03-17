'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { User, MessageCircle, Send } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatRelativeDate } from '@/lib/utils'
import type { CommentWithAuthor } from '@/lib/types'

interface CommentsSectionProps {
  postId: string
}

const fetcher = async (postId: string): Promise<CommentWithAuthor[]> => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      author:profiles(*)
    `)
    .eq('post_id', postId)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as CommentWithAuthor[]
}

export function CommentsSection({ postId }: CommentsSectionProps) {
  const { data: comments, error, mutate } = useSWR(postId, fetcher)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    content: '',
  })
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    try {
      const supabase = createClient()

      // Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser()

      const commentData = {
        post_id: postId,
        content: formData.content,
        author_id: user?.id || null,
        guest_name: user ? null : formData.name,
        guest_email: user ? null : formData.email,
      }

      const { error } = await supabase.from('comments').insert(commentData)

      if (error) throw error

      setMessage({
        type: 'success',
        text: 'تم إرسال تعليقك بنجاح. سيظهر بعد الموافقة عليه.',
      })
      setFormData({ name: '', email: '', content: '' })
      mutate()
    } catch (err) {
      setMessage({
        type: 'error',
        text: 'حدث خطأ أثناء إرسال التعليق. حاول مرة أخرى.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="comments">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            التعليقات ({comments?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Comment Form */}
          <form onSubmit={handleSubmit} className="mb-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                placeholder="الاسم"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                type="email"
                placeholder="البريد الإلكتروني"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <Textarea
              placeholder="اكتب تعليقك هنا..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
            />
            {message && (
              <p
                className={`text-sm ${
                  message.type === 'success' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {message.text}
              </p>
            )}
            <Button type="submit" disabled={isSubmitting}>
              <Send className="h-4 w-4 ml-2" />
              {isSubmitting ? 'جاري الإرسال...' : 'إرسال التعليق'}
            </Button>
          </form>

          {/* Comments List */}
          {error ? (
            <p className="text-center text-muted-foreground py-8">
              حدث خطأ أثناء تحميل التعليقات
            </p>
          ) : !comments ? (
            <p className="text-center text-muted-foreground py-8">
              جاري التحميل...
            </p>
          ) : comments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              لا توجد تعليقات بعد. كن أول من يعلق!
            </p>
          ) : (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">
                        {comment.author?.display_name || comment.guest_name || 'زائر'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatRelativeDate(comment.created_at)}
                      </span>
                    </div>
                    <p className="text-muted-foreground">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
