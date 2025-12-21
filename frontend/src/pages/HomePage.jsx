import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { useToast } from '@/hooks/use-toast'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Moon, Sun, Zap, TrendingDown, AlertTriangle, Star, Users, Award, Mail, MapPin, Phone, Droplet, BarChart3, Shield, ChevronRight, Sparkles } from "lucide-react"

export default function HomePage() {
  const [isDark, setIsDark] = useState(false)
  const [visibleItems, setVisibleItems] = useState(new Set())
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [scrollY, setScrollY] = useState(0)
  const heroRef = useRef(null)

  // Counter animation hook
  const [counters, setCounters] = useState({ users: 0, savings: 0, monitoring: 0 })
  const [hasCounterStarted, setHasCounterStarted] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleItems((prev) => new Set([...prev, entry.target.id]))
          }
        })
      },
      { threshold: 0.1 },
    )

    const elements = document.querySelectorAll(".scroll-trigger")
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 40,
        y: (e.clientY / window.innerHeight - 0.5) * 40,
      })
    }

    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Animated counters
  useEffect(() => {
    if (hasCounterStarted) {
      const duration = 2000
      const steps = 60
      const interval = duration / steps

      let step = 0
      const timer = setInterval(() => {
        step++
        const progress = step / steps
        setCounters({
          users: Math.floor(50000 * progress),
          savings: Math.floor(20 * progress),
          monitoring: Math.floor(24 * progress),
        })
        if (step >= steps) clearInterval(timer)
      }, interval)

      return () => clearInterval(timer)
    }
  }, [hasCounterStarted])

  // Start counter when stats section is visible
  useEffect(() => {
    if (visibleItems.has("about-content") && !hasCounterStarted) {
      setHasCounterStarted(true)
    }
  }, [visibleItems, hasCounterStarted])

  const toggleDarkMode = () => {
    setIsDark(!isDark)
    if (!isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const { toast } = useToast()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [messageText, setMessageText] = useState("")
  const [isSending, setIsSending] = useState(false)

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative">
        {/* Refined Autonomous Particles - No Mouse Interaction */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-40">
          {[...Array(30)].map((_, i) => {
            const size = Math.random() * 4 + 1;
            const opacity = Math.random() * 0.3 + 0.1;
            return (
              <div
                key={i}
                className="absolute rounded-full animate-drift"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  background: i % 3 === 0 
                    ? 'radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%)'
                    : i % 3 === 1
                    ? 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)'
                    : 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)',
                  opacity: opacity,
                  animationDelay: `${Math.random() * 15}s`,
                  animationDuration: `${20 + Math.random() * 20}s`,
                  filter: 'blur(1px)',
                }}
              />
            );
          })}
        </div>

        {/* Premium Modern Header */}
        <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/30 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-6 py-5 sm:px-8 lg:px-12">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl blur-lg opacity-40 group-hover:opacity-70 transition-all duration-500" />
                  <div className="relative rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 p-2.5 group-hover:scale-105 transition-all duration-300 shadow-lg">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                </div>
                <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  WattsFlow
                </span>
              </Link>
              <div className="flex items-center gap-8">
                <nav className="hidden gap-8 md:flex">
                  {["Features", "About", "Reviews", "Contact"].map((item) => (
                    <a
                      key={item}
                      href={`#${item.toLowerCase()}`}
                      className="relative text-sm font-medium text-foreground/70 hover:text-foreground transition-colors group"
                    >
                      {item}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300" />
                    </a>
                  ))}
                </nav>
                <button
                  onClick={toggleDarkMode}
                  className="rounded-xl p-2.5 hover:bg-muted/50 transition-all hover:scale-105 duration-300"
                  aria-label="Toggle dark mode"
                >
                  {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
                <div className="flex gap-3">
                  <Link to="/login">
                    <Button variant="ghost" size="sm" className="hover:scale-105 transition-all font-medium">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button size="sm" className="hover:scale-105 transition-all font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Premium Hero Section - High-End SaaS Design */}
        <section ref={heroRef} className="relative pt-40 pb-32 px-6 sm:px-8 lg:px-12 overflow-hidden min-h-screen flex items-center">
          {/* Sophisticated Gradient Background */}
          <div className="absolute inset-0">
            {/* Base gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 dark:from-gray-950 dark:via-blue-950/30 dark:to-purple-950/30" />
            
            {/* Soft ambient lights */}
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-7xl w-full">
            <div className="flex flex-col items-center text-center space-y-10">
              {/* Premium Badge */}
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/50 dark:bg-white/5 backdrop-blur-xl border border-blue-200/50 dark:border-white/10 shadow-lg opacity-0 animate-fade-slide-up"
                   style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
                <div className="flex items-center justify-center w-2 h-2 bg-blue-600 rounded-full animate-pulse">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-ping absolute" />
                </div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  AI-Powered Resource Intelligence
                </span>
              </div>

              {/* Hero Headline - Premium Typography */}
              <div className="max-w-5xl space-y-6 opacity-0 animate-fade-slide-up" style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}>
                <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.2] pb-2">
                  <span className="block text-gray-900 dark:text-white mb-3">
                    Resource Management
                  </span>
                  <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent py-2">
                    Transformed for 2025
                  </span>
                </h1>
              </div>

              {/* Refined Subheadline */}
              <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed font-light opacity-0 animate-fade-slide-up"
                 style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}>
                Monitor your water and electricity consumption with cutting-edge AI analytics, real-time insights, and smart automation. 
                <span className="font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text"> Reduce bills by 25%</span> while protecting the environment.
              </p>

              {/* Premium CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 items-center opacity-0 animate-fade-slide-up pt-6"
                   style={{ animationDelay: "0.7s", animationFillMode: "forwards" }}>
                <Link to="/signup">
                  <Button
                    size="lg"
                    className="text-base px-12 py-7 font-semibold rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 hover:from-blue-700 hover:via-purple-700 hover:to-purple-800 shadow-2xl hover:shadow-blue-500/30 hover:scale-105 transition-all duration-300 border-0 group"
                  >
                    <span className="flex items-center gap-2">
                      Start Free Trial
                      <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </Link>
                <Link to="/login">
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-base px-12 py-7 font-semibold rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border-2 border-gray-300 dark:border-white/20 hover:bg-white dark:hover:bg-white/10 hover:scale-105 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 shadow-lg"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      Watch Demo
                    </span>
                  </Button>
                </Link>
              </div>

              {/* Social Proof - Refined Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 max-w-4xl pt-16 opacity-0 animate-fade-slide-up"
                   style={{ animationDelay: "0.9s", animationFillMode: "forwards" }}>
                {[
                  { value: "50K+", label: "Active Users", sublabel: "Worldwide", icon: Users },
                  { value: "25%", label: "Avg. Savings", sublabel: "Per Month", icon: TrendingDown },
                  { value: "24/7", label: "Monitoring", sublabel: "Real-time Data", icon: BarChart3 },
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col items-center group cursor-pointer p-6 rounded-2xl hover:bg-white/50 dark:hover:bg-white/5 transition-all duration-300">
                    <stat.icon className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
                    <div className="text-5xl font-extrabold bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                      {stat.value}
                    </div>
                    <div className="text-sm font-bold text-gray-900 dark:text-white">{stat.label}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.sublabel}</div>
                  </div>
                ))}
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center gap-8 pt-12 opacity-0 animate-fade-slide-up"
                   style={{ animationDelay: "1.1s", animationFillMode: "forwards" }}>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Enterprise Security</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-medium">4.9/5 Rating</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Award className="h-4 w-4 text-purple-600" />
                  <span className="font-medium">Best Green Tech 2025</span>
                </div>
              </div>
            </div>
          </div>

          {/* Elegant Scroll Indicator */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
            <div className="flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">Scroll to explore</span>
              <div className="w-6 h-10 rounded-full border-2 border-gray-400 dark:border-gray-600 flex justify-center p-2">
                <div className="w-1.5 h-3 bg-gray-600 dark:bg-gray-400 rounded-full animate-bounce" />
              </div>
            </div>
          </div>
        </section>

        {/* Premium Features Section */}
        <section id="features" className="relative border-t border-border/30 px-6 py-32 sm:px-8 lg:px-12 bg-white/50 dark:bg-gray-900/50">
          <div className="mx-auto max-w-7xl">
            {/* Section Header */}
            <div className="text-center mb-24">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-800/50 mb-6">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-900 dark:text-blue-300">Features</span>
              </div>
              <h3 className="text-5xl sm:text-6xl font-bold mb-6 text-gray-900 dark:text-white">
                Everything You Need to Succeed
              </h3>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto font-light">
                Powerful features designed to transform how you manage resources and optimize consumption
              </p>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1: Real-time Analytics */}
              <Card
                id="feature-1"
                className={`scroll-trigger group relative overflow-hidden p-8 transition-all duration-700 hover:shadow-2xl ${
                  visibleItems.has("feature-1") ? "animate-slide-in-3d opacity-100" : "opacity-0"
                }`}
                style={{ animationDelay: "0.1s" }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="mb-6 inline-flex rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 p-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <BarChart3 className="h-10 w-10 text-primary" />
                  </div>
                  <h4 className="mb-4 text-2xl font-bold group-hover:text-primary transition-colors">Real-time Analytics</h4>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Monitor live consumption data updated every minute. Track exactly how your appliances impact your bills with precision accuracy.
                  </p>
                  <div className="flex items-center gap-2 text-primary font-medium group-hover:gap-4 transition-all">
                    Learn more
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              </Card>

              {/* Feature 2: Predictive Savings */}
              <Card
                id="feature-2"
                className={`scroll-trigger group relative overflow-hidden p-8 transition-all duration-700 hover:shadow-2xl ${
                  visibleItems.has("feature-2") ? "animate-slide-in-3d opacity-100" : "opacity-0"
                }`}
                style={{ animationDelay: "0.2s" }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="mb-6 inline-flex rounded-2xl bg-gradient-to-br from-accent/20 to-accent/10 p-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <TrendingDown className="h-10 w-10 text-accent" />
                  </div>
                  <h4 className="mb-4 text-2xl font-bold group-hover:text-accent transition-colors">Predictive Savings</h4>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    AI forecasts your monthly bills and provides personalized recommendations to reduce consumption and maximize savings.
                  </p>
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between items-center p-3 rounded-lg glass">
                      <span className="text-sm text-muted-foreground">Current trend</span>
                      <span className="font-bold">$145/mo</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg glass border border-accent/20">
                      <span className="text-sm font-medium">You could save</span>
                      <span className="font-bold text-accent text-lg">$29/mo</span>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-accent/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              </Card>

              {/* Feature 3: Anomaly Detection */}
              <Card
                id="feature-3"
                className={`scroll-trigger group relative overflow-hidden p-8 transition-all duration-700 hover:shadow-2xl ${
                  visibleItems.has("feature-3") ? "animate-slide-in-3d opacity-100" : "opacity-0"
                }`}
                style={{ animationDelay: "0.3s" }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="mb-6 inline-flex rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/10 p-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <AlertTriangle className="h-10 w-10 text-secondary" />
                  </div>
                  <h4 className="mb-4 text-2xl font-bold group-hover:text-secondary transition-colors">Smart Alerts</h4>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Get instant alerts when usage spikes unexpectedly. Identify leaks, malfunctions, and unusual patterns automatically.
                  </p>
                  <div className="rounded-xl glass border border-secondary/30 p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-secondary rounded-full animate-pulse" />
                      <p className="text-sm font-medium text-secondary">Active Alert</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Water usage 30% above normal - possible leak detected
                    </p>
                  </div>
                </div>
                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-secondary/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              </Card>

              {/* Feature 4: Water Tracking */}
              <Card
                id="feature-4"
                className={`scroll-trigger group relative overflow-hidden p-8 transition-all duration-700 hover:shadow-2xl ${
                  visibleItems.has("feature-4") ? "animate-slide-in-3d opacity-100" : "opacity-0"
                }`}
                style={{ animationDelay: "0.4s" }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="mb-6 inline-flex rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-500/10 p-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <Droplet className="h-10 w-10 text-blue-500" />
                  </div>
                  <h4 className="mb-4 text-2xl font-bold group-hover:text-blue-500 transition-colors">Water Management</h4>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Track water usage per fixture with smart meter integration. Understand consumption patterns and reduce waste effectively.
                  </p>
                  <div className="flex items-center gap-2 text-blue-500 font-medium group-hover:gap-4 transition-all">
                    Explore
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              </Card>

              {/* Feature 5: Goal Setting */}
              <Card
                id="feature-5"
                className={`scroll-trigger group relative overflow-hidden p-8 transition-all duration-700 hover:shadow-2xl ${
                  visibleItems.has("feature-5") ? "animate-slide-in-3d opacity-100" : "opacity-0"
                }`}
                style={{ animationDelay: "0.5s" }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="mb-6 inline-flex rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-500/10 p-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <Award className="h-10 w-10 text-purple-500" />
                  </div>
                  <h4 className="mb-4 text-2xl font-bold group-hover:text-purple-500 transition-colors">Goal Tracking</h4>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Set custom savings goals and track progress with gamified achievements. Stay motivated with milestones and rewards.
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Monthly Goal</span>
                      <span className="font-medium">75%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" />
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              </Card>

              {/* Feature 6: Secure Platform */}
              <Card
                id="feature-6"
                className={`scroll-trigger group relative overflow-hidden p-8 transition-all duration-700 hover:shadow-2xl ${
                  visibleItems.has("feature-6") ? "animate-slide-in-3d opacity-100" : "opacity-0"
                }`}
                style={{ animationDelay: "0.6s" }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="mb-6 inline-flex rounded-2xl bg-gradient-to-br from-green-500/20 to-green-500/10 p-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <Shield className="h-10 w-10 text-green-500" />
                  </div>
                  <h4 className="mb-4 text-2xl font-bold group-hover:text-green-500 transition-colors">Enterprise Security</h4>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Bank-level encryption protects your data. GDPR compliant with multi-factor authentication and regular security audits.
                  </p>
                  <div className="flex items-center gap-2 text-green-500 font-medium group-hover:gap-4 transition-all">
                    Security details
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-green-500/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              </Card>
            </div>
          </div>
        </section>

        {/* About Section with Animated Counters */}
        <section id="about" className="relative border-t border-border bg-gradient-to-b from-background to-primary/5 px-4 py-32 sm:px-6 lg:px-8 overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "2s" }} />
          
          <div className="relative mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Content */}
              <div
                id="about-content"
                className={`scroll-trigger space-y-6 ${visibleItems.has("about-content") ? "animate-slide-in-3d" : "opacity-0"}`}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 mb-4">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">About WattsFlow</span>
                </div>
                
                <h3 className="text-5xl font-bold leading-tight">
                  Revolutionizing Resource Management
                </h3>
                
                <p className="text-xl text-muted-foreground leading-relaxed">
                  WattsFlow combines cutting-edge AI technology with intuitive design to help households and businesses take control of their water and electricity consumption.
                </p>
                
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Founded in 2025, we're passionate about making sustainability accessible to everyone. Our platform transforms complex consumption data into actionable insights, helping you save money while reducing environmental impact.
                </p>

                {/* Animated Stats Counter */}
                <div className="grid grid-cols-3 gap-6 pt-8">
                  <div className="text-center group cursor-pointer">
                    <div className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                      {counters.users.toLocaleString()}+
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">Active Users</div>
                  </div>
                  <div className="text-center group cursor-pointer">
                    <div className="text-5xl font-bold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                      {counters.savings}%
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">Avg Savings</div>
                  </div>
                  <div className="text-center group cursor-pointer">
                    <div className="text-5xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                      {counters.monitoring}/7
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">Monitoring</div>
                  </div>
                </div>

                {/* Features List */}
                <div className="grid grid-cols-2 gap-4 pt-8">
                  {[
                    { icon: Zap, text: "Real-time Tracking" },
                    { icon: Shield, text: "Secure Platform" },
                    { icon: Award, text: "Award Winning" },
                    { icon: Users, text: "50K+ Community" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-lg glass hover:scale-105 transition-transform cursor-pointer group"
                    >
                      <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 group-hover:rotate-12 transition-transform">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-medium">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Visual */}
              <div
                id="about-image"
                className={`scroll-trigger ${visibleItems.has("about-image") ? "animate-slide-in-3d" : "opacity-0"}`}
                style={{ animationDelay: "0.3s" }}
              >
                <div className="relative">
                  {/* Floating Cards */}
                  <div className="space-y-4">
                    {[
                      {
                        icon: Award,
                        title: "Award-Winning Platform",
                        subtitle: "Best Green Tech 2025",
                        gradient: "from-yellow-500/20 to-orange-500/20",
                        delay: "0s",
                      },
                      {
                        icon: Users,
                        title: "Growing Community",
                        subtitle: "Join thousands of users",
                        gradient: "from-blue-500/20 to-cyan-500/20",
                        delay: "0.5s",
                      },
                      {
                        icon: Zap,
                        title: "Smart Technology",
                        subtitle: "AI-powered insights",
                        gradient: "from-purple-500/20 to-pink-500/20",
                        delay: "1s",
                      },
                      {
                        icon: Shield,
                        title: "Secure & Private",
                        subtitle: "Bank-level encryption",
                        gradient: "from-green-500/20 to-emerald-500/20",
                        delay: "1.5s",
                      },
                    ].map((item, i) => (
                      <Card
                        key={i}
                        className="group p-6 hover:scale-105 transition-all duration-500 cursor-pointer relative overflow-hidden"
                        style={{
                          animationDelay: item.delay,
                          transform: `translateX(${i % 2 === 0 ? -scrollY * 0.02 : scrollY * 0.02}px)`,
                        }}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
                        <div className="relative flex items-center gap-4">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 group-hover:scale-110 group-hover:rotate-6 transition-all">
                            <item.icon className="h-8 w-8 text-primary" />
                          </div>
                          <div>
                            <div className="font-bold text-lg">{item.title}</div>
                            <div className="text-sm text-muted-foreground">{item.subtitle}</div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Modern Reviews Section */}
        <section id="reviews" className="relative border-t border-border px-4 py-32 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-yellow-500/20 mb-6">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-medium">Testimonials</span>
              </div>
              <h3 className="text-5xl font-bold mb-6">Loved by Thousands</h3>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                See what our users are saying about their experience with WattsFlow
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  id: "review-1",
                  name: "Anmol Sharma",
                  role: "Homeowner",
                  avatar: "AS",
                  gradient: "from-blue-500 to-cyan-500",
                  rating: 5,
                  text: "WattsFlow helped us reduce our electricity bill by 25% in just 3 months. The real-time insights are incredible and the interface is so intuitive!",
                },
                {
                  id: "review-2",
                  name: "Ansh Singh",
                  role: "Small Business Owner",
                  avatar: "AS",
                  gradient: "from-purple-500 to-pink-500",
                  rating: 5,
                  text: "As a small business owner, tracking resource consumption is crucial. This platform makes it so easy and the anomaly detection saved us from a major leak.",
                },
                {
                  id: "review-3",
                  name: "Tushar",
                  role: "Environmental Consultant",
                  avatar: "T",
                  gradient: "from-green-500 to-emerald-500",
                  rating: 5,
                  text: "I recommend WattsFlow to all my clients. The predictive analytics and AI recommendations are game-changing for achieving sustainability goals.",
                },
              ].map((review, index) => (
                <Card
                  key={review.id}
                  id={review.id}
                  className={`scroll-trigger group relative overflow-hidden p-8 transition-all duration-700 hover:shadow-2xl ${
                    visibleItems.has(review.id) ? "animate-slide-in-3d" : "opacity-0"
                  }`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    {/* Stars */}
                    <div className="flex gap-1 mb-6">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-5 w-5 fill-yellow-500 text-yellow-500 animate-pulse"
                          style={{ animationDelay: `${i * 0.1}s` }}
                        />
                      ))}
                    </div>

                    {/* Quote */}
                    <div className="relative mb-8">
                      <div className="absolute -top-2 -left-2 text-6xl text-primary/20 font-serif">"</div>
                      <p className="text-muted-foreground italic leading-relaxed pl-6">
                        {review.text}
                      </p>
                    </div>

                    {/* Author */}
                    <div className="flex items-center gap-4">
                      <div className={`relative h-14 w-14 rounded-full bg-gradient-to-br ${review.gradient} flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform`}>
                        {review.avatar}
                        <div className="absolute inset-0 rounded-full bg-white/20 animate-ping" />
                      </div>
                      <div>
                        <div className="font-bold text-lg">{review.name}</div>
                        <div className="text-sm text-muted-foreground">{review.role}</div>
                      </div>
                    </div>
                  </div>

                  {/* Decorative Element */}
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                </Card>
              ))}
            </div>

            {/* Trust Indicators */}
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {[
                { value: "4.9", label: "Average Rating" },
                { value: "50K+", label: "Happy Users" },
                { value: "99%", label: "Satisfaction" },
                { value: "24/7", label: "Support" },
              ].map((stat, i) => (
                <div key={i} className="text-center group cursor-pointer">
                  <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Modern Contact Section */}
        <section id="contact" className="relative border-t border-border bg-gradient-to-b from-background to-accent/5 px-4 py-32 sm:px-6 lg:px-8 overflow-hidden">
          {/* Decorative Background */}
          <div className="absolute top-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "2s" }} />
          
          <div className="relative mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-accent/20 mb-6">
                <Mail className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium">Contact Us</span>
              </div>
              <h3 className="text-5xl font-bold mb-6">Let's Talk</h3>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div
                id="contact-info"
                className={`scroll-trigger space-y-8 ${visibleItems.has("contact-info") ? "animate-slide-in-3d" : "opacity-0"}`}
              >
                {[
                  {
                    icon: Mail,
                    title: "Email",
                    content: "anmosh2004@gmail.com",
                    gradient: "from-blue-500/20 to-cyan-500/20",
                  },
                  {
                    icon: Phone,
                    title: "Phone",
                    content: "+91-9463605786",
                    gradient: "from-green-500/20 to-emerald-500/20",
                  },
                  {
                    icon: MapPin,
                    title: "Office",
                    content: "Model Town, Jalandhar",
                    gradient: "from-purple-500/20 to-pink-500/20",
                  },
                ].map((item, i) => (
                  <Card
                    key={i}
                    className="group p-6 hover:scale-105 transition-all duration-500 cursor-pointer relative overflow-hidden"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
                    <div className="relative flex items-start gap-4">
                      <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 group-hover:scale-110 group-hover:rotate-6 transition-all">
                        <item.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="font-bold text-lg mb-1">{item.title}</div>
                        <div className="text-muted-foreground">{item.content}</div>
                      </div>
                    </div>
                  </Card>
                ))}

                {/* Additional Info */}
                <Card className="p-6 glass border-2">
                  <h4 className="font-bold text-lg mb-4">Office Hours</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monday - Friday</span>
                      <span className="font-medium">9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Saturday</span>
                      <span className="font-medium">10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sunday</span>
                      <span className="font-medium">Closed</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Contact Form */}
              <Card
                id="contact-form"
                className={`scroll-trigger glass p-8 ${
                  visibleItems.has("contact-form") ? "animate-slide-in-3d" : "opacity-0"
                }`}
                style={{ animationDelay: "0.3s" }}
              >
                <form
                  className="space-y-6"
                  onSubmit={async (e) => {
                    e.preventDefault()
                    if (!messageText.trim() || !email.trim()) {
                      toast({ title: 'Please enter your email and message.' })
                      return
                    }

                    try {
                      setIsSending(true)
                      await new Promise((res) => setTimeout(res, 600))
                      toast({ 
                        title: 'Message sent successfully!', 
                        description: 'Thanks for reaching out. We will get back to you soon.' 
                      })
                      setName("")
                      setEmail("")
                      setMessageText("")
                    } finally {
                      setIsSending(false)
                    }
                  }}
                >
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium">
                      Your Name
                    </label>
                    <Input 
                      id="name" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      placeholder="John Doe" 
                      className="h-12 glass border-2 focus:border-primary transition-colors" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium">
                      Your Email *
                    </label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      placeholder="john@example.com" 
                      className="h-12 glass border-2 focus:border-primary transition-colors"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="block text-sm font-medium">
                      Message *
                    </label>
                    <Textarea 
                      id="message" 
                      value={messageText} 
                      onChange={(e) => setMessageText(e.target.value)} 
                      placeholder="Tell us how we can help you..." 
                      className="min-h-40 glass border-2 focus:border-primary transition-colors resize-none"
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSending} 
                    className="w-full h-12 hover:scale-105 transition-all relative overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isSending ? 'Sending...' : 'Send Message'}
                      {!isSending && <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-gradient" />
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </section>

        {/* Modern CTA Section */}
        <section className="relative border-t border-border px-4 py-32 sm:px-6 lg:px-8 overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 animate-gradient" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
          
          <div className="relative mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 mb-8 animate-bounce">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Start Your Journey</span>
            </div>
            
            <h3 className="text-5xl sm:text-6xl font-bold mb-6 leading-tight">
              Ready to Transform Your
              <br />
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Resource Management?
              </span>
            </h3>
            
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Join thousands of homes and businesses already saving money and reducing their environmental impact with WattsFlow.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/signup">
                <Button
                  size="lg"
                  className="text-lg px-12 py-7 hover:scale-110 transition-all shadow-2xl relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Get Started Free
                    <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-gradient" />
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-12 py-7 hover:scale-110 transition-all glass border-2"
                >
                  Sign In
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Secure Platform</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>50K+ Users</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                <span>Award Winning</span>
              </div>
            </div>
          </div>
        </section>

        {/* Modern Footer */}
        <footer className="relative border-t border-border bg-gradient-to-b from-background to-muted/20 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid md:grid-cols-4 gap-12 mb-12">
              {/* Brand */}
              <div className="md:col-span-1">
                <Link to="/" className="flex items-center gap-2 group mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-lg blur-md opacity-50 group-hover:opacity-100 transition-opacity" />
                    <div className="relative rounded-lg bg-gradient-to-br from-primary to-accent p-2 group-hover:scale-110 transition-transform">
                      <Zap className="h-5 w-5 text-primary-foreground" />
                    </div>
                  </div>
                  <span className="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    WattsFlow
                  </span>
                </Link>
                <p className="text-sm text-muted-foreground mb-4">
                  AI-powered resource management for a sustainable future.
                </p>
                <div className="flex gap-3">
                  {[
                    { icon: "github", href: "#" },
                    { icon: "twitter", href: "#" },
                    { icon: "linkedin", href: "#" },
                  ].map((social, i) => (
                    <a
                      key={i}
                      href={social.href}
                      className="p-2 rounded-lg glass hover:scale-110 hover:bg-primary/10 transition-all"
                    >
                      <div className="h-5 w-5 bg-primary/50 rounded" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="font-bold mb-4">Product</h4>
                <ul className="space-y-3 text-sm">
                  {["Features", "Pricing", "Demo", "Updates"].map((item, i) => (
                    <li key={i}>
                      <a
                        href="#"
                        className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                      >
                        <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-0 transition-all" />
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 className="font-bold mb-4">Company</h4>
                <ul className="space-y-3 text-sm">
                  {["About", "Blog", "Careers", "Press Kit"].map((item, i) => (
                    <li key={i}>
                      <a
                        href="#"
                        className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                      >
                        <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-0 transition-all" />
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h4 className="font-bold mb-4">Resources</h4>
                <ul className="space-y-3 text-sm">
                  {["Documentation", "API", "Support", "Status"].map((item, i) => (
                    <li key={i}>
                      <a
                        href="#"
                        className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                      >
                        <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-0 transition-all" />
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-muted-foreground">
                © 2025 WattsFlow. Made with ❤️ by Anmol
              </p>
              <div className="flex gap-6 text-sm text-muted-foreground">
                {["Privacy", "Terms", "Cookies"].map((item, i) => (
                  <a
                    key={i}
                    href="#"
                    className="hover:text-primary transition-colors relative group"
                  >
                    {item}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
