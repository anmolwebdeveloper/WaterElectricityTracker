import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { goalsAPI } from "@/utils/api"
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
import {
  Target,
  Trophy,
  Zap,
  Droplets,
  TrendingUp,
  Award,
  Star,
  Leaf,
  Plus,
  Edit,
  Check,
  Flame,
  Loader2
} from "lucide-react"

const initialGoals = [
  {
    id: 1,
    type: 'electricity',
    name: 'Electricity Budget',
    target: 1200,
    current: 1247,
    unit: 'kWh',
    icon: Zap,
    textColor: 'text-primary',
    bgColor: 'bg-primary/10',
    borderColor: 'border-primary/20'
  },
  {
    id: 2,
    type: 'water',
    name: 'Water Budget',
    target: 9000,
    current: 8540,
    unit: 'gal',
    icon: Droplets,
    textColor: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/20'
  },
  {
    id: 3,
    type: 'cost',
    name: 'Monthly Cost Target',
    target: 250,
    current: 228,
    unit: '$',
    icon: Target,
    textColor: 'text-green-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20'
  }
]

const achievements = [
  { id: 1, name: 'Water Saver', description: 'Reduce water by 10%', achieved: true, icon: Droplets, color: 'text-cyan-500' },
  { id: 2, name: 'Energy Efficient', description: 'Below target for 3 months', achieved: true, icon: Zap, color: 'text-primary' },
  { id: 3, name: 'Cost Cutter', description: 'Save $50 vs last year', achieved: false, icon: Target, color: 'text-green-500' },
  { id: 4, name: 'Eco Warrior', description: 'Sustainability score 80+', achieved: true, icon: Leaf, color: 'text-emerald-500' },
  { id: 5, name: 'Streak Master', description: '30 days under budget', achieved: false, icon: Flame, color: 'text-orange-500' },
  { id: 6, name: 'Peak Optimizer', description: 'Avoid peak hours 20 days', achieved: false, icon: TrendingUp, color: 'text-purple-500' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
}

export default function Goals() {
  const { toast } = useToast()
  const [goals, setGoals] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingGoal, setEditingGoal] = useState(null)
  const [newTarget, setNewTarget] = useState(0)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isNewGoalDialogOpen, setIsNewGoalDialogOpen] = useState(false)
  const [newGoalData, setNewGoalData] = useState({
    title: '',
    type: 'electricity',
    target: 0,
    unit: 'kWh',
    deadline: '',
    description: ''
  })

  // Fetch goals from API
  useEffect(() => {
    fetchGoals()
  }, [])

  const fetchGoals = async () => {
    try {
      setIsLoading(true)
      const data = await goalsAPI.getAll()
      setGoals(data)
    } catch (error) {
      toast({
        title: "Error loading goals",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateGoal = async () => {
    try {
      const goal = await goalsAPI.create(newGoalData)
      setGoals([...goals, goal])
      setIsNewGoalDialogOpen(false)
      setNewGoalData({
        title: '',
        type: 'electricity',
        target: 0,
        unit: 'kWh',
        deadline: '',
        description: ''
      })
      toast({
        title: "Goal created successfully",
        description: "Your new goal has been added",
      })
    } catch (error) {
      toast({
        title: "Error creating goal",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const handleUpdateGoal = async () => {
    if (editingGoal && newTarget > 0) {
      try {
        const updatedGoal = await goalsAPI.update(editingGoal._id, { target: newTarget })
        setGoals(goals.map(goal => 
          goal._id === editingGoal._id ? updatedGoal : goal
        ))
        setIsDialogOpen(false)
        setEditingGoal(null)
        setNewTarget(0)
        toast({
          title: "Goal updated",
          description: "Your goal target has been updated successfully",
        })
      } catch (error) {
        toast({
          title: "Error updating goal",
          description: error.message,
          variant: "destructive"
        })
      }
    }
  }

  const calculateSustainabilityScore = () => {
    let score = 0
    goals.forEach(goal => {
      const percentage = (goal.current / goal.target) * 100
      if (percentage <= 100) {
        score += 33.33
      } else {
        score += Math.max(0, 33.33 - (percentage - 100))
      }
    })
    return Math.min(100, Math.floor(score))
  }

  const sustainabilityScore = calculateSustainabilityScore()

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-500'
    if (score >= 60) return 'text-green-500'
    if (score >= 40) return 'text-yellow-500'
    if (score >= 20) return 'text-orange-500'
    return 'text-red-500'
  }

  const getScoreBadge = (score) => {
    if (score >= 80) return { label: 'Excellent', color: 'bg-emerald-500' }
    if (score >= 60) return { label: 'Good', color: 'bg-green-500' }
    if (score >= 40) return { label: 'Average', color: 'bg-yellow-500' }
    if (score >= 20) return { label: 'Needs Work', color: 'bg-orange-500' }
    return { label: 'Critical', color: 'bg-red-500' }
  }

  const openEditDialog = (goal) => {
    setEditingGoal(goal)
    setNewTarget(goal.target)
    setIsDialogOpen(true)
  }

  const scoreBadge = getScoreBadge(sustainabilityScore)

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
              Goals & Achievements
            </h1>
            <p className="text-muted-foreground mt-1">Track progress and earn rewards</p>
          </div>
          <Button className="bg-gradient-to-r from-primary to-purple-500">
            <Plus className="h-4 w-4 mr-2" />
            New Goal
          </Button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="glass border-emerald-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-full blur-3xl" />
          <div className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-emerald-500/10">
                    <Leaf className="h-6 w-6 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Sustainability Score</h3>
                    <p className="text-sm text-muted-foreground">Your environmental impact rating</p>
                  </div>
                </div>
                <div className="flex items-end gap-4">
                  <motion.div
                    className={`text-6xl font-bold ${getScoreColor(sustainabilityScore)}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  >
                    {sustainabilityScore}
                  </motion.div>
                  <div className="mb-2">
                    <Badge className={`${scoreBadge.color} text-white border-0`}>
                      {scoreBadge.label}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <motion.div
                  className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500/20 to-green-500/20 flex items-center justify-center border-4 border-emerald-500/30"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Trophy className="h-16 w-16 text-emerald-500" />
                </motion.div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Resource Budgets
        </h3>
        <div className="grid gap-4 md:grid-cols-3">
          {goals.map((goal, index) => {
            const percentage = (goal.current / goal.target) * 100
            const IconComponent = goal.icon
            
            return (
              <motion.div key={goal.id} whileHover={{ scale: 1.02, y: -5 }}>
                <Card className={`glass ${goal.borderColor} h-full`}>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl ${goal.bgColor}`}>
                        <IconComponent className={`h-6 w-6 ${goal.textColor}`} />
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(goal)} className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <h4 className="font-semibold mb-1">{goal.name}</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      {goal.current} / {goal.target} {goal.unit}
                    </p>

                    <div className="relative w-32 h-32 mx-auto mb-4">
                      <svg className="transform -rotate-90 w-32 h-32">
                        <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="none" className="text-muted opacity-20" />
                        <motion.circle
                          cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="none"
                          className={goal.textColor}
                          strokeDasharray={`${2 * Math.PI * 56}`}
                          initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
                          animate={{ strokeDashoffset: 2 * Math.PI * 56 * (1 - Math.min(percentage, 100) / 100) }}
                          transition={{ duration: 1, delay: index * 0.2 }}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold">{Math.floor(percentage)}%</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Status</span>
                        <span className={`font-semibold ${percentage <= 100 ? 'text-green-500' : 'text-red-500'}`}>
                          {percentage <= 100 ? 'On Track' : 'Over Budget'}
                        </span>
                      </div>
                      <Progress value={Math.min(percentage, 100)} className="h-2" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Award className="h-5 w-5 text-yellow-500" />
          Achievements
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {achievements.map((achievement, index) => {
            const IconComponent = achievement.icon
            return (
              <motion.div key={achievement.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 }} whileHover={{ scale: 1.05 }}>
                <Card className={`glass h-full ${achievement.achieved ? 'border-yellow-500/30' : 'border-muted opacity-60'}`}>
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 rounded-lg ${achievement.achieved ? 'bg-yellow-500/10' : 'bg-muted/30'}`}>
                        <IconComponent className={`h-5 w-5 ${achievement.achieved ? achievement.color : 'text-muted-foreground'}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold flex items-center gap-2">
                          {achievement.name}
                          {achievement.achieved && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500 }}>
                              <Check className="h-4 w-4 text-green-500" />
                            </motion.div>
                          )}
                        </h4>
                        <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      </div>
                    </div>
                    {achievement.achieved && (
                      <motion.div className="flex items-center gap-1 text-yellow-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                        <Star className="h-3 w-3 fill-current" />
                        <Star className="h-3 w-3 fill-current" />
                        <Star className="h-3 w-3 fill-current" />
                      </motion.div>
                    )}
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AnimatePresence>
          {isDialogOpen && (
            <DialogContent className="glass" asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <DialogHeader>
                  <DialogTitle>Update Goal Target</DialogTitle>
                  <DialogDescription>
                    Adjust your {editingGoal?.title?.toLowerCase()} target to match your conservation goals.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="target">New Target ({editingGoal?.unit})</Label>
                    <Input id="target" type="number" value={newTarget} onChange={(e) => setNewTarget(Number(e.target.value))} className="glass" />
                  </div>
                  <div className="space-y-2">
                    <Label>Adjust with Slider</Label>
                    <Slider
                      value={[newTarget]}
                      onValueChange={(value) => setNewTarget(value[0])}
                      max={editingGoal?.target * 2 || 1000}
                      min={editingGoal?.target * 0.5 || 100}
                      step={editingGoal?.unit === '$' ? 10 : 100}
                      className="py-4"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="bg-transparent">Cancel</Button>
                  <Button onClick={handleUpdateGoal} className="bg-gradient-to-r from-primary to-purple-500">
                    <Check className="h-4 w-4 mr-2" />Update Goal
                  </Button>
                </DialogFooter>
              </motion.div>
            </DialogContent>
          )}
        </AnimatePresence>
      </Dialog>

      {/* New Goal Dialog */}
      <Dialog open={isNewGoalDialogOpen} onOpenChange={setIsNewGoalDialogOpen}>
        <AnimatePresence>
          {isNewGoalDialogOpen && (
            <DialogContent className="glass max-w-lg" asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.3, type: "spring" }}
              >
                <DialogHeader>
                  <DialogTitle>Create New Goal</DialogTitle>
                  <DialogDescription>
                    Set a new conservation goal to track your progress
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Goal Title</Label>
                    <Input 
                      id="title" 
                      placeholder="e.g., Reduce Monthly Electricity" 
                      value={newGoalData.title}
                      onChange={(e) => setNewGoalData({...newGoalData, title: e.target.value})}
                      className="glass" 
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Goal Type</Label>
                      <Select value={newGoalData.type} onValueChange={(value) => {
                        const unitMap = {
                          electricity: 'kWh',
                          water: 'gal',
                          cost: '$',
                          sustainability: 'points'
                        }
                        setNewGoalData({...newGoalData, type: value, unit: unitMap[value]})
                      }}>
                        <SelectTrigger className="glass">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="electricity">Electricity</SelectItem>
                          <SelectItem value="water">Water</SelectItem>
                          <SelectItem value="cost">Cost</SelectItem>
                          <SelectItem value="sustainability">Sustainability</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="target">Target Value</Label>
                      <Input 
                        id="target" 
                        type="number" 
                        placeholder="1200"
                        value={newGoalData.target}
                        onChange={(e) => setNewGoalData({...newGoalData, target: Number(e.target.value)})}
                        className="glass" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deadline">Deadline</Label>
                    <Input 
                      id="deadline" 
                      type="date"
                      value={newGoalData.deadline}
                      onChange={(e) => setNewGoalData({...newGoalData, deadline: e.target.value})}
                      className="glass" 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Input 
                      id="description" 
                      placeholder="Why this goal matters to you..."
                      value={newGoalData.description}
                      onChange={(e) => setNewGoalData({...newGoalData, description: e.target.value})}
                      className="glass" 
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsNewGoalDialogOpen(false)} className="bg-transparent">
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateGoal} 
                    className="bg-gradient-to-r from-primary to-purple-500"
                    disabled={!newGoalData.title || !newGoalData.target || !newGoalData.deadline}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Goal
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
