"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Play, Users, TrendingUp, Award, MessageSquare } from "lucide-react"

export default function DemoShowcase() {
  return (
    <section className="py-20 bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-950 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
            <Award className="h-4 w-4 text-amber-400" />
            <span className="text-sm font-semibold">See It In Action</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Experience the Future of Farming
          </h2>
          <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
            Watch how our AI avatar helps farmers solve real problems
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Video/Demo Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 border-4 border-emerald-500/30 shadow-2xl">
              <div className="aspect-video bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center relative group">
                {/* Placeholder for demo video */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="absolute inset-0 flex items-center justify-center cursor-pointer"
                >
                  <motion.div
                    className="w-20 h-20 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 flex items-center justify-center shadow-2xl"
                    whileHover={{ scale: 1.2 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Play className="h-10 w-10 text-white ml-1" />
                  </motion.div>
                </motion.div>

                {/* Demo image/content */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-semibold mb-1">🎥 AI Avatar Demo</p>
                  <p className="text-white/80 text-sm">See live conversation in action</p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Impact Stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {[
              { icon: Users, label: "Farmers Empowered", value: "10,000+", color: "emerald" },
              { icon: MessageSquare, label: "Conversations Daily", value: "500+", color: "teal" },
              { icon: TrendingUp, label: "Success Rate", value: "95%", color: "amber" },
              { icon: Award, label: "Languages Supported", value: "10+", color: "emerald" },
            ].map((stat, index) => {
              const Icon = stat.icon
              const colorClasses = {
                emerald: "bg-emerald-500/20 text-emerald-400",
                teal: "bg-teal-500/20 text-teal-400",
                amber: "bg-amber-500/20 text-amber-400",
              }
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 10, scale: 1.02 }}
                  className="flex items-center gap-4 bg-white/10 backdrop-blur-sm p-5 rounded-xl border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
                >
                  <div className={`w-14 h-14 rounded-xl ${colorClasses[stat.color as keyof typeof colorClasses]} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`h-7 w-7`} />
                  </div>
                  <div className="flex-1">
                    <div className="text-3xl font-bold mb-1">{stat.value}</div>
                    <div className="text-emerald-200 text-sm">{stat.label}</div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

