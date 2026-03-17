export type UserRole = 'admin' | 'editor' | 'moderator' | 'user'

export interface Profile {
  id: string
  display_name: string | null
  avatar_url: string | null
  role: UserRole
  bio: string | null
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  emoji: string
  color: string
  sort_order: number
  created_at: string
}

export type PostStatus = 'draft' | 'published' | 'archived'

export interface Post {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  cover_image: string | null
  category_id: string | null
  author_id: string
  status: PostStatus
  featured: boolean
  views: number
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface PostWithRelations extends Post {
  category: Category | null
  author: Profile
}

export interface StaticPage {
  id: string
  title: string
  slug: string
  content: string
  meta_description: string | null
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface Comment {
  id: string
  post_id: string
  author_id: string | null
  guest_name: string | null
  guest_email: string | null
  content: string
  is_approved: boolean
  created_at: string
}

export interface CommentWithAuthor extends Comment {
  author: Profile | null
}

export type ContactType = 'contact' | 'complaint' | 'suggestion'

export interface ContactSubmission {
  id: string
  type: ContactType
  name: string
  email: string
  subject: string | null
  message: string
  is_read: boolean
  is_resolved: boolean
  created_at: string
}
