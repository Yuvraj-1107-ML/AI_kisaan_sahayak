"use client"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Loader2, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import dynamic from "next/dynamic"
import { motion, AnimatePresence } from "framer-motion"

// Lazy load WebRTC avatar for better performance
const WebRTCAvatar = dynamic(() => import("@/components/webrtc-avatar"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="h-12 w-12 text-green-400 animate-spin" />
    </div>
  ),
})

interface AIAvatarProps {
  isActive: boolean
  isSpeaking: boolean
  audioUrl?: string
  responseText?: string
  language?: string
  additionalInfo?: {
    type: "market_prices" | "weather" | "scheme_info" | "images"
    data: any
  }
}

export default function AIAvatar({
  isActive,
  isSpeaking,
  audioUrl,
  responseText,
  language = "hindi",
  additionalInfo
}: AIAvatarProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [avatarState, setAvatarState] = useState<"idle" | "listening" | "speaking">("idle")
  const [useWebRTC, setUseWebRTC] = useState(false)
  const [webrtcSessionId, setWebrtcSessionId] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

  // Sync avatar animation with audio
  useEffect(() => {
    if (isSpeaking) {
      setAvatarState("speaking")
      if (audioUrl && audioRef.current) {
        audioRef.current.src = `data:audio/mp3;base64,${audioUrl}`
        audioRef.current.muted = isMuted
        audioRef.current.play().catch(console.error)
      }
    } else if (isActive) {
      setAvatarState("listening")
    } else {
      setAvatarState("idle")
    }
  }, [isSpeaking, isActive, audioUrl, isMuted])

  // Handle audio ended and pause
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleEnded = () => {
      setAvatarState(isActive ? "listening" : "idle")
      setIsPaused(false)
    }

    const handlePause = () => {
      if (!audio.ended) setIsPaused(true)
    }

    const handlePlay = () => {
      setIsPaused(false)
    }

    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("pause", handlePause)
    audio.addEventListener("play", handlePlay)
    
    return () => {
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("pause", handlePause)
      audio.removeEventListener("play", handlePlay)
    }
  }, [isActive])

  // Handle pause/resume
  const togglePause = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPaused) {
      audio.play()
    } else {
      audio.pause()
    }
  }

  return (
    <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4">
      {/* Main Avatar Section */}
      <div className="lg:col-span-2 h-full flex flex-col">
        <Card className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 border-2 border-slate-600/50 shadow-2xl h-full flex flex-col">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/60 to-transparent p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`h-3 w-3 rounded-full animate-pulse ${
                  avatarState === "speaking" ? "bg-green-500" :
                  avatarState === "listening" ? "bg-blue-500" :
                  "bg-gray-500"
                }`} />
                <span className="text-white font-medium text-sm">
                  {avatarState === "speaking" ? "Speaking" :
                   avatarState === "listening" ? "Listening" :
                   "Ready"}
                </span>
              </div>
              <div className="flex gap-2">
                {isSpeaking && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20 h-8 w-8 rounded-full"
                    onClick={togglePause}
                  >
                    {isPaused ? (
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                      </svg>
                    )}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 h-8 w-8 rounded-full"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Avatar Video/Animation */}
          <div className="relative flex-1 min-h-0">
            <AnimatePresence mode="wait">
              {useWebRTC ? (
                <motion.div
                  key="webrtc"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full"
                >
                  <WebRTCAvatar
                    backendUrl={API_BASE}
                    useStun={true}
                    onSessionStart={(sessionId) => {
                      setWebrtcSessionId(sessionId)
                      console.log('WebRTC Session started:', sessionId)
                    }}
                    onStatusChange={(status) => {
                      if (status.status === 'speaking') {
                        setAvatarState('speaking')
                      } else if (status.status === 'connected') {
                        setAvatarState(isActive ? 'listening' : 'idle')
                      }
                    }}
                    className="w-full h-full"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="fallback"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative w-full h-full bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 flex items-center justify-center"
                >
                  {isLoading ? (
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="h-12 w-12 text-green-400 animate-spin" />
                      <p className="text-white text-sm">Loading Avatar...</p>
                    </div>
                  ) : (
                    <div className="relative w-full h-full flex items-center justify-center">
                      {/* Placeholder Avatar */}
                      <div className="relative">
                        {/* Animated background */}
                        <div className="absolute inset-0 -z-10">
                          <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-teal-500/20 rounded-full blur-3xl animate-pulse" />
                        </div>

                        {/* Avatar Circle */}
                        <div className={`relative w-64 h-64 rounded-full overflow-hidden border-4 transition-all duration-300 ${
                          avatarState === "speaking" ? "border-green-500 shadow-lg shadow-green-500/50 scale-105" :
                          avatarState === "listening" ? "border-blue-500 shadow-lg shadow-blue-500/50" :
                          "border-slate-600"
                        }`}>
                          <div className="absolute inset-0 bg-gradient-to-br from-amber-700 via-amber-600 to-amber-800">
                            {/* Farmer Avatar Illustration */}
                            <svg viewBox="0 0 200 200" className="w-full h-full">
                              {/* Head */}
                              <circle cx="100" cy="90" r="45" fill="#d4a574" />
                              
                              {/* Turban */}
                              <ellipse cx="100" cy="60" rx="48" ry="35" fill="#ff6b35" />
                              <ellipse cx="100" cy="55" rx="45" ry="20" fill="#ff8552" />
                              
                              {/* Face features */}
                              <circle cx="88" cy="85" r="4" fill="#000" />
                              <circle cx="112" cy="85" r="4" fill="#000" />
                              
                              {/* Mustache */}
                              <path d="M 85 100 Q 90 105 100 103 Q 110 105 115 100" 
                                    stroke="#3d2817" strokeWidth="3" fill="none" />
                              
                              {/* Smile - animated when speaking */}
                              <path d="M 88 110 Q 100 118 112 110" 
                                    stroke="#8b5a3c" strokeWidth="2" fill="none"
                                    className={avatarState === "speaking" ? "animate-pulse" : ""} />
                              
                              {/* Body/Shoulders */}
                              <ellipse cx="100" cy="170" rx="60" ry="40" fill="#4a7c59" />
                              
                              {/* Shirt collar */}
                              <rect x="85" y="130" width="30" height="20" fill="#6b9b7f" rx="5" />
                            </svg>
                          </div>

                          {/* Speaking animation overlay */}
                          {avatarState === "speaking" && (
                            <div className="absolute inset-0 bg-green-500/10 animate-pulse" />
                          )}
                        </div>

                        {/* Audio waves when speaking */}
                        {avatarState === "speaking" && (
                          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className="w-1 bg-green-500 rounded-full animate-pulse"
                                style={{
                                  height: `${Math.random() * 20 + 10}px`,
                                  animationDelay: `${i * 0.1}s`
                                }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Toggle Button */}
                      <div className="absolute bottom-4 right-4">
                        <Button
                          onClick={() => setUseWebRTC(true)}
                          className="bg-green-600 hover:bg-green-700 text-white shadow-lg"
                          size="sm"
                        >
                          Enable Live Avatar
                        </Button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Subtitle/Transcript */}
          {responseText && avatarState === "speaking" && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-6">
              <div className="max-w-3xl mx-auto">
                <p className="text-white text-center text-lg leading-relaxed drop-shadow-lg">
                  {responseText}
                </p>
              </div>
            </div>
          )}

          {/* Hidden audio element */}
          <audio ref={audioRef} className="hidden" />
        </Card>
      </div>

      {/* Additional Info Panel */}
      <div className="lg:col-span-1 h-full flex flex-col min-h-0">
        <Card className="p-4 bg-gradient-to-br from-teal-50 to-emerald-50 border-2 border-teal-200/50 shadow-lg h-full flex flex-col min-h-0 max-h-full overflow-hidden">
          <h3 className="text-lg font-bold text-teal-900 mb-3 flex-shrink-0">
            {language === "hindi" ? "महत्वपूर्ण जानकारी" : language === "marathi" ? "महत्त्वाची माहिती" : "Important Info"}
          </h3>
          
          {additionalInfo ? (
            <div className="space-y-3 flex-1 overflow-y-auto min-h-0 pr-2 scroll-smooth info-card-scrollbar" style={{ scrollbarWidth: 'thin', scrollbarColor: '#6ee7b7 #d1fae5', maxHeight: '100%' }}>
              {additionalInfo.type === "weather" && (
                <div className="p-4 bg-white rounded-lg shadow-sm border-l-4 border-blue-500">
                  <h4 className="font-semibold text-blue-900 mb-3">
                    {language === "hindi" ? "मौसम की जानकारी" : language === "marathi" ? "हवामान माहिती" : "Weather Information"}
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                      <span className="font-medium">{language === "hindi" ? "तापमान:" : language === "marathi" ? "तापमान:" : "Temperature:"}</span>
                      <span className="text-lg font-bold text-blue-700">{additionalInfo.data.temperature}°C</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                      <span className="font-medium">{language === "hindi" ? "नमी:" : language === "marathi" ? "आर्द्रता:" : "Humidity:"}</span>
                      <span className="text-lg font-bold text-blue-700">{additionalInfo.data.humidity}%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                      <span className="font-medium">{language === "hindi" ? "मौसम:" : language === "marathi" ? "हवामान:" : "Condition:"}</span>
                      <span className="font-bold text-blue-700">{additionalInfo.data.weather}</span>
                    </div>
                    {additionalInfo.data.wind_speed && (
                      <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                        <span className="font-medium">{language === "hindi" ? "हवा की गति:" : language === "marathi" ? "वाऱ्याचा वेग:" : "Wind Speed:"}</span>
                        <span className="font-bold text-blue-700">{additionalInfo.data.wind_speed} m/s</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {additionalInfo.type === "market_prices" && (
                <div className="p-4 bg-white rounded-lg shadow-sm border-l-4 border-green-500">
                  <h4 className="font-semibold text-green-900 mb-3">
                    {language === "hindi" ? "मंडी भाव" : language === "marathi" ? "बाजार भाव" : "Market Prices"}
                  </h4>
                  <div className="space-y-2">
                    {additionalInfo.data.map((item: any, idx: number) => (
                      <div key={idx} className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-green-900">{item.commodity}</span>
                          <span className="text-xl font-bold text-green-700">₹{item.price}</span>
                        </div>
                        {item.market && (
                          <p className="text-xs text-green-600">
                            {language === "hindi" ? "मंडी:" : language === "marathi" ? "बाजार:" : "Market:"} {item.market}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {additionalInfo.type === "scheme_info" && (
                <div className="p-4 bg-white rounded-lg shadow-sm border-l-4 border-purple-500">
                  <h4 className="font-semibold text-purple-900 mb-3">
                    {language === "hindi" ? "सरकारी योजनाएं" : language === "marathi" ? "सरकारी योजना" : "Government Schemes"}
                  </h4>
                  <div className="space-y-3 text-sm bg-purple-50 p-3 rounded">
                    <p className="leading-relaxed">{additionalInfo.data.info}</p>
                    {additionalInfo.data.helpline && (
                      <div className="mt-3 p-2 bg-purple-100 rounded">
                        <p className="font-semibold text-purple-900">
                          {language === "hindi" ? "हेल्पलाइन:" : language === "marathi" ? "मदत क्रमांक:" : "Helpline:"} {additionalInfo.data.helpline}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {additionalInfo.type === "fertilizer" && (
                <div className="p-4 bg-white rounded-lg shadow-sm border-l-4 border-orange-500">
                  <h4 className="font-semibold text-orange-900 mb-3">
                    {language === "hindi" ? "उर्वरक सिफारिश" : language === "marathi" ? "खत शिफारस" : "Fertilizer Recommendation"}
                  </h4>
                  {additionalInfo.data.crop && (
                    <p className="text-xs text-orange-700 mb-2">
                      {language === "hindi" ? "फसल:" : language === "marathi" ? "पीक:" : "Crop:"} {additionalInfo.data.crop}
                    </p>
                  )}
                  <div className="space-y-3 text-sm">
                    <div className="bg-orange-50 p-3 rounded">
                      <p className="leading-relaxed text-orange-900 whitespace-pre-line">
                        {additionalInfo.data.recommendation}
                      </p>
                    </div>
                    {additionalInfo.data.images && additionalInfo.data.images.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs font-semibold text-orange-700 mb-2">
                          {language === "hindi" ? "उर्वरक चित्र:" : language === "marathi" ? "खत चित्रे:" : "Fertilizer Images:"}
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {additionalInfo.data.images.map((img: any, idx: number) => (
                            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-orange-200">
                              <img
                                src={img.url || img}
                                alt={img.title || `Fertilizer ${idx + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {additionalInfo.type === "pesticide" && (
                <div className="p-4 bg-white rounded-lg shadow-sm border-l-4 border-red-500">
                  <h4 className="font-semibold text-red-900 mb-3">
                    {language === "hindi" ? "कीटनाशक सिफारिश" : language === "marathi" ? "कीटकनाशक शिफारस" : "Pesticide Recommendation"}
                  </h4>
                  {additionalInfo.data.crop && (
                    <p className="text-xs text-red-700 mb-1">
                      {language === "hindi" ? "फसल:" : language === "marathi" ? "पीक:" : "Crop:"} {additionalInfo.data.crop}
                    </p>
                  )}
                  {additionalInfo.data.pest && (
                    <p className="text-xs text-red-700 mb-2">
                      {language === "hindi" ? "कीट:" : language === "marathi" ? "कीटक:" : "Pest:"} {additionalInfo.data.pest}
                    </p>
                  )}
                  <div className="space-y-3 text-sm">
                    <div className="bg-red-50 p-3 rounded">
                      <p className="leading-relaxed text-red-900 whitespace-pre-line">
                        {additionalInfo.data.recommendation}
                      </p>
                    </div>
                    {additionalInfo.data.images && additionalInfo.data.images.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs font-semibold text-red-700 mb-2">
                          {language === "hindi" ? "कीटनाशक चित्र:" : language === "marathi" ? "कीटकनाशक चित्रे:" : "Pesticide Images:"}
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {additionalInfo.data.images.map((img: any, idx: number) => (
                            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-red-200">
                              <img
                                src={img.url || img}
                                alt={img.title || `Pesticide ${idx + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-400">
              <p className="text-xs font-medium">
                {language === "hindi" ? "जानकारी यहां दिखेगी" : language === "marathi" ? "माहिती येथे दिसेल" : "Information will appear here"}
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}



