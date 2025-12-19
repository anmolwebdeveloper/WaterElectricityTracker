import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import AuthLayout from "../layouts/AuthLayout"
import { Loader2, ArrowRight, ArrowLeft, Check } from "lucide-react"
import { authAPI } from "@/utils/api"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"

export default function SignupPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    electricityMeterNo: "",
    waterMeterNo: "",
  })

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleNextStep = (e) => {
    e.preventDefault()
    
    // Step 1 validation
    if (currentStep === 1) {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        toast({
          title: "Missing Fields",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        return
      }
      
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Password Mismatch",
          description: "Passwords do not match",
          variant: "destructive",
        })
        return
      }
      
      if (formData.password.length < 6) {
        toast({
          title: "Weak Password",
          description: "Password must be at least 6 characters",
          variant: "destructive",
        })
        return
      }
      
      setCurrentStep(2)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    setIsLoading(true)
    
    try {
      const response = await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        electricityMeterNo: formData.electricityMeterNo || null,
        waterMeterNo: formData.waterMeterNo || null,
      })
      
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      toast({
        title: "Account Created!",
        description: "Welcome to WattsFlow! Your meter numbers will be verified soon.",
      })
      
      // Redirect to dashboard
      navigate("/dashboard")
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-md animate-scale-in max-h-[90vh] flex flex-col">
        <div className="space-y-6 overflow-y-auto px-2">
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-bold">Create Your Account</h2>
            <p className="text-muted-foreground">
              {currentStep === 1 ? "Start tracking and saving today" : "Verify your utility meters"}
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
              currentStep >= 1 
                ? "bg-primary border-primary text-primary-foreground" 
                : "border-muted-foreground/30 text-muted-foreground"
            }`}>
              {currentStep > 1 ? <Check className="h-5 w-5" /> : "1"}
            </div>
            <div className={`h-0.5 w-16 transition-all ${
              currentStep >= 2 ? "bg-primary" : "bg-muted-foreground/30"
            }`} />
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
              currentStep >= 2 
                ? "bg-primary border-primary text-primary-foreground" 
                : "border-muted-foreground/30 text-muted-foreground"
            }`}>
              2
            </div>
          </div>

          <AnimatePresence mode="wait">
            {currentStep === 1 ? (
              <motion.form
                key="step1"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
                onSubmit={handleNextStep}
                className="space-y-4"
              >
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium">
                Full Name
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="h-11"
              />
            </div>

                <Button type="submit" className="w-full h-11 gap-2">
                  Next Step
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.form>
            ) : (
              <motion.form
                key="step2"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
                className="space-y-3"
              >
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">
                    Please provide your meter numbers. These will be verified by an administrator to unlock full features.
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="electricityMeterNo" className="block text-sm font-medium">
                    Electricity Meter Number
                  </label>
                  <Input
                    id="electricityMeterNo"
                    name="electricityMeterNo"
                    type="text"
                    placeholder="e.g., ELEC-123456789"
                    value={formData.electricityMeterNo}
                    onChange={handleChange}
                    className="h-10 font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="waterMeterNo" className="block text-sm font-medium">
                    Water Meter Number
                  </label>
                  <Input
                    id="waterMeterNo"
                    name="waterMeterNo"
                    type="text"
                    placeholder="e.g., WATER-987654321"
                    value={formData.waterMeterNo}
                    onChange={handleChange}
                    className="h-10 font-mono"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 h-10 gap-2"
                    onClick={() => setCurrentStep(1)}
                    disabled={isLoading}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-10"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="pt-4 text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}
