import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Clock, CheckCircle2, Loader2, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { authAPI } from "@/utils/api"
import { useToast } from "@/hooks/use-toast"

export default function PendingVerification() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [checking, setChecking] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }

    // Check verification status every 30 seconds
    const interval = setInterval(async () => {
      try {
        setChecking(true)
        const response = await authAPI.getMe()
        
        if (response.user.isVerified) {
          toast({
            title: "Account Verified!",
            description: "Redirecting to your dashboard...",
          })
          
          localStorage.setItem('user', JSON.stringify(response.user))
          
          // Redirect to dashboard
          setTimeout(() => {
            navigate("/dashboard")
          }, 1500)
        }
      } catch (error) {
        console.error('Failed to check verification status:', error)
      } finally {
        setChecking(false)
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [navigate, toast])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate("/login")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-primary/5 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass-card rounded-2xl p-8 space-y-6 text-center">
          {/* Animated Icon */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="flex justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl" />
              <div className="relative bg-primary/10 rounded-full p-6">
                <Clock className="h-16 w-16 text-primary" />
              </div>
            </div>
          </motion.div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Verification Pending</h1>
            <p className="text-muted-foreground">
              Your account is awaiting admin approval
            </p>
          </div>

          {/* Meter Numbers Info */}
          {user && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-muted/50 rounded-lg p-4 space-y-2 text-left"
            >
              <p className="text-sm font-medium text-muted-foreground">Submitted Meter Numbers:</p>
              {user.electricityMeterNo && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Electricity:</span>
                  <code className="text-xs font-mono bg-background/50 px-2 py-1 rounded">
                    {user.electricityMeterNo}
                  </code>
                </div>
              )}
              {user.waterMeterNo && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Water:</span>
                  <code className="text-xs font-mono bg-background/50 px-2 py-1 rounded">
                    {user.waterMeterNo}
                  </code>
                </div>
              )}
            </motion.div>
          )}

          {/* Status Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="space-y-3"
          >
            <p className="text-sm text-muted-foreground">
              An administrator is reviewing your meter numbers to ensure accuracy. This typically takes 1-2 business days.
            </p>
            
            {/* Animated Progress Dots */}
            <div className="flex justify-center gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                  className="w-2 h-2 bg-primary rounded-full"
                />
              ))}
            </div>

            {checking && (
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Checking verification status...</span>
              </div>
            )}
          </motion.div>

          {/* Info Cards */}
          <div className="grid gap-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-start gap-3 bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-left"
            >
              <CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">What happens next?</p>
                <p className="text-xs text-muted-foreground mt-1">
                  You'll receive an email notification once your account is verified. The page will automatically refresh.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-left"
            >
              <Clock className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Need help?</p>
                <p className="text-xs text-muted-foreground mt-1">
                  If your verification is taking longer than expected, contact support at support@wattsflow.com
                </p>
              </div>
            </motion.div>
          </div>

          {/* Logout Button */}
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
