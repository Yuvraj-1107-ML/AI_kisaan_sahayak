"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mic, X, MessageSquare, Camera } from "lucide-react"
import Link from "next/link"

export default function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false)

  const actions = [
    {
      icon: Mic,
      label: "Live Avatar",
      href: "/conversation-avatar",
      color: "from-emerald-500 to-emerald-600",
      delay: 0
    },
    {
      icon: MessageSquare,
      label: "Voice Chat",
      href: "/conversation",
      color: "from-teal-500 to-teal-600",
      delay: 0.1
    },
    {
      icon: Camera,
      label: "Disease Check",
      href: "/conversation-avatar",
      color: "from-amber-500 to-amber-600",
      delay: 0.2
    },
  ]

  return (
    <div className="fixed bottom-24 right-8 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div className="absolute bottom-20 right-0 flex flex-col gap-3">
            {actions.map((action, index) => {
              const Icon = action.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0, x: 20 }}
                  transition={{ delay: action.delay }}
                >
                  <Link href={action.href}>
                    <motion.button
                      whileHover={{ scale: 1.1, x: -5 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center gap-3 px-5 py-3 bg-gradient-to-r ${action.color} text-white rounded-full shadow-xl hover:shadow-2xl transition-shadow`}
                      aria-label={action.label}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-semibold whitespace-nowrap">{action.label}</span>
                    </motion.button>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`h-16 w-16 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-2xl flex items-center justify-center ${
          isOpen ? 'shadow-emerald-500/50' : 'shadow-teal-500/50'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          rotate: isOpen ? 135 : 0,
          boxShadow: isOpen 
            ? "0 20px 50px rgba(16, 185, 129, 0.5)" 
            : "0 10px 30px rgba(20, 184, 166, 0.5)"
        }}
        transition={{ duration: 0.3 }}
        aria-label={isOpen ? "Close quick actions" : "Open quick actions"}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-7 w-7" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Mic className="h-7 w-7" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Pulse effect when closed */}
      {!isOpen && (
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
      )}
    </div>
  )
}

