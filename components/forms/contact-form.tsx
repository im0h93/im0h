'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ContactType } from '@/lib/types'

interface ContactFormProps {
  type?: ContactType
}

export function ContactForm({ type = 'contact' }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: type,
  })
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const titles: Record<ContactType, string> = {
    contact: 'نموذج التواصل',
    complaint: 'نموذج الشكاوى',
    suggestion: 'نموذج الاقتراحات والملاحظات',
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    try {
      const supabase = createClient()

      const { error } = await supabase.from('contact_submissions').insert({
        type: formData.type,
        name: formData.name,
        email: formData.email,
        subject: formData.subject || null,
        message: formData.message,
      })

      if (error) throw error

      setMessage({
        type: 'success',
        text: 'تم إرسال رسالتك بنجاح. سنتواصل معك قريباً.',
      })
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        type: type,
      })
    } catch (err) {
      setMessage({
        type: 'error',
        text: 'حدث خطأ أثناء إرسال الرسالة. حاول مرة أخرى.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{titles[type]}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {type !== 'contact' && (
            <div className="flex flex-wrap gap-2 mb-4">
              {(['contact', 'complaint', 'suggestion'] as const).map((t) => (
                <Button
                  key={t}
                  type="button"
                  variant={formData.type === t ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFormData({ ...formData, type: t })}
                >
                  {t === 'contact' && 'تواصل'}
                  {t === 'complaint' && 'شكوى'}
                  {t === 'suggestion' && 'اقتراح'}
                </Button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              placeholder="الاسم الكامل"
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

          <Input
            placeholder="الموضوع (اختياري)"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          />

          <Textarea
            placeholder="رسالتك..."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            required
            className="min-h-[150px]"
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

          <Button type="submit" disabled={isSubmitting} className="w-full">
            <Send className="h-4 w-4 ml-2" />
            {isSubmitting ? 'جاري الإرسال...' : 'إرسال'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
