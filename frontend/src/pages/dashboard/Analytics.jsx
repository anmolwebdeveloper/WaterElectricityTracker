import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  Zap,
  Droplets,
  Target,
  Brain,
  Clock,
  AlertCircle,
  BarChart3,
  Activity
} from "lucide-react"

// Mock data generators
const generateDailyData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  return days.map(day => ({
    day,
    electricity: Math.floor(Math.random() * 30 + 40),
    water: Math.floor(Math.random() * 150 + 200),
    cost: Math.floor(Math.random() * 15 + 10)
  }))
}

const generateWeeklyData = () => {
  const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4']
  return weeks.map(week => ({
    week,
    electricity: Math.floor(Math.random() * 200 + 250),
    water: Math.floor(Math.random() * 1000 + 1500),
    cost: Math.floor(Math.random() * 80 + 60)
  }))
}

const generateMonthlyData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return months.map(month => ({
    month,
    electricity: Math.floor(Math.random() * 400 + 800),
    water: Math.floor(Math.random() * 2000 + 6000),
    cost: Math.floor(Math.random() * 150 + 150)
  }))
}

const peakHoursData = [
  { hour: '00:00', usage: 15 },
  { hour: '02:00', usage: 12 },
  { hour: '04:00', usage: 10 },
  { hour: '06:00', usage: 25 },
  { hour: '08:00', usage: 55 },
  { hour: '10:00', usage: 45 },
  { hour: '12:00', usage: 60 },
  { hour: '14:00', usage: 50 },
  { hour: '16:00', usage: 48 },
  { hour: '18:00', usage: 75 },
  { hour: '20:00', usage: 85 },
  { hour: '22:00', usage: 40 },
]

const comparisonData = [
  { category: 'Electricity', thisMonth: 1247, lastMonth: 1089, average: 1150 },
  { category: 'Water', thisMonth: 8540, lastMonth: 9120, average: 8800 },
  { category: 'Cost', thisMonth: 228, lastMonth: 245, average: 235 },
]

const efficiencyData = [
  { metric: 'HVAC', value: 75, fullMark: 100 },
  { metric: 'Lighting', value: 85, fullMark: 100 },
  { metric: 'Appliances', value: 65, fullMark: 100 },
  { metric: 'Water Heating', value: 70, fullMark: 100 },
  { metric: 'Electronics', value: 80, fullMark: 100 },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
  }
}

export default function Analytics() {
  const [activeTab, setActiveTab] = useState('daily')
  const [dailyData] = useState(generateDailyData())
  const [weeklyData] = useState(generateWeeklyData())
  const [monthlyData] = useState(generateMonthlyData())

  const calculatePrediction = () => {
    const today = new Date()
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
    const daysPassed = today.getDate()
    const daysRemaining = daysInMonth - daysPassed
    
    const currentElectricity = 1247
    const currentWater = 8540
    const currentCost = 228.80
    
    const avgElectricityPerDay = currentElectricity / daysPassed
    const avgWaterPerDay = currentWater / daysPassed
    const avgCostPerDay = currentCost / daysPassed
    
    return {
      electricity: Math.floor(currentElectricity + (avgElectricityPerDay * daysRemaining)),
      water: Math.floor(currentWater + (avgWaterPerDay * daysRemaining)),
      cost: (currentCost + (avgCostPerDay * daysRemaining)).toFixed(2),
      daysRemaining
    }
  }

  const prediction = calculatePrediction()

  const getChartData = () => {
    switch(activeTab) {
      case 'daily': return dailyData
      case 'weekly': return weeklyData
      case 'monthly': return monthlyData
      default: return dailyData
    }
  }

  const getDataKey = () => {
    switch(activeTab) {
      case 'daily': return 'day'
      case 'weekly': return 'week'
      case 'monthly': return 'month'
      default: return 'day'
    }
  }

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              Deep Analytics
            </h1>
            <p className="text-muted-foreground mt-1">Insights and predictive analysis</p>
          </div>
          <Button variant="outline" className="bg-transparent">
            <Calendar className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="glass border-purple-500/20">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="h-5 w-5 text-purple-500" />
              <h3 className="text-xl font-semibold">AI-Powered Prediction</h3>
              <Badge variant="secondary" className="ml-2">Beta</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Based on current usage patterns, here's your projected end-of-month consumption
            </p>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                <div className="flex items-center justify-between mb-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
                <p className="text-sm text-muted-foreground">Projected Electricity</p>
                <p className="text-2xl font-bold mt-1">{prediction.electricity} kWh</p>
                <p className="text-xs text-muted-foreground mt-2">
                  +{prediction.electricity - 1247} kWh in {prediction.daysRemaining} days
                </p>
              </div>

              <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                <div className="flex items-center justify-between mb-2">
                  <Droplets className="h-5 w-5 text-cyan-500" />
                  <TrendingDown className="h-4 w-4 text-red-500" />
                </div>
                <p className="text-sm text-muted-foreground">Projected Water</p>
                <p className="text-2xl font-bold mt-1">{prediction.water} gal</p>
                <p className="text-xs text-muted-foreground mt-2">
                  +{prediction.water - 8540} gal in {prediction.daysRemaining} days
                </p>
              </div>

              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  <Target className="h-4 w-4 text-green-500" />
                </div>
                <p className="text-sm text-muted-foreground">Projected Cost</p>
                <p className="text-2xl font-bold mt-1">${prediction.cost}</p>
                <p className="text-xs text-green-500 mt-2">Within budget range</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="glass">
          <div className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Usage Trends
                </h3>
                <TabsList>
                  <TabsTrigger value="daily">Daily</TabsTrigger>
                  <TabsTrigger value="weekly">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value={activeTab} className="space-y-4">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={getChartData()}>
                    <defs>
                      <linearGradient id="electricityGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis dataKey={getDataKey()} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="electricity" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#electricityGrad)" />
                    <Area type="monotone" dataKey="water" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#waterGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </div>
        </Card>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2">
        <motion.div variants={itemVariants}>
          <Card className="glass h-full">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Clock className="h-5 w-5 text-orange-500" />
                <h3 className="text-xl font-semibold">Peak Usage Hours</h3>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={peakHoursData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="usage" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Peak: 8PM - 10PM</p>
                    <p className="text-xs text-muted-foreground">Consider shifting usage to off-peak hours</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="glass h-full">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Activity className="h-5 w-5 text-green-500" />
                <h3 className="text-xl font-semibold">Efficiency Score</h3>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={efficiencyData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="metric" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={10} />
                  <Radar name="Efficiency" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="p-3 rounded-lg bg-green-500/10 text-center">
                  <p className="text-2xl font-bold text-green-500">75%</p>
                  <p className="text-xs text-muted-foreground mt-1">Overall Score</p>
                </div>
                <div className="p-3 rounded-lg bg-primary/10 text-center">
                  <p className="text-2xl font-bold text-primary">+5%</p>
                  <p className="text-xs text-muted-foreground mt-1">vs Last Month</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <Card className="glass">
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-6">Comparative Analysis</h3>
            <div className="space-y-4">
              {comparisonData.map((item, index) => (
                <div key={index} className="p-4 rounded-xl bg-muted/30">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-medium">{item.category}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">This Month: <span className="font-semibold text-foreground">{item.thisMonth}</span></span>
                      <span className="text-muted-foreground">Last Month: <span className="font-semibold text-foreground">{item.lastMonth}</span></span>
                      <span className="text-muted-foreground">Average: <span className="font-semibold text-foreground">{item.average}</span></span>
                    </div>
                  </div>
                  <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="absolute h-full bg-gradient-to-r from-primary to-purple-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.thisMonth / item.average) * 50}%` }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  )
}
