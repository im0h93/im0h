'use client'

import { useState, useEffect } from 'react'
import { Mail, MailOpen, Check, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatRelativeDate } from '@/lib/utils'
import type { ContactSubmission, ContactType } from '@/lib/types'

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactSubmission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread' | 'resolved'>('unread')
  const [selectedMessage, setSelectedMessage] = useState<ContactSubmission | null>(null)

  const fetchMessages = async () => {
    const supabase = createClient()

    let query = supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false })

    if (filter === 'unread') {
      query = query.eq('is_read', false)
    } else if (filter === 'resolved') {
      query = query.eq('is_resolved', true)
    }

    const { data } = await query

    setMessages((data as ContactSubmission[]) || [])
    setIsLoading(false)
  }

  useEffect(() => {
    fetchMessages()
  }, [filter])

  const typeLabels: Record<ContactType, { label: string; color: string }> = {
    contact: { label: 'تواصل', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
    complaint: { label: 'شكوى', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
    suggestion: { label: 'اقتراح', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  }

  const handleRead = async (id: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('contact_submissions')
        .update({ is_read: true })
        .eq('id', id)

      if (error) throw error

      fetchMessages()
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  const handleResolve = async (id: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('contact_submissions')
        .update({ is_resolved: true, is_read: true })
        .eq('id', id)

      if (error) throw error

      setSelectedMessage(null)
      fetchMessages()
    } catch (error) {
      console.error('Error resolving message:', error)
      alert('حدث خطأ')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الرسالة؟')) return

    try {
      const supabase = createClient()
      const { error } = await supabase.from('contact_submissions').delete().eq('id', id)

      if (error) throw error

      setSelectedMessage(null)
      fetchMessages()
    } catch (error) {
      console.error('Error deleting message:', error)
      alert('حدث خطأ أثناء حذف الرسالة')
    }
  }

  const openMessage = (message: ContactSubmission) => {
    setSelectedMessage(message)
    if (!message.is_read) {
      handleRead(message.id)
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
        <h1 className="text-3xl font-bold">الرسائل</h1>
        <p className="text-muted-foreground">رسائل التواصل والشكاوى والاقتراحات</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'unread' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('unread')}
        >
          غير مقروءة
        </Button>
        <Button
          variant={filter === 'resolved' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('resolved')}
        >
          المحلولة
        </Button>
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          الكل
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-0">
              {messages.length > 0 ? (
                <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
                  {messages.map((message) => (
                    <button
                      key={message.id}
                      onClick={() => openMessage(message)}
                      className={`w-full text-right p-4 hover:bg-muted/50 transition-colors ${
                        selectedMessage?.id === message.id ? 'bg-muted' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {message.is_read ? (
                          <MailOpen className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Mail className="h-4 w-4 text-primary" />
                        )}
                        <span className={`font-medium ${!message.is_read ? 'text-primary' : ''}`}>
                          {message.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${typeLabels[message.type].color}`}>
                          {typeLabels[message.type].label}
                        </span>
                        {message.is_resolved && (
                          <Badge variant="secondary" className="text-xs">
                            محلولة
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {message.subject || message.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatRelativeDate(message.created_at)}
                      </p>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">لا توجد رسائل</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">{selectedMessage.name}</h2>
                    <p className="text-muted-foreground">{selectedMessage.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${typeLabels[selectedMessage.type].color}`}>
                      {typeLabels[selectedMessage.type].label}
                    </span>
                  </div>
                </div>

                {selectedMessage.subject && (
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-1">الموضوع</h3>
                    <p>{selectedMessage.subject}</p>
                  </div>
                )}

                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">الرسالة</h3>
                  <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>

                <div className="text-sm text-muted-foreground">
                  {formatRelativeDate(selectedMessage.created_at)}
                </div>

                <div className="flex gap-2 pt-4 border-t border-border">
                  {!selectedMessage.is_resolved && (
                    <Button onClick={() => handleResolve(selectedMessage.id)}>
                      <Check className="h-4 w-4 ml-2" />
                      تم الحل
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(selectedMessage.id)}
                  >
                    <Trash2 className="h-4 w-4 ml-2" />
                    حذف
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Mail className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">
                  اختر رسالة لعرض التفاصيل
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
