"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Leaf, Lock, User, ArrowLeft } from "lucide-react"
import { toast } from "sonner"

export default function AdminLoginPage() {
  const router = useRouter()
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  })
  const [isLoading, setIsLoading] = useState(false)

  // Dummy credentials for demo
  const DEMO_USERNAME = "admin"
  const DEMO_PASSWORD = "admin123"

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (credentials.username === DEMO_USERNAME && credentials.password === DEMO_PASSWORD) {
      toast.success("Login successful!")
      // Store auth token (in real app, would be from backend)
      localStorage.setItem("admin_token", "demo_token")
      router.push("/admin/dashboard")
    } else {
      toast.error("Invalid credentials. Try admin/admin123")
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50/50 via-emerald-50/30 to-teal-50/50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        {/* Back to Home */}
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        {/* Login Card */}
        <Card className="border-2">
          <CardHeader className="space-y-4">
            <div className="flex justify-center">
              <div className="bg-green-600 p-3 rounded-full">
                <Leaf className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="text-center">
              <CardTitle className="text-2xl">Admin Login</CardTitle>
              <CardDescription>
                Access the AI Kisaan Sahayak Dashboard
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter username"
                    className="pl-10"
                    value={credentials.username}
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    className="pl-10"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>

              {/* Demo Credentials Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <p className="text-sm font-medium text-blue-800 mb-2">Demo Credentials:</p>
                <p className="text-xs text-blue-700">Username: <span className="font-mono font-bold">admin</span></p>
                <p className="text-xs text-blue-700">Password: <span className="font-mono font-bold">admin123</span></p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 text-center">
              For security reasons, this is a demo login. In production, proper authentication would be implemented.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
















