import Link from 'next/link'
import { AlertCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-destructive/5 to-transparent">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">حدث خطأ</CardTitle>
          <CardDescription>
            عذراً، حدث خطأ أثناء عملية المصادقة
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            يرجى المحاولة مرة أخرى. إذا استمرت المشكلة، تواصل معنا للحصول على المساعدة.
          </p>
          <div className="flex flex-col gap-2">
            <Button asChild>
              <Link href="/auth/login">
                <ArrowRight className="h-4 w-4 ml-2" />
                العودة لتسجيل الدخول
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">
                العودة للصفحة الرئيسية
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
