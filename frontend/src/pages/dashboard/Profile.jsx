import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Home,
  Calendar,
  Shield,
  Camera,
  Save,
  Edit,
  Trash,
  Award,
  TrendingUp,
  Zap,
  Droplets,
  Clock
} from "lucide-react"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
}

export default function Profile() {
  const { toast } = useToast()
  
  // User Information
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Green Street, Eco City, EC 12345",
    householdSize: "4",
    propertyType: "Single Family Home",
    squareFeet: "2,500",
    memberSince: "January 2024",
    bio: "Committed to sustainable living and reducing our household's environmental footprint."
  })

  // Account Stats
  const accountStats = [
    { label: "Days Active", value: "324", icon: Calendar, color: "text-blue-500" },
    { label: "Total Savings", value: "$487", icon: TrendingUp, color: "text-green-500" },
    { label: "Achievements", value: "12", icon: Award, color: "text-yellow-500" },
    { label: "Streak", value: "45 days", icon: Clock, color: "text-orange-500" }
  ]

  // Usage Summary
  const usageSummary = [
    {
      resource: "Electricity",
      thisMonth: "1,247 kWh",
      average: "1,150 kWh",
      trend: "+8.4%",
      trendUp: true,
      icon: Zap,
      color: "text-primary"
    },
    {
      resource: "Water",
      thisMonth: "8,540 gal",
      average: "8,800 gal",
      trend: "-3.0%",
      trendUp: false,
      icon: Droplets,
      color: "text-cyan-500"
    }
  ]

  const handleSaveProfile = () => {
    setIsEditing(false)
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    })
  }

  const handleChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              My Profile
            </h1>
            <p className="text-muted-foreground mt-1">Manage your account information</p>
          </div>
          {isEditing ? (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)} className="bg-transparent">
                Cancel
              </Button>
              <Button onClick={handleSaveProfile} className="bg-gradient-to-r from-primary to-purple-500">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)} variant="outline" className="bg-transparent">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Profile Card */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <Card className="glass">
            <div className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative group">
                  <Avatar className="w-32 h-32 border-4 border-primary/20">
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" />
                    <AvatarFallback className="text-3xl">JD</AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      size="sm"
                      className="absolute bottom-0 right-0 rounded-full w-10 h-10 p-0 bg-primary"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <h2 className="text-2xl font-bold mt-4">{profileData.name}</h2>
                <p className="text-sm text-muted-foreground">{profileData.email}</p>
                
                <div className="flex items-center gap-2 mt-3">
                  <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    Premium
                  </Badge>
                </div>

                <Separator className="my-6" />

                {/* Quick Stats */}
                <div className="w-full space-y-3">
                  {accountStats.map((stat, index) => {
                    const IconComponent = stat.icon
                    return (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <div className="flex items-center gap-2">
                          <IconComponent className={`h-4 w-4 ${stat.color}`} />
                          <span className="text-sm text-muted-foreground">{stat.label}</span>
                        </div>
                        <span className="font-semibold">{stat.value}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Right Column - Profile Details */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card className="glass">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <User className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-semibold">Personal Information</h3>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="glass"
                    />
                  ) : (
                    <p className="text-sm p-3 rounded-lg bg-muted/30">{profileData.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="glass"
                    />
                  ) : (
                    <p className="text-sm p-3 rounded-lg bg-muted/30">{profileData.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="glass"
                    />
                  ) : (
                    <p className="text-sm p-3 rounded-lg bg-muted/30">{profileData.phone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="memberSince">Member Since</Label>
                  <p className="text-sm p-3 rounded-lg bg-muted/30">{profileData.memberSince}</p>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  {isEditing ? (
                    <Input
                      id="address"
                      value={profileData.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                      className="glass"
                    />
                  ) : (
                    <p className="text-sm p-3 rounded-lg bg-muted/30">{profileData.address}</p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  {isEditing ? (
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => handleChange('bio', e.target.value)}
                      className="glass resize-none"
                      rows={3}
                    />
                  ) : (
                    <p className="text-sm p-3 rounded-lg bg-muted/30">{profileData.bio}</p>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Household Information */}
          <Card className="glass">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Home className="h-5 w-5 text-green-500" />
                <h3 className="text-xl font-semibold">Household Details</h3>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="householdSize">Household Size</Label>
                  {isEditing ? (
                    <Input
                      id="householdSize"
                      type="number"
                      value={profileData.householdSize}
                      onChange={(e) => handleChange('householdSize', e.target.value)}
                      className="glass"
                    />
                  ) : (
                    <p className="text-sm p-3 rounded-lg bg-muted/30">{profileData.householdSize} people</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="propertyType">Property Type</Label>
                  {isEditing ? (
                    <Input
                      id="propertyType"
                      value={profileData.propertyType}
                      onChange={(e) => handleChange('propertyType', e.target.value)}
                      className="glass"
                    />
                  ) : (
                    <p className="text-sm p-3 rounded-lg bg-muted/30">{profileData.propertyType}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="squareFeet">Square Footage</Label>
                  {isEditing ? (
                    <Input
                      id="squareFeet"
                      value={profileData.squareFeet}
                      onChange={(e) => handleChange('squareFeet', e.target.value)}
                      className="glass"
                    />
                  ) : (
                    <p className="text-sm p-3 rounded-lg bg-muted/30">{profileData.squareFeet} sq ft</p>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Usage Summary */}
          <Card className="glass">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="h-5 w-5 text-purple-500" />
                <h3 className="text-xl font-semibold">Usage Overview</h3>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {usageSummary.map((item, index) => {
                  const IconComponent = item.icon
                  return (
                    <div key={index} className="p-4 rounded-xl bg-muted/30">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <IconComponent className={`h-5 w-5 ${item.color}`} />
                          <span className="font-medium">{item.resource}</span>
                        </div>
                        <Badge variant={item.trendUp ? "destructive" : "secondary"} className={!item.trendUp && "bg-green-500/10 text-green-500 border-green-500/20"}>
                          {item.trend}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">This Month</p>
                        <p className="text-2xl font-bold">{item.thisMonth}</p>
                        <p className="text-xs text-muted-foreground">Average: {item.average}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </Card>

          {/* Danger Zone */}
          {isEditing && (
            <Card className="glass border-red-500/20">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-red-500 mb-4">Danger Zone</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                    <div>
                      <p className="font-medium">Delete Account</p>
                      <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                    </div>
                    <Button variant="destructive" size="sm">
                      <Trash className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
