"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Check, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"

export interface ConversationStep {
  id: string
  label: {
    english: string
    hindi: string
    [key: string]: string
  }
  icon: string
  status: "pending" | "active" | "completed"
}

interface ConversationProgressProps {
  steps: ConversationStep[]
  language?: string
  className?: string
}

export function ConversationProgress({
  steps,
  language = "hindi",
  className = ""
}: ConversationProgressProps) {
  const getLocalizedLabel = (step: ConversationStep) => {
    const lang = language.toLowerCase()
    return step.label[lang] || step.label.english
  }

  return (
    <Card className={`p-6 bg-gradient-to-br from-white to-green-50/50 border-2 border-green-200/50 shadow-lg ${className}`}>
      <div className="space-y-4">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative flex items-center gap-4"
          >
            {/* Step Indicator */}
            <div className="relative flex-shrink-0">
              <motion.div
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center text-xl
                  border-2 transition-all duration-300
                  ${
                    step.status === "completed"
                      ? "bg-green-600 border-green-600 text-white"
                      : step.status === "active"
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "bg-gray-100 border-gray-300 text-gray-400"
                  }
                `}
                animate={step.status === "active" ? {
                  scale: [1, 1.1, 1],
                } : {}}
                transition={{
                  duration: 2,
                  repeat: step.status === "active" ? Infinity : 0,
                }}
              >
                {step.status === "completed" ? (
                  <Check className="h-6 w-6" />
                ) : step.status === "active" ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <span>{step.icon}</span>
                )}
              </motion.div>

              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div className="absolute top-12 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-gray-300">
                  <motion.div
                    className="w-full bg-green-600"
                    initial={{ height: 0 }}
                    animate={{
                      height: step.status === "completed" ? "100%" : "0%"
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              )}
            </div>

            {/* Step Content */}
            <div className="flex-1">
              <motion.p
                className={`font-semibold transition-colors ${
                  step.status === "completed" || step.status === "active"
                    ? "text-gray-800"
                    : "text-gray-400"
                }`}
              >
                {getLocalizedLabel(step)}
              </motion.p>
              {step.status === "active" && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-blue-600 mt-1"
                >
                  {language === "hindi" ? "प्रगति में..." : "In progress..."}
                </motion.p>
              )}
            </div>

            {/* Status Badge */}
            <AnimatePresence>
              {step.status === "completed" && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex-shrink-0 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full"
                >
                  ✓ {language === "hindi" ? "पूर्ण" : "Done"}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </Card>
  )
}

interface QuickActionCard {
  id: string
  icon: string
  label: {
    english: string
    hindi: string
    [key: string]: string
  }
  onClick: () => void
}

interface QuickActionsProps {
  actions: QuickActionCard[]
  language?: string
  className?: string
}

export function QuickActions({
  actions,
  language = "hindi",
  className = ""
}: QuickActionsProps) {
  const getLocalizedLabel = (action: QuickActionCard) => {
    const lang = language.toLowerCase()
    return action.label[lang] || action.label.english
  }

  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 ${className}`}>
      {actions.map((action, index) => (
        <motion.button
          key={action.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={action.onClick}
          className="
            flex flex-col items-center gap-3 p-4
            bg-gradient-to-br from-white to-blue-50
            rounded-xl border-2 border-blue-200
            shadow-md hover:shadow-lg
            transition-all cursor-pointer
          "
        >
          <div className="text-4xl">{action.icon}</div>
          <p className="text-sm font-semibold text-gray-800 text-center leading-tight">
            {getLocalizedLabel(action)}
          </p>
        </motion.button>
      ))}
    </div>
  )
}

interface OnboardingTooltipProps {
  title: {
    english: string
    hindi: string
    [key: string]: string
  }
  description: {
    english: string
    hindi: string
    [key: string]: string
  }
  language?: string
  onClose?: () => void
}

export function OnboardingTooltip({
  title,
  description,
  language = "hindi",
  onClose
}: OnboardingTooltipProps) {
  const getLocalizedText = (text: { [key: string]: string }) => {
    const lang = language.toLowerCase()
    return text[lang] || text.english
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="fixed bottom-24 left-1/2 -translate-x-1/2 max-w-md z-50"
    >
      <Card className="p-6 bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-2xl border-2 border-blue-400">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 text-3xl">💡</div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-2">{getLocalizedText(title)}</h3>
            <p className="text-sm leading-relaxed opacity-90">
              {getLocalizedText(description)}
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="flex-shrink-0 text-white/80 hover:text-white transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </Card>
    </motion.div>
  )
}

// Default steps for farming conversation
export const DEFAULT_CONVERSATION_STEPS: ConversationStep[] = [
  {
    id: "greeting",
    label: {
      english: "Welcome & Language",
      hindi: "स्वागत और भाषा",
      marathi: "स्वागत आणि भाषा"
    },
    icon: "👋",
    status: "pending"
  },
  {
    id: "query",
    label: {
      english: "Your Question",
      hindi: "आपका सवाल",
      marathi: "तुमचा प्रश्न"
    },
    icon: "❓",
    status: "pending"
  },
  {
    id: "processing",
    label: {
      english: "AI Analysis",
      hindi: "AI विश्लेषण",
      marathi: "AI विश्लेषण"
    },
    icon: "🤖",
    status: "pending"
  },
  {
    id: "response",
    label: {
      english: "Your Answer",
      hindi: "आपका जवाब",
      marathi: "तुमचे उत्तर"
    },
    icon: "💡",
    status: "pending"
  }
]


