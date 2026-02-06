"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ImageSlider from "@/components/image-slider"
import AnimatedBackground from "@/components/animated-background"
import EnhancedHero from "@/components/enhanced-hero"
import InteractiveFeatureCard from "@/components/interactive-feature-card"
import AnimatedStats from "@/components/animated-stats"
import ScrollToTop from "@/components/scroll-to-top"
import HowItWorks from "@/components/how-it-works"
import DemoShowcase from "@/components/demo-showcase"
import FloatingActionButton from "@/components/floating-action-button"
import { motion } from "framer-motion"
import { 
  Mic, 
  Camera, 
  CloudSun, 
  TrendingUp, 
  Leaf, 
  BookOpen,
  Shield,
  MessageSquare,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  FileText,
  Users,
  BarChart3,
  Sparkles
} from "lucide-react"

export default function HomePage() {
  const features = [
    {
      icon: <Mic className="h-10 w-10 text-emerald-600" />,
      title: "Voice Interaction",
      description: "Talk to AI assistant in Hindi, English, and 8+ Indian languages"
    },
    {
      icon: <TrendingUp className="h-10 w-10 text-amber-600" />,
      title: "Market Prices",
      description: "Real-time mandi rates and commodity prices across India"
    },
    {
      icon: <Camera className="h-10 w-10 text-teal-600" />,
      title: "Disease Detection",
      description: "AI-powered crop disease identification using camera"
    },
    {
      icon: <CloudSun className="h-10 w-10 text-sky-500" />,
      title: "Weather Advisory",
      description: "Location-based weather forecasts and farming recommendations"
    },
    {
      icon: <Shield className="h-10 w-10 text-emerald-700" />,
      title: "Government Schemes",
      description: "Information on PM-Kisan, subsidies, and agricultural programs"
    },
    {
      icon: <BookOpen className="h-10 w-10 text-amber-700" />,
      title: "Expert Guidance",
      description: "Comprehensive farming knowledge and best practices"
    }
  ]

  const quickLinks = [
    { title: "Crop Advisory", icon: <Leaf className="h-5 w-5" /> },
    { title: "Market Rates", icon: <BarChart3 className="h-5 w-5" /> },
    { title: "Government Schemes", icon: <Shield className="h-5 w-5" /> },
    { title: "Weather Updates", icon: <CloudSun className="h-5 w-5" /> },
    { title: "Disease Management", icon: <Camera className="h-5 w-5" /> },
    { title: "Helpline Numbers", icon: <Phone className="h-5 w-5" /> }
  ]

  const statistics = [
    { value: "10+", label: "Languages Supported" },
    { value: "24/7", label: "Available Support" },
    { value: "Kiosk", label: "Kiosk Solution" }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-emerald-50 to-teal-50 relative">
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white py-2 border-b border-emerald-700 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between items-center text-sm gap-2">
            <div className="flex items-center gap-6">
              <a href="tel:+918439266770" className="flex items-center gap-2 hover:text-emerald-200 transition-colors" aria-label="Call AI Lifebot Support">
                <Phone className="h-4 w-4" />
                <span>Support: +91 8439266770</span>
              </a>
              <a href="mailto:contact@ailifebot.com" className="flex items-center gap-2 hover:text-emerald-200 transition-colors hidden md:flex" aria-label="Email AI Lifebot">
                <Mail className="h-4 w-4" />
                <span>contact@ailifebot.com</span>
              </a>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs">Last Updated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b-4 border-gradient-to-r from-emerald-500 to-amber-500 sticky top-0 z-50 shadow-lg" style={{ borderImage: 'linear-gradient(to right, #10b981, #f59e0b) 1' }}>
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              {/* Company Logo */}
              <div className="relative h-16 w-40 flex-shrink-0">
                <Image
                  src="/company_logo-01.jpg"
                  alt="AI Lifebot - Kisan Suvidha Kendra"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="border-l-2 border-emerald-400 pl-3">
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                  Kisan Suvidha Kendra
                </h1>
                <p className="text-xs md:text-sm text-amber-700 font-medium">
                  किसान सुविधा केंद्र
                </p>
                <p className="text-xs bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent font-semibold">Powered by AI Lifebot™</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/admin/login">
                <Button variant="outline" size="sm" className="border-emerald-600 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-700 transition-colors" aria-label="Login to admin dashboard">
                  <Users className="h-4 w-4 mr-2" aria-hidden="true" />
                  Admin Login
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white shadow-lg">
          <div className="container mx-auto px-4">
            <nav className="flex gap-1 overflow-x-auto py-2" role="navigation" aria-label="Main navigation">
              {[
                { href: "/", label: "Home", active: true },
                { href: "/conversation", label: "AI Assistant", active: false },
                { href: "/conversation-avatar", label: "Live Avatar", active: false },
                { href: "#about", label: "About Us", active: false },
                { href: "#services", label: "Services", active: false },
                { href: "#contact", label: "Contact", active: false },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href={item.href}>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`text-white hover:bg-emerald-600 rounded-lg transition-all relative group ${
                        item.active ? 'bg-emerald-600' : ''
                      }`}
                      aria-label={item.label}
                    >
                      {item.label}
                      {item.active && (
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 to-emerald-400"
                          layoutId="activeTab"
                        />
                      )}
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Enhanced Hero Section */}
      <EnhancedHero />

      {/* Quick Links */}
      <section className="py-10 bg-gradient-to-b from-amber-50/50 to-emerald-50/50 border-b relative z-10" aria-label="Quick access links">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent mb-8 text-center"
          >
            Quick Access
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickLinks.map((link, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -8, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card className="hover:shadow-2xl transition-all cursor-pointer border-2 hover:border-emerald-500 bg-white group" role="button" tabIndex={0} aria-label={`Access ${link.title}`}>
                  <CardContent className="p-5 text-center">
                    <motion.div 
                      className="bg-gradient-to-br from-emerald-100 via-teal-100 to-amber-100 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 text-emerald-700 shadow-md group-hover:shadow-lg group-hover:scale-110 transition-transform"
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                      aria-hidden="true"
                    >
                      {link.icon}
                    </motion.div>
                    <p className="text-sm font-semibold text-gray-700 group-hover:text-emerald-700 transition-colors">{link.title}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gradient-to-b from-white via-amber-50/30 to-emerald-50/30 relative z-10" aria-label="Our services and features">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full mb-4 border border-emerald-200">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-semibold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">AI-Powered Solutions</span>
            </div>
            <h3 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-800 bg-clip-text text-transparent mb-4">
              Our Services
            </h3>
            <p className="text-xl text-amber-800/80 max-w-3xl mx-auto">
              Comprehensive agricultural support powered by advanced AI technology
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" role="list">
            {features.map((feature, index) => (
              <InteractiveFeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Animated Statistics */}
      <AnimatedStats stats={statistics} />

      {/* How It Works */}
      <HowItWorks />

      {/* Demo Showcase */}
      <DemoShowcase />

      {/* Partner Resources */}
      <section className="py-16 bg-gradient-to-b from-emerald-50/50 via-amber-50/30 to-teal-50/50 relative z-10" aria-label="Related agricultural resources">
        <div className="container mx-auto px-4">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-800 to-teal-800 bg-clip-text text-transparent mb-10 text-center"
          >
            Partner Resources
          </motion.h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4" role="list">
            {[
              "PM-KISAN Portal",
              "e-NAM Platform",
              "PMFBY Insurance",
              "Kisan Credit Card",
              "Soil Health Card",
              "mKisan Portal",
              "Agri Market",
              "Kisan Rath"
            ].map((portal, index) => (
              <motion.a
                key={index}
                href="#"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white p-5 rounded-xl border-2 border-emerald-200 hover:border-emerald-500 hover:shadow-xl transition-all flex items-center justify-between group"
                role="listitem"
                aria-label={`Visit ${portal} website`}
              >
                <span className="font-semibold text-gray-700 group-hover:text-emerald-700 transition-colors">{portal}</span>
                <motion.div
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-emerald-600 transition-colors" aria-hidden="true" />
                </motion.div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-950 text-white py-16 relative overflow-hidden" role="contentinfo" aria-label="Footer">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div>
              <h4 className="text-lg font-bold mb-4">About Us</h4>
              <p className="text-emerald-200 text-sm leading-relaxed">
                Kisan Suvidha Kendra is developed by AI Lifebot™ to provide cutting-edge AI-powered agricultural support to farmers across India.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Quick Links</h4>
              <nav aria-label="Footer navigation">
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="text-emerald-200 hover:text-amber-300 transition-colors" aria-label="Learn about AI Lifebot">About AI Lifebot</a></li>
                  <li><a href="#" className="text-emerald-200 hover:text-amber-300 transition-colors" aria-label="View terms and conditions">Terms & Conditions</a></li>
                  <li><a href="#" className="text-emerald-200 hover:text-amber-300 transition-colors" aria-label="Read privacy policy">Privacy Policy</a></li>
                  <li><a href="#" className="text-emerald-200 hover:text-amber-300 transition-colors" aria-label="View accessibility statement">Accessibility</a></li>
                </ul>
              </nav>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Contact Us</h4>
              <ul className="space-y-3 text-sm text-emerald-200">
                <li className="flex items-start gap-2">
                  <Phone className="h-4 w-4 mt-1 flex-shrink-0" aria-hidden="true" />
                  <a href="tel:+918439266770" className="hover:text-white transition-colors" aria-label="Call AI Lifebot at +91 8439266770">
                    Phone: +91 8439266770
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <Mail className="h-4 w-4 mt-1 flex-shrink-0" aria-hidden="true" />
                  <a href="mailto:contact@ailifebot.com" className="hover:text-white transition-colors" aria-label="Email AI Lifebot at contact@ailifebot.com">
                    Email: contact@ailifebot.com
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-1 flex-shrink-0" aria-hidden="true" />
                  <address className="not-italic" aria-label="AI Lifebot Office Address">
                    3rd Floor, Orchid Center,<br />
                    Golf Course Road, DLF QE,<br />
                    Sec-53, Gurugram, Haryana - 122002
                  </address>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Trust & Security</h4>
              <div className="space-y-3">
                <motion.div 
                  className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-sm border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
                  whileHover={{ scale: 1.05, x: 5 }}
                >
                  <FileText className="h-5 w-5 mb-2 text-amber-400" aria-hidden="true" />
                  <span className="font-semibold">ISO 27001 Certified</span>
                </motion.div>
                <motion.div 
                  className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-sm border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
                  whileHover={{ scale: 1.05, x: 5 }}
                >
                  <Shield className="h-5 w-5 mb-2 text-emerald-400" aria-hidden="true" />
                  <span className="font-semibold">Secure & Private</span>
                </motion.div>
              </div>
            </div>
          </div>

          <motion.div 
            className="border-t border-emerald-800 pt-10 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <motion.p 
              className="text-emerald-200 text-base mb-2 font-semibold"
              whileHover={{ scale: 1.05 }}
            >
              © 2025 Kisan Suvidha Kendra. Developed by <span className="text-amber-400">AI Lifebot™</span>
            </motion.p>
            <p className="text-sm text-emerald-300 mb-6">
              🌾 Empowering Farmers with AI Technology 🌾
            </p>
            
            <div className="mt-4 flex justify-center items-center gap-4 text-xs text-emerald-400">
              <span>Made with ❤️ for Indian Farmers</span>
            </div>
          </motion.div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <ScrollToTop />

      {/* Floating Action Button for Quick Access */}
      <FloatingActionButton />

      {/* Custom CSS */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </main>
  )
}
