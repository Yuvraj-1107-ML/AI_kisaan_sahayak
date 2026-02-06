"use client"

import VoiceAssistant from "@/components/voice-assistant"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useState } from "react"
import { User, Video } from "lucide-react"

export default function ConversationPage() {
  const [showModeSelection, setShowModeSelection] = useState(true)

  if (showModeSelection) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-green-50/50 via-emerald-50/30 to-teal-50/50 flex items-center justify-center p-4">
        <Card className="p-8 max-w-2xl w-full bg-white/95 shadow-2xl">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Choose Your Experience
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Select how you'd like to interact with Kisan AI Assistant
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* AI Avatar Mode */}
            <Link href="/conversation-avatar">
              <Card className="p-6 hover:shadow-xl transition-all cursor-pointer border-2 border-green-200 hover:border-green-400 bg-gradient-to-br from-green-50 to-emerald-50">
                <div className="flex flex-col items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-green-500 flex items-center justify-center">
                    <Video className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-green-900">Live AI Avatar</h2>
                  <p className="text-sm text-green-700 text-center">
                    Experience an interactive live avatar with visual responses and additional information panels
                  </p>
                  <div className="mt-2 flex flex-col gap-1 text-xs text-green-600">
                    <span>✓ Animated Farmer Avatar</span>
                    <span>✓ Visual Information Panels</span>
                    <span>✓ Immersive Experience</span>
                  </div>
                </div>
              </Card>
            </Link>

            {/* Classic Voice Mode */}
            <Card 
              onClick={() => setShowModeSelection(false)}
              className="p-6 hover:shadow-xl transition-all cursor-pointer border-2 border-blue-200 hover:border-blue-400 bg-gradient-to-br from-blue-50 to-teal-50"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-xl font-bold text-blue-900">Classic Voice Mode</h2>
                <p className="text-sm text-blue-700 text-center">
                  Traditional voice assistant with conversation history and text-based interface
                </p>
                <div className="mt-2 flex flex-col gap-1 text-xs text-blue-600">
                  <span>✓ Voice Conversations</span>
                  <span>✓ Text Transcripts</span>
                  <span>✓ Session History</span>
                </div>
              </div>
            </Card>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Both modes provide the same AI-powered farming guidance and support
          </p>
        </Card>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50/50 via-emerald-50/30 to-teal-50/50">
      <VoiceAssistant />
    </main>
  )
}



