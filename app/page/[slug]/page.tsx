import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { MainLayout } from '@/components/layout/main-layout'
import { ContactForm } from '@/components/forms/contact-form'
import type { StaticPage } from '@/lib/types'

interface StaticPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: StaticPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: page } = await supabase
    .from('static_pages')
    .select('title, meta_description')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!page) {
    return {
      title: 'الصفحة غير موجودة | مكسب',
    }
  }

  return {
    title: `${page.title} | مكسب`,
    description: page.meta_description || page.title,
  }
}

export default async function StaticPageRoute({ params }: StaticPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: page } = await supabase
    .from('static_pages')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!page) {
    notFound()
  }

  const typedPage = page as StaticPage
  const isContactPage = slug === 'contact' || slug === 'feedback'

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            {typedPage.title}
          </h1>

          <div
            className="prose-ar mb-12"
            dangerouslySetInnerHTML={{ __html: typedPage.content }}
          />

          {isContactPage && (
            <ContactForm type={slug === 'feedback' ? 'suggestion' : 'contact'} />
          )}
        </div>
      </div>
    </MainLayout>
  )
}
