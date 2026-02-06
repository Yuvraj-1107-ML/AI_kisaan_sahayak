"use client"

import { motion } from "framer-motion"
import { Mic, Brain, MessageSquare, CheckCircle } from "lucide-react"

const steps = [
  {
    icon: Mic,
    title: "Speak Your Question",
    description: "Ask in your preferred language - Hindi, English, or 8 other Indian languages",
    color: "from-emerald-500 to-emerald-600",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600"
  },
  {
    icon: Brain,
    title: "AI Analysis",
    description: "Our advanced AI processes your query and analyzes using real-time data",
    color: "from-teal-500 to-teal-600",
    iconBg: "bg-teal-100",
    iconColor: "text-teal-600"
  },
  {
    icon: MessageSquare,
    title: "Get Expert Advice",
    description: "Receive personalized guidance with supporting data and visual aids",
    color: "from-amber-500 to-amber-600",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600"
  },
  {
    icon: CheckCircle,
    title: "Take Action",
    description: "Implement solutions with confidence and track your farming progress",
    color: "from-emerald-600 to-teal-600",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-700"
  }
]

export default function HowItWorks() {
  return (
    <section className="py-20 bg-gradient-to-b from-white via-amber-50/30 to-emerald-50/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 text-9xl">🌾</div>
        <div className="absolute bottom-20 right-10 text-9xl">🚜</div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get farming solutions in 4 simple steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting Line (desktop) */}
          <div className="hidden lg:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-200 via-teal-200 via-amber-200 to-emerald-200" style={{ top: '80px' }} />

          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                whileHover={{ y: -10 }}
                className="relative"
              >
                {/* Step Number */}
                <motion.div
                  className="absolute -top-4 -left-4 z-10 w-10 h-10 rounded-full bg-gradient-to-br from-white to-gray-100 border-4 border-white shadow-lg flex items-center justify-center font-bold text-gray-700"
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {index + 1}
                </motion.div>

                <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-emerald-300 shadow-lg hover:shadow-2xl transition-all h-full relative overflow-hidden group">
                  {/* Gradient overlay on hover */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-5 transition-opacity`}
                  />

                  {/* Icon */}
                  <motion.div
                    className={`${step.iconBg} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md`}
                    whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon className={`h-8 w-8 ${step.iconColor}`} />
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-center text-sm leading-relaxed">
                    {step.description}
                  </p>

                  {/* Progress indicator */}
                  <div className="mt-4 flex justify-center">
                    <div className="flex gap-1">
                      {steps.map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full transition-all ${
                            i <= index ? `bg-gradient-to-r ${step.color}` : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* CTA below steps */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-gray-600 mb-6 text-lg">
            Ready to revolutionize your farming?
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <a href="/conversation-avatar">
              <button className="px-10 py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-full font-bold text-lg shadow-2xl hover:shadow-emerald-500/50 transition-all">
                Start Now - It's Free! 🚀
              </button>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

