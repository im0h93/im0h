import Link from 'next/link'
import { Mail, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-primary/5 to-transparent">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">تحقق من بريدك الإلكتروني</CardTitle>
          <CardDescription>
            تم إرسال رابط التفعيل إلى بريدك الإلكتروني
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            يرجى فتح بريدك الإلكتروني والنقر على رابط التفعيل لإكمال عملية التسجيل.
          </p>
          <p className="text-sm text-muted-foreground">
            لم تستلم الرسالة؟ تحقق من مجلد البريد المزعج.
          </p>
          <Button asChild className="mt-4">
            <Link href="/auth/login">
              <ArrowRight className="h-4 w-4 ml-2" />
              العودة لتسجيل الدخول
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
