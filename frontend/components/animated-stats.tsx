"use client"

import { motion, useInView, useMotionValue, useSpring } from "framer-motion"
import { useEffect, useRef, useState } from "react"

interface AnimatedStatsProps {
  stats: Array<{
    value: string
    label: string
  }>
}

function AnimatedNumber({ value }: { value: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  
  // Check if value contains "/" (like "24/7") or is non-numeric (like "Kiosk")
  const hasSlash = value.includes('/')
  const isNonNumeric = isNaN(parseInt(value.replace(/\D/g, '')))
  
  // Parse value based on type
  let numericValue = 0
  let suffix = ''
  let secondPart = ''
  
  if (hasSlash) {
    const parts = value.split('/')
    numericValue = parseInt(parts[0]) || 0
    secondPart = parts[1] || ''
  } else if (!isNonNumeric) {
    numericValue = parseInt(value.replace(/\D/g, '')) || 0
    suffix = value.replace(/\d/g, '')
  }
  
  // Initialize displayValue with the final value to prevent hydration mismatch
  // Server and client will both render numericValue initially
  const [displayValue, setDisplayValue] = useState(numericValue)
  
  // Always use hooks at top level
  const motionValue = useMotionValue(numericValue)
  const springValue = useSpring(motionValue, {
    damping: 50,
    stiffness: 100,
  })

  // Set mounted state on client and start animation
  useEffect(() => {
    setMounted(true)
    // Only animate numeric values
    if (!isNonNumeric) {
      // Reset to 0, then animate to target
      setDisplayValue(0)
      motionValue.set(0)
      // Small delay to ensure state is set
      setTimeout(() => {
        if (isInView) {
          motionValue.set(numericValue)
        }
      }, 50)
    }
  }, []) // Empty deps - only run once on mount

  useEffect(() => {
    if (mounted && isInView && !isNonNumeric) {
      motionValue.set(numericValue)
    }
  }, [mounted, isInView, numericValue, motionValue, isNonNumeric])

  useEffect(() => {
    if (mounted && !isNonNumeric) {
      const unsubscribe = springValue.on("change", (latest) => {
        setDisplayValue(Math.floor(latest))
      })
      return unsubscribe
    }
  }, [mounted, springValue, isNonNumeric])

  // For non-numeric values like "Kiosk", just display as-is
  if (isNonNumeric && !hasSlash) {
    return (
      <div ref={ref} className="bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 bg-clip-text text-transparent">
        {value}
      </div>
    )
  }
  
  // For values with "/" like "24/7", display with proper formatting
  if (hasSlash) {
    // Always show numericValue on server, displayValue on client after mount
    const showValue = mounted ? displayValue : numericValue
    return (
      <div ref={ref} suppressHydrationWarning>
        <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          {showValue}
        </span>
        <span className="bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">
          /{secondPart}
        </span>
      </div>
    )
  }
  
  // For regular numeric values with suffix (e.g., "10+")
  const showValue = mounted ? displayValue : numericValue
  return (
    <div ref={ref} suppressHydrationWarning>
      <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
        {showValue}
      </span>
      <span className="bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">
        {suffix}
      </span>
    </div>
  )
}

export default function AnimatedStats({ stats }: AnimatedStatsProps) {
  return (
    <section className="py-12 bg-white border-y shadow-inner" aria-label="Platform statistics">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-3 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="relative inline-block"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500 blur-2xl opacity-20 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <div className="relative text-5xl md:text-6xl font-bold mb-2">
                  <AnimatedNumber value={stat.value} />
                </div>
              </motion.div>
              <motion.div
                className="text-gray-600 font-medium text-sm md:text-base"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                {stat.label}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

