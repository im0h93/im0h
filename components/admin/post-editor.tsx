'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Eye, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RichTextEditor } from './rich-text-editor'
import { slugify } from '@/lib/utils'
import type { Category, Post, PostStatus } from '@/lib/types'

interface PostEditorProps {
  post?: Post
  categories: Category[]
  authorId: string
}

export function PostEditor({ post, categories, authorId }: PostEditorProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const [formData, setFormData] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    cover_image: post?.cover_image || '',
    category_id: post?.category_id || '',
    status: (post?.status || 'draft') as PostStatus,
    featured: post?.featured || false,
  })

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setFormData({
      ...formData,
      title,
      slug: post ? formData.slug : slugify(title),
    })
  }

  const handleSubmit = async (status: PostStatus) => {
    if (!formData.title || !formData.content) {
      alert('يرجى إدخال العنوان والمحتوى')
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClient()

      const postData = {
        title: formData.title,
        slug: formData.slug || slugify(formData.title),
        excerpt: formData.excerpt || null,
        content: formData.content,
        cover_image: formData.cover_image || null,
        category_id: formData.category_id || null,
        author_id: authorId,
        status,
        featured: formData.featured,
        published_at: status === 'published' ? new Date().toISOString() : null,
      }

      if (post) {
        const { error } = await supabase
          .from('posts')
          .update(postData)
          .eq('id', post.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from('posts').insert(postData)

        if (error) throw error
      }

      router.push('/admin/posts')
      router.refresh()
    } catch (error) {
      console.error('Error saving post:', error)
      alert('حدث خطأ أثناء حفظ المقال')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Editor */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardContent className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">العنوان</label>
              <Input
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="عنوان المقال"
                className="text-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">الرابط</label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="رابط-المقال"
                dir="ltr"
                className="text-left"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">المقتطف</label>
              <Textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="وصف مختصر للمقال (اختياري)"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>المحتوى</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
            >
              <Eye className="h-4 w-4 ml-2" />
              {showPreview ? 'المحرر' : 'معاينة'}
            </Button>
          </CardHeader>
          <CardContent>
            {showPreview ? (
              <div
                className="prose-ar min-h-[400px] p-4 border border-input rounded-lg"
                dangerouslySetInnerHTML={{ __html: formData.content }}
              />
            ) : (
              <RichTextEditor
                content={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
                placeholder="ابدأ كتابة المقال هنا..."
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>النشر</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => handleSubmit('published')}
                disabled={isLoading}
              >
                <Save className="h-4 w-4 ml-2" />
                {isLoading ? 'جاري الحفظ...' : 'نشر'}
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSubmit('draft')}
                disabled={isLoading}
              >
                حفظ كمسودة
              </Button>
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded border-input"
                />
                <span className="text-sm">مقال مميز</span>
              </label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>القسم</CardTitle>
          </CardHeader>
          <CardContent>
            <select
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm"
            >
              <option value="">بدون قسم</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.emoji} {category.name}
                </option>
              ))}
            </select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>صورة الغلاف</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              value={formData.cover_image}
              onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
              placeholder="رابط صورة الغلاف"
              dir="ltr"
            />
            {formData.cover_image && (
              <div className="mt-4 aspect-video rounded-lg overflow-hidden bg-muted">
                <img
                  src={formData.cover_image}
                  alt="معاينة الغلاف"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Button variant="ghost" className="w-full" onClick={() => router.back()}>
          <ArrowRight className="h-4 w-4 ml-2" />
          إلغاء
        </Button>
      </div>
    </div>
  )
}
