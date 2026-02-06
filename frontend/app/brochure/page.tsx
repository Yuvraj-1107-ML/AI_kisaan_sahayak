'use client'

import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Download, Share2, Printer, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function BrochurePage() {
  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // Create a link to download the markdown file
    const link = document.createElement('a')
    link.href = '/AI_KISAAN_SAHAYAK_BROCHURE.md'
    link.download = 'AI_Kisaan_Sahayak_Brochure.md'
    link.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50">
      {/* Header with Actions */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
            <div className="flex gap-3">
              <Button onClick={handlePrint} variant="outline" className="gap-2">
                <Printer className="w-4 h-4" />
                Print
              </Button>
              <Button onClick={handleDownload} variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Download
              </Button>
              <Button variant="default" className="gap-2 bg-green-600 hover:bg-green-700">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Brochure Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Professional Brochure Container */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          
          {/* Cover Image */}
          <div className="relative w-full h-[500px] bg-gradient-to-br from-green-600 to-green-800">
            <Image
              src="/brochure_cover.png"
              alt="AI Kisaan Sahayak Brochure Cover"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Brochure Content */}
          <div className="p-8 sm:p-12 lg:p-16 space-y-12">
            
            {/* Title Section */}
            <div className="text-center space-y-4 border-b-2 border-green-600 pb-8">
              <h1 className="text-5xl font-bold text-gray-900 flex items-center justify-center gap-3">
                🌾 AI Kisaan Sahayak
              </h1>
              <h2 className="text-3xl font-semibold text-green-700">
                कृषि सहायक - Your Intelligent Agricultural Assistant
              </h2>
            </div>

            {/* Project Overview */}
            <section className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 border-l-4 border-green-600 pl-4">
                📋 Project Overview
              </h2>
              <div className="bg-gradient-to-r from-green-50 to-orange-50 p-6 rounded-xl border border-green-200">
                <p className="text-lg text-gray-700 leading-relaxed">
                  <strong className="text-green-700">AI Kisaan Sahayak</strong> is a cutting-edge, AI-powered agricultural assistance platform designed to empower Indian farmers with intelligent, voice-based guidance in their native languages. Built with state-of-the-art technology, this platform provides comprehensive farming support through an intuitive, accessible interface.
                </p>
              </div>
              
              <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-xl">
                <h3 className="text-xl font-bold text-blue-900 mb-3">🎯 Mission</h3>
                <p className="text-gray-700 leading-relaxed">
                  To democratize agricultural knowledge and support by providing every farmer with instant access to expert agricultural advice, market information, weather updates, and government schemes through simple voice interaction in their preferred language.
                </p>
              </div>
            </section>

            {/* Key Features Grid */}
            <section className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 border-l-4 border-green-600 pl-4">
                ✨ Key Features
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    icon: '🎤',
                    title: 'Multi-Language Voice Interaction',
                    desc: '9 Indian Languages Supported: Hindi, English, Punjabi, Marathi, Gujarati, Tamil, Telugu, Kannada, Bengali with real-time speech recognition and natural voice responses.',
                    color: 'from-purple-500 to-pink-500'
                  },
                  {
                    icon: '🤖',
                    title: 'Intelligent Multi-Agent AI System',
                    desc: 'Built on LangGraph with 10+ specialized AI agents for crop selection, disease diagnosis, weather advisory, market prices, and government schemes.',
                    color: 'from-blue-500 to-cyan-500'
                  },
                  {
                    icon: '🌤️',
                    title: 'Real-Time Weather Advisory',
                    desc: 'Current weather conditions with temperature, humidity, wind speed, and weather-based farming recommendations integrated with OpenWeather API.',
                    color: 'from-orange-500 to-yellow-500'
                  },
                  {
                    icon: '💰',
                    title: 'Live Market Price Information',
                    desc: 'Real-time commodity prices from e-NAM and government sources with multi-mandi price comparison and selling strategy recommendations.',
                    color: 'from-green-500 to-emerald-500'
                  },
                  {
                    icon: '🏛️',
                    title: 'Government Schemes Information',
                    desc: 'Comprehensive details on PM-Kisan, PMFBY, KCC, PM-Kusum, and more with application process, eligibility, and contact information.',
                    color: 'from-indigo-500 to-purple-500'
                  },
                  {
                    icon: '🌱',
                    title: 'Crop Disease Diagnosis',
                    desc: 'Camera-based visual inspection with AI-powered disease identification using Google Gemini Vision AI and detailed treatment recommendations.',
                    color: 'from-red-500 to-pink-500'
                  },
                  {
                    icon: '📅',
                    title: 'Crop Planning & Calendar',
                    desc: 'Season-based crop recommendations (Kharif, Rabi, Summer) with sowing timelines, cultivation practices, and fertilizer schedules.',
                    color: 'from-teal-500 to-green-500'
                  },
                  {
                    icon: '👤',
                    title: 'Interactive AI Avatar',
                    desc: 'Engaging visual interface with professional AI avatar, particle effects, pause/resume functionality, and multi-language info panels.',
                    color: 'from-violet-500 to-purple-500'
                  }
                ].map((feature, idx) => (
                  <div key={idx} className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <div className={`text-4xl mb-4 w-16 h-16 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Technical Architecture */}
            <section className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 border-l-4 border-blue-600 pl-4">
                🏗️ Technical Architecture
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                {/* Frontend */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
                    <span className="text-2xl">💻</span> Frontend
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>✓ Next.js 14.2 (React 18)</li>
                    <li>✓ TypeScript</li>
                    <li>✓ Tailwind CSS 4.1</li>
                    <li>✓ shadcn/ui, Radix UI</li>
                    <li>✓ Framer Motion</li>
                    <li>✓ Voice Activity Detection</li>
                    <li>✓ PWA Support</li>
                  </ul>
                </div>

                {/* Backend */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
                    <span className="text-2xl">⚙️</span> Backend
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>✓ FastAPI (Python)</li>
                    <li>✓ LangGraph Multi-Agent</li>
                    <li>✓ Google Gemini 2.0</li>
                    <li>✓ Azure Speech Services</li>
                    <li>✓ AssemblyAI</li>
                    <li>✓ PostgreSQL / SQLite</li>
                    <li>✓ WebSocket Support</li>
                  </ul>
                </div>

                {/* AI & Integrations */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-300 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-orange-800 mb-4 flex items-center gap-2">
                    <span className="text-2xl">🤖</span> AI & APIs
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>✓ Gemini Vision AI</li>
                    <li>✓ ElevenLabs Voice</li>
                    <li>✓ OpenWeather API</li>
                    <li>✓ e-NAM Market Data</li>
                    <li>✓ Government APIs</li>
                    <li>✓ Real-time Processing</li>
                    <li>✓ NLP & Entity Extraction</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Use Cases */}
            <section className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 border-l-4 border-purple-600 pl-4">
                💡 Use Cases
              </h2>
              
              <div className="space-y-4">
                {[
                  {
                    title: 'Crop Selection',
                    question: '"इस मौसम में कौन सी फसल लगाऊं?" (Which crop should I plant this season?)',
                    answer: 'Analyzes current season, location, weather, market prices, and recommends 2-3 crops with planting timeline, expected yield, input requirements, and market demand forecast.',
                    color: 'border-green-500 bg-green-50'
                  },
                  {
                    title: 'Disease Diagnosis',
                    question: '"मेरे टमाटर के पत्ते पीले हो रहे हैं" (My tomato leaves are turning yellow)',
                    answer: 'Triggers camera for leaf photo, analyzes image with AI vision, identifies disease (e.g., Early Blight), provides treatment with organic and chemical options, recommends specific products with dosages.',
                    color: 'border-red-500 bg-red-50'
                  },
                  {
                    title: 'Market Intelligence',
                    question: '"गेहूं का भाव क्या चल रहा है?" (What\'s the wheat price?)',
                    answer: 'Fetches real-time prices from multiple mandis, shows price range and best markets, provides selling strategy, suggests optimal timing.',
                    color: 'border-blue-500 bg-blue-50'
                  },
                  {
                    title: 'Government Schemes',
                    question: '"PM-Kisan योजना के बारे में बताओ" (Tell me about PM-Kisan scheme)',
                    answer: 'Provides detailed scheme information, eligibility criteria, step-by-step application process, required documents, helpline and website.',
                    color: 'border-orange-500 bg-orange-50'
                  }
                ].map((useCase, idx) => (
                  <div key={idx} className={`border-l-4 ${useCase.color} p-6 rounded-r-xl`}>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{useCase.title}</h3>
                    <p className="text-gray-700 mb-3 italic">Farmer: {useCase.question}</p>
                    <p className="text-gray-600 leading-relaxed"><strong>AI Kisaan Sahayak:</strong> {useCase.answer}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Impact & Benefits */}
            <section className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 border-l-4 border-green-600 pl-4">
                📈 Impact & Benefits
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                {/* For Farmers */}
                <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-xl p-6 border-2 border-green-400">
                  <h3 className="text-xl font-bold text-green-900 mb-4">👨‍🌾 For Farmers</h3>
                  <ul className="space-y-2 text-sm text-gray-800">
                    <li>✅ 24/7 Expert Guidance</li>
                    <li>✅ Cost Savings</li>
                    <li>✅ Better Prices</li>
                    <li>✅ Access to Schemes</li>
                    <li>✅ Reduced Risk</li>
                    <li>✅ Increased Yield</li>
                    <li>✅ Language Comfort</li>
                  </ul>
                </div>

                {/* For Government */}
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-6 border-2 border-blue-400">
                  <h3 className="text-xl font-bold text-blue-900 mb-4">🏛️ For Government</h3>
                  <ul className="space-y-2 text-sm text-gray-800">
                    <li>✅ Scheme Awareness</li>
                    <li>✅ Digital Agriculture</li>
                    <li>✅ Data Insights</li>
                    <li>✅ Cost-Effective</li>
                    <li>✅ Farmer Welfare</li>
                  </ul>
                </div>

                {/* For Agriculture Sector */}
                <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl p-6 border-2 border-orange-400">
                  <h3 className="text-xl font-bold text-orange-900 mb-4">🌾 For Sector</h3>
                  <ul className="space-y-2 text-sm text-gray-800">
                    <li>✅ Knowledge Democratization</li>
                    <li>✅ Technology Adoption</li>
                    <li>✅ Productivity Boost</li>
                    <li>✅ Market Efficiency</li>
                    <li>✅ Sustainable Farming</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Unique Selling Points */}
            <section className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 border-l-4 border-purple-600 pl-4">
                🌟 Unique Selling Points
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { title: 'True Multi-Language Support', desc: 'Agricultural context in each language with native terminology' },
                  { title: 'Voice-First Design', desc: 'Natural conversation without typing for limited literacy' },
                  { title: 'Multi-Agent Intelligence', desc: '10+ specialized AI agents working together' },
                  { title: 'Camera-Based Diagnosis', desc: 'Visual disease identification using advanced AI' },
                  { title: 'Real-Time Data Integration', desc: 'Live weather, market prices, and scheme updates' },
                  { title: 'Government-Grade Interface', desc: 'Professional portal design building trust' },
                  { title: 'Offline-First PWA', desc: 'Basic functionality with poor connectivity' },
                  { title: 'Comprehensive Coverage', desc: 'Complete farming lifecycle support' }
                ].map((usp, idx) => (
                  <div key={idx} className="flex gap-4 items-start bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                    <div className="text-2xl">⭐</div>
                    <div>
                      <h4 className="font-bold text-gray-900">{usp.title}</h4>
                      <p className="text-sm text-gray-600">{usp.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Support & Contact */}
            <section className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 border-l-4 border-blue-600 pl-4">
                📞 Support & Contact
              </h2>
              
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border-2 border-blue-300">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-bold text-blue-900 mb-4">Helpline Numbers</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>📞 <strong>Kisan Call Center:</strong> 1800-180-1551</li>
                      <li>📞 <strong>PM-Kisan Helpline:</strong> 155261, 011-24300606</li>
                      <li>📞 <strong>Mandi Helpline:</strong> 1800-270-0224</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-blue-900 mb-4">Online Resources</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>🌐 <strong>e-NAM Portal:</strong> enam.gov.in</li>
                      <li>🌐 <strong>Agriculture Ministry:</strong> agricoop.gov.in</li>
                      <li>🌐 <strong>PM-Kisan:</strong> pmkisan.gov.in</li>
                      <li>🌐 <strong>Crop Insurance:</strong> pmfby.gov.in</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Conclusion */}
            <section className="space-y-6">
              <div className="bg-gradient-to-r from-green-600 to-green-800 text-white rounded-2xl p-10 text-center">
                <h2 className="text-4xl font-bold mb-6">🌾 Transform Indian Agriculture</h2>
                <p className="text-xl mb-6 leading-relaxed">
                  AI Kisaan Sahayak represents the future of agricultural assistance in India - combining cutting-edge AI technology with deep agricultural expertise to serve farmers in their native languages.
                </p>
                <div className="grid md:grid-cols-4 gap-4 mb-8">
                  {['Comprehensive', 'Intelligent', 'Accessible', 'Trusted'].map((point, idx) => (
                    <div key={idx} className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                      <div className="text-3xl mb-2">✅</div>
                      <div className="font-bold">{point}</div>
                    </div>
                  ))}
                </div>
                <h3 className="text-3xl font-bold mb-4">AI Kisaan Sahayak - कृषि सहायक</h3>
                <p className="text-xl italic">Empowering Every Farmer, Every Day 🌾</p>
              </div>
            </section>

            {/* Footer */}
            <section className="border-t-2 border-gray-200 pt-8">
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">For More Information</h3>
                <div className="flex flex-col items-center gap-2 text-lg text-gray-700">
                  <p>🌐 Website: <a href="https://www.ailifebot.com" className="text-blue-600 hover:underline font-semibold">www.ailifebot.com</a></p>
                </div>
                <p className="text-gray-600 font-semibold mt-6">Developed by AI Lifebot Farmers</p>
              </div>
            </section>

          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
          body {
            background: white !important;
          }
          @page {
            margin: 1cm;
          }
        }
      `}</style>
    </div>
  )
}
