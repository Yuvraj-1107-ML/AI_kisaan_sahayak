"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Volume2, VolumeX, Wifi, WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WebRTCManager, ConnectionStatus } from "@/lib/webrtc-manager"

interface WebRTCAvatarProps {
  backendUrl?: string
  useStun?: boolean
  onSessionStart?: (sessionId: string) => void
  onStatusChange?: (status: ConnectionStatus) => void
  className?: string
}

export default function WebRTCAvatar({
  backendUrl = "http://localhost:8000",
  useStun = true,
  onSessionStart,
  onStatusChange,
  className = ""
}: WebRTCAvatarProps) {
  const [status, setStatus] = useState<ConnectionStatus>({
    status: 'idle',
    message: 'Ready to connect'
  })
  const [isMuted, setIsMuted] = useState(false)
  const [showFallback, setShowFallback] = useState(false)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const webrtcManager = useRef<WebRTCManager | null>(null)

  const handleStatusChange = useCallback((newStatus: ConnectionStatus) => {
    setStatus(newStatus)
    if (onStatusChange) {
      onStatusChange(newStatus)
    }
  }, [onStatusChange])

  const handleTrack = useCallback((stream: MediaStream) => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream
      setShowFallback(false)
    }
  }, [])

  useEffect(() => {
    // Initialize WebRTC manager
    webrtcManager.current = new WebRTCManager({
      backendUrl,
      useStun
    })

    webrtcManager.current.setStatusCallback(handleStatusChange)
    webrtcManager.current.setTrackCallback(handleTrack)

    // Auto-connect
    const connect = async () => {
      try {
        if (webrtcManager.current) {
          const sessionId = await webrtcManager.current.connect()
          if (onSessionStart) {
            onSessionStart(sessionId)
          }
        }
      } catch (error) {
        console.error('Failed to connect:', error)
        setShowFallback(true)
      }
    }

    connect()

    // Cleanup on unmount
    return () => {
      if (webrtcManager.current) {
        webrtcManager.current.disconnect()
      }
    }
  }, [backendUrl, useStun, onSessionStart, handleStatusChange, handleTrack])

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled
      })
      setIsMuted(!isMuted)
    }
  }, [isMuted])

  // Retry connection
  const retryConnection = useCallback(async () => {
    setShowFallback(false)
    if (webrtcManager.current) {
      try {
        const sessionId = await webrtcManager.current.connect()
        if (onSessionStart) {
          onSessionStart(sessionId)
        }
      } catch (error) {
        console.error('Retry failed:', error)
        setShowFallback(true)
      }
    }
  }, [onSessionStart])

  const getStatusColor = () => {
    switch (status.status) {
      case 'connected':
      case 'speaking':
        return 'bg-green-500'
      case 'connecting':
        return 'bg-yellow-500'
      case 'disconnected':
      case 'error':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusIcon = () => {
    switch (status.status) {
      case 'connected':
      case 'speaking':
        return <Wifi className="h-4 w-4" />
      case 'disconnected':
      case 'error':
        return <WifiOff className="h-4 w-4" />
      default:
        return <Loader2 className="h-4 w-4 animate-spin" />
    }
  }

  return (
    <div className={`relative ${className}`}>
      {/* Status Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/70 to-transparent p-4">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className={`h-3 w-3 rounded-full animate-pulse ${getStatusColor()}`} />
            <span className="text-white font-medium text-sm flex items-center gap-2">
              {getStatusIcon()}
              {status.message}
            </span>
          </motion.div>

          <div className="flex gap-2">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 h-8 w-8 rounded-full"
                onClick={toggleMute}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Video Container */}
      <div className="relative aspect-video bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 rounded-2xl overflow-hidden border-2 border-slate-600/50 shadow-2xl">
        <AnimatePresence mode="wait">
          {status.status === 'connecting' && (
            <motion.div
              key="connecting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-20"
            >
              <Loader2 className="h-16 w-16 text-green-400 animate-spin" />
              <p className="text-white text-lg font-medium">Connecting to Avatar...</p>
              <div className="flex gap-2">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-green-400 rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {(status.status === 'error' || showFallback) && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-20 bg-slate-800/90"
            >
              <WifiOff className="h-16 w-16 text-red-400" />
              <p className="text-white text-lg font-medium">Connection Failed</p>
              <p className="text-white/70 text-sm">{status.message}</p>
              <Button
                onClick={retryConnection}
                className="mt-4 bg-green-600 hover:bg-green-700"
              >
                Retry Connection
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live Avatar Video */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={false}
          className="w-full h-full object-contain"
          style={{ display: showFallback ? 'none' : 'block' }}
        />

        {/* Speaking Animation Overlay */}
        <AnimatePresence>
          {status.status === 'speaking' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"
            >
              <motion.div
                className="h-full bg-white/30"
                animate={{
                  x: ['-100%', '100%']
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Audio Waves when Speaking */}
        <AnimatePresence>
          {status.status === 'speaking' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-1"
            >
              {[...Array(7)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-green-400 rounded-full"
                  animate={{
                    height: [10, 30, 10]
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.1
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}


