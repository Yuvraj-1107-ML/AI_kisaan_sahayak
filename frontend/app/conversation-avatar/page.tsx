"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mic, MicOff, Loader2, Settings, Languages, History, ArrowLeft, Sparkles, Volume2, X } from "lucide-react"
import AIAvatar from "@/components/ai-avatar"
import LanguageSelector from "@/components/language-selector"
import CameraDiseaseDetector from "@/components/camera-disease-detector"
import Link from "next/link"

type SessionStatus = "idle" | "awaiting_language" | "active" | "listening" | "processing"

interface Message {
  id: string
  text: string
  audio?: string
  sender: "user" | "assistant"
  timestamp: Date
  additionalInfo?: any
}

export default function ConversationAvatarPage() {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [status, setStatus] = useState<SessionStatus>("idle")
  const [messages, setMessages] = useState<Message[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)
  const [showLanguageSelector, setShowLanguageSelector] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("Hindi")
  const [currentTranscript, setCurrentTranscript] = useState("")
  const [showCamera, setShowCamera] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentResponse, setCurrentResponse] = useState<any>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const silenceStartTimeRef = useRef<number | null>(null)
  const isRecordingRef = useRef<boolean>(false)
  const animationFrameRef = useRef<number | null>(null)
  const speechDetectedRef = useRef<boolean>(false)
  const streamRef = useRef<MediaStream | null>(null)

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

  const SILENCE_THRESHOLD = 0.03
  const SILENCE_DURATION = 3000
  const SPEECH_THRESHOLD = 0.05
  const FALLBACK_TIMEOUT = 10000

  // Prevent scrolling - Kiosk mode
  useEffect(() => {
    document.body.style.overflow = "hidden"
    document.documentElement.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
      document.documentElement.style.overflow = ""
    }
  }, [])

  const startSession = useCallback(async () => {
    try {
      setStatus("processing")
      
      const response = await fetch(`${API_BASE}/voice/start-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

      const data = await response.json()
      setSessionId(data.session_id)
      
      const greetingMessage: Message = {
        id: Date.now().toString(),
        text: data.text,
        audio: data.audio,
        sender: "assistant",
        timestamp: new Date(),
      }

      setMessages([greetingMessage])
      setCurrentResponse({ text: data.text, audio: data.audio })
      setIsSpeaking(true)

      setTimeout(() => {
        setIsSpeaking(false)
        setStatus("awaiting_language")
        setTimeout(() => startRecordingForLanguage(data.session_id), 2000)
      }, 3000)
    } catch (error) {
      console.error("Error starting session:", error)
      setStatus("idle")
    }
  }, [])

  const startRecording = useCallback(async () => {
    try {
      if (!sessionId) return

      setCurrentTranscript("")
      setError(null)

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      })
      
      streamRef.current = stream

      if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }
      
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume()
      }
      
      const source = audioContextRef.current.createMediaStreamSource(stream)
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 512
      analyserRef.current.smoothingTimeConstant = 0.3
      source.connect(analyserRef.current)

      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data)
      }

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        await sendAudioQuery(audioBlob)
        cleanupStream()
      }

      mediaRecorderRef.current.start(250)
      setIsRecording(true)
      isRecordingRef.current = true
      setStatus("listening")
      
      visualizeAudio()
      startSilenceDetection()
    } catch (error) {
      console.error("Error starting recording:", error)
      setStatus("active")
      setError("Microphone access denied")
      setTimeout(() => setError(null), 3000)
    }
  }, [sessionId])

  const startRecordingForLanguage = useCallback(async (currentSessionId?: string) => {
    const activeSessionId = currentSessionId || sessionId
    if (!activeSessionId) {
      setShowLanguageSelector(true)
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      })
      
      streamRef.current = stream

      if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }
      
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume()
      }
      
      const source = audioContextRef.current.createMediaStreamSource(stream)
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 512
      source.connect(analyserRef.current)

      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data)
      }

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        await processLanguageSelection(audioBlob, activeSessionId)
        cleanupStream()
      }

      mediaRecorderRef.current.start(250)
      setIsRecording(true)
      isRecordingRef.current = true
      setStatus("listening")
      
      visualizeAudio()
      startSilenceDetection()
    } catch (error) {
      console.error("Error starting language recording:", error)
      setShowLanguageSelector(true)
    }
  }, [sessionId])

  const cleanupStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      isRecordingRef.current = false
      setStatus("processing")
      setAudioLevel(0)
      
      if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current)
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
      silenceStartTimeRef.current = null
    }
  }, [])

  const startSilenceDetection = useCallback(() => {
    if (!analyserRef.current) return

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
    speechDetectedRef.current = false
    let frameCount = 0
    const startTime = Date.now()
    
    const checkSilence = () => {
      if (!analyserRef.current || !isRecordingRef.current) return

      frameCount++
      
      if (frameCount % 3 === 0) {
        analyserRef.current.getByteFrequencyData(dataArray)
        const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length
        const normalizedLevel = average / 255

        const elapsed = Date.now() - startTime
        if (!speechDetectedRef.current && elapsed > FALLBACK_TIMEOUT) {
          stopRecording()
          return
        }

        if (!speechDetectedRef.current && normalizedLevel > SPEECH_THRESHOLD) {
          speechDetectedRef.current = true
          silenceStartTimeRef.current = null
        }

        if (speechDetectedRef.current) {
          if (normalizedLevel < SILENCE_THRESHOLD) {
            if (silenceStartTimeRef.current === null) {
              silenceStartTimeRef.current = Date.now()
            } else {
              const silenceDuration = Date.now() - silenceStartTimeRef.current
              if (silenceDuration >= SILENCE_DURATION) {
                stopRecording()
                return
              }
            }
          } else {
            silenceStartTimeRef.current = null
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(checkSilence)
    }

    checkSilence()
  }, [stopRecording])

  const visualizeAudio = useCallback(() => {
    if (!analyserRef.current) return

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
    let lastUpdate = 0
    const UPDATE_INTERVAL = 50

    const updateLevel = (currentTime: number) => {
      if (!analyserRef.current || !isRecordingRef.current) return

      if (currentTime - lastUpdate >= UPDATE_INTERVAL) {
        analyserRef.current.getByteFrequencyData(dataArray)
        const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length
        setAudioLevel(average / 255)
        lastUpdate = currentTime
      }

      requestAnimationFrame(updateLevel)
    }

    requestAnimationFrame(updateLevel)
  }, [])

  const sendAudioQuery = useCallback(async (audioBlob: Blob) => {
    if (!sessionId) return

    try {
      const base64Audio = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          const base64 = reader.result as string
          resolve(base64.split(',')[1])
        }
        reader.onerror = reject
        reader.readAsDataURL(audioBlob)
      })

      const response = await fetch(`${API_BASE}/voice/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          audio_base64: base64Audio,
          language: selectedLanguage.toLowerCase(),
        }),
      })

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

      const data = await response.json()

      const userMessage: Message = {
        id: Date.now().toString(),
        text: data.user_text || "...",
        sender: "user",
        timestamp: new Date(),
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.text_response || data.text,
        audio: data.audio_base64 || data.audio,
        sender: "assistant",
        timestamp: new Date(),
        additionalInfo: data.additional_info
      }

      setMessages((prev) => [...prev, userMessage, assistantMessage])
      setCurrentResponse({
        text: assistantMessage.text,
        audio: assistantMessage.audio,
        additionalInfo: data.additional_info
      })
      setIsSpeaking(true)

      setTimeout(() => {
        setIsSpeaking(false)
        if (data.requires_camera) {
          setShowCamera(true)
        } else {
          setStatus("active")
        }
      }, 3000)

      setCurrentTranscript("")
    } catch (error) {
      console.error("Error sending audio query:", error)
      setStatus("active")
      setError("Connection error. Please try again.")
      setTimeout(() => setError(null), 3000)
    }
  }, [sessionId, selectedLanguage])

  const processLanguageSelection = async (audioBlob: Blob, currentSessionId?: string) => {
    const activeSessionId = currentSessionId || sessionId
    if (!activeSessionId) {
      setShowLanguageSelector(true)
      return
    }

    try {
      setStatus("processing")
      
      const base64Audio = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.readAsDataURL(audioBlob)
        reader.onloadend = () => {
          const base64 = reader.result as string
          resolve(base64.split(',')[1])
        }
      })

      const response = await fetch(`${API_BASE}/voice/detect-language`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: activeSessionId,
          audio_base64: base64Audio,
        }),
      })

      const data = await response.json()

      if (data.language_detected && data.language) {
        const languageMap: { [key: string]: string } = {
          "english": "English",
          "hindi": "Hindi",
          "punjabi": "Punjabi",
          "marathi": "Marathi",
        }

        const detectedLanguageName = languageMap[data.language] || "Hindi"
        setSelectedLanguage(detectedLanguageName)

        const confirmMessage: Message = {
          id: Date.now().toString(),
          text: data.text,
          audio: data.audio,
          sender: "assistant",
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, confirmMessage])
        setCurrentResponse({ text: data.text, audio: data.audio })
        setIsSpeaking(true)

        setTimeout(() => {
          setIsSpeaking(false)
          setStatus("active")
        }, 2000)
      } else {
        setShowLanguageSelector(true)
        setStatus("awaiting_language")
      }
    } catch (error) {
      console.error("Error processing language selection:", error)
      setShowLanguageSelector(true)
    }
  }

  const handleLanguageSelection = async (languageName: string) => {
    if (!sessionId) return

    try {
      setStatus("processing")
      setShowLanguageSelector(false)

      const languageMap: { [key: string]: string } = {
        "English": "english",
        "Hindi": "hindi",
        "Punjabi": "punjabi",
        "Marathi": "marathi",
      }

      const languageCode = languageMap[languageName] || "hindi"

      const response = await fetch(`${API_BASE}/voice/select-language`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          language: languageCode,
        }),
      })

      const data = await response.json()
      setSelectedLanguage(languageName)

      const confirmMessage: Message = {
        id: Date.now().toString(),
        text: data.text,
        audio: data.audio,
        sender: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, confirmMessage])
      setCurrentResponse({ text: data.text, audio: data.audio })
      setIsSpeaking(true)

      setTimeout(() => {
        setIsSpeaking(false)
        setStatus("active")
      }, 2000)
    } catch (error) {
      console.error("Error selecting language:", error)
      setShowLanguageSelector(true)
    }
  }

  return (
    <div className="fixed inset-0 h-screen w-screen overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-3xl animate-pulse animation-delay-4000" />
      </div>

      {showCamera && sessionId && (
        <CameraDiseaseDetector
          sessionId={sessionId}
          language={selectedLanguage.toLowerCase()}
          onClose={() => {
            setShowCamera(false)
            setStatus("active")
          }}
          onDiagnosisComplete={(diagnosis, audio) => {
            setShowCamera(false)
            setStatus("active")
          }}
        />
      )}

      <div className="h-full w-full flex flex-col relative z-10">
        {/* Compact Header */}
        <Card className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 p-3 border-0 shadow-2xl rounded-none">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12">
                <Image
                  src="/logo.jpg"
                  alt="Kisan Logo"
                  fill
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  🌾 Kisan AI सहायक
                  <Sparkles className="h-5 w-5 animate-pulse" />
                </h1>
                <p className="text-white/90 text-xs">Live AI Avatar Experience</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 rounded-full h-9 w-9"
                onClick={() => setShowLanguageSelector(!showLanguageSelector)}
              >
                <Languages className="h-4 w-4" />
              </Button>
              <div className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                <span className="text-xs font-semibold text-white flex items-center gap-1">
                  <Volume2 className="h-3 w-3" />
                  {selectedLanguage}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {showLanguageSelector && (
          <div className="absolute top-16 right-4 z-50">
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onSelectLanguage={handleLanguageSelection}
              onClose={() => setShowLanguageSelector(false)}
            />
          </div>
        )}

        {/* Main Content Area - Flex to fill remaining space */}
        <div className="flex-1 overflow-hidden">
          {status === "idle" ? (
            <div className="h-full flex items-center justify-center p-4">
              <Card className="p-8 text-center bg-gradient-to-br from-white/95 to-emerald-50/95 backdrop-blur-xl shadow-2xl border-2 border-emerald-200 max-w-2xl">
                <div className="space-y-6">
                  <div className="relative mx-auto inline-block">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full blur-2xl opacity-50 animate-pulse" />
                    <Button
                      size="lg"
                      onClick={startSession}
                      className="relative h-40 w-40 rounded-full text-xl font-bold bg-gradient-to-br from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-2xl hover:shadow-emerald-500/50 transition-all transform hover:scale-105"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <Sparkles className="h-16 w-16 animate-pulse" />
                        <span className="text-2xl">Start</span>
                      </div>
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      Welcome to Kisan AI Avatar! 👋
                    </h2>
                    <p className="text-lg text-gray-700 leading-relaxed">
                      Experience real-time farming guidance with our intelligent AI avatar
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            <div className="h-full flex flex-col">
              {/* Avatar Section - Takes most of the space */}
              <div className="flex-1 min-h-0 p-4">
                <AIAvatar
                  isActive={status === "active"}
                  isSpeaking={isSpeaking}
                  audioUrl={currentResponse?.audio}
                  responseText={currentResponse?.text}
                  language={selectedLanguage.toLowerCase()}
                  additionalInfo={currentResponse?.additionalInfo}
                />
              </div>

              {/* Controls Section - Fixed at bottom */}
              <div className="flex-shrink-0 p-4 space-y-3">

                {error && (
                  <Card className="p-3 bg-red-50/95 backdrop-blur-xl border-2 border-red-200 shadow-xl">
                    <div className="flex items-center gap-2">
                      <span className="text-red-500 text-xl">⚠️</span>
                      <p className="text-red-700 font-semibold text-sm">{error}</p>
                    </div>
                  </Card>
                )}

                {/* Microphone Control */}
                <Card className="p-4 bg-gradient-to-br from-white/95 to-emerald-50/95 backdrop-blur-xl shadow-2xl border-2 border-emerald-200">
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex gap-3 items-center">
                      {/* Main Microphone Button */}
                      <div className="relative">
                        {status === "processing" ? (
                          <Button size="lg" disabled className="h-20 w-20 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-2xl">
                            <Loader2 className="h-10 w-10 animate-spin" />
                          </Button>
                        ) : (
                          <div className="relative">
                            {isRecording && (
                              <div className="absolute inset-0 bg-red-500 rounded-full blur-2xl opacity-30 animate-pulse" />
                            )}
                            <Button
                              size="lg"
                              onClick={isRecording ? stopRecording : startRecording}
                              disabled={isSpeaking}
                              className={`relative h-20 w-20 rounded-full transition-all shadow-2xl ${
                                isRecording && status === "listening"
                                  ? "bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 animate-pulse"
                                  : "bg-gradient-to-br from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 hover:scale-105"
                              } text-white ${isSpeaking ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                              {isRecording && status === "listening" ? (
                                <MicOff className="h-10 w-10" />
                              ) : (
                                <Mic className="h-10 w-10" />
                              )}
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* Continue to Next Question Button */}
                      {status === "active" && !isSpeaking && !isRecording && (
                        <Button
                          size="lg"
                          onClick={startRecording}
                          className="h-16 px-6 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-xl transition-all hover:scale-105 group"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-base">Next Question</span>
                            <svg className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                            </svg>
                          </div>
                        </Button>
                      )}
                    </div>

                    <div className="text-center space-y-1">
                      <p className="text-sm font-semibold text-gray-800">
                        {status === "awaiting_language" && "Listening for your language..."}
                        {status === "processing" && "Processing..."}
                        {status === "active" && !isSpeaking && "Ready - Tap microphone"}
                        {status === "active" && isSpeaking && "Speaking..."}
                      </p>
                      {status === "active" && !isSpeaking && (
                        <p className="text-xs text-gray-600">
                          Ask about farming, crops, weather, prices, or diseases
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
