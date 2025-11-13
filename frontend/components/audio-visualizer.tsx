"use client"

import { memo, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface AudioVisualizerProps {
  isActive: boolean
  level: number
  language?: string
}

function AudioVisualizer({ isActive, level, language = "hindi" }: AudioVisualizerProps) {
  const bars = useMemo(() => Array.from({ length: 40 }, (_, i) => i), []) // More bars for richer visualization

  // Language-based color schemes
  const colorScheme = useMemo(() => {
    switch (language.toLowerCase()) {
      case 'hindi':
        return { hue: 140, saturation: 65, name: 'Emerald' } // Green
      case 'english':
        return { hue: 220, saturation: 70, name: 'Blue' }
      case 'marathi':
        return { hue: 35, saturation: 75, name: 'Orange' }
      case 'punjabi':
        return { hue: 45, saturation: 80, name: 'Gold' }
      default:
        return { hue: 140, saturation: 65, name: 'Emerald' }
    }
  }, [language])

  const barElements = useMemo(() => {
    return bars.map((i) => {
      const angle = (i / bars.length) * Math.PI * 2
      const baseHeight = 15 + Math.sin(i * 0.3) * 8
      const activeHeight = baseHeight + level * 80
      const scale = isActive ? 1 + level * 0.3 : 1

      return (
        <motion.div
          key={i}
          className="rounded-full"
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{
            scaleY: isActive ? scale : 0.5,
            height: isActive ? `${activeHeight}%` : `${baseHeight}%`,
            opacity: isActive ? Math.max(0.7, 0.85 + level * 0.15) : 0.3,
          }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: i * 0.01
          }}
          style={{
            width: '3px',
            background: `linear-gradient(to top, 
              hsl(${colorScheme.hue + i * 0.5}, ${colorScheme.saturation}%, ${40 + i * 0.3}%), 
              hsl(${colorScheme.hue + 20 + i * 0.5}, ${colorScheme.saturation + 5}%, ${60 + i * 0.3}%))`,
            transformOrigin: 'center',
          }}
        />
      )
    })
  }, [bars, isActive, level, colorScheme])

  return (
    <div className="relative">
      {/* Animated Glow Background */}
      <motion.div 
        className="absolute inset-0 rounded-3xl blur-3xl"
        animate={isActive ? {
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.05, 1],
        } : { opacity: 0.1 }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{
          background: `radial-gradient(circle, 
            hsl(${colorScheme.hue}, ${colorScheme.saturation}%, 60%) 0%, 
            hsl(${colorScheme.hue + 20}, ${colorScheme.saturation}%, 70%) 50%,
            transparent 100%)`
        }}
      />

      {/* Main Visualizer Container */}
      <motion.div 
        className="relative flex items-end justify-center gap-1 h-40 px-8 py-6 rounded-3xl bg-gradient-to-br from-white/90 to-green-50/80 backdrop-blur-xl border-2 border-green-200/60 shadow-2xl"
        animate={isActive ? {
          boxShadow: [
            '0 10px 30px rgba(16, 185, 129, 0.2)',
            '0 20px 40px rgba(16, 185, 129, 0.4)',
            '0 10px 30px rgba(16, 185, 129, 0.2)',
          ]
        } : {}}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {/* 3D Frequency Bars */}
        <div className="flex items-end justify-center gap-1 h-full w-full">
          {barElements}
        </div>

        {/* Center Pulse Effect when active */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.6, 0.3, 0.6]
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 rounded-3xl border-2"
              style={{
                borderColor: `hsl(${colorScheme.hue}, ${colorScheme.saturation}%, 60%)`
              }}
            />
          )}
        </AnimatePresence>

        {/* Frequency Spectrum Label */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 bg-white/80 rounded-full">
          <motion.div
            animate={isActive ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="w-2 h-2 rounded-full"
            style={{
              background: `hsl(${colorScheme.hue}, ${colorScheme.saturation}%, 50%)`
            }}
          />
          <span className="text-xs font-semibold text-gray-700">
            {isActive ? 'Recording...' : 'Ready'}
          </span>
        </div>
      </motion.div>

      {/* Status Indicator */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute -top-2 -right-2"
          >
            <div className="relative">
              <motion.div 
                className="absolute inset-0 rounded-full blur-md"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.3, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{
                  background: `hsl(${colorScheme.hue}, ${colorScheme.saturation}%, 50%)`
                }}
              />
              <div 
                className="relative h-4 w-4 rounded-full"
                style={{
                  background: `hsl(${colorScheme.hue}, ${colorScheme.saturation}%, 50%)`
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Memoize the component to prevent unnecessary re-renders
export default memo(AudioVisualizer)
