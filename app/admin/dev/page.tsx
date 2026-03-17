'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport, UIMessage } from 'ai'
import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Send,
  Bot,
  User,
  Code2,
  Sparkles,
  Copy,
  Check,
  Trash2,
  RotateCcw,
} from 'lucide-react'

function getMessageText(message: UIMessage): string {
  if (!message.parts || !Array.isArray(message.parts)) return ''
  return message.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map((p) => p.text)
    .join('')
}

function CodeBlock({ code, language }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative my-3 rounded-lg border border-border bg-muted/50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted">
        <span className="text-xs text-muted-foreground font-mono">
          {language || 'code'}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="h-7 px-2"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-green-500" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm" dir="ltr">
        <code>{code}</code>
      </pre>
    </div>
  )
}

function MessageContent({ content }: { content: string }) {
  const parts = content.split(/(```[\s\S]*?```)/g)

  return (
    <div className="prose prose-sm max-w-none dark:prose-invert">
      {parts.map((part, index) => {
        if (part.startsWith('```')) {
          const match = part.match(/```(\w+)?\n([\s\S]*?)```/)
          if (match) {
            const [, language, code] = match
            return <CodeBlock key={index} code={code.trim()} language={language} />
          }
        }
        return (
          <div
            key={index}
            className="whitespace-pre-wrap"
            dangerouslySetInnerHTML={{
              __html: part
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/`([^`]+)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm">$1</code>')
                .replace(/\n/g, '<br />'),
            }}
          />
        )
      })}
    </div>
  )
}

export default function DevPage() {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: '/api/ai/chat' }),
  })

  const isLoading = status === 'streaming' || status === 'submitted'

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    sendMessage({ text: input })
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const quickPrompts = [
    { icon: Code2, label: 'مراجعة كود', prompt: 'راجع هذا الكود واقترح تحسينات:' },
    { icon: Sparkles, label: 'توليد مكون', prompt: 'أنشئ مكون React لـ:' },
    { icon: Bot, label: 'شرح مفهوم', prompt: 'اشرح لي مفهوم:' },
  ]

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-foreground">مركز التطوير</h1>
        <p className="text-muted-foreground">
          مساعد ذكي للبرمجة يساعدك في كتابة ومراجعة الكود
        </p>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden glass">
        <CardHeader className="border-b border-border/50 py-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              المحادثة
            </CardTitle>
            {messages.length > 0 && (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMessages([])}
                  className="h-8 text-xs"
                >
                  <Trash2 className="h-3.5 w-3.5 ml-1" />
                  مسح
                </Button>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">مرحباً بك في مركز التطوير</h3>
              <p className="text-muted-foreground text-sm mb-6 max-w-md">
                أنا مساعدك البرمجي الذكي. يمكنني مساعدتك في كتابة الكود، مراجعته،
                وشرح المفاهيم البرمجية.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {quickPrompts.map((item, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setInput(item.prompt)}
                    className="h-9"
                  >
                    <item.icon className="h-4 w-4 ml-2" />
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => {
              const text = getMessageText(message)
              return (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  <div
                    className={`flex-1 max-w-[85%] rounded-xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/50 border border-border/50'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <p className="whitespace-pre-wrap">{text}</p>
                    ) : (
                      <MessageContent content={text} />
                    )}
                  </div>
                </div>
              )
            })
          )}

          {isLoading && messages[messages.length - 1]?.role === 'user' && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-muted/50 border border-border/50 rounded-xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">جاري الكتابة...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </CardContent>

        <div className="border-t border-border/50 p-4">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="اكتب سؤالك أو الكود الذي تريد مساعدة فيه..."
              className="min-h-[60px] max-h-[200px] resize-none"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              className="h-[60px] w-[60px]"
              disabled={!input.trim() || isLoading}
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}
