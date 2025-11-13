"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ImageSlider from "@/components/image-slider"
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
  Bell
} from "lucide-react"

export default function HomePage() {
  const features = [
    {
      icon: <Mic className="h-10 w-10 text-blue-600" />,
      title: "Voice Interaction",
      description: "Talk to AI assistant in Hindi, English, and 8+ Indian languages"
    },
    {
      icon: <TrendingUp className="h-10 w-10 text-green-600" />,
      title: "Market Prices",
      description: "Real-time mandi rates and commodity prices across India"
    },
    {
      icon: <Camera className="h-10 w-10 text-orange-600" />,
      title: "Disease Detection",
      description: "AI-powered crop disease identification using camera"
    },
    {
      icon: <CloudSun className="h-10 w-10 text-blue-500" />,
      title: "Weather Advisory",
      description: "Location-based weather forecasts and farming recommendations"
    },
    {
      icon: <Shield className="h-10 w-10 text-purple-600" />,
      title: "Government Schemes",
      description: "Information on PM-Kisan, subsidies, and agricultural programs"
    },
    {
      icon: <BookOpen className="h-10 w-10 text-indigo-600" />,
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
    { value: "10,000+", label: "Farmers Helped" },
    { value: "24/7", label: "Available Support" },
    { value: "100%", label: "Free Service" }
  ]

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-blue-900 text-white py-2 border-b border-blue-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between items-center text-sm gap-2">
            <div className="flex items-center gap-6">
              <a href="tel:1800-180-1551" className="flex items-center gap-2 hover:text-blue-200">
                <Phone className="h-4 w-4" />
                <span>Kisan Call Center: 1800-180-1551</span>
              </a>
              <a href="mailto:support@kisansuvidha.gov.in" className="flex items-center gap-2 hover:text-blue-200 hidden md:flex">
                <Mail className="h-4 w-4" />
                <span>support@kisansuvidha.gov.in</span>
              </a>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs">Last Updated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b-4 border-orange-500 sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              {/* Government Logo */}
              <div className="relative h-20 w-20 flex-shrink-0">
                <Image
                  src="/logo.jpg"
                  alt="Kisan Suvidha Kendra Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="border-l-2 border-gray-300 pl-4">
                <h1 className="text-2xl md:text-3xl font-bold text-blue-900">
                  Kisan Suvidha Kendra
                </h1>
                <p className="text-sm md:text-base text-gray-600 font-medium">
                  किसान सुविधा केंद्र
                </p>
                <p className="text-xs text-gray-500">Ministry of Agriculture & Farmers Welfare</p>
                <p className="text-xs text-gray-500">Government of India</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/admin/login">
                <Button variant="outline" size="sm" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                  <Users className="h-4 w-4 mr-2" />
                  Admin Login
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-blue-800 text-white">
          <div className="container mx-auto px-4">
            <nav className="flex gap-1 overflow-x-auto py-1">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-white hover:bg-blue-700 rounded-none">
                  Home
                </Button>
              </Link>
              <Link href="/conversation">
                <Button variant="ghost" size="sm" className="text-white hover:bg-blue-700 rounded-none">
                  AI Assistant
                </Button>
              </Link>
              <Link href="/conversation-avatar">
                <Button variant="ghost" size="sm" className="text-white hover:bg-blue-700 rounded-none">
                  Live Avatar
                </Button>
              </Link>
              <Button variant="ghost" size="sm" className="text-white hover:bg-blue-700 rounded-none">
                About Us
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-blue-700 rounded-none">
                Services
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-blue-700 rounded-none">
                Contact
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Image Slider */}
      <ImageSlider />

      {/* Marquee/News Ticker */}
      <div className="bg-yellow-50 border-y-2 border-yellow-400 py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-red-600 font-bold flex-shrink-0">
              <Bell className="h-5 w-5 animate-pulse" />
              <span>Latest Updates</span>
            </div>
            <div className="overflow-hidden">
              <div className="animate-marquee whitespace-nowrap">
                <span className="mx-8">🌾 New PM-Kisan installment released - Check your account</span>
                <span className="mx-8">🌧️ Heavy rainfall expected in North India - Take precautions</span>
                <span className="mx-8">💰 Wheat MSP increased to ₹2,275 per quintal</span>
                <span className="mx-8">📱 Download Kisan Suvidha Mobile App for instant updates</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <section className="py-6 bg-white border-b">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">Quick Access</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickLinks.map((link, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-500">
                <CardContent className="p-4 text-center">
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 text-blue-600">
                    {link.icon}
                  </div>
                  <p className="text-sm font-semibold text-gray-700">{link.title}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main CTA */}
      <section className="py-12 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Start Your AI-Powered Farming Journey
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Get instant expert advice through voice interaction in your preferred language
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/conversation-avatar">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6 h-auto">
                <Mic className="mr-2 h-6 w-6" />
                Experience Live AI Avatar
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </Link>
            <Link href="/conversation">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-blue-700 text-lg px-8 py-6 h-auto">
                <MessageSquare className="mr-2 h-6 w-6" />
                Classic Voice Mode
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-blue-900 mb-4">
              Our Services
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive agricultural support powered by advanced AI technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="border-2 hover:border-blue-500 hover:shadow-xl transition-all duration-300 bg-white"
              >
                <CardHeader>
                  <div className="mb-4 bg-gray-50 w-16 h-16 rounded-lg flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-12 bg-white border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {statistics.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Government Links */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-blue-900 mb-6 text-center">
            Related Government Portals
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              <a
                key={index}
                href="#"
                className="bg-white p-4 rounded border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all flex items-center justify-between group"
              >
                <span className="font-medium text-gray-700 group-hover:text-blue-600">{portal}</span>
                <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-bold mb-4">About Us</h4>
              <p className="text-blue-200 text-sm leading-relaxed">
                Kisan Suvidha Kendra is a Government of India initiative to provide AI-powered agricultural support to farmers across the nation.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-blue-200 hover:text-white">About Ministry</a></li>
                <li><a href="#" className="text-blue-200 hover:text-white">Terms & Conditions</a></li>
                <li><a href="#" className="text-blue-200 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-blue-200 hover:text-white">Accessibility</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Contact Us</h4>
              <ul className="space-y-3 text-sm text-blue-200">
                <li className="flex items-start gap-2">
                  <Phone className="h-4 w-4 mt-1 flex-shrink-0" />
                  <span>Kisan Call Center: 1800-180-1551</span>
                </li>
                <li className="flex items-start gap-2">
                  <Mail className="h-4 w-4 mt-1 flex-shrink-0" />
                  <span>support@kisansuvidha.gov.in</span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                  <span>Krishi Bhawan, New Delhi - 110001</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Certifications</h4>
              <div className="space-y-2">
                <div className="bg-white/10 p-3 rounded text-sm">
                  <FileText className="h-5 w-5 mb-2" />
                  <span>ISO 27001 Certified</span>
                </div>
                <div className="bg-white/10 p-3 rounded text-sm">
                  <Shield className="h-5 w-5 mb-2" />
                  <span>STQC Audited</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-blue-800 pt-8 text-center">
            <p className="text-blue-200 text-sm mb-2">
              © 2025 Kisan Suvidha Kendra. Ministry of Agriculture & Farmers Welfare, Government of India
            </p>
            <p className="text-xs text-blue-300">
              Content owned, updated and maintained by Ministry of Agriculture & Farmers Welfare
            </p>
            <div className="mt-4 flex justify-center items-center gap-4 text-xs text-blue-300">
              <span>Visitors: 1,25,430</span>
              <span>•</span>
              <span>Last Reviewed: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </footer>

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
