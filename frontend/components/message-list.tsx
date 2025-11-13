"use client"

import { useEffect, useRef, memo, useCallback } from "react"
import { Volume2, User, Bot, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'

interface Message {
  id: string
  text: string
  audio?: string
  sender: "user" | "assistant"
  timestamp: Date
  isStreaming?: boolean
}

interface MessageListProps {
  messages: Message[]
  isThinking?: boolean
  isListening?: boolean
  isSpeaking?: boolean
  currentTranscript?: string
}

function MessageList({ messages, isThinking, isListening, isSpeaking, currentTranscript }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Use requestAnimationFrame for smoother scrolling
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
    }
    requestAnimationFrame(scrollToBottom)
  }, [messages.length]) // Only depend on message count, not content

  const playAudio = useCallback((base64Audio: string) => {
    const audio = new Audio(`data:audio/mp3;base64,${base64Audio}`)
    audio.preload = 'auto' // Preload for faster playback
    audio.play().catch(console.error)
  }, [])

  const TypingIndicator = () => (
    <div className="flex gap-3 sm:gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <Avatar className="h-8 w-8 sm:h-10 sm:w-10 shrink-0 bg-gradient-to-br from-green-600 to-emerald-600 border-2 border-green-200 shadow-sm animate-pulse">
        <AvatarFallback className="text-white">
          <Bot className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col gap-1.5 max-w-[70%] sm:max-w-[75%]">
        <div className="rounded-2xl px-4 py-3 sm:px-5 sm:py-4 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200/50 rounded-tl-sm shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex gap-1 sm:gap-1.5">
              <div className="h-2 w-2 rounded-full bg-green-600 animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="h-2 w-2 rounded-full bg-green-600 animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="h-2 w-2 rounded-full bg-green-600 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            <span className="text-sm text-green-700 font-medium">
              {isSpeaking ? "🔊 AI is speaking..." : "⚡ AI is thinking..."}
            </span>
          </div>
        </div>
      </div>
    </div>
  )

  const LiveTranscript = () => (
    <div className="flex gap-3 sm:gap-4 flex-row-reverse animate-in fade-in slide-in-from-bottom-4 duration-300">
      <Avatar className="h-8 w-8 sm:h-10 sm:w-10 shrink-0 bg-gradient-to-br from-green-600 to-green-700 border-2 border-green-200 shadow-sm animate-pulse">
        <AvatarFallback className="text-white">
          <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col gap-1.5 max-w-[70%] sm:max-w-[75%] items-end">
        <div className="rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 bg-gradient-to-br from-green-600 to-green-700 text-white rounded-tr-sm shadow-lg border-2 border-green-300/30 hover:shadow-green-500/20 transition-shadow">
          <div className="flex items-center gap-2 sm:gap-3">
            <Loader2 className="h-4 w-4 animate-spin text-white/80" />
            <p className="text-pretty leading-relaxed text-sm sm:text-[15px]">🎤 Listening...</p>
          </div>
        </div>
        <p className="text-xs text-gray-600 px-2 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
          Recording (will auto-stop on silence)
        </p>
      </div>
    </div>
  )

  if (messages.length === 0 && !isThinking && !isListening) return null

  return (
    <div className="space-y-3 sm:space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-green-300/30 scrollbar-track-transparent hover:scrollbar-thumb-green-400/40 transition-colors">
      {messages.map((message, index) => (
        <div
          key={message.id}
          className={`flex gap-3 sm:gap-4 ${message.sender === "user" ? "flex-row-reverse" : "flex-row"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
          style={{ animationDelay: `${Math.min(index * 25, 200)}ms` }}
        >
          <Avatar
            className={`h-8 w-8 sm:h-10 sm:w-10 shrink-0 border-2 shadow-sm transition-all duration-200 hover:scale-105 ${
              message.sender === "user"
                ? "bg-gradient-to-br from-green-600 to-green-700 border-green-200 hover:from-green-700 hover:to-green-800"
                : "bg-gradient-to-br from-green-600 to-emerald-600 border-green-200 hover:from-green-700 hover:to-emerald-700"
            }`}
          >
            <AvatarFallback className="text-white">
              {message.sender === "user" ? <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Bot className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
            </AvatarFallback>
          </Avatar>

          <div className={`flex flex-col gap-1.5 max-w-[70%] sm:max-w-[75%] ${message.sender === "user" ? "items-end" : "items-start"}`}>
            <div
              className={`rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3 shadow-md transition-all duration-200 hover:shadow-lg ${
                message.sender === "user"
                  ? "bg-gradient-to-br from-green-600 to-green-700 text-white rounded-tr-sm border border-green-300/30 hover:shadow-green-500/20"
                  : "bg-gradient-to-br from-green-50 to-emerald-50 text-gray-800 border border-green-200/50 rounded-tl-sm hover:shadow-emerald-500/20"
              } ${message.isStreaming ? "animate-pulse" : ""}`}
            >
              {message.sender === "assistant" ? (
                <div className={`prose prose-sm max-w-none ${message.isStreaming ? "animate-in fade-in duration-200" : ""}`}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeSanitize]}
                    components={{
                      // Style headers
                      h1: ({node, ...props}) => <h1 className="text-base sm:text-lg font-bold text-green-800 mt-2 mb-1" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-sm sm:text-base font-bold text-green-700 mt-2 mb-1" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-sm font-bold text-green-700 mt-1 mb-0.5" {...props} />,
                      // Style paragraphs
                      p: ({node, ...props}) => <p className="text-sm leading-relaxed mb-2 last:mb-0 text-gray-800" {...props} />,
                      // Style lists
                      ul: ({node, ...props}) => <ul className="list-none space-y-1 my-2" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal list-inside space-y-1 my-2 ml-2" {...props} />,
                      li: ({node, ...props}) => <li className="text-sm leading-relaxed text-gray-800 flex items-start gap-2">
                        <span className="text-green-600 mt-1.5">•</span>
                        <span>{props.children}</span>
                      </li>,
                      // Style strong/bold
                      strong: ({node, ...props}) => <strong className="font-bold text-green-800" {...props} />,
                      // Style emphasis/italic
                      em: ({node, ...props}) => <em className="italic text-gray-700" {...props} />,
                      // Style code
                      code: ({node, inline, ...props}: any) =>
                        inline ? (
                          <code className="bg-green-100 text-green-800 px-1.5 py-0.5 rounded text-xs font-mono" {...props} />
                        ) : (
                          <code className="block bg-green-100 text-green-800 p-2 rounded text-xs font-mono my-1 overflow-x-auto" {...props} />
                        ),
                      // Style links
                      a: ({node, ...props}) => <a className="text-green-600 hover:text-green-700 underline font-medium transition-colors" target="_blank" rel="noopener noreferrer" {...props} />,
                      // Style blockquotes
                      blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-green-500 pl-3 my-2 italic text-gray-700 bg-green-50/50 py-1 rounded-r-md" {...props} />,
                    }}
                  >
                    {message.text}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className={`text-pretty leading-relaxed text-sm ${message.isStreaming ? "animate-in fade-in duration-200" : ""}`}>
                  {message.text}
                </p>
              )}

              {message.audio && message.sender === "assistant" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => playAudio(message.audio!)}
                  className="mt-2 h-7 px-2.5 hover:bg-green-200/50 rounded-full transition-all hover:scale-105 text-green-700 hover:text-green-800"
                  title="Play audio response"
                >
                  <Volume2 className="h-3 w-3 mr-1" />
                  <span className="text-xs font-medium">Play</span>
                </Button>
              )}
            </div>

            <p className="text-xs text-gray-500 px-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="h-1 w-1 rounded-full bg-green-400" />
              {message.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      ))}

      {isListening && <LiveTranscript />}

      {isThinking && <TypingIndicator />}

      <div ref={messagesEndRef} />
    </div>
  )
}

// Export memoized component
export default memo(MessageList)
