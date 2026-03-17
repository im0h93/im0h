'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

interface DeletePostButtonProps {
  postId: string
}

export function DeletePostButton({ postId }: DeletePostButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('هل أنت متأكد من حذف هذا المقال؟')) return

    setIsDeleting(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.from('posts').delete().eq('id', postId)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('حدث خطأ أثناء حذف المقال')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-destructive hover:text-destructive"
    >
      <Trash2 className="h-4 w-4" />
      <span className="sr-only">حذف</span>
    </Button>
  )
}
