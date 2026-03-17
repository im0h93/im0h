import Link from 'next/link'
import type { Category } from '@/lib/types'

interface FooterProps {
  categories: Category[]
}

export function Footer({ categories }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-xl">
                م
              </div>
              <span className="font-bold text-xl">مكسب</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              منصة عربية متخصصة في نشر المحتوى التقني والتعليمي الهادف. نسعى لتقديم محتوى عربي أصيل يساعد القراء على التطور.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4">الأقسام</h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/category/${category.slug}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <span className="ml-1">{category.emoji}</span>
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/posts"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  جميع المقالات
                </Link>
              </li>
              <li>
                <Link
                  href="/page/about"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  من نحن
                </Link>
              </li>
              <li>
                <Link
                  href="/page/archive"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  الأرشيف
                </Link>
              </li>
              <li>
                <Link
                  href="/search"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  البحث
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">الدعم</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/page/contact"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  اتصل بنا
                </Link>
              </li>
              <li>
                <Link
                  href="/page/feedback"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  الملاحظات والشكاوى
                </Link>
              </li>
              <li>
                <Link
                  href="/page/privacy"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  سياسة الخصوصية
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-border my-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>
            جميع الحقوق محفوظة &copy; {currentYear} مكسب | MAKSAB
          </p>
          <p>
            صُنع بكل حب للمحتوى العربي
          </p>
        </div>
      </div>
    </footer>
  )
}
