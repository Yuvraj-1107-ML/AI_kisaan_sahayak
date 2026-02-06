"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Volume2 } from "lucide-react"
import { useCallback } from "react"

export interface VernacularText {
  english: string
  hindi: string
  punjabi?: string
  marathi?: string
  gujarati?: string
  tamil?: string
  telugu?: string
  kannada?: string
  bengali?: string
  malayalam?: string
}

interface VernacularButtonProps {
  text: VernacularText
  language: string
  icon?: React.ReactNode
  onClick?: () => void
  className?: string
  size?: "sm" | "default" | "lg" | "xl"
  variant?: "default" | "outline" | "ghost"
  withAudio?: boolean
}

export function VernacularButton({
  text,
  language,
  icon,
  onClick,
  className = "",
  size = "default",
  variant = "default",
  withAudio = false
}: VernacularButtonProps) {
  const getLocalizedText = useCallback(() => {
    const lang = language.toLowerCase()
    switch (lang) {
      case 'hindi':
        return text.hindi
      case 'punjabi':
        return text.punjabi || text.hindi
      case 'marathi':
        return text.marathi || text.hindi
      case 'gujarati':
        return text.gujarati || text.hindi
      case 'tamil':
        return text.tamil || text.english
      case 'telugu':
        return text.telugu || text.english
      case 'kannada':
        return text.kannada || text.english
      case 'bengali':
        return text.bengali || text.english
      case 'malayalam':
        return text.malayalam || text.english
      default:
        return text.english
    }
  }, [language, text])

  const speakText = useCallback(() => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(getLocalizedText())
      utterance.lang = getLanguageCode(language)
      window.speechSynthesis.speak(utterance)
    }
  }, [language, getLocalizedText])

  const sizeClasses = {
    sm: 'text-sm px-3 py-1.5',
    default: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3',
    xl: 'text-2xl px-8 py-4'
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="inline-block"
    >
      <Button
        onClick={onClick}
        variant={variant}
        className={`${sizeClasses[size]} ${className} font-semibold relative group`}
      >
        {icon && <span className="mr-2">{icon}</span>}
        <span>{getLocalizedText()}</span>
        {withAudio && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              speakText()
            }}
            className="ml-2 p-1 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Play audio"
          >
            <Volume2 className="h-4 w-4" />
          </button>
        )}
      </Button>
    </motion.div>
  )
}

interface VernacularLabelProps {
  text: VernacularText
  language: string
  className?: string
  size?: "sm" | "base" | "lg" | "xl" | "2xl"
}

export function VernacularLabel({
  text,
  language,
  className = "",
  size = "base"
}: VernacularLabelProps) {
  const getLocalizedText = useCallback(() => {
    const lang = language.toLowerCase()
    switch (lang) {
      case 'hindi':
        return text.hindi
      case 'punjabi':
        return text.punjabi || text.hindi
      case 'marathi':
        return text.marathi || text.hindi
      case 'gujarati':
        return text.gujarati || text.hindi
      case 'tamil':
        return text.tamil || text.english
      case 'telugu':
        return text.telugu || text.english
      case 'kannada':
        return text.kannada || text.english
      case 'bengali':
        return text.bengali || text.english
      case 'malayalam':
        return text.malayalam || text.english
      default:
        return text.english
    }
  }, [language, text])

  const sizeClasses = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl'
  }

  return (
    <motion.span
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${sizeClasses[size]} ${className} font-medium`}
    >
      {getLocalizedText()}
    </motion.span>
  )
}

interface IconTextCardProps {
  icon: string
  text: VernacularText
  language: string
  onClick?: () => void
  className?: string
}

export function IconTextCard({
  icon,
  text,
  language,
  onClick,
  className = ""
}: IconTextCardProps) {
  const getLocalizedText = () => {
    const lang = language.toLowerCase()
    switch (lang) {
      case 'hindi':
        return text.hindi
      case 'punjabi':
        return text.punjabi || text.hindi
      case 'marathi':
        return text.marathi || text.hindi
      case 'gujarati':
        return text.gujarati || text.hindi
      case 'tamil':
        return text.tamil || text.english
      case 'telugu':
        return text.telugu || text.english
      case 'kannada':
        return text.kannada || text.english
      case 'bengali':
        return text.bengali || text.english
      case 'malayalam':
        return text.malayalam || text.english
      default:
        return text.english
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        flex flex-col items-center gap-3 p-6 
        bg-gradient-to-br from-white to-green-50 
        rounded-2xl border-2 border-green-200 
        shadow-lg hover:shadow-xl 
        cursor-pointer transition-all
        ${className}
      `}
    >
      <div className="text-5xl">{icon}</div>
      <p className="text-center text-base font-semibold text-gray-800 leading-tight">
        {getLocalizedText()}
      </p>
    </motion.div>
  )
}

// Helper function to get language code for speech synthesis
function getLanguageCode(language: string): string {
  const codes: { [key: string]: string } = {
    'english': 'en-IN',
    'hindi': 'hi-IN',
    'punjabi': 'pa-IN',
    'marathi': 'mr-IN',
    'gujarati': 'gu-IN',
    'tamil': 'ta-IN',
    'telugu': 'te-IN',
    'kannada': 'kn-IN',
    'bengali': 'bn-IN',
    'malayalam': 'ml-IN'
  }
  return codes[language.toLowerCase()] || 'en-IN'
}

// Predefined common texts in multiple languages
export const COMMON_TEXTS = {
  start: {
    english: "Start",
    hindi: "शुरू करें",
    punjabi: "ਸ਼ੁਰੂ ਕਰੋ",
    marathi: "सुरू करा",
    gujarati: "શરૂ કરો",
    tamil: "தொடங்கு",
    telugu: "ప్రారంభించు",
  },
  record: {
    english: "Record",
    hindi: "रिकॉर्ड करें",
    punjabi: "ਰਿਕਾਰਡ ਕਰੋ",
    marathi: "रेकॉर्ड करा",
    gujarati: "રેકોર્ડ કરો",
    tamil: "பதிவு செய்",
    telugu: "రికార్డ్ చేయండి",
  },
  stop: {
    english: "Stop",
    hindi: "बंद करें",
    punjabi: "ਬੰਦ ਕਰੋ",
    marathi: "थांबवा",
    gujarati: "બંધ કરો",
    tamil: "நிறுத்து",
    telugu: "ఆపు",
  },
  next: {
    english: "Next Question",
    hindi: "अगला सवाल",
    punjabi: "ਅਗਲਾ ਸਵਾਲ",
    marathi: "पुढील प्रश्न",
    gujarati: "આગળનો પ્રશ્ન",
    tamil: "அடுத்த கேள்வி",
    telugu: "తదుపరి ప్రశ్న",
  },
  listening: {
    english: "Listening...",
    hindi: "सुन रहा हूं...",
    punjabi: "ਸੁਣ ਰਿਹਾ ਹਾਂ...",
    marathi: "ऐकत आहे...",
    gujarati: "સાંભળી રહ્યો છું...",
    tamil: "கேட்கிறேன்...",
    telugu: "వింటున్నాను...",
  },
  processing: {
    english: "Processing...",
    hindi: "प्रोसेस हो रहा है...",
    punjabi: "ਪ੍ਰਕਿਰਿਆ ਕਰ ਰਿਹਾ ਹੈ...",
    marathi: "प्रक्रिया करत आहे...",
    gujarati: "પ્રક્રિયા કરી રહ્યું છે...",
    tamil: "செயலாக்கம்...",
    telugu: "ప్రాసెస్ చేస్తోంది...",
  }
}


