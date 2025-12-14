"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Target, Plus, TrendingDown } from "lucide-react"
import { useState } from "react"

export default function GoalsPage() {
  const [showAddReading, setShowAddReading] = useState(false)
  const [electricityInput, setElectricityInput] = useState("")
  const [waterInput, setWaterInput] = useState("")

  const handleSubmitReading = () => {
    console.log("[v0] Reading submitted from goals:", electricityInput, waterInput)
    setElectricityInput("")
    setWaterInput("")
    setShowAddReading(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Savings Goals</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowAddReading(!showAddReading)}>
            <Plus className="h-4 w-4 mr-2" />
            {showAddReading ? "Cancel" : "Add Reading"}
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Goal
          </Button>
        </div>
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

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 animate-slide-in-up">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-primary/10 p-3">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Reduce Electricity by 15%</h3>
                <p className="text-sm text-muted-foreground">Ongoing</p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span className="font-semibold">45%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted">
              <div className="h-full w-[45%] rounded-full bg-primary transition-all duration-1000" />
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Estimated savings: $25/month</p>
        </Card>

        <Card className="p-6 animate-slide-in-up" style={{ animationDelay: "100ms" }}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-secondary/10 p-3">
                <TrendingDown className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold">Water Conservation</h3>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span className="font-semibold">68%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted">
              <div className="h-full w-[68%] rounded-full bg-secondary transition-all duration-1000" />
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Estimated savings: $12/month</p>
        </Card>
      </div>
    </div>
  )
}
