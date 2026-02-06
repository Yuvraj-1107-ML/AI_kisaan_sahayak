"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

interface InteractiveFeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  index: number
}

export default function InteractiveFeatureCard({
  icon,
  title,
  description,
  index
}: InteractiveFeatureCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <motion.div
        whileHover={{ 
          y: -10,
          transition: { duration: 0.3 }
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <Card className="relative border-2 hover:border-emerald-500 transition-all duration-300 bg-white overflow-hidden group h-full">
          {/* Animated gradient background on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-amber-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            animate={isHovered ? {
              background: [
                "linear-gradient(to bottom right, rgb(236, 253, 245), rgb(240, 253, 250), rgb(255, 251, 235))",
                "linear-gradient(to bottom right, rgb(240, 253, 250), rgb(255, 251, 235), rgb(236, 253, 245))",
              ]
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          />

          <CardHeader className="relative z-10">
            <motion.div 
              className="mb-4 bg-gradient-to-br from-emerald-100 via-teal-100 to-amber-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto shadow-lg"
              animate={isHovered ? {
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              } : {}}
              transition={{ duration: 0.5 }}
            >
              <div className="transform group-hover:scale-110 transition-transform duration-300">
                {icon}
              </div>
            </motion.div>
            <CardTitle className="text-xl font-bold text-gray-900 text-center">{title}</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <CardDescription className="text-base text-gray-600 text-center leading-relaxed">
              {description}
            </CardDescription>
          </CardContent>

          {/* Shine effect on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30"
            animate={isHovered ? {
              x: ['-100%', '100%']
            } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </Card>
      </motion.div>
    </motion.div>
  )
}

