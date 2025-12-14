"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, Plus } from "lucide-react"
import { useState } from "react"

const yearlyData = [
  { name: "Jan", electricity: 240, water: 150 },
  { name: "Feb", electricity: 220, water: 140 },
  { name: "Mar", electricity: 200, water: 130 },
  { name: "Apr", electricity: 190, water: 120 },
  { name: "May", electricity: 210, water: 135 },
  { name: "Jun", electricity: 250, water: 160 },
]

const usageBreakdown = [
  { name: "HVAC", value: 45 },
  { name: "Water Heater", value: 25 },
  { name: "Lighting", value: 15 },
  { name: "Appliances", value: 15 },
]

const colors = ["#0066cc", "#00b4d8", "#00d9ff", "#48cae4"]

export default function AnalyticsPage() {
  const [showAddReading, setShowAddReading] = useState(false)
  const [electricityInput, setElectricityInput] = useState("")
  const [waterInput, setWaterInput] = useState("")

  const handleSubmitReading = () => {
    console.log("[v0] Reading submitted from analytics:", electricityInput, waterInput)
    setElectricityInput("")
    setWaterInput("")
    setShowAddReading(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Analytics</h2>
        <Button onClick={() => setShowAddReading(!showAddReading)}>
          <Plus className="h-4 w-4 mr-2" />
          {showAddReading ? "Cancel" : "Add Reading"}
        </Button>
      </div>

      {showAddReading && (
        <Card className="p-4 bg-muted/30 animate-slide-in-up">
          <h4 className="font-semibold mb-3">Add New Reading</h4>
          <div className="grid gap-3 md:grid-cols-2">
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
          </div>
          <Button size="sm" className="w-full mt-3" onClick={handleSubmitReading}>
            Submit Reading
          </Button>
        </Card>
      )}

      {/* Historical Data Chart */}
      <Card className="p-6 animate-slide-in-up">
        <h3 className="mb-4 font-semibold">Yearly Consumption Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={yearlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="electricity" stroke="#0066cc" />
            <Line type="monotone" dataKey="water" stroke="#00b4d8" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6 animate-slide-in-up" style={{ animationDelay: "100ms" }}>
        <h3 className="mb-4 flex items-center gap-2 font-semibold">
          <TrendingUp className="h-5 w-5" />
          Peer Comparison & Benchmarking
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={[
              { name: "Your Home", usage: 350 },
              { name: "Similar Homes Avg", usage: 300 },
            ]}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="usage" fill="#0066cc" />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 p-3 bg-secondary/10 border border-secondary/30 rounded-lg">
          <p className="text-sm text-muted-foreground">
            You are <span className="font-semibold text-accent">15% above average</span>. Consider reducing HVAC usage
            during peak hours. Your peers are saving an average of <span className="font-semibold">$18/month</span> with
            smart thermostat scheduling.
          </p>
        </div>
      </Card>

      {/* Usage Breakdown */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 animate-slide-in-up" style={{ animationDelay: "200ms" }}>
          <h3 className="mb-4 font-semibold">Electricity Usage by Appliance</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={usageBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {usageBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 animate-slide-in-up" style={{ animationDelay: "300ms" }}>
          <h3 className="mb-4 font-semibold">Water Usage by Fixture</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={[
                  { name: "Showers", value: 40 },
                  { name: "Toilets", value: 30 },
                  { name: "Washing Machine", value: 20 },
                  { name: "Other", value: 10 },
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {[
                  { name: "Showers", value: 40 },
                  { name: "Toilets", value: 30 },
                  { name: "Washing Machine", value: 20 },
                  { name: "Other", value: 10 },
                ].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  )
}
