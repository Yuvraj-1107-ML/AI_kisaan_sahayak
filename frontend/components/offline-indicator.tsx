"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { WifiOff, Wifi, RefreshCw, AlertCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface OfflineIndicatorProps {
  language?: string
}

export default function OfflineIndicator({ language = "hindi" }: OfflineIndicatorProps) {
  const [isOnline, setIsOnline] = useState(true)
  const [wasOffline, setWasOffline] = useState(false)
  const [pendingMessages, setPendingMessages] = useState(0)

  useEffect(() => {
    // Check initial online status
    setIsOnline(navigator.onLine)

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true)
      setWasOffline(true)
      
      // Hide "back online" message after 3 seconds
      setTimeout(() => setWasOffline(false), 3000)
      
      // Trigger sync of pending messages
      syncPendingMessages()
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Load pending messages count from localStorage
    loadPendingCount()

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const loadPendingCount = () => {
    try {
      const pending = localStorage.getItem('pending_messages')
      if (pending) {
        const messages = JSON.parse(pending)
        setPendingMessages(messages.length || 0)
      }
    } catch (error) {
      console.error('Failed to load pending messages:', error)
    }
  }

  const syncPendingMessages = async () => {
    try {
      const pending = localStorage.getItem('pending_messages')
      if (pending) {
        const messages = JSON.parse(pending)
        // TODO: Sync messages with backend
        console.log('Syncing pending messages:', messages)
        
        // Clear pending messages after sync
        localStorage.removeItem('pending_messages')
        setPendingMessages(0)
      }
    } catch (error) {
      console.error('Failed to sync messages:', error)
    }
  }

  const getOfflineText = () => {
    switch (language.toLowerCase()) {
      case 'hindi':
        return {
          offline: 'इंटरनेट कनेक्शन नहीं है',
          pending: `${pendingMessages} संदेश भेजने के लिए प्रतीक्षारत`,
          reconnecting: 'पुनः कनेक्ट हो रहा है...',
          backOnline: 'इंटरनेट कनेक्शन वापस आ गया!',
          localOnly: 'केवल स्थानीय सुविधाएं उपलब्ध हैं'
        }
      case 'marathi':
        return {
          offline: 'इंटरनेट कनेक्शन नाही',
          pending: `${pendingMessages} संदेश पाठवण्याची प्रतीक्षा`,
          reconnecting: 'पुन्हा कनेक्ट होत आहे...',
          backOnline: 'इंटरनेट कनेक्शन परत आले!',
          localOnly: 'फक्त स्थानिक सुविधा उपलब्ध'
        }
      case 'punjabi':
        return {
          offline: 'ਇੰਟਰਨੈੱਟ ਕਨੈਕਸ਼ਨ ਨਹੀਂ ਹੈ',
          pending: `${pendingMessages} ਸੁਨੇਹੇ ਭੇਜਣ ਦੀ ਉਡੀਕ`,
          reconnecting: 'ਦੁਬਾਰਾ ਕਨੈਕਟ ਹੋ ਰਿਹਾ ਹੈ...',
          backOnline: 'ਇੰਟਰਨੈੱਟ ਕਨੈਕਸ਼ਨ ਵਾਪਸ ਆ ਗਿਆ!',
          localOnly: 'ਸਿਰਫ਼ ਸਥਾਨਕ ਸੁਵਿਧਾਵਾਂ ਉਪਲਬਧ ਹਨ'
        }
      default:
        return {
          offline: 'No Internet Connection',
          pending: `${pendingMessages} messages waiting to send`,
          reconnecting: 'Reconnecting...',
          backOnline: 'Back Online!',
          localOnly: 'Only local features available'
        }
    }
  }

  const text = getOfflineText()

  return (
    <AnimatePresence>
      {(!isOnline || wasOffline) && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="fixed top-0 left-0 right-0 z-50 px-4 pt-4"
        >
          <Card
            className={`
              p-4 shadow-2xl border-2
              ${
                isOnline && wasOffline
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 border-green-400'
                  : 'bg-gradient-to-r from-red-500 to-orange-600 border-red-400'
              }
            `}
          >
            <div className="flex items-center gap-4">
              {/* Icon */}
              <div className="flex-shrink-0">
                <motion.div
                  animate={{
                    rotate: isOnline ? 0 : [0, -10, 10, -10, 0],
                    scale: wasOffline ? [1, 1.2, 1] : 1
                  }}
                  transition={{
                    rotate: { duration: 0.5, repeat: !isOnline ? Infinity : 0 },
                    scale: { duration: 0.5 }
                  }}
                >
                  {isOnline && wasOffline ? (
                    <Wifi className="h-8 w-8 text-white" />
                  ) : (
                    <WifiOff className="h-8 w-8 text-white" />
                  )}
                </motion.div>
              </div>

              {/* Message */}
              <div className="flex-1">
                <p className="text-white font-bold text-lg">
                  {isOnline && wasOffline ? text.backOnline : text.offline}
                </p>
                {!isOnline && (
                  <div className="space-y-1">
                    <p className="text-white/90 text-sm">{text.localOnly}</p>
                    {pendingMessages > 0 && (
                      <p className="text-white/80 text-xs flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {text.pending}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Sync Button */}
              {isOnline && wasOffline && pendingMessages > 0 && (
                <Button
                  onClick={syncPendingMessages}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync
                </Button>
              )}
            </div>

            {/* Progress Bar for Reconnecting */}
            {!isOnline && (
              <div className="mt-3 relative h-1 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-white/50"
                  animate={{
                    x: ['0%', '100%', '0%']
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                  style={{ width: '30%' }}
                />
              </div>
            )}
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Hook to check online status
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
}

// Queue messages for later sync
export function queueMessage(message: any) {
  try {
    const pending = localStorage.getItem('pending_messages')
    const messages = pending ? JSON.parse(pending) : []
    messages.push({
      ...message,
      timestamp: new Date().toISOString(),
      queued: true
    })
    localStorage.setItem('pending_messages', JSON.stringify(messages))
  } catch (error) {
    console.error('Failed to queue message:', error)
  }
}


