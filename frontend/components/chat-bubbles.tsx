"use client"

import { motion } from "framer-motion"
import { Check, CheckCheck, Clock, Play, Pause, Volume2 } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"

export interface ChatMessage {
  id: string
  text: string
  audio?: string
  sender: "user" | "assistant"
  timestamp: Date
  status?: "sending" | "sent" | "heard"
  additionalInfo?: any
}

interface ChatBubblesProps {
  messages: ChatMessage[]
  language?: string
}

function MessageBubble({ message, language }: { message: ChatMessage; language?: string }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const isUser = message.sender === "user"

  useEffect(() => {
    if (message.audio && !audioRef.current) {
      audioRef.current = new Audio(`data:audio/mp3;base64,${message.audio}`)
      audioRef.current.addEventListener('ended', () => setIsPlaying(false))
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [message.audio])

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const getStatusIcon = () => {
    if (!isUser) return null
    
    switch (message.status) {
      case 'sending':
        return <Clock className="h-3 w-3" />
      case 'sent':
        return <Check className="h-3 w-3" />
      case 'heard':
        return <CheckCheck className="h-3 w-3 text-blue-500" />
      default:
        return <CheckCheck className="h-3 w-3" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        {/* Message Bubble */}
        <motion.div
          className={`relative px-4 py-3 rounded-2xl shadow-md ${
            isUser
              ? 'bg-green-600 text-white rounded-br-sm'
              : 'bg-white text-gray-800 rounded-bl-sm border border-gray-200'
          }`}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          {/* Voice Message Indicator */}
          {message.audio && (
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-300/30">
              <Button
                size="sm"
                variant="ghost"
                onClick={toggleAudio}
                className={`h-8 w-8 p-0 rounded-full ${
                  isUser ? 'hover:bg-green-700' : 'hover:bg-gray-100'
                }`}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              <div className="flex gap-0.5 items-center">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={`w-0.5 rounded-full ${
                      isUser ? 'bg-white/70' : 'bg-gray-600/70'
                    }`}
                    style={{ height: `${Math.random() * 16 + 8}px` }}
                    animate={isPlaying ? {
                      scaleY: [1, 1.5, 0.8, 1.2, 1],
                    } : {}}
                    transition={{
                      duration: 0.8,
                      repeat: isPlaying ? Infinity : 0,
                      delay: i * 0.05
                    }}
                  />
                ))}
              </div>
              <Volume2 className={`h-4 w-4 ${isUser ? 'text-white' : 'text-gray-600'}`} />
            </div>
          )}

          {/* Message Text */}
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.text}
          </p>

          {/* Timestamp & Status */}
          <div className={`flex items-center gap-1 justify-end mt-1 text-xs ${
            isUser ? 'text-white/80' : 'text-gray-500'
          }`}>
            <span>{formatTime(message.timestamp)}</span>
            {getStatusIcon()}
          </div>
        </motion.div>

        {/* Sender Label (for AI) */}
        {!isUser && (
          <span className="text-xs text-gray-500 px-2">
            {language === 'hindi' ? '🤖 किसान सहायक' : 
             language === 'marathi' ? '🤖 किसान सहायक' :
             language === 'punjabi' ? '🤖 ਕਿਸਾਨ ਸਹਾਇਕ' :
             '🤖 Kisan Assistant'}
          </span>
        )}
      </div>
    </motion.div>
  )
}

function TypingIndicator({ language }: { language?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex justify-start mb-4"
    >
      <div className="bg-white rounded-2xl rounded-bl-sm px-5 py-3 shadow-md border border-gray-200">
        <div className="flex gap-1.5">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-gray-400 rounded-full"
              animate={{
                y: [-2, 2, -2],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.15
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function ChatBubbles({ messages, language = "hindi" }: ChatBubblesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="space-y-2">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} language={language} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}

export { TypingIndicator }


