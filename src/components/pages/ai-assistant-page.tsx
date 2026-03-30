'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Send, Loader2, Bot, User, Copy, Check, Table } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: Date
}

// Parse markdown-like content and render properly
function formatMessageContent(content: string) {
  // First, extract and handle tables
  const tableRegex = /(\|[^\n]+\|\n)+/g
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let partIndex = 0

  const tables: { start: number; end: number; content: string }[] = []
  let match
  while ((match = tableRegex.exec(content)) !== null) {
    tables.push({ start: match.index, end: match.index + match[0].length, content: match[0] })
  }

  tables.forEach((table) => {
    if (table.start > lastIndex) {
      const beforeContent = content.slice(lastIndex, table.start)
      parts.push(<TextContent key={partIndex++} content={beforeContent} />)
    }
    parts.push(<TableBlock key={partIndex++} markdown={table.content} />)
    lastIndex = table.end
  })

  if (lastIndex < content.length) {
    const afterContent = content.slice(lastIndex)
    parts.push(<TextContent key={partIndex++} content={afterContent} />)
  }

  return parts.length > 0 ? parts : <TextContent content={content} />
}

function TableBlock({ markdown }: { markdown: string }) {
  const [copied, setCopied] = React.useState(false)
  const { toast } = useToast()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdown.trim())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({ title: 'Disalin!', description: 'Tabel berhasil disalin' })
    } catch (err) {
      toast({ title: 'Gagal', description: 'Tidak dapat menyalin', variant: 'destructive' })
    }
  }

  const lines = markdown.trim().split('\n').filter(line => line.trim())
  if (lines.length < 2) return null

  const headerCells = lines[0].split('|').filter(c => c.trim()).map(c => c.trim())
  const bodyLines = lines.slice(2)
  const bodyRows = bodyLines.map(line => 
    line.split('|').filter(c => c.trim()).map(c => c.trim())
  )

  if (headerCells.length === 0) return null

  return (
    <div className="my-2 rounded-lg overflow-hidden border border-border/50 bg-muted/30 max-w-full">
      <div className="flex items-center justify-between px-2 py-1 bg-muted/50 border-b border-border/50">
        <span className="text-[10px] text-muted-foreground">Tabel</span>
        <Button variant="ghost" size="sm" className="h-5 px-1.5" onClick={handleCopy}>
          {copied ? <Check className="size-2.5" /> : <Copy className="size-2.5" />}
        </Button>
      </div>
      <div className="overflow-x-auto max-w-full scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        <table className="text-xs" style={{ minWidth: '100%' }}>
          <thead>
            <tr className="border-b border-border/50">
              {headerCells.map((cell, index) => (
                <th key={index} className="px-2 py-1.5 text-left font-medium whitespace-nowrap">
                  {formatInline(cell)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bodyRows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-border/30 last:border-0">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-2 py-1.5 whitespace-nowrap">
                    {formatInline(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = React.useState(false)
  const { toast } = useToast()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({ title: 'Disalin!', description: 'Kode berhasil disalin' })
    } catch (err) {
      toast({ title: 'Gagal', description: 'Tidak dapat menyalin', variant: 'destructive' })
    }
  }

  return (
    <div className="my-2 rounded-lg overflow-hidden border border-border/50 bg-muted/30 max-w-full">
      <div className="flex items-center justify-between px-2 py-1 bg-muted/50 border-b border-border/50">
        <span className="text-[10px] text-muted-foreground font-mono">{language || 'code'}</span>
        <Button variant="ghost" size="sm" className="h-5 px-1.5" onClick={handleCopy}>
          {copied ? <Check className="size-2.5" /> : <Copy className="size-2.5" />}
        </Button>
      </div>
      <pre className="p-2 overflow-x-auto text-[10px] max-w-full">
        <code className="font-mono whitespace-pre-wrap break-words">{code}</code>
      </pre>
    </div>
  )
}

function TextContent({ content }: { content: string }) {
  const parts = content.split(/(```[\s\S]*?```)/g)
  
  return (
    <div className="whitespace-pre-wrap break-words">
      {parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const codeContent = part.slice(3, -3)
          const firstLine = codeContent.split('\n')[0]
          const language = firstLine.match(/^\w+$/) ? firstLine : ''
          const code = language ? codeContent.slice(firstLine.length + 1) : codeContent
          return <CodeBlock key={index} code={code} language={language} />
        }
        return <TextLines key={index} content={part} />
      })}
    </div>
  )
}

function TextLines({ content }: { content: string }) {
  const lines = content.split('\n')
  
  return (
    <>
      {lines.map((line, lineIndex) => {
        // Skip table lines
        if (line.includes('|') && line.trim().startsWith('|')) {
          return null
        }
        // Numbered list
        if (line.match(/^\d+\.\s/)) {
          return <div key={lineIndex} className="text-xs pl-3 -indent-2">{formatInline(line)}</div>
        }
        // Bullet list
        if (line.startsWith('- ')) {
          return <div key={lineIndex} className="text-xs pl-3 -indent-2">• {formatInline(line.slice(2))}</div>
        }
        if (line.startsWith('• ')) {
          return <div key={lineIndex} className="text-xs pl-3 -indent-2">{formatInline(line)}</div>
        }
        if (!line.trim()) {
          return <div key={lineIndex} className="h-0.5" />
        }
        // Render ## as bold text (not heading)
        if (line.startsWith('## ')) {
          return <p key={lineIndex} className="text-xs font-semibold mt-1">{formatInline(line.slice(3))}</p>
        }
        if (line.startsWith('### ')) {
          return <p key={lineIndex} className="text-xs font-medium mt-1">{formatInline(line.slice(4))}</p>
        }
        return <p key={lineIndex} className="text-xs">{formatInline(line)}</p>
      })}
    </>
  )
}

function formatInline(text: string): React.ReactNode {
  text = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
  text = text.replace(/\*(.*?)\*/g, '<i>$1</i>')
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>')
  
  const parts = text.split(/(<[bi]>.*?<\/[bi]>|<code>.*?<\/code>)/g)
  
  return parts.map((part, index) => {
    if (part.startsWith('<b>') && part.endsWith('</b>')) {
      return <strong key={index} className="font-medium">{part.slice(3, -4)}</strong>
    }
    if (part.startsWith('<i>') && part.endsWith('</i>')) {
      return <em key={index}>{part.slice(3, -4)}</em>
    }
    if (part.startsWith('<code>') && part.endsWith('</code>')) {
      return <code key={index} className="px-1 py-0.5 rounded bg-muted/70 text-[10px] font-mono">{part.slice(6, -7)}</code>
    }
    return part
  })
}

const MAX_HISTORY = 5

export function AIAssistantPage() {
  const [messages, setMessages] = React.useState<Message[]>([])
  const [input, setInput] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  React.useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      createdAt: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const historyMessages = messages
        .slice(-MAX_HISTORY)
        .map(m => ({ role: m.role, content: m.content }))

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: input.trim(),
          history: historyMessages
        }),
      })

      const data = await response.json()

      if (response.ok && data.response) {
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: data.response,
          createdAt: new Date(),
        }
        setMessages(prev => [...prev, assistantMessage])
      } else {
        throw new Error(data.error || 'Failed to get response')
      }
    } catch (error) {
      console.error('AI Error:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Gagal mendapatkan respons.',
        variant: 'destructive',
      })
      setMessages(prev => prev.filter(m => m.id !== userMessage.id))
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full w-full min-h-0">
      {/* Header */}
      <div className="flex items-center gap-2 p-3 border-b bg-card shrink-0">
        <Avatar className="size-10 shrink-0">
          <AvatarFallback className="bg-primary/10 text-primary">
            <Sparkles className="size-5" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate">AI Assistant</h3>
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs text-muted-foreground">Online</span>
          </div>
        </div>
      </div>

      {/* Messages - Scrollable area */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden" ref={scrollRef}>
        <div className="p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <div className="size-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="size-8 text-primary" />
              </div>
              <p className="text-muted-foreground text-sm font-medium">Halo! Ada yang bisa saya bantu?</p>
              <p className="text-muted-foreground/70 text-xs mt-1">Tanyakan apa saja tentang IKMI SOCIAL</p>
            </div>
          ) : (
            messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  'flex gap-1 max-w-[85%]',
                  message.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                )}
              >
                <div className={cn('flex flex-col gap-1', message.role === 'user' ? 'items-end' : 'items-start')}>
                  <div
                    className={cn(
                      'px-4 py-2.5 rounded-2xl',
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-sm'
                        : 'bg-muted rounded-bl-sm'
                    )}
                  >
                    {message.role === 'assistant' ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        {formatMessageContent(message.content)}
                      </div>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="flex gap-1 max-w-[85%] mr-auto"
            >
              <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3">
                <Loader2 className="size-4 animate-spin" />
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="p-3 border-t bg-background shrink-0">
        <div className="flex items-center gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ketik pertanyaan..."
            disabled={isLoading}
            className="flex-1 h-10"
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="size-10 shrink-0"
          >
            {isLoading ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <Send className="size-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
