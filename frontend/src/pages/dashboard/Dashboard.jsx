import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useMeters } from "@/context/meters"
import { useToast } from "@/hooks/use-toast"
import { reportsAPI } from "@/utils/api"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { 
  Zap, 
  Droplets, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Activity,
  DollarSign,
  Clock,
  Calendar,
  ArrowUp,
  ArrowDown,
  Gauge,
  RefreshCw
} from "lucide-react"
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts"

// Mock Data - Real-time consumption for last 24 hours
const generateLiveData = () => {
  const now = new Date()
  const data = []
  for (let i = 23; i >= 0; i--) {
    const hour = new Date(now.getTime() - i * 60 * 60 * 1000)
    data.push({
      time: hour.getHours() + ":00",
      electricity: Math.floor(Math.random() * 30 + 40), // 40-70 kWh
      water: Math.floor(Math.random() * 50 + 100), // 100-150 gallons
    })
  }
  return data
}

// Usage breakdown by category
const usageBreakdown = [
  { name: "HVAC", value: 42, color: "#3b82f6" },
  { name: "Lighting", value: 18, color: "#06b6d4" },
  { name: "Appliances", value: 25, color: "#8b5cf6" },
  { name: "Water Heating", value: 15, color: "#f59e0b" },
]

// Recent alerts
const recentAlerts = [
  { id: 1, type: "warning", message: "Electricity usage 15% above average", time: "2 hours ago", icon: AlertTriangle, color: "text-yellow-500" },
  { id: 2, type: "info", message: "Water consumption within budget", time: "5 hours ago", icon: Droplets, color: "text-cyan-500" },
  { id: 3, type: "critical", message: "Peak usage detected at 8 PM", time: "Yesterday", icon: TrendingUp, color: "text-red-500" },
]

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
}

const cardHoverVariants = {
  hover: {
    scale: 1.02,
    y: -5,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  }
}

export default function Dashboard() {
  const { toast } = useToast()
  const [liveData, setLiveData] = useState(generateLiveData())
  const [isLive, setIsLive] = useState(true)
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark'))
  const [reportSettings, setReportSettings] = useState({
    frequency: 'weekly',
    email: '',
    reportType: 'comprehensive',
    includeComparison: true
  })
  const { electricityMeter, waterMeter, fetchMeterData, isLoading } = useMeters()

  // Detect dark mode changes
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDarkMode(document.documentElement.classList.contains('dark'))
        }
      })
    })
    
    observer.observe(document.documentElement, { attributes: true })
    return () => observer.disconnect()
  }, [])

  const handleScheduleReport = async () => {
    try {
      const result = await reportsAPI.schedule(reportSettings)
      toast({
        title: "Report Scheduled Successfully",
        description: `Your ${reportSettings.frequency} report will be sent to ${reportSettings.email || 'your email'}`,
      })
      setIsReportDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error Scheduling Report",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  // Current month stats
  const currentStats = {
    electricity: {
      current: 1247,
      previous: 1089,
      unit: "kWh",
      cost: 186.50
    },
    water: {
      current: 8540,
      previous: 9120,
      unit: "gal",
      cost: 42.30
    }
  }

  // Calculate percentage change
  const getPercentageChange = (current, previous) => {
    const change = ((current - previous) / previous) * 100
    return {
      value: Math.abs(change).toFixed(1),
      isIncrease: change > 0
    }
  }

  const electricityChange = getPercentageChange(currentStats.electricity.current, currentStats.electricity.previous)
  const waterChange = getPercentageChange(currentStats.water.current, currentStats.water.previous)

  // Simulate live data updates
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      setLiveData(prevData => {
        const newData = [...prevData.slice(1)]
        const lastEntry = newData[newData.length - 1]
        const now = new Date()
        newData.push({
          time: now.getHours() + ":" + String(now.getMinutes()).padStart(2, '0'),
          electricity: Math.floor(Math.random() * 10 + lastEntry.electricity - 5),
          water: Math.floor(Math.random() * 20 + lastEntry.water - 10),
        })
        return newData
      })
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [isLive])

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Command Center
          </h1>
          <p className="text-muted-foreground mt-1">Real-time resource monitoring and insights</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass">
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            <span className="text-sm font-medium">{isLive ? 'Live' : 'Paused'}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLive(!isLive)}
            className="bg-transparent"
          >
            {isLive ? 'Pause' : 'Resume'}
          </Button>
        </div>
      </motion.div>

      {/* Meter Information Card */}
      <motion.div variants={itemVariants}>
        <Card className="glass border-primary/20">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Gauge className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Connected Meters</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchMeterData}
                disabled={isLoading}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {/* Electricity Meter */}
              {electricityMeter && (
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Electricity Meter</span>
                    </div>
                    <Badge className={`${electricityMeter.status === 'online' ? 'bg-green-500' : 'bg-red-500'} text-white border-0 text-xs`}>
                      {electricityMeter.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono mb-2">ID: {electricityMeter.number}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-primary">{electricityMeter.currentValue.toFixed(1)}</span>
                    <span className="text-xs text-muted-foreground">{electricityMeter.unit}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Updated: {new Date(electricityMeter.lastReading).toLocaleTimeString()}
                  </p>
                </div>
              )}

              {/* Water Meter */}
              {waterMeter && (
                <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-cyan-500" />
                      <span className="text-sm font-medium">Water Meter</span>
                    </div>
                    <Badge className={`${waterMeter.status === 'online' ? 'bg-green-500' : 'bg-red-500'} text-white border-0 text-xs`}>
                      {waterMeter.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono mb-2">ID: {waterMeter.number}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-cyan-500">{waterMeter.currentValue.toFixed(1)}</span>
                    <span className="text-xs text-muted-foreground">{waterMeter.unit}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Updated: {new Date(waterMeter.lastReading).toLocaleTimeString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Quick Stats Cards */}
      <motion.div 
        variants={itemVariants}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {/* Electricity Usage Card */}
        <motion.div whileHover="hover" variants={cardHoverVariants}>
          <Card className="relative overflow-hidden glass border-primary/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-2xl" />
            <div className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold ${electricityChange.isIncrease ? 'text-red-500' : 'text-green-500'}`}>
                  {electricityChange.isIncrease ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                  {electricityChange.value}%
                </div>
              </div>
              <h3 className="text-sm font-medium text-muted-foreground">Electricity</h3>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold">{currentStats.electricity.current.toLocaleString()}</span>
                <span className="text-sm text-muted-foreground">{currentStats.electricity.unit}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">vs. last month: {currentStats.electricity.previous.toLocaleString()}</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Water Usage Card */}
        <motion.div whileHover="hover" variants={cardHoverVariants}>
          <Card className="relative overflow-hidden glass border-cyan-500/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-full blur-2xl" />
            <div className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-cyan-500/10">
                  <Droplets className="h-6 w-6 text-cyan-500" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold ${waterChange.isIncrease ? 'text-red-500' : 'text-green-500'}`}>
                  {waterChange.isIncrease ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                  {waterChange.value}%
                </div>
              </div>
              <h3 className="text-sm font-medium text-muted-foreground">Water</h3>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold">{currentStats.water.current.toLocaleString()}</span>
                <span className="text-sm text-muted-foreground">{currentStats.water.unit}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">vs. last month: {currentStats.water.previous.toLocaleString()}</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Total Cost Card */}
        <motion.div whileHover="hover" variants={cardHoverVariants}>
          <Card className="relative overflow-hidden glass border-green-500/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/20 to-transparent rounded-full blur-2xl" />
            <div className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-green-500/10">
                  <DollarSign className="h-6 w-6 text-green-500" />
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold text-green-500">
                  <TrendingDown className="h-4 w-4" />
                  3.2%
                </div>
              </div>
              <h3 className="text-sm font-medium text-muted-foreground">Total Cost</h3>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold">${(currentStats.electricity.cost + currentStats.water.cost).toFixed(2)}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">This month</span>
                <span className="text-green-500 font-medium">-$7.80</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Active Alerts Card */}
        <motion.div whileHover="hover" variants={cardHoverVariants}>
          <Card className="relative overflow-hidden glass border-yellow-500/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-500/20 to-transparent rounded-full blur-2xl" />
            <div className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-yellow-500/10">
                  <AlertTriangle className="h-6 w-6 text-yellow-500" />
                </div>
                <Activity className="h-5 w-5 text-yellow-500 animate-pulse" />
              </div>
              <h3 className="text-sm font-medium text-muted-foreground">Active Alerts</h3>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold">3</span>
                <span className="text-sm text-muted-foreground">notifications</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">1 requires action</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Live Consumption Area Chart */}
      <motion.div variants={itemVariants}>
        <Card className="glass">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Live Consumption
                </h3>
                <p className="text-sm text-muted-foreground mt-1">Real-time resource usage over the last 24 hours</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-sm">Electricity</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-cyan-500" />
                  <span className="text-sm">Water</span>
                </div>
              </div>
            </div>
            
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={liveData}>
                <defs>
                  <linearGradient id="colorElectricity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'hsl(var(--border))'} 
                  opacity={0.3} 
                />
                <XAxis 
                  dataKey="time" 
                  stroke={isDarkMode ? '#e2e8f0' : 'hsl(var(--muted-foreground))'}
                  fontSize={12}
                  tick={{ fill: isDarkMode ? '#e2e8f0' : 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  stroke={isDarkMode ? '#e2e8f0' : 'hsl(var(--muted-foreground))'}
                  fontSize={12}
                  tick={{ fill: isDarkMode ? '#e2e8f0' : 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    padding: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="electricity" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorElectricity)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="water" 
                  stroke="#06b6d4" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorWater)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>

      {/* Usage Breakdown and Recent Alerts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Usage Breakdown Donut Chart */}
        <motion.div variants={itemVariants}>
          <Card className="glass h-full">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-1">Usage Breakdown</h3>
              <p className="text-sm text-muted-foreground mb-6">Distribution by category</p>
              
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={usageBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {usageBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--foreground))'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                {usageBreakdown.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.value}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Recent Alerts */}
        <motion.div variants={itemVariants}>
          <Card className="glass h-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold">Recent Alerts</h3>
                  <p className="text-sm text-muted-foreground">Latest notifications</p>
                </div>
                <Button variant="ghost" size="sm" className="text-primary">
                  View All
                </Button>
              </div>

              <div className="space-y-4">
                {recentAlerts.map((alert, index) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className={`p-2 rounded-lg ${alert.color.replace('text-', 'bg-').replace('500', '500/10')}`}>
                      <alert.icon className={`h-4 w-4 ${alert.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{alert.message}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">{alert.time}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Button
                variant="outline" 
                className="w-full mt-4 bg-transparent"
                onClick={() => setIsReportDialogOpen(true)}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Report
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Schedule Report Dialog */}
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <AnimatePresence>
          {isReportDialogOpen && (
            <DialogContent className="glass" asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <DialogHeader>
                  <DialogTitle>Schedule Automated Report</DialogTitle>
                  <DialogDescription>
                    Set up automatic consumption reports delivered to your inbox
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Report Frequency</Label>
                    <Select 
                      value={reportSettings.frequency}
                      onValueChange={(value) => setReportSettings({...reportSettings, frequency: value})}
                    >
                      <SelectTrigger className="glass">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={reportSettings.email}
                      onChange={(e) => setReportSettings({...reportSettings, email: e.target.value})}
                      className="glass"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reportType">Report Type</Label>
                    <Select 
                      value={reportSettings.reportType}
                      onValueChange={(value) => setReportSettings({...reportSettings, reportType: value})}
                    >
                      <SelectTrigger className="glass">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="comprehensive">Comprehensive</SelectItem>
                        <SelectItem value="summary">Summary Only</SelectItem>
                        <SelectItem value="cost-focused">Cost Focused</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsReportDialogOpen(false)} className="bg-transparent">
                    Cancel
                  </Button>
                  <Button onClick={handleScheduleReport} className="bg-gradient-to-r from-primary to-accent">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Report
                  </Button>
                </DialogFooter>
              </motion.div>
            </DialogContent>
          )}
        </AnimatePresence>
      </Dialog>
    </motion.div>
  )
}
