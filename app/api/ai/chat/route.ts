import { streamText, convertToModelMessages, UIMessage } from 'ai'

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: 'openai/gpt-4o-mini',
    system: `أنت مساعد برمجة متخصص يتحدث العربية. أنت خبير في:
- تطوير الويب (React, Next.js, TypeScript, Tailwind CSS)
- قواعد البيانات (PostgreSQL, Supabase)
- أفضل ممارسات البرمجة
- تحسين الأداء والأمان

قدم إجابات واضحة ومفصلة باللغة العربية مع أمثلة كود عند الحاجة.
اكتب الكود بشكل منسق وقابل للقراءة.
اشرح المفاهيم البرمجية بطريقة سهلة الفهم.`,
    messages: await convertToModelMessages(messages),
  })

  return result.toUIMessageStreamResponse()
}
