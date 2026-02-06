"use client"

import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mic, MicOff, Loader2, Settings, Languages, History, Volume2 } from "lucide-react"
import MessageList from "@/components/message-list"
import LanguageSelector from "@/components/language-selector"
import SessionStats from "@/components/session-stats"
import CameraDiseaseDetector from "@/components/camera-disease-detector"

type SessionStatus = "idle" | "awaiting_language" | "active" | "listening" | "processing"

interface Message {
  id: string
  text: string
  audio?: string
  sender: "user" | "assistant"
  timestamp: Date
  isStreaming?: boolean
}

export default function VoiceAssistant() {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [status, setStatus] = useState<SessionStatus>("idle")
  const [messages, setMessages] = useState<Message[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)
  const [showLanguageSelector, setShowLanguageSelector] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("English")
  const [showStats, setShowStats] = useState(false)
  const [currentTranscript, setCurrentTranscript] = useState("")
  const [languageRetryCount, setLanguageRetryCount] = useState(0)
  const [isAutoRecording, setIsAutoRecording] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const currentAudioRef = useRef<HTMLAudioElement | null>(null)

  // Performance optimizations
  const pendingRequests = useRef<Map<string, Promise<any>>>(new Map())
  const lastRequestTime = useRef<number>(0)
  const REQUEST_DEBOUNCE_TIME = 300 // Prevent duplicate requests within 300ms

  // Prevent scrolling - Kiosk mode
  useEffect(() => {
    document.body.style.overflow = "hidden"
    document.documentElement.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
      document.documentElement.style.overflow = ""
    }
  }, [])
  
  // Browser capability detection with fallback options
  const getOptimalMediaRecorderOptions = useCallback((): MediaRecorderOptions => {
    const preferredOptions = [
      // Try high quality first
      { mimeType: 'audio/webm;codecs=opus', bitsPerSecond: AUDIO_BITRATE },
      { mimeType: 'audio/webm', bitsPerSecond: AUDIO_BITRATE },
      // Fallback without bitrate specification to avoid clamping
      { mimeType: 'audio/webm;codecs=opus' },
      { mimeType: 'audio/webm' },
      { mimeType: 'audio/mp4' },
      // Last resort with bitrate
      { bitsPerSecond: AUDIO_BITRATE },
      // Final fallback with no options
      {}
    ]
    
    for (const option of preferredOptions) {
      if (!option.mimeType || MediaRecorder.isTypeSupported(option.mimeType)) {
        console.log("[v0] Using MediaRecorder options:", option)
        return option
      }
    }
    
    console.warn("[v0] Using default MediaRecorder options")
    return {}
  }, [])

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const silenceStartTimeRef = useRef<number | null>(null)
  const isRecordingRef = useRef<boolean>(false)
  const animationFrameRef = useRef<number | null>(null)
  const speechDetectedRef = useRef<boolean>(false) // Track if speech has been detected
  const streamRef = useRef<MediaStream | null>(null)

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

  // Balanced thresholds for proper microphone behavior
  const SILENCE_THRESHOLD = 0.03 // Balanced threshold for proper silence detection
  const SILENCE_DURATION = 3000 // 3 seconds - more reasonable time for user to think
  const SPEECH_THRESHOLD = 0.05 // Higher threshold to avoid noise detection
  const FALLBACK_TIMEOUT = 10000 // 10 seconds fallback if no speech detected
  
  // Optimized audio settings for better browser compatibility
  const AUDIO_SAMPLE_RATE = 48000 // Use browser's preferred sample rate
  const AUDIO_BITRATE = 256000 // Increased to 256kbps to avoid browser clamping
  const AUDIO_CHUNK_SIZE = 1024 // Optimized chunk size

  // Optimized cleanup and performance monitoring
  useEffect(() => {
    // Suppress MediaRecorder bitrate clamping warnings for cleaner console
    const originalWarn = console.warn
    console.warn = (...args) => {
      const message = args.join(' ')
      if (message.includes('Clamping calculated') && message.includes('bitrate')) {
        return // Suppress these expected warnings
      }
      originalWarn.apply(console, args)
    }

    // Preload audio context for faster first recording
    const initAudioContext = () => {
      if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
        try {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
          // Let browser choose optimal sample rate
        } catch (error) {
          console.warn("[v0] Failed to initialize audio context:", error)
        }
      }
    }

    // Initialize on user interaction for better performance
    const handleUserInteraction = () => {
      initAudioContext()
      document.removeEventListener('click', handleUserInteraction)
      document.removeEventListener('touchstart', handleUserInteraction)
      document.removeEventListener('keydown', handleUserInteraction)
    }

    document.addEventListener('click', handleUserInteraction)
    document.addEventListener('touchstart', handleUserInteraction)
    document.addEventListener('keydown', handleUserInteraction)

    // Add keyboard shortcuts for better accessibility
    const handleKeyDown = (e: KeyboardEvent) => {
      // Space bar to start/stop recording (when active)
      if (e.code === 'Space' && status === 'active' && !isSpeaking) {
        e.preventDefault()
        if (isRecording) {
          stopRecording()
        } else {
          startRecording()
        }
      }
      // Enter to start session (when idle)
      if (e.code === 'Enter' && status === 'idle') {
        e.preventDefault()
        startSession()
      }
      // Escape to stop recording or close modals
      if (e.code === 'Escape') {
        if (isRecording) {
          stopRecording()
        } else if (showLanguageSelector) {
          setShowLanguageSelector(false)
        } else if (showStats) {
          setShowStats(false)
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      // Restore original console.warn
      console.warn = originalWarn

      // Comprehensive cleanup
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current)
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close()
      }

      // Clear caches
      pendingRequests.current.clear()

      // Remove event listeners
      document.removeEventListener('click', handleUserInteraction)
      document.removeEventListener('touchstart', handleUserInteraction)
      document.removeEventListener('keydown', handleUserInteraction)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const startSession = useCallback(async () => {
    try {
      setStatus("processing")
      
      console.log("[v0] Starting new session (no audio caching)")
      
      // Use AbortController for request timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
      
      const response = await fetch(`${API_BASE}/voice/start-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Connection": "keep-alive",
        },
        signal: controller.signal,
      })
      
      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("[v0] Session start response:", {
        session_id: data.session_id,
        text: data.text,
        hasAudio: !!data.audio,
        audioLength: data.audio ? data.audio.length : 0
      })
      setSessionId(data.session_id)
      
      const greetingMessage: Message = {
        id: Date.now().toString(),
        text: data.text,
        audio: data.audio,
        sender: "assistant",
        timestamp: new Date(),
        isStreaming: true,
      }

      setMessages([greetingMessage])

      // Play audio without waiting and prepare for next step
      if (data.audio) {
        console.log("[v0] Playing greeting audio, length:", data.audio.length)
        playAudio(data.audio).catch(console.error)
      }

      // Wait longer for audio to finish playing before starting language selection
      setTimeout(() => {
        setMessages((prev) => prev.map((msg) => ({ ...msg, isStreaming: false })))
        setStatus("awaiting_language")
        setLanguageRetryCount(0)
        
        // Increased delay to let user understand the greeting
        setTimeout(() => {
          console.log("[v0] Auto-starting language selection recording, sessionId:", data.session_id)
          startRecordingForLanguage(data.session_id)
        }, 2000) // Increased to 2 seconds
      }, 1500) // Increased to 1.5 seconds
    } catch (error) {
      console.error("[v0] Error starting session:", error)
      setStatus("idle")
    }
  }, [])

  const startRecording = useCallback(async () => {
    try {
      console.log("[v0] startRecording called, current status:", status, "sessionId:", sessionId)
      
      if (!sessionId) {
        console.error("[v0] Cannot start recording: no session ID")
        return
      }

      setCurrentTranscript("")
      setError(null) // Clear any previous errors
      setRetryCount(0) // Reset retry count

      // Optimized audio constraints for browser compatibility
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1, // Mono for smaller file size
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          // Remove sampleRate constraint to let browser choose optimal rate
        }
      })
      
      // Test if the stream is actually working
      const tracks = stream.getAudioTracks()
      if (tracks.length === 0) {
        throw new Error("No audio tracks available")
      }
      
      console.log("[v0] Audio track settings:", tracks[0].getSettings())
      console.log("[v0] Audio track state:", tracks[0].readyState, tracks[0].enabled)
      
      streamRef.current = stream

      // Reuse existing AudioContext if available and working
      if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }
      
      // Resume context if suspended
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume()
      }
      
      const source = audioContextRef.current.createMediaStreamSource(stream)
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 512 // Balanced for good sensitivity without overprocessing
      analyserRef.current.smoothingTimeConstant = 0.3 // Balanced smoothing
      analyserRef.current.minDecibels = -90
      analyserRef.current.maxDecibels = -10
      source.connect(analyserRef.current)
      
      console.log("[v0] AudioContext state:", audioContextRef.current.state, 
                 "Sample rate:", audioContextRef.current.sampleRate,
                 "Analyser fftSize:", analyserRef.current.fftSize)

      // Get optimal MediaRecorder options for this browser
      const options = getOptimalMediaRecorderOptions()
      
      try {
        mediaRecorderRef.current = new MediaRecorder(stream, options)
        console.log("[v0] MediaRecorder created successfully with options:", options)
      } catch (error) {
        console.warn("[v0] Failed to create MediaRecorder with options:", options, "Error:", error)
        // Fallback to basic MediaRecorder
        mediaRecorderRef.current = new MediaRecorder(stream)
        console.log("[v0] Using fallback MediaRecorder without options")
      }
      
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        await sendAudioQuery(audioBlob)
        cleanupStream()
      }

      // Start recording with optimized timeslices
      try {
        mediaRecorderRef.current.start(250)
        setIsRecording(true)
        isRecordingRef.current = true
        setStatus("listening")
        
        console.log("[v0] Recording started successfully with options:", options)
      } catch (startError) {
        console.error("[v0] Failed to start MediaRecorder:", startError)
        cleanupStream()
        throw startError
      }
      
      visualizeAudio()
      startSilenceDetection()
    } catch (error) {
      console.error("[v0] Error starting recording:", error)
      setStatus("active")
      setError("Microphone access denied or not available")
      setTimeout(() => setError(null), 3000)
      throw error
    }
  }, [sessionId, status])

  const startRecordingForLanguage = useCallback(async (currentSessionId?: string) => {
    try {
      const activeSessionId = currentSessionId || sessionId
      
      if (!activeSessionId) {
        console.error("[v0] No session ID for language selection - showing UI selector as fallback")
        setShowLanguageSelector(true)
        setStatus("awaiting_language")
        setIsAutoRecording(false)
        return
      }
      
      console.log("[v0] Starting language recording with sessionId:", activeSessionId)
      
      setCurrentTranscript("")
      setIsAutoRecording(true)

      // Optimized audio constraints for language detection
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
          // Remove sampleRate constraint for better compatibility
        }
      })
      
      // Test if the stream is actually working for language detection
      const tracks = stream.getAudioTracks()
      if (tracks.length === 0) {
        throw new Error("No audio tracks available for language detection")
      }
      
      console.log("[v0] Language detection audio track settings:", tracks[0].getSettings())
      console.log("[v0] Language detection audio track state:", tracks[0].readyState, tracks[0].enabled)
      
      streamRef.current = stream

      // Reuse existing AudioContext for language detection
      if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }
      
      // Resume context if suspended
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume()
      }
      
      const source = audioContextRef.current.createMediaStreamSource(stream)
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 512 // Balanced for language detection
      analyserRef.current.smoothingTimeConstant = 0.3 // Balanced smoothing
      analyserRef.current.minDecibels = -90
      analyserRef.current.maxDecibels = -10
      source.connect(analyserRef.current)
      
      console.log("[v0] Language AudioContext state:", audioContextRef.current.state, 
                 "Sample rate:", audioContextRef.current.sampleRate)

      // Use optimized options for language recording
      const options = getOptimalMediaRecorderOptions()
      
      try {
        mediaRecorderRef.current = new MediaRecorder(stream, options)
        console.log("[v0] Language MediaRecorder created successfully with options:", options)
      } catch (error) {
        console.warn("[v0] Failed to create language MediaRecorder with options:", options, "Error:", error)
        // Fallback to basic MediaRecorder
        mediaRecorderRef.current = new MediaRecorder(stream)
        console.log("[v0] Using fallback language MediaRecorder without options")
      }
      
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        await processLanguageSelection(audioBlob, activeSessionId)
        cleanupStream()
      }

      try {
        mediaRecorderRef.current.start(250)
        setIsRecording(true)
        isRecordingRef.current = true
        setStatus("listening")
        
        console.log("[v0] Language recording started with options:", options)
      } catch (startError) {
        console.error("[v0] Failed to start language MediaRecorder:", startError)
        cleanupStream()
        throw startError
      }
      
      visualizeAudio()
      startSilenceDetection()
    } catch (error) {
      console.error("[v0] Error starting language recording:", error)
      setIsAutoRecording(false)
      if (languageRetryCount >= 2) {
        setShowLanguageSelector(true)
        setStatus("awaiting_language")
      }
    }
  }, [sessionId, languageRetryCount])

  const cleanupStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      console.log("[v0] Stopping recording...")
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      isRecordingRef.current = false
      setStatus("processing")
      setAudioLevel(0)
      
      // Clear silence detection
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current)
        silenceTimeoutRef.current = null
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
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
      if (!analyserRef.current || !isRecordingRef.current) {
        console.log("[v0] Stopping silence detection")
        return
      }

      frameCount++
      
      // Check every 3rd frame for better performance (still ~20 times per second)
      if (frameCount % 3 === 0) {
        analyserRef.current.getByteFrequencyData(dataArray)
        const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length
        const normalizedLevel = average / 255

        // Debug audio analysis - reduced logging
        if (frameCount % 90 === 0) {
          console.log("[v0] Audio level:", normalizedLevel.toFixed(3), 
                     "Speech detected:", speechDetectedRef.current,
                     "Silence duration:", silenceStartTimeRef.current ? Date.now() - silenceStartTimeRef.current : 0)
        }

        // Check for fallback timeout if no speech detected
        const elapsed = Date.now() - startTime
        if (!speechDetectedRef.current && elapsed > FALLBACK_TIMEOUT) {
          console.log("[v0] Fallback timeout reached, stopping recording (no speech detected)")
          stopRecording()
          return
        }

        // Speech detection with proper threshold
        if (!speechDetectedRef.current && normalizedLevel > SPEECH_THRESHOLD) {
          speechDetectedRef.current = true
          console.log("[v0] Speech detected! Level:", normalizedLevel.toFixed(3), "Threshold:", SPEECH_THRESHOLD)
          silenceStartTimeRef.current = null
        }

        // Alternative detection for very quiet environments - check frequency data
        if (!speechDetectedRef.current && elapsed > 4000) {
          // Check if there's any variation in frequency data (indicating speech/sound)
          const maxValue = Math.max(...dataArray)
          const minValue = Math.min(...dataArray)
          const variation = maxValue - minValue
          
          if (variation > 10) { // Some frequency variation detected
            speechDetectedRef.current = true
            console.log("[v0] Speech detected via frequency variation! Variation:", variation)
            silenceStartTimeRef.current = null
          }
        }

        // Optimized silence detection
        if (speechDetectedRef.current) {
          if (normalizedLevel < SILENCE_THRESHOLD) {
            if (silenceStartTimeRef.current === null) {
              silenceStartTimeRef.current = Date.now()
              console.log("[v0] Silence started (after speech)")
            } else {
              const silenceDuration = Date.now() - silenceStartTimeRef.current
              if (silenceDuration >= SILENCE_DURATION) {
                console.log(`[v0] Silence detected for ${SILENCE_DURATION}ms, auto-stopping recording`)
                stopRecording()
                return
              }
            }
          } else {
            // Reset silence timer on sound
            if (silenceStartTimeRef.current !== null) {
              console.log("[v0] Sound detected, resetting silence timer")
              silenceStartTimeRef.current = null
            }
          }
        }
      }

      // Continue checking
      animationFrameRef.current = requestAnimationFrame(checkSilence)
    }

    checkSilence()
  }, [stopRecording])

  const visualizeAudio = useCallback(() => {
    if (!analyserRef.current) return

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
    let lastUpdate = 0
    const UPDATE_INTERVAL = 50 // Update every 50ms for smoother but not overwhelming updates

    const updateLevel = (currentTime: number) => {
      if (!analyserRef.current || !isRecordingRef.current) return

      // Throttle updates for better performance
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
    if (!sessionId) {
      console.error("[v0] Cannot send audio query: no session ID")
      return
    }

    // Debounce requests to prevent spam
    const now = Date.now()
    if (now - lastRequestTime.current < REQUEST_DEBOUNCE_TIME) {
      console.log("[v0] Request debounced, too soon after last request")
      return
    }
    lastRequestTime.current = now

    // Check for pending request to avoid duplicates
    const requestKey = `query-${sessionId}`
    if (pendingRequests.current.has(requestKey)) {
      console.log("[v0] Request already pending, skipping duplicate")
      return
    }

    try {
      console.log("[v0] Sending audio query, sessionId:", sessionId, "language:", selectedLanguage, "blob size:", audioBlob.size)
      
      // Optimized base64 conversion using FileReader promise
      const base64Audio = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          const base64 = reader.result as string
          resolve(base64.split(',')[1])
        }
        reader.onerror = reject
        reader.readAsDataURL(audioBlob)
      })

      console.log("[v0] Sending query to backend...")

      // Create and cache the request promise
      const requestPromise = fetch(`${API_BASE}/voice/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Connection": "keep-alive", // Reuse connections
        },
        body: JSON.stringify({
          session_id: sessionId,
          audio_base64: base64Audio,
          language: selectedLanguage.toLowerCase(),
        }),
      })

      pendingRequests.current.set(requestKey, requestPromise)

      const response = await requestPromise
      pendingRequests.current.delete(requestKey)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("[v0] Backend response received:", data)

      // Batch state updates for better performance
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
        isStreaming: true,
      }

      // Single state update for both messages
      setMessages((prev) => [...prev, userMessage, assistantMessage])

      // Play audio immediately without waiting
      if (data.audio_base64 || data.audio) {
        playAudio(data.audio_base64 || data.audio).catch(console.error)
      }

      // Optimize timing for better UX
      setTimeout(() => {
        setMessages((prev) => prev.map((msg) => ({ ...msg, isStreaming: false })))
        
        if (data.requires_camera) {
          setShowCamera(true)
        } else {
          setStatus("active")
        }
      }, 200) // Reduced delay

      setCurrentTranscript("")
    } catch (error) {
      console.error("[v0] Error sending audio query:", error)
      pendingRequests.current.delete(requestKey)
      setStatus("active")
      setCurrentTranscript("")

      // Handle errors with retry mechanism
      if (retryCount < 2) {
        setError("Connection issue. Retrying...")
        setRetryCount(prev => prev + 1)
        setTimeout(() => {
          setError(null)
          setRetryCount(0)
          // Retry the request
          sendAudioQuery(audioBlob)
        }, 2000)
      } else {
        setError("Please check your connection and try again")
        setTimeout(() => setError(null), 5000)
      }
    }
  }, [sessionId, selectedLanguage, retryCount])

  const processLanguageSelection = async (audioBlob: Blob, currentSessionId?: string) => {
    // Use passed sessionId or fallback to state
    const activeSessionId = currentSessionId || sessionId
    
    if (!activeSessionId) {
      console.error("[v0] No session ID for language selection - showing UI selector as fallback")
      setStatus("awaiting_language")
      setIsAutoRecording(false)
      setShowLanguageSelector(true)
      return
    }

    try {
      console.log("[v0] Processing language selection, sessionId:", activeSessionId, "audio blob size:", audioBlob.size)
      setStatus("processing")
      setIsAutoRecording(false)
      
      // Audio caching is now disabled globally

      // Convert audio blob to base64
      const reader = new FileReader()
      reader.readAsDataURL(audioBlob)
      
      const base64Audio = await new Promise<string>((resolve) => {
        reader.onloadend = () => {
          const base64 = reader.result as string
          const base64String = base64.split(',')[1]
          resolve(base64String)
        }
      })

      console.log("[v0] Sending to backend for language detection...")

      // Send to backend for language detection
      const response = await fetch(`${API_BASE}/voice/detect-language`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: activeSessionId,
          audio_base64: base64Audio,
        }),
      })

      const data = await response.json()
      console.log("[v0] Language detection response:", {
        language_detected: data.language_detected,
        language: data.language,
        text: data.text,
        hasAudio: !!data.audio,
        audioLength: data.audio ? data.audio.length : 0
      })

      if (data.language_detected && data.language) {
        // Language detected successfully
        const languageMap: { [key: string]: string } = {
          "english": "English",
          "hindi": "Hindi",
          "punjabi": "Punjabi",
          "marathi": "Marathi",
          "gujarati": "Gujarati",
          "tamil": "Tamil",
          "telugu": "Telugu",
          "kannada": "Kannada",
          "bengali": "Bengali",
        }

        const detectedLanguageName = languageMap[data.language] || "Hindi"
        console.log("[v0] Language detected:", data.language, "->", detectedLanguageName)
        setSelectedLanguage(detectedLanguageName)

        const confirmMessage: Message = {
          id: Date.now().toString(),
          text: data.text,
          audio: data.audio,
          sender: "assistant",
          timestamp: new Date(),
          isStreaming: true,
        }

        setMessages((prev) => [...prev, confirmMessage])

        if (data.audio) {
          console.log("[v0] Playing language confirmation audio, length:", data.audio.length)
          await playAudio(data.audio)
        } else {
          console.log("[v0] No audio in language detection response")
        }

        setTimeout(() => {
          setMessages((prev) => prev.map((msg) => ({ ...msg, isStreaming: false })))
          setStatus("active")
          setLanguageRetryCount(0)
          
          // Audio caching is disabled globally
          
          // Don't auto-start recording - let user initiate manually for better control
          // This prevents microphone conflicts and gives user time to understand
          console.log("[v0] Language detection complete - user can now start recording manually")
          // No auto-start recording here
        }, 1000)
      } else {
        // Language not detected, retry
        setLanguageRetryCount((prev) => prev + 1)
        
        if (languageRetryCount >= 2) {
          // After 3 retries, show UI selector
          setShowLanguageSelector(true)
          setStatus("awaiting_language")
          
          const fallbackMessage: Message = {
            id: Date.now().toString(),
            text: "कृपया नीचे दिए गए विकल्पों से अपनी भाषा चुनें। / Please select your language from the options below.",
            sender: "assistant",
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, fallbackMessage])
        } else {
          // Retry voice detection
          const retryMessage: Message = {
            id: Date.now().toString(),
            text: data.text || "कृपया फिर से अपनी भाषा बोलें। / Please speak your language again.",
            audio: data.audio,
            sender: "assistant",
            timestamp: new Date(),
            isStreaming: true,
          }

          setMessages((prev) => [...prev, retryMessage])

          if (data.audio) {
            await playAudio(data.audio)
          }

          setTimeout(() => {
            setMessages((prev) => prev.map((msg) => ({ ...msg, isStreaming: false })))
            setStatus("awaiting_language")
            // Auto-start recording again for retry
            setTimeout(() => {
              startRecordingForLanguage()
            }, 500)
          }, 1000)
        }
      }
    } catch (error) {
      console.error("[v0] Error processing language selection:", error)
      setLanguageRetryCount((prev) => prev + 1)
      
      if (languageRetryCount >= 2) {
        setShowLanguageSelector(true)
        setStatus("awaiting_language")
      } else {
        // Retry
        setTimeout(() => {
          startRecordingForLanguage()
        }, 1000)
      }
    }
  }

  const playAudio = useCallback(async (base64Audio: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      console.log("[v0] Playing audio (no caching), audio length:", base64Audio.length)
      
      // Always create a fresh audio element - no caching
      const audio = new Audio(`data:audio/mp3;base64,${base64Audio}`)
      audio.preload = 'auto'
      currentAudioRef.current = audio
      
      audio.onplay = () => {
        console.log("[v0] Audio started playing")
        setIsSpeaking(true)
        setIsPaused(false)
      }
      audio.onpause = () => {
        console.log("[v0] Audio paused")
        if (!audio.ended) setIsPaused(true)
      }
      audio.onended = () => {
        console.log("[v0] Audio finished playing")
        setIsSpeaking(false)
        setIsPaused(false)
        currentAudioRef.current = null
        resolve()
      }
      audio.onerror = (e) => {
        console.error("[v0] Audio playback error:", e)
        setIsSpeaking(false)
        setIsPaused(false)
        currentAudioRef.current = null
        reject(e)
      }
      
      // Play immediately
      audio.play().catch(e => {
        console.error("[v0] Audio play error:", e)
        setIsSpeaking(false)
        setIsPaused(false)
        currentAudioRef.current = null
        reject(e)
      })
    })
  }, [])
  
  const toggleAudioPause = useCallback(() => {
    const audio = currentAudioRef.current
    if (!audio) return
    
    if (isPaused || audio.paused) {
      audio.play()
    } else {
      audio.pause()
    }
  }, [isPaused])

  const handleLanguageSelection = async (languageName: string) => {
    if (!sessionId) return

    try {
      setStatus("processing")
      setShowLanguageSelector(false)

      // Map language name to code
      const languageMap: { [key: string]: string } = {
        "English": "english",
        "Hindi": "hindi",
        "Punjabi": "punjabi",
        "Marathi": "marathi",
        "Gujarati": "gujarati",
        "Tamil": "tamil",
        "Telugu": "telugu",
        "Kannada": "kannada",
        "Bengali": "bengali",
        "Malayalam": "malayalam"
      }

      const languageCode = languageMap[languageName] || "hindi"

      const response = await fetch(`${API_BASE}/voice/select-language`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
        isStreaming: true,
      }

      setMessages((prev) => [...prev, confirmMessage])

      if (data.audio) {
        await playAudio(data.audio)
      }

      setTimeout(() => {
        setMessages((prev) => prev.map((msg) => ({ ...msg, isStreaming: false })))
        setStatus("active")
        
        // Don't auto-start recording - let user click the microphone button
        console.log("[v0] Manual language selection complete - ready for user input")
      }, 400) // Reduced for faster flow
    } catch (error) {
      console.error("[v0] Error selecting language:", error)
      setStatus("awaiting_language")
      setShowLanguageSelector(true)
    }
  }

  const handleCameraDiagnosisComplete = async (diagnosis: string, audio: string) => {
    // Add diagnosis message
    const diagnosisMessage: Message = {
      id: Date.now().toString(),
      text: diagnosis,
      audio: audio,
      sender: "assistant",
      timestamp: new Date(),
      isStreaming: true,
    }

    setMessages((prev) => [...prev, diagnosisMessage])

    // Play diagnosis audio
    if (audio) {
      await playAudio(audio)
    }

    setTimeout(() => {
      setMessages((prev) => prev.map((msg) => ({ ...msg, isStreaming: false })))
      setStatus("active")
      setShowCamera(false)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50/50 to-teal-50 flex items-center justify-center p-2 sm:p-4 relative overflow-hidden">
      {showCamera && sessionId && (
        <CameraDiseaseDetector
          sessionId={sessionId}
          language={selectedLanguage.toLowerCase()}
          onClose={() => {
            setShowCamera(false)
            setStatus("active")
          }}
          onDiagnosisComplete={handleCameraDiagnosisComplete}
        />
      )}

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-48 h-48 sm:w-72 sm:h-72 bg-green-400/20 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-20 right-10 w-64 h-64 sm:w-96 sm:h-96 bg-emerald-400/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 sm:w-[600px] sm:h-[600px] bg-teal-400/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="w-full h-full max-w-7xl relative z-10 flex flex-col">
        <Card className="bg-white/95 backdrop-blur-xl shadow-2xl overflow-hidden border-2 border-green-200/50 rounded-2xl flex flex-col h-full">
          <div className="relative bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 p-4 sm:p-6 lg:p-8 border-b border-white/20">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />

            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4 flex-1">
                <div className="relative w-24 h-12 sm:w-32 sm:h-16 flex-shrink-0">
                  <Image
                    src="/logo.jpg"
                    alt="AI Lifebot - Kisan Suvidha Kendra"
                    fill
                    className="object-contain drop-shadow-lg"
                    priority
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-balance mb-1 sm:mb-2 drop-shadow-lg leading-tight">
                    🌾 किसान सहायक
                  </h1>
                  <p className="text-white/90 text-sm sm:text-base lg:text-lg text-pretty drop-shadow leading-relaxed">
                    AI-Powered Farming Intelligence
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start lg:self-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 h-10 w-10 rounded-full transition-all duration-200 hover:scale-105"
                  onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                  title="Change Language"
                >
                  <Languages className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 h-10 w-10 rounded-full transition-all duration-200 hover:scale-105"
                  onClick={() => setShowStats(!showStats)}
                  title="View Session History"
                >
                  <History className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 h-10 w-10 rounded-full transition-all duration-200 hover:scale-105"
                  title="Settings"
                >
                  <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </div>
            </div>

            <div className="mt-3 sm:mt-4 inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
              <Languages className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
              <span className="text-sm font-medium text-white">{selectedLanguage}</span>
            </div>
          </div>

          {showLanguageSelector && (
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onSelectLanguage={async (lang) => {
                await handleLanguageSelection(lang)
              }}
              onClose={() => setShowLanguageSelector(false)}
            />
          )}

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
            {status === "idle" ? (
              <div className="flex flex-col items-center justify-center py-8 sm:py-12 lg:py-16 space-y-6 sm:space-y-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500/30 rounded-full blur-3xl animate-pulse-ring" />
                  <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-2xl animate-ripple" />

                  <Button
                    size="lg"
                    onClick={startSession}
                    className="relative h-32 w-32 sm:h-40 sm:w-40 rounded-full text-lg sm:text-xl font-bold shadow-2xl hover:shadow-green-500/50 transition-all duration-500 hover:scale-110 bg-gradient-to-br from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-4 border-white/30 group focus:outline-none focus:ring-4 focus:ring-green-500/50"
                    aria-label="Start voice assistant session"
                  >
                    <div className="flex flex-col items-center gap-2 sm:gap-3">
                      <div className="relative">
                        <Mic className="h-12 w-12 sm:h-16 sm:w-16 transition-transform group-hover:scale-110" />
                        <div className="absolute inset-0 bg-white/20 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                      </div>
                      <span className="text-base sm:text-lg drop-shadow-lg">Start</span>
                    </div>
                  </Button>
                </div>

                <div className="text-center space-y-4 sm:space-y-6 max-w-3xl">
                  <div className="space-y-2">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                      Welcome to Kisan Suvidha Kendra! 👋
                    </h2>
                    <p className="text-base sm:text-lg text-gray-700 text-pretty font-medium leading-relaxed">
                      Your intelligent farming companion is ready to help with crop guidance, disease detection, and agricultural advice
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div className="group p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-green-50 to-green-100/50 border-2 border-green-200/50 hover:border-green-400 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-default">
                      <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 bg-green-500 rounded-xl group-hover:scale-110 transition-transform duration-300">
                        <Volume2 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-green-900 mb-1">Voice First</h3>
                      <p className="text-xs sm:text-sm text-green-700 leading-relaxed">Natural conversation in your preferred language</p>
                    </div>
                    <div className="group p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-2 border-emerald-200/50 hover:border-emerald-400 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-default">
                      <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 bg-emerald-500 rounded-xl group-hover:scale-110 transition-transform duration-300">
                        <Languages className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-emerald-900 mb-1">Multi-lingual</h3>
                      <p className="text-xs sm:text-sm text-emerald-700 leading-relaxed">Supports 10+ Indian languages</p>
                    </div>
                    <div className="group p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-teal-50 to-teal-100/50 border-2 border-teal-200/50 hover:border-teal-400 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-default">
                      <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 bg-teal-500 rounded-xl group-hover:scale-110 transition-transform duration-300">
                        <History className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-teal-900 mb-1">Smart Memory</h3>
                      <p className="text-xs sm:text-sm text-teal-700 leading-relaxed">Remembers your context and preferences</p>
                    </div>
                  </div>

                  <div className="mt-6 sm:mt-8 p-4 rounded-xl bg-blue-50 border border-blue-200/50">
                    <p className="text-sm text-blue-800 font-medium flex items-center gap-2">
                      <span className="text-blue-600">💡</span>
                      <strong>Pro Tip:</strong> You can ask about crop diseases, weather advice, market prices, government schemes, and more!
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col min-h-0">
                {showStats && (
                  <div className="flex-shrink-0 mb-4">
                    <SessionStats messages={messages} sessionId={sessionId} />
                  </div>
                )}

                <div className="flex-1 min-h-0 overflow-y-auto">
                  <MessageList
                    messages={messages}
                    isThinking={status === "processing"}
                    isListening={status === "listening"}
                    isSpeaking={isSpeaking}
                    currentTranscript=""
                  />
                </div>


                {/* Error display */}
                {error && (
                  <div className="flex-shrink-0 bg-red-50 border border-red-200 rounded-lg p-2 sm:p-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-red-500">⚠️</span>
                      <p className="text-xs sm:text-sm text-red-700 font-medium">{error}</p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col items-center gap-3 sm:gap-4 pt-2 sm:pt-4 pb-4">
                  <div className="relative">
                    {(isRecording && status === "listening") && (
                      <>
                        <div className="absolute inset-0 bg-green-500/30 rounded-full blur-2xl animate-pulse-ring" />
                        <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-ripple" />
                      </>
                    )}

                    {(status === "processing") ? (
                      <Button size="lg" disabled className="h-20 w-20 sm:h-24 sm:w-24 rounded-full shadow-xl relative bg-gradient-to-br from-green-600 to-emerald-600 text-white">
                        <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 animate-spin" />
                      </Button>
                    ) : isSpeaking ? (
                      <div className="flex flex-col items-center gap-3">
                        <Button
                          size="lg"
                          onClick={toggleAudioPause}
                          className="h-20 w-20 sm:h-24 sm:w-24 rounded-full shadow-xl relative bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white transition-all hover:scale-105"
                        >
                          {isPaused ? (
                            <svg className="h-8 w-8 sm:h-10 sm:w-10" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          ) : (
                            <svg className="h-8 w-8 sm:h-10 sm:w-10" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                            </svg>
                          )}
                        </Button>
                        <p className="text-xs text-gray-600">
                          {isPaused ? "Resume" : "Pause"}
                        </p>
                      </div>
                    ) : (
                      <Button
                        size="lg"
                        onClick={isRecording ? stopRecording : startRecording}
                        disabled={isSpeaking}
                        className={`h-20 w-20 sm:h-24 sm:w-24 rounded-full transition-all duration-300 shadow-xl relative group border-4 border-white/50 touch-manipulation ${
                          isRecording && status === "listening"
                            ? "bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white animate-pulse active:scale-95"
                            : "bg-gradient-to-br from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white hover:scale-105 hover:shadow-2xl active:scale-95"
                        } ${isSpeaking ? "opacity-75 cursor-not-allowed" : "opacity-100"}`}
                        aria-label={isRecording ? "Stop recording" : "Start recording"}
                      >
                        {isRecording && status === "listening" ? (
                          <MicOff className="h-8 w-8 sm:h-10 sm:w-10 transition-transform group-hover:scale-110" />
                        ) : (
                          <Mic className="h-8 w-8 sm:h-10 sm:w-10 transition-transform group-hover:scale-110" />
                        )}
                      </Button>
                    )}
                  </div>

                  <div className="text-center space-y-1 max-w-md">
                    <p className="text-xs sm:text-sm font-semibold text-gray-800 leading-tight">
                      {status === "awaiting_language" && isAutoRecording && "Listening for language..."}
                      {status === "awaiting_language" && !isAutoRecording && "Please select your language"}
                      {status === "processing" && "Processing..."}
                      {status === "active" && !isSpeaking && "Ready - Tap microphone"}
                      {status === "active" && isSpeaking && !isPaused && "Speaking..."}
                      {status === "active" && isSpeaking && isPaused && "Paused"}
                    </p>
                    {status === "active" && !isSpeaking && (
                      <p className="text-xs text-gray-600 leading-tight">
                        Ask about farming, crops, weather, or plant diseases
                      </p>
                    )}

                    {/* Keyboard shortcuts hint */}
                    {!isSpeaking && (
                      <p className="text-xs text-gray-500 mt-1">
                        💡 {status === "active" ? "Press Space to record, Esc to stop" : "Press Enter to start"}
                      </p>
                    )}

                    {/* Manual language selection fallback */}
                    {status === "awaiting_language" && isAutoRecording && (
                      <div className="mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            stopRecording()
                            setIsAutoRecording(false)
                            setShowLanguageSelector(true)
                          }}
                          className="bg-white/90 hover:bg-white border-green-300 text-green-700 hover:text-green-800 transition-all duration-200 hover:scale-105 text-xs"
                        >
                          Skip Voice Detection
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
