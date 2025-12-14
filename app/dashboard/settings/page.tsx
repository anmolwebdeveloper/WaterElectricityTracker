"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Zap, Droplets, Wifi, Plus } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const [connectedDevices, setConnectedDevices] = useState<{
    smartMeter: boolean
    thermostat: boolean
  }>({
    smartMeter: false,
    thermostat: false,
  })

  const [showAddReading, setShowAddReading] = useState(false)
  const [electricityInput, setElectricityInput] = useState("")
  const [waterInput, setWaterInput] = useState("")

  const router = useRouter()

  const handleConnect = (device: "smartMeter" | "thermostat") => {
    setConnectedDevices((prev) => ({
      ...prev,
      [device]: !prev[device],
    }))
  }

  const handleSubmitReading = () => {
    console.log("[v0] Reading submitted from settings:", electricityInput, waterInput)
    setElectricityInput("")
    setWaterInput("")
    setShowAddReading(false)
  }

  const handleSignOut = () => {
    console.log("[v0] User signing out from settings")
    router.push("/")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Settings</h2>
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

      {/* IoT Integration Tab */}
      <Card className="p-6 animate-slide-in-up">
        <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold">
          <Wifi className="h-5 w-5" />
          Connected Devices
        </h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Connect your smart meters and thermostats for real-time monitoring and API integration
        </p>

        <div className="space-y-3">
          <Button
            onClick={() => handleConnect("smartMeter")}
            className={`w-full justify-start gap-2 h-auto py-3 transition-all ${
              connectedDevices.smartMeter
                ? "bg-primary/20 text-primary hover:bg-primary/30"
                : "bg-primary/10 text-primary hover:bg-primary/20"
            }`}
          >
            <div className="rounded-lg bg-primary/10 p-2">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium">
                {connectedDevices.smartMeter ? "Smart Meter Connected" : "Connect Smart Meter"}
              </div>
              <div className="text-xs text-muted-foreground">
                {connectedDevices.smartMeter ? "API: wattsmeter-001" : "Electricity monitoring"}
              </div>
            </div>
            {connectedDevices.smartMeter && <span className="text-xs font-semibold">✓</span>}
          </Button>

          <Button
            onClick={() => handleConnect("thermostat")}
            className={`w-full justify-start gap-2 h-auto py-3 transition-all ${
              connectedDevices.thermostat
                ? "bg-secondary/20 text-secondary hover:bg-secondary/30"
                : "bg-secondary/10 text-secondary hover:bg-secondary/20"
            }`}
          >
            <div className="rounded-lg bg-secondary/10 p-2">
              <Droplets className="h-5 w-5 text-secondary" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium">
                {connectedDevices.thermostat ? "Thermostat Connected" : "Link Smart Thermostat"}
              </div>
              <div className="text-xs text-muted-foreground">
                {connectedDevices.thermostat ? "API: smarttherm-002" : "Temperature & HVAC control"}
              </div>
            </div>
            {connectedDevices.thermostat && <span className="text-xs font-semibold">✓</span>}
          </Button>
        </div>
      </Card>

      {/* User Preferences */}
      <Card className="p-6 animate-slide-in-up" style={{ animationDelay: "100ms" }}>
        <h3 className="mb-4 text-lg font-semibold">Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Email Alerts</label>
            <input type="checkbox" defaultChecked className="h-4 w-4" />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Weekly Reports</label>
            <input type="checkbox" defaultChecked className="h-4 w-4" />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Anomaly Alerts</label>
            <input type="checkbox" defaultChecked className="h-4 w-4" />
          </div>
        </div>
      </Card>

      {/* Account */}
      <Card className="p-6 animate-slide-in-up" style={{ animationDelay: "200ms" }}>
        <h3 className="mb-4 text-lg font-semibold">Account</h3>
        <Button variant="destructive" className="w-full" onClick={handleSignOut}>
          Sign Out
        </Button>
      </Card>
    </div>
  )
}
