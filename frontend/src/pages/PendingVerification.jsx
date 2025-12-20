import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Clock, CheckCircle2, Loader2, LogOut, Mail, RefreshCw, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { authAPI } from "@/utils/api"
import { useToast } from "@/hooks/use-toast"

export default function PendingVerification() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [checking, setChecking] = useState(false)
  const [resending, setResending] = useState(false)
  const [user, setUser] = useState(null)
  const [lastCheckTime, setLastCheckTime] = useState(new Date())

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
        setLastCheckTime(new Date())
        
        if (response.user.isVerified) {
          clearInterval(interval)
          toast({
            title: "🎉 Account Verified!",
            description: "Redirecting to your dashboard...",
          })
          
          localStorage.setItem('user', JSON.stringify(response.user))
          localStorage.removeItem('isNewUser')
          
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

  const handleResendEmail = async () => {
    try {
      setResending(true)
      // Implement resend verification email API call
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulated API call
      toast({
        title: "Email Resent!",
        description: "Please check your inbox for the verification email.",
      })
    } catch (error) {
      toast({
        title: "Failed to Resend",
        description: error.message || "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setResending(false)
    }
  }

  const handleManualCheck = async () => {
    try {
      setChecking(true)
      const response = await authAPI.getMe()
      setLastCheckTime(new Date())
      
      if (response.user.isVerified) {
        toast({
          title: "🎉 Account Verified!",
          description: "Redirecting to your dashboard...",
        })
        
        localStorage.setItem('user', JSON.stringify(response.user))
        localStorage.removeItem('isNewUser')
        
        setTimeout(() => {
          navigate("/dashboard")
        }, 1500)
      } else {
        toast({
          title: "Still Pending",
          description: "Your account is still awaiting verification.",
        })
      }
    } catch (error) {
      toast({
        title: "Check Failed",
        description: error.message || "Unable to check status.",
        variant: "destructive",
      })
    } finally {
      setChecking(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('isNewUser')
    navigate("/login")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "2s" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl relative z-10"
      >
        <div className="glass rounded-3xl border border-white/10 p-8 md:p-12 space-y-8 text-center backdrop-blur-xl bg-slate-900/50">
          {/* Animated Icon */}
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 2, -2, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="flex justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full blur-2xl animate-pulse" />
              <div className="relative bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full p-8 border border-white/10">
                <Clock className="h-20 w-20 text-blue-400" />
              </div>
            </div>
          </motion.div>

          {/* Heading */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-blue-500/20 mb-2">
              <Sparkles className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-300">Account Created</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Verification Pending
            </h1>
            <p className="text-lg text-slate-400">
              Your account is awaiting admin approval
            </p>
          </div>

          {/* Meter Numbers Info */}
          {user && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-xl border border-white/10 p-6 space-y-3 text-left"
            >
              <div className="flex items-center gap-2 mb-3">
                <Mail className="h-5 w-5 text-blue-400" />
                <p className="text-sm font-semibold text-slate-200">Submitted Information</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                  <span className="text-sm text-slate-400">Email:</span>
                  <code className="text-sm font-mono text-slate-200 ml-auto">
                    {user.email}
                  </code>
                </div>
                {user.electricityMeterNo && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" style={{ animationDelay: "0.2s" }} />
                    <span className="text-sm text-slate-400">Electricity:</span>
                    <code className="text-sm font-mono text-slate-200 ml-auto bg-slate-800/50 px-3 py-1 rounded">
                      {user.electricityMeterNo}
                    </code>
                  </div>
                )}
                {user.waterMeterNo && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" style={{ animationDelay: "0.4s" }} />
                    <span className="text-sm text-slate-400">Water:</span>
                    <code className="text-sm font-mono text-slate-200 ml-auto bg-slate-800/50 px-3 py-1 rounded">
                      {user.waterMeterNo}
                    </code>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Status Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            <div className="space-y-3">
              <p className="text-slate-300 leading-relaxed">
                An administrator is reviewing your information to ensure accuracy. This typically takes 1-2 business days.
              </p>
              
              {/* Animated Progress Dots */}
              <div className="flex justify-center gap-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                    className="w-2.5 h-2.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                  />
                ))}
              </div>

              {checking && (
                <div className="flex items-center justify-center gap-2 text-sm text-blue-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Checking verification status...</span>
                </div>
              )}

              <p className="text-xs text-slate-500">
                Last checked: {lastCheckTime.toLocaleTimeString()}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid md:grid-cols-2 gap-4">
              <Button
                onClick={handleManualCheck}
                disabled={checking}
                variant="outline"
                className="glass border-white/10 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all h-12"
              >
                {checking ? (
                  <><Loader2 className="h-4 w-4 animate-spin mr-2" />Checking...</>
                ) : (
                  <><RefreshCw className="h-4 w-4 mr-2" />Check Status</>
                )}
              </Button>
              
              <Button
                onClick={handleResendEmail}
                disabled={resending}
                variant="outline"
                className="glass border-white/10 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all h-12"
              >
                {resending ? (
                  <><Loader2 className="h-4 w-4 animate-spin mr-2" />Sending...</>
                ) : (
                  <><Mail className="h-4 w-4 mr-2" />Resend Email</>
                )}
              </Button>
            </div>
          </motion.div>

          {/* Info Cards */}
          <div className="grid gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="glass rounded-xl border border-blue-500/20 p-5 text-left group hover:border-blue-500/40 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                  <CheckCircle2 className="h-6 w-6 text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-base font-semibold text-slate-200 mb-2">What happens next?</p>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    You'll receive an email notification once your account is verified. The page will automatically refresh and redirect you to the dashboard.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="glass rounded-xl border border-amber-500/20 p-5 text-left group hover:border-amber-500/40 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-amber-500/10 group-hover:bg-amber-500/20 transition-colors">
                  <Clock className="h-6 w-6 text-amber-400" />
                </div>
                <div className="flex-1">
                  <p className="text-base font-semibold text-slate-200 mb-2">Need help?</p>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    If your verification is taking longer than expected, contact our support team at{" "}
                    <a href="mailto:support@wattsflow.com" className="text-amber-400 hover:underline">
                      support@wattsflow.com
                    </a>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <div className="grid md:grid-cols-2 gap-4 pt-4">
            <Link to="/login" className="w-full">
              <Button
                variant="outline"
                className="w-full glass border-white/10 hover:border-slate-500/50 hover:bg-slate-800/50 transition-all h-12"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Back to Login
              </Button>
            </Link>
            <Button
              variant="outline"
              className="w-full glass border-red-500/20 hover:border-red-500/50 hover:bg-red-500/10 text-red-400 transition-all h-12"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
