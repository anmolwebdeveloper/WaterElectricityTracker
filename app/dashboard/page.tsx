"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Zap, Droplets, AlertTriangle, Users, TrendingDown, Trophy, Plus, UserPlus, Check } from "lucide-react"
import { useState, useEffect } from "react"

const chartDataByPeriod = {
  day: [
    { time: "12 AM", electricity: 45, water: 30 },
    { time: "3 AM", electricity: 35, water: 25 },
    { time: "6 AM", electricity: 55, water: 60 },
    { time: "9 AM", electricity: 80, water: 45 },
    { time: "12 PM", electricity: 120, water: 90 },
    { time: "3 PM", electricity: 100, water: 70 },
    { time: "6 PM", electricity: 140, water: 110 },
    { time: "9 PM", electricity: 95, water: 55 },
    { time: "12 AM", electricity: 50, water: 35 },
  ],
  week: [
    { name: "Monday", electricity: 180, water: 120 },
    { name: "Tuesday", electricity: 200, water: 135 },
    { name: "Wednesday", electricity: 220, water: 150 },
    { name: "Thursday", electricity: 240, water: 165 },
    { name: "Friday", electricity: 210, water: 140 },
    { name: "Saturday", electricity: 195, water: 125 },
    { name: "Sunday", electricity: 170, water: 115 },
  ],
  month: [
    { name: "Week 1", electricity: 1260, water: 840 },
    { name: "Week 2", electricity: 1400, water: 945 },
    { name: "Week 3", electricity: 1540, water: 1050 },
    { name: "Week 4", electricity: 1680, water: 1155 },
  ],
}

const anomalies = [
  {
    id: 1,
    type: "water",
    severity: "high",
    message: "Water consumption spiked 30% yesterday at 5 PM",
    time: "Yesterday",
  },
  {
    id: 2,
    type: "electricity",
    severity: "medium",
    message: "Unusual AC usage detected early morning",
    time: "2 days ago",
  },
]

const applianceData = [
  { name: "HVAC", value: 35, color: "#0066cc" },
  { name: "Water Heater", value: 25, color: "#00b4d8" },
  { name: "Lighting", value: 20, color: "#90e0ef" },
  { name: "Appliances", value: 20, color: "#caf0f8" },
]

const fixtureData = [
  { name: "Showers", value: 40, color: "#0066cc" },
  { name: "Toilets", value: 30, color: "#00b4d8" },
  { name: "Washing Machine", value: 20, color: "#90e0ef" },
  { name: "Other", value: 10, color: "#caf0f8" },
]

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"electricity" | "water">("electricity")
  const [timePeriod, setTimePeriod] = useState<"day" | "week" | "month">("week")
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set())
  const [showAnomaly, setShowAnomaly] = useState(false)
  const [electricityReading, setElectricityReading] = useState(0)
  const [waterReading, setWaterReading] = useState(0)
  const [electricityInput, setElectricityInput] = useState("")
  const [waterInput, setWaterInput] = useState("")
  const [goalProgress, setGoalProgress] = useState(0)
  const [waterGoalProgress, setWaterGoalProgress] = useState(0)
  const [isAddingReading, setIsAddingReading] = useState(false)
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteSuccess, setInviteSuccess] = useState(false)
  const [familyMembers, setFamilyMembers] = useState([
    { id: 1, name: "You", initial: "Y", role: "Owner" },
    { id: 2, name: "Owner", initial: "O", role: "Admin" },
    { id: 3, name: "User", initial: "U", role: "Member" },
  ])

  useEffect(() => {
    const timers = [
      setTimeout(() => setVisibleItems((prev) => new Set([...prev, "usage"])), 100),
      setTimeout(() => setVisibleItems((prev) => new Set([...prev, "bill"])), 200),
      setTimeout(() => setVisibleItems((prev) => new Set([...prev, "chart"])), 300),
      setTimeout(() => setVisibleItems((prev) => new Set([...prev, "alerts"])), 400),
      setTimeout(() => setVisibleItems((prev) => new Set([...prev, "goal"])), 500),
      setTimeout(() => setVisibleItems((prev) => new Set([...prev, "actions"])), 600),
    ]
    return () => timers.forEach((timer) => clearTimeout(timer))
  }, [])

  const handleSubmitReading = () => {
    const elec = Number.parseFloat(electricityInput) || 0
    const water = Number.parseFloat(waterInput) || 0

    if (elec > 0 || water > 0) {
      setElectricityReading((prev) => prev + elec)
      setWaterReading((prev) => prev + water)

      const elecProgress = Math.min((elec / 100) * 100, 100)
      const waterProgress = Math.min((water / 150) * 100, 100)
      setGoalProgress(elecProgress)
      setWaterGoalProgress(waterProgress)

      setElectricityInput("")
      setWaterInput("")
      setIsAddingReading(false)

      console.log("[v0] Reading submitted - Electricity:", elec, "Water:", water)
    }
  }

  const handleInviteMember = () => {
    if (inviteEmail && inviteEmail.includes("@")) {
      const newMember = {
        id: familyMembers.length + 1,
        name: inviteEmail.split("@")[0],
        initial: inviteEmail[0].toUpperCase(),
        role: "Member",
      }
      setFamilyMembers([...familyMembers, newMember])
      setInviteSuccess(true)

      setTimeout(() => {
        setShowInviteDialog(false)
        setInviteEmail("")
        setInviteSuccess(false)
      }, 2000)

      console.log("[v0] Family member invited:", inviteEmail)
    }
  }

  const chartData = chartDataByPeriod[timePeriod]
  const projectedBill = (electricityReading * 0.12 + waterReading * 0.003).toFixed(2)
  const potentialSavings = (Number.parseFloat(projectedBill) * 0.2).toFixed(2)

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card
          className={`p-6 transition-all duration-500 ${
            visibleItems.has("usage") ? "animate-slide-in-up opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Electricity</p>
              <p className="mt-2 text-4xl font-bold text-primary">{electricityReading.toFixed(1)} kWh</p>
              <p className="mt-1 text-xs text-muted-foreground">This month</p>
              <p className="mt-2 text-xs font-medium">
                <span className="text-primary">vs. Last Month:</span>{" "}
                <span className="font-semibold">+{goalProgress.toFixed(0)}%</span>
              </p>
            </div>
            <div className="rounded-lg bg-primary/10 p-4">
              <Zap className="h-8 w-8 text-primary" />
            </div>
          </div>
        </Card>

        <Card
          className={`p-6 transition-all duration-500 ${
            visibleItems.has("usage") ? "animate-slide-in-up opacity-100" : "opacity-0"
          }`}
          style={{ animationDelay: visibleItems.has("usage") ? "100ms" : "0ms" }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Water</p>
              <p className="mt-2 text-4xl font-bold text-secondary">{waterReading.toFixed(1)} Liters</p>
              <p className="mt-1 text-xs text-muted-foreground">This month</p>
              <p className="mt-2 text-xs font-medium">
                <span className="text-secondary">vs. Last Month:</span>{" "}
                <span className="font-semibold">+{waterGoalProgress.toFixed(0)}%</span>
              </p>
            </div>
            <div className="rounded-lg bg-secondary/10 p-4">
              <Droplets className="h-8 w-8 text-secondary" />
            </div>
          </div>
        </Card>
      </div>

      <Card
        className={`p-6 transition-all duration-500 ${
          visibleItems.has("chart") ? "animate-slide-in-up opacity-100" : "opacity-0"
        }`}
        style={{ animationDelay: visibleItems.has("chart") ? "300ms" : "0ms" }}
      >
        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h3 className="text-lg font-semibold">Consumption Chart</h3>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={activeTab === "electricity" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("electricity")}
              >
                Electricity (kWh)
              </Button>
              <Button
                variant={activeTab === "water" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("water")}
              >
                Water (Liters)
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant={timePeriod === "day" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimePeriod("day")}
              className="text-xs"
            >
              Day
            </Button>
            <Button
              variant={timePeriod === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimePeriod("week")}
              className="text-xs"
            >
              Week
            </Button>
            <Button
              variant={timePeriod === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimePeriod("month")}
              className="text-xs"
            >
              Month
            </Button>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey={timePeriod === "day" ? "time" : "name"} />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey={activeTab === "electricity" ? "electricity" : "water"}
              stroke={activeTab === "electricity" ? "#0066cc" : "#00b4d8"}
              dot={{ r: 5 }}
              strokeWidth={2}
              name={activeTab === "electricity" ? "Electricity (kWh)" : "Water (L)"}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card
          className={`p-6 transition-all duration-500 ${
            visibleItems.has("bill") ? "animate-slide-in-up opacity-100" : "opacity-0"
          }`}
          style={{ animationDelay: visibleItems.has("bill") ? "200ms" : "0ms" }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">Projected Monthly Bill</p>
              <p className="mt-2 text-3xl font-bold">${projectedBill}</p>

              <div className="mt-6 space-y-3 border-t border-border pt-4">
                <div>
                  <p className="text-sm font-semibold">Potential Savings</p>
                  <p className="mt-1 text-lg font-bold text-accent">
                    Optimize your usage to save up to ${potentialSavings} this month
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">
                  <p>Current Trend: ${projectedBill}/month</p>
                  <p>Potential: ${(Number.parseFloat(projectedBill) * 0.8).toFixed(2)}/month</p>
                  <p className="font-semibold text-accent mt-1">Possible Savings: ${potentialSavings}/month</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-accent/10 p-4">
              <TrendingDown className="h-8 w-8 text-accent" />
            </div>
          </div>
        </Card>

        <Card
          className={`p-6 transition-all duration-500 ${
            visibleItems.has("alerts") ? "animate-slide-in-up opacity-100" : "opacity-0"
          }`}
          style={{ animationDelay: visibleItems.has("alerts") ? "400ms" : "0ms" }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="mb-4 flex items-center gap-2 font-semibold text-lg">
                <AlertTriangle className="h-5 w-5 text-accent" />
                Anomaly Detection
              </h3>

              {!showAnomaly ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">✓ No anomalies detected</p>
                  <p className="text-xs text-muted-foreground">Your usage patterns are normal for the last 7 days</p>
                  <Button variant="outline" size="sm" onClick={() => setShowAnomaly(true)} className="mt-3 text-xs">
                    View Sample Alert
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
                  {anomalies.map((anomaly) => (
                    <div key={anomaly.id} className="flex gap-3">
                      <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground break-words">{anomaly.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{anomaly.time}</p>
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAnomaly(false)}
                    className="mt-2 text-xs w-full"
                  >
                    Hide Sample
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      <Card
        className={`p-6 transition-all duration-500 ${
          visibleItems.has("goal") ? "animate-slide-in-up opacity-100" : "opacity-0"
        }`}
        style={{ animationDelay: visibleItems.has("goal") ? "500ms" : "0ms" }}
      >
        <div className="space-y-6">
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <Trophy className="h-5 w-5 text-primary" />
            Monthly Reduction Goals
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3 p-4 rounded-lg border border-border bg-muted/30">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">Monthly Energy Reduction Goal</p>
                  <p className="text-sm text-muted-foreground mt-1">Reduce consumption by 10%</p>
                </div>
                <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-1 rounded">
                  {goalProgress.toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div
                  className="bg-primary h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(goalProgress, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground">
                {goalProgress === 0
                  ? "Add readings to track your progress toward this goal"
                  : `You're ${goalProgress.toFixed(0)}% towards your reduction goal!`}
              </p>
            </div>

            <div className="space-y-3 p-4 rounded-lg border border-border bg-muted/30">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">Water Conservation Goal</p>
                  <p className="text-sm text-muted-foreground mt-1">Reduce usage by 15%</p>
                </div>
                <span className="text-xs font-bold bg-secondary/10 text-secondary px-2 py-1 rounded">
                  {waterGoalProgress.toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div
                  className="bg-secondary h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(waterGoalProgress, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground">
                {waterGoalProgress === 0
                  ? "Start tracking water usage to unlock conservation achievements"
                  : `Great progress! ${waterGoalProgress.toFixed(0)}% of your water conservation goal achieved`}
              </p>
            </div>
          </div>

          <Button
            className="w-full"
            onClick={() => {
              setGoalProgress(0)
              setWaterGoalProgress(0)
              console.log("[v0] Goals reset")
            }}
          >
            <Trophy className="h-4 w-4 mr-2" />
            Reset Goals
          </Button>
        </div>
      </Card>

      <Card
        className={`p-6 transition-all duration-500 ${
          visibleItems.has("actions") ? "animate-slide-in-up opacity-100" : "opacity-0"
        }`}
        style={{ animationDelay: visibleItems.has("actions") ? "600ms" : "0ms" }}
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Add New Reading
            </h3>
            <p className="text-sm text-muted-foreground">
              Manually log your water and electricity meter readings to keep your data up to date.
            </p>
            <Button className="w-full" onClick={() => setIsAddingReading(!isAddingReading)}>
              {isAddingReading ? "Cancel" : "+ Add Reading"}
            </Button>

            {isAddingReading && (
              <div className="space-y-3 p-4 bg-muted/30 rounded-lg border border-border animate-slide-in-up">
                <div>
                  <label className="text-sm font-medium">Electricity (kWh)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={electricityInput}
                    onChange={(e) => setElectricityInput(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Water (Liters)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={waterInput}
                    onChange={(e) => setWaterInput(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button size="sm" className="w-full" onClick={handleSubmitReading}>
                  Submit Reading
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Users className="h-5 w-5 text-secondary" />
              Household Members
            </h3>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Family members with access to this household's data</p>
              <div className="flex items-center gap-2 flex-wrap">
                {familyMembers.map((member) => (
                  <div
                    key={member.id}
                    className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-sm font-bold cursor-pointer hover:scale-110 transition-transform"
                    title={`${member.name} (${member.role})`}
                  >
                    {member.initial}
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => setShowInviteDialog(!showInviteDialog)}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                {showInviteDialog ? "Cancel" : "Invite Family Member"}
              </Button>

              {showInviteDialog && (
                <div className="space-y-3 p-4 bg-muted/30 rounded-lg border border-border animate-slide-in-up">
                  {!inviteSuccess ? (
                    <>
                      <div>
                        <label className="text-sm font-medium">Email Address</label>
                        <Input
                          type="email"
                          placeholder="family@example.com"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <Button size="sm" className="w-full" onClick={handleInviteMember}>
                        Send Invitation
                      </Button>
                    </>
                  ) : (
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400 justify-center py-2">
                      <Check className="h-5 w-5" />
                      <span className="font-medium">Invitation sent successfully!</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
