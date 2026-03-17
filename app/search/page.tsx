'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search as SearchIcon } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { MainLayout } from '@/components/layout/main-layout'
import { PostCard } from '@/components/posts/post-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { PostWithRelations } from '@/lib/types'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<PostWithRelations[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return

    setIsLoading(true)
    setHasSearched(true)

    try {
      const supabase = createClient()

      const { data } = await supabase
        .from('posts')
        .select(`
          *,
          category:categories(*),
          author:profiles(*)
        `)
        .eq('status', 'published')
        .or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%`)
        .order('published_at', { ascending: false })
        .limit(20)

      setResults((data as PostWithRelations[]) || [])
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery)
    }
  }, [initialQuery])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(query)
    // Update URL without navigation
    window.history.replaceState({}, '', `/search?q=${encodeURIComponent(query)}`)
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">
            البحث
          </h1>
          <p className="text-muted-foreground mb-8 text-center">
            ابحث في جميع المقالات المنشورة
          </p>

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="mb-12">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="ابحث عن مقالات..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pr-10 h-12 text-lg"
                />
              </div>
              <Button type="submit" size="lg" disabled={isLoading}>
                {isLoading ? 'جاري البحث...' : 'بحث'}
              </Button>
            </div>
          </form>

          {/* Results */}
          {isLoading ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">جاري البحث...</p>
            </div>
          ) : hasSearched ? (
            results.length > 0 ? (
              <div>
                <p className="text-muted-foreground mb-6">
                  تم العثور على {results.length} نتيجة
                </p>
                <div className="grid grid-cols-1 gap-6">
                  {results.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg mb-2">
                  لم يتم العثور على نتائج
                </p>
                <p className="text-sm text-muted-foreground">
                  جرب كلمات بحث مختلفة
                </p>
              </div>
            )
          ) : (
            <div className="text-center py-16">
              <SearchIcon className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">
                أدخل كلمات البحث للعثور على المقالات
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
