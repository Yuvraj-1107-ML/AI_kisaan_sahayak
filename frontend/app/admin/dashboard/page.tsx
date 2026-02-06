"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  Leaf, 
  LogOut, 
  MessageSquare, 
  CheckCircle2, 
  XCircle, 
  Clock,
  TrendingUp,
  Users,
  Activity,
  BarChart3
} from "lucide-react"
import { toast } from "sonner"

// Types
interface ChatSession {
  id: string
  timestamp: string
  language: string
  messageCount: number
  resolved: boolean | null
  queryType: string
  duration: string
  userLocation?: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("admin_token")
    if (!token) {
      router.push("/admin/login")
      return
    }

    // Load chat data (simulated)
    loadChatData()
  }, [router])

  const loadChatData = async () => {
    setIsLoading(true)
    
    // Simulate API call - In production, this would fetch from backend
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Demo data
    const demoData: ChatSession[] = [
      {
        id: "S001",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        language: "Hindi",
        messageCount: 8,
        resolved: true,
        queryType: "Crop Disease",
        duration: "5m 32s",
        userLocation: "Punjab"
      },
      {
        id: "S002",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        language: "English",
        messageCount: 5,
        resolved: true,
        queryType: "Market Price",
        duration: "3m 15s",
        userLocation: "Maharashtra"
      },
      {
        id: "S003",
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        language: "Marathi",
        messageCount: 12,
        resolved: false,
        queryType: "Government Scheme",
        duration: "8m 45s",
        userLocation: "Maharashtra"
      },
      {
        id: "S004",
        timestamp: new Date(Date.now() - 14400000).toISOString(),
        language: "Punjabi",
        messageCount: 6,
        resolved: true,
        queryType: "Crop Selection",
        duration: "4m 20s",
        userLocation: "Punjab"
      },
      {
        id: "S005",
        timestamp: new Date(Date.now() - 18000000).toISOString(),
        language: "Hindi",
        messageCount: 15,
        resolved: null,
        queryType: "Weather Advisory",
        duration: "10m 5s",
        userLocation: "Uttar Pradesh"
      },
      {
        id: "S006",
        timestamp: new Date(Date.now() - 21600000).toISOString(),
        language: "Tamil",
        messageCount: 9,
        resolved: true,
        queryType: "Soil Management",
        duration: "6m 30s",
        userLocation: "Tamil Nadu"
      },
      {
        id: "S007",
        timestamp: new Date(Date.now() - 25200000).toISOString(),
        language: "English",
        messageCount: 4,
        resolved: false,
        queryType: "Irrigation",
        duration: "2m 50s",
        userLocation: "Karnataka"
      },
      {
        id: "S008",
        timestamp: new Date(Date.now() - 28800000).toISOString(),
        language: "Telugu",
        messageCount: 11,
        resolved: true,
        queryType: "Crop Disease",
        duration: "7m 15s",
        userLocation: "Andhra Pradesh"
      },
      {
        id: "S009",
        timestamp: new Date(Date.now() - 32400000).toISOString(),
        language: "Hindi",
        messageCount: 7,
        resolved: true,
        queryType: "Market Price",
        duration: "5m 0s",
        userLocation: "Rajasthan"
      },
      {
        id: "S010",
        timestamp: new Date(Date.now() - 36000000).toISOString(),
        language: "Gujarati",
        messageCount: 10,
        resolved: null,
        queryType: "Crop Cultivation",
        duration: "6m 45s",
        userLocation: "Gujarat"
      }
    ]
    
    setChatSessions(demoData)
    setIsLoading(false)
  }

  const handleLogout = () => {
    localStorage.removeItem("admin_token")
    toast.success("Logged out successfully")
    router.push("/")
  }

  // Calculate statistics
  const totalSessions = chatSessions.length
  const resolvedSessions = chatSessions.filter(s => s.resolved === true).length
  const unresolvedSessions = chatSessions.filter(s => s.resolved === false).length
  const pendingSessions = chatSessions.filter(s => s.resolved === null).length
  const resolutionRate = totalSessions > 0 ? ((resolvedSessions / totalSessions) * 100).toFixed(1) : "0"
  const avgMessages = totalSessions > 0 
    ? (chatSessions.reduce((sum, s) => sum + s.messageCount, 0) / totalSessions).toFixed(1)
    : "0"

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (resolved: boolean | null) => {
    if (resolved === true) {
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-100"><CheckCircle2 className="h-3 w-3 mr-1" />Resolved</Badge>
    } else if (resolved === false) {
      return <Badge className="bg-red-100 text-red-700 hover:bg-red-100"><XCircle className="h-3 w-3 mr-1" />Unresolved</Badge>
    } else {
      return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50/50 via-emerald-50/30 to-teal-50/50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50/50 via-emerald-50/30 to-teal-50/50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-green-600 p-2 rounded-lg">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-green-800">Admin Dashboard</h1>
              <p className="text-xs text-gray-600">AI Kisaan Sahayak Analytics</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/">
              <Button variant="outline" size="sm">
                Home
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-gray-900">{totalSessions}</div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Resolved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-green-600">{resolvedSessions}</div>
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Unresolved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-red-600">{unresolvedSessions}</div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Resolution Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-purple-600">{resolutionRate}%</div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Avg Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-orange-600">{avgMessages}</div>
                <MessageSquare className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different views */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
            <TabsTrigger value="unresolved">Unresolved</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <ChatSessionsTable sessions={chatSessions} formatDate={formatDate} getStatusBadge={getStatusBadge} />
          </TabsContent>

          <TabsContent value="resolved">
            <ChatSessionsTable 
              sessions={chatSessions.filter(s => s.resolved === true)} 
              formatDate={formatDate} 
              getStatusBadge={getStatusBadge} 
            />
          </TabsContent>

          <TabsContent value="unresolved">
            <ChatSessionsTable 
              sessions={chatSessions.filter(s => s.resolved === false)} 
              formatDate={formatDate} 
              getStatusBadge={getStatusBadge} 
            />
          </TabsContent>

          <TabsContent value="pending">
            <ChatSessionsTable 
              sessions={chatSessions.filter(s => s.resolved === null)} 
              formatDate={formatDate} 
              getStatusBadge={getStatusBadge} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

// Separate component for the table
function ChatSessionsTable({ 
  sessions, 
  formatDate, 
  getStatusBadge 
}: { 
  sessions: ChatSession[]
  formatDate: (date: string) => string
  getStatusBadge: (resolved: boolean | null) => JSX.Element
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Chat Sessions</CardTitle>
        <CardDescription>
          Detailed view of all chat interactions and their resolution status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Session ID</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Language</TableHead>
                <TableHead>Query Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Messages</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No sessions found
                  </TableCell>
                </TableRow>
              ) : (
                sessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="font-mono font-medium">{session.id}</TableCell>
                    <TableCell className="text-sm">{formatDate(session.timestamp)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{session.language}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">{session.queryType}</TableCell>
                    <TableCell className="text-sm">{session.userLocation || "N/A"}</TableCell>
                    <TableCell className="text-center">{session.messageCount}</TableCell>
                    <TableCell className="text-sm">{session.duration}</TableCell>
                    <TableCell>{getStatusBadge(session.resolved)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
















