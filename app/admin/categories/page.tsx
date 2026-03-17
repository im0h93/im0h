'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Save, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { slugify } from '@/lib/utils'
import type { Category } from '@/lib/types'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    emoji: '',
    color: '#10b981',
    description: '',
  })

  const fetchCategories = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order')

    setCategories((data as Category[]) || [])
    setIsLoading(false)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: editingId ? formData.slug : slugify(name),
    })
  }

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      emoji: '',
      color: '#10b981',
      description: '',
    })
    setEditingId(null)
    setIsAdding(false)
  }

  const startEditing = (category: Category) => {
    setFormData({
      name: category.name,
      slug: category.slug,
      emoji: category.emoji,
      color: category.color,
      description: category.description || '',
    })
    setEditingId(category.id)
    setIsAdding(false)
  }

  const handleSave = async () => {
    if (!formData.name || !formData.slug) {
      alert('يرجى إدخال الاسم والرابط')
      return
    }

    try {
      const supabase = createClient()

      if (editingId) {
        const { error } = await supabase
          .from('categories')
          .update({
            name: formData.name,
            slug: formData.slug,
            emoji: formData.emoji || null,
            color: formData.color,
            description: formData.description || null,
          })
          .eq('id', editingId)

        if (error) throw error
      } else {
        const { error } = await supabase.from('categories').insert({
          name: formData.name,
          slug: formData.slug,
          emoji: formData.emoji || null,
          color: formData.color,
          description: formData.description || null,
          sort_order: categories.length + 1,
        })

        if (error) throw error
      }

      resetForm()
      fetchCategories()
    } catch (error) {
      console.error('Error saving category:', error)
      alert('حدث خطأ أثناء حفظ القسم')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا القسم؟')) return

    try {
      const supabase = createClient()
      const { error } = await supabase.from('categories').delete().eq('id', id)

      if (error) throw error

      fetchCategories()
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('حدث خطأ أثناء حذف القسم')
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">الأقسام</h1>
          <p className="text-muted-foreground">إدارة أقسام المقالات</p>
        </div>
        {!isAdding && !editingId && (
          <Button onClick={() => setIsAdding(true)}>
            <Plus className="h-4 w-4 ml-2" />
            قسم جديد
          </Button>
        )}
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'تعديل القسم' : 'إضافة قسم جديد'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">الاسم</label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="اسم القسم"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">الرابط</label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="رابط-القسم"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">الرمز التعبيري</label>
                <Input
                  value={formData.emoji}
                  onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                  placeholder="مثال: 💻"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">اللون</label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="#10b981"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">الوصف (اختياري)</label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="وصف مختصر للقسم"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 ml-2" />
                حفظ
              </Button>
              <Button variant="outline" onClick={resetForm}>
                <X className="h-4 w-4 ml-2" />
                إلغاء
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Categories List */}
      <Card>
        <CardContent className="p-0">
          {categories.length > 0 ? (
            <div className="divide-y divide-border">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="h-10 w-10 rounded-lg flex items-center justify-center text-xl"
                      style={{ backgroundColor: category.color + '20' }}
                    >
                      {category.emoji || '📁'}
                    </div>
                    <div>
                      <h3 className="font-medium">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">/{category.slug}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => startEditing(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(category.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">لا توجد أقسام بعد</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
