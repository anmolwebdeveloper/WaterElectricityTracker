import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import {
  Settings as SettingsIcon,
  Bell,
  Zap,
  Droplets,
  DollarSign,
  Globe,
  Moon,
  Sun,
  Smartphone,
  Mail,
  Save,
  AlertTriangle,
  Gauge,
  Activity,
  Check
} from "lucide-react"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
}

export default function Settings() {
  const { toast } = useToast()
  
  // Meter Information
  const [electricityMeterNumber, setElectricityMeterNumber] = useState("EM-2024-12345")
  const [waterMeterNumber, setWaterMeterNumber] = useState("WM-2024-67890")
  const [meterReadingFrequency, setMeterReadingFrequency] = useState("15") // minutes
  
  // Alert Thresholds
  const [electricityThreshold, setElectricityThreshold] = useState([80])
  const [waterThreshold, setWaterThreshold] = useState([85])
  const [costThreshold, setCostThreshold] = useState([250])
  
  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [weeklyReport, setWeeklyReport] = useState(true)
  
  // Unit Preferences
  const [electricityUnit, setElectricityUnit] = useState("kWh")
  const [waterUnit, setWaterUnit] = useState("gallons")
  const [temperatureUnit, setTemperatureUnit] = useState("fahrenheit")
  const [currency, setCurrency] = useState("USD")
  
  // Appearance
  const [theme, setTheme] = useState("dark")
  const [compactView, setCompactView] = useState(false)
  
  const handleSaveSettings = () => {
    // In a real app, this would save to backend
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    })
  }

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="text-muted-foreground mt-1">Manage your preferences and configurations</p>
          </div>
          <Button onClick={handleSaveSettings} className="bg-gradient-to-r from-primary to-purple-500">
            <Save className="h-4 w-4 mr-2" />
            Save All Changes
          </Button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Tabs defaultValue="meters" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="meters">Meter Info</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          {/* Meter Information Tab */}
          <TabsContent value="meters" className="space-y-4">
            <Card className="glass">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Gauge className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-semibold">Meter Information</h3>
                  <Badge variant="secondary" className="ml-2">Connected</Badge>
                </div>

                <div className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Electricity Meter */}
                    <div className="space-y-2">
                      <Label htmlFor="electricity-meter" className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-primary" />
                        Electricity Meter Number
                      </Label>
                      <Input
                        id="electricity-meter"
                        value={electricityMeterNumber}
                        onChange={(e) => setElectricityMeterNumber(e.target.value)}
                        className="glass font-mono"
                        placeholder="EM-XXXX-XXXXX"
                      />
                      <p className="text-xs text-muted-foreground">Your unique electricity meter identifier</p>
                    </div>

                    {/* Water Meter */}
                    <div className="space-y-2">
                      <Label htmlFor="water-meter" className="flex items-center gap-2">
                        <Droplets className="h-4 w-4 text-cyan-500" />
                        Water Meter Number
                      </Label>
                      <Input
                        id="water-meter"
                        value={waterMeterNumber}
                        onChange={(e) => setWaterMeterNumber(e.target.value)}
                        className="glass font-mono"
                        placeholder="WM-XXXX-XXXXX"
                      />
                      <p className="text-xs text-muted-foreground">Your unique water meter identifier</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Reading Frequency */}
                  <div className="space-y-2">
                    <Label htmlFor="reading-freq" className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-green-500" />
                      Meter Reading Frequency
                    </Label>
                    <div className="flex items-center gap-4">
                      <Select value={meterReadingFrequency} onValueChange={setMeterReadingFrequency}>
                        <SelectTrigger className="glass w-[200px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">Every 5 minutes</SelectItem>
                          <SelectItem value="15">Every 15 minutes</SelectItem>
                          <SelectItem value="30">Every 30 minutes</SelectItem>
                          <SelectItem value="60">Every hour</SelectItem>
                        </SelectContent>
                      </Select>
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                        <Check className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">How often to fetch data from your smart meters</p>
                  </div>

                  {/* Meter Status Cards */}
                  <div className="grid gap-4 md:grid-cols-2 mt-6">
                    <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                      <div className="flex items-center justify-between mb-2">
                        <Zap className="h-5 w-5 text-primary" />
                        <Badge className="bg-green-500 text-white border-0">Online</Badge>
                      </div>
                      <p className="text-sm font-medium">Electricity Meter</p>
                      <p className="text-xs text-muted-foreground mt-1">Last reading: 2 minutes ago</p>
                      <p className="text-xs text-muted-foreground">Current: 52.3 kWh</p>
                    </div>

                    <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                      <div className="flex items-center justify-between mb-2">
                        <Droplets className="h-5 w-5 text-cyan-500" />
                        <Badge className="bg-green-500 text-white border-0">Online</Badge>
                      </div>
                      <p className="text-sm font-medium">Water Meter</p>
                      <p className="text-xs text-muted-foreground mt-1">Last reading: 2 minutes ago</p>
                      <p className="text-xs text-muted-foreground">Current: 125.8 gallons</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Alert Thresholds Tab */}
          <TabsContent value="alerts" className="space-y-4">
            <Card className="glass">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  <h3 className="text-xl font-semibold">Alert Thresholds</h3>
                </div>

                <div className="space-y-8">
                  {/* Electricity Threshold */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-primary" />
                        Electricity Usage Alert
                      </Label>
                      <span className="text-sm font-semibold">{electricityThreshold[0]}% of budget</span>
                    </div>
                    <Slider
                      value={electricityThreshold}
                      onValueChange={setElectricityThreshold}
                      max={100}
                      step={5}
                      className="py-4"
                    />
                    <p className="text-xs text-muted-foreground">
                      Get notified when electricity usage reaches {electricityThreshold[0]}% of your monthly budget
                    </p>
                  </div>

                  <Separator />

                  {/* Water Threshold */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        <Droplets className="h-4 w-4 text-cyan-500" />
                        Water Usage Alert
                      </Label>
                      <span className="text-sm font-semibold">{waterThreshold[0]}% of budget</span>
                    </div>
                    <Slider
                      value={waterThreshold}
                      onValueChange={setWaterThreshold}
                      max={100}
                      step={5}
                      className="py-4"
                    />
                    <p className="text-xs text-muted-foreground">
                      Get notified when water usage reaches {waterThreshold[0]}% of your monthly budget
                    </p>
                  </div>

                  <Separator />

                  {/* Cost Threshold */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        Monthly Cost Alert
                      </Label>
                      <span className="text-sm font-semibold">${costThreshold[0]}</span>
                    </div>
                    <Slider
                      value={costThreshold}
                      onValueChange={setCostThreshold}
                      max={500}
                      step={10}
                      className="py-4"
                    />
                    <p className="text-xs text-muted-foreground">
                      Get notified when total monthly cost reaches ${costThreshold[0]}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-4">
            <Card className="glass">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Bell className="h-5 w-5 text-purple-500" />
                  <h3 className="text-xl font-semibold">Notification Preferences</h3>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive alerts via email</p>
                      </div>
                    </div>
                    <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">SMS Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive alerts via text message</p>
                      </div>
                    </div>
                    <Switch checked={smsNotifications} onCheckedChange={setSmsNotifications} />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                      </div>
                    </div>
                    <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Weekly Summary Report</p>
                        <p className="text-sm text-muted-foreground">Get weekly usage summary every Monday</p>
                      </div>
                    </div>
                    <Switch checked={weeklyReport} onCheckedChange={setWeeklyReport} />
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-4">
            <Card className="glass">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Globe className="h-5 w-5 text-blue-500" />
                  <h3 className="text-xl font-semibold">Units & Display</h3>
                </div>

                <div className="space-y-6">
                  {/* Unit Preferences */}
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="electricity-unit">Electricity Unit</Label>
                      <Select value={electricityUnit} onValueChange={setElectricityUnit}>
                        <SelectTrigger className="glass">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kWh">Kilowatt-hour (kWh)</SelectItem>
                          <SelectItem value="MWh">Megawatt-hour (MWh)</SelectItem>
                          <SelectItem value="Wh">Watt-hour (Wh)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="water-unit">Water Unit</Label>
                      <Select value={waterUnit} onValueChange={setWaterUnit}>
                        <SelectTrigger className="glass">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gallons">Gallons (US)</SelectItem>
                          <SelectItem value="liters">Liters</SelectItem>
                          <SelectItem value="cubic-meters">Cubic Meters</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="temperature-unit">Temperature Unit</Label>
                      <Select value={temperatureUnit} onValueChange={setTemperatureUnit}>
                        <SelectTrigger className="glass">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fahrenheit">Fahrenheit (°F)</SelectItem>
                          <SelectItem value="celsius">Celsius (°C)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select value={currency} onValueChange={setCurrency}>
                        <SelectTrigger className="glass">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">US Dollar ($)</SelectItem>
                          <SelectItem value="EUR">Euro (€)</SelectItem>
                          <SelectItem value="GBP">British Pound (£)</SelectItem>
                          <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  {/* Appearance Settings */}
                  <div className="space-y-4">
                    <Label>Appearance</Label>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Moon className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Theme</p>
                          <p className="text-sm text-muted-foreground">Choose your preferred color scheme</p>
                        </div>
                      </div>
                      <Select value={theme} onValueChange={setTheme}>
                        <SelectTrigger className="glass w-[150px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Compact View</p>
                        <p className="text-sm text-muted-foreground">Show more data in less space</p>
                      </div>
                      <Switch checked={compactView} onCheckedChange={setCompactView} />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  )
}
