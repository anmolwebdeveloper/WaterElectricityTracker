"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Moon, Sun, Zap, TrendingDown, AlertTriangle, Star, Users, Award, Mail, MapPin, Phone } from "lucide-react"

export default function HomePage() {
  const [isDark, setIsDark] = useState(false)
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set())
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

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
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const toggleDarkMode = () => {
    setIsDark(!isDark)
    if (!isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
        <header className="sticky top-0 z-50 border-b border-border glass">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-all hover:scale-105">
                <div className="rounded-lg bg-gradient-to-br from-primary to-accent p-2 animate-float">
                  <Zap className="h-6 w-6 text-primary-foreground" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  WattsFlow
                </h1>
              </Link>
              <div className="flex items-center gap-4">
                <nav className="hidden gap-8 md:flex">
                  <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
                    Features
                  </a>
                  <a href="#about" className="text-sm font-medium hover:text-primary transition-colors">
                    About
                  </a>
                  <a href="#reviews" className="text-sm font-medium hover:text-primary transition-colors">
                    Reviews
                  </a>
                  <a href="#contact" className="text-sm font-medium hover:text-primary transition-colors">
                    Contact
                  </a>
                </nav>
                <button
                  onClick={toggleDarkMode}
                  className="rounded-lg p-2 hover:bg-muted transition-all hover:scale-110 hover:rotate-12"
                  aria-label="Toggle dark mode"
                >
                  {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
                <div className="flex gap-2">
                  <Link href="/login">
                    <Button variant="outline" size="sm" className="hover:scale-105 transition-transform bg-transparent">
                      Log In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button size="sm" className="hover:scale-105 transition-transform">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="relative px-4 py-32 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 animate-gradient" />
          <div
            className="absolute top-20 right-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float"
            style={{
              transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
            }}
          />
          <div
            className="absolute bottom-20 left-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl"
            style={{
              transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)`,
              animationDelay: "2s",
            }}
          />

          <div className="relative mx-auto max-w-4xl text-center animate-slide-in-3d perspective-1000">
            <h2 className="text-balance text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl mb-6">
              Track Your Impact.
              <br />
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-gradient">
                Save 20% on Bills.
              </span>
            </h2>
            <p className="mt-8 text-xl text-muted-foreground max-w-2xl mx-auto">
              Monitor your water and electricity consumption in real-time with AI-powered insights and predictive
              savings recommendations.
            </p>
            <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 hover:scale-110 transition-transform shadow-lg hover:shadow-2xl"
                >
                  Start Saving Now
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-6 hover:scale-110 transition-transform bg-transparent"
                >
                  Log In
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section with 3D cards */}
        <section id="features" className="border-t border-border px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h3 className="mb-4 text-center text-4xl font-bold">Key Features</h3>
            <p className="mb-16 text-center text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to understand and optimize your resource consumption
            </p>

            <div className="grid gap-8 md:grid-cols-3">
              <Card
                id="feature-1"
                className={`scroll-trigger card-3d p-8 transition-all duration-500 ${
                  visibleItems.has("feature-1") ? "animate-slide-in-3d opacity-100" : "opacity-0"
                }`}
                style={{ animationDelay: "0.1s" }}
              >
                <div className="mb-6 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 p-4 w-fit animate-float">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h4 className="mb-3 text-2xl font-semibold">Real-time Analytics</h4>
                <p className="mb-6 text-muted-foreground">
                  View live consumption data updated every minute. See exactly how your appliances impact your bills.
                </p>
                <svg className="w-full h-24 mt-4" viewBox="0 0 100 40" preserveAspectRatio="none">
                  <polyline
                    points="0,30 20,20 40,25 60,15 80,22 100,10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-primary"
                  />
                </svg>
              </Card>

              <Card
                id="feature-2"
                className={`scroll-trigger card-3d p-8 transition-all duration-500 ${
                  visibleItems.has("feature-2") ? "animate-slide-in-3d opacity-100" : "opacity-0"
                }`}
                style={{ animationDelay: "0.2s" }}
              >
                <div
                  className="mb-6 rounded-lg bg-gradient-to-br from-accent/20 to-accent/10 p-4 w-fit animate-float"
                  style={{ animationDelay: "1s" }}
                >
                  <TrendingDown className="h-8 w-8 text-accent" />
                </div>
                <h4 className="mb-3 text-2xl font-semibold">Predictive Savings</h4>
                <p className="mb-6 text-muted-foreground">
                  AI forecasts your monthly bills and suggests personalized ways to reduce consumption and save money.
                </p>
                <div className="mt-6 space-y-3 text-sm">
                  <div className="flex justify-between p-2 rounded bg-muted/50">
                    <span className="text-muted-foreground">Current Trend:</span>
                    <span className="font-semibold">$145/mo</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-muted/50">
                    <span className="text-muted-foreground">Potential:</span>
                    <span className="font-semibold text-accent">$116/mo</span>
                  </div>
                  <div className="flex justify-between p-3 rounded bg-gradient-to-r from-accent/20 to-accent/10">
                    <span className="font-medium">Savings:</span>
                    <span className="font-bold text-accent text-lg">$29/mo</span>
                  </div>
                </div>
              </Card>

              <Card
                id="feature-3"
                className={`scroll-trigger card-3d p-8 transition-all duration-500 ${
                  visibleItems.has("feature-3") ? "animate-slide-in-3d opacity-100" : "opacity-0"
                }`}
                style={{ animationDelay: "0.3s" }}
              >
                <div
                  className="mb-6 rounded-lg bg-gradient-to-br from-secondary/20 to-secondary/10 p-4 w-fit animate-float"
                  style={{ animationDelay: "2s" }}
                >
                  <AlertTriangle className="h-8 w-8 text-secondary" />
                </div>
                <h4 className="mb-3 text-2xl font-semibold">AI-Powered Anomaly Detection</h4>
                <p className="mb-6 text-muted-foreground">
                  Get proactive alerts when usage spikes unexpectedly. Identify leaks, malfunctions, and unusual
                  patterns instantly.
                </p>
                <div className="mt-6 rounded-lg glass border border-secondary/30 p-4">
                  <p className="text-sm font-medium text-secondary">Example Alert</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Water usage 30% above normal at 2:15 AM - possible leak detected
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section id="about" className="border-t border-border bg-primary/5 px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div
                id="about-content"
                className={`scroll-trigger ${visibleItems.has("about-content") ? "animate-slide-in-3d" : "opacity-0"}`}
              >
                <h3 className="text-4xl font-bold mb-6">What We Do</h3>
                <p className="text-lg text-muted-foreground mb-6">
                  WattsFlow is a comprehensive resource tracking platform designed to help households and businesses
                  monitor their water and electricity consumption. Our AI-powered platform provides real-time insights,
                  predictive analytics, and actionable recommendations to help you optimize resource usage and reduce
                  costs.
                </p>
                <p className="text-lg text-muted-foreground mb-8">
                  Founded in 2024, we're on a mission to make resource management accessible, intuitive, and impactful
                  for everyone. Our technology combines IoT sensors, machine learning, and beautiful design to create an
                  experience that's both powerful and easy to use.
                </p>
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">50K+</div>
                    <div className="text-sm text-muted-foreground">Active Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-accent mb-2">20%</div>
                    <div className="text-sm text-muted-foreground">Avg Savings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-secondary mb-2">24/7</div>
                    <div className="text-sm text-muted-foreground">Monitoring</div>
                  </div>
                </div>
              </div>
              <div
                id="about-image"
                className={`scroll-trigger ${visibleItems.has("about-image") ? "animate-slide-in-3d" : "opacity-0"}`}
                style={{ animationDelay: "0.2s" }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-2xl animate-float" />
                  <Card className="relative p-8 card-3d">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 rounded-lg bg-primary/10">
                        <Award className="h-10 w-10 text-primary" />
                        <div>
                          <div className="font-semibold">Award-Winning Platform</div>
                          <div className="text-sm text-muted-foreground">Best Green Tech 2024</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 rounded-lg bg-accent/10">
                        <Users className="h-10 w-10 text-accent" />
                        <div>
                          <div className="font-semibold">Growing Community</div>
                          <div className="text-sm text-muted-foreground">Join thousands of users</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/10">
                        <Zap className="h-10 w-10 text-secondary" />
                        <div>
                          <div className="font-semibold">Smart Technology</div>
                          <div className="text-sm text-muted-foreground">AI-powered insights</div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="reviews" className="border-t border-border px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h3 className="text-4xl font-bold text-center mb-4">What Our Users Say</h3>
            <p className="text-center text-lg text-muted-foreground mb-16 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have transformed their resource management
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  id: "review-1",
                  name: "Anmol Sharma",
                  role: "Homeowner",
                  image: "SJ",
                  rating: 5,
                  text: "WattsFlow helped us reduce our electricity bill by 25% in just 3 months. The real-time insights are incredible!",
                },
                {
                  id: "review-2",
                  name: "Ansh Singh",
                  role: "Small Business Owner",
                  image: "MC",
                  rating: 5,
                  text: "As a small business owner, tracking resource consumption is crucial. This platform makes it so easy and the anomaly detection saved us from a major leak.",
                },
                {
                  id: "review-3",
                  name: "Tushar",
                  role: "Environmental Consultant",
                  image: "ER",
                  rating: 5,
                  text: "I recommend WattsFlow to all my clients. The predictive analytics and AI recommendations are game-changing for sustainability goals.",
                },
              ].map((review, index) => (
                <Card
                  key={review.id}
                  id={review.id}
                  className={`scroll-trigger card-3d p-8 ${
                    visibleItems.has(review.id) ? "animate-slide-in-3d" : "opacity-0"
                  }`}
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 italic">{review.text}</p>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                      {review.image}
                    </div>
                    <div>
                      <div className="font-semibold">{review.name}</div>
                      <div className="text-sm text-muted-foreground">{review.role}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="border-t border-border bg-accent/5 px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid md:grid-cols-2 gap-16">
              <div
                id="contact-info"
                className={`scroll-trigger ${visibleItems.has("contact-info") ? "animate-slide-in-3d" : "opacity-0"}`}
              >
                <h3 className="text-4xl font-bold mb-6">Get In Touch</h3>
                <p className="text-lg text-muted-foreground mb-10">
                  Have questions about WattsFlow? We'd love to hear from you. Send us a message and we'll respond as
                  soon as possible.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-primary/10 p-3">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold mb-1">Email</div>
                      <div className="text-muted-foreground">anmosh2004@gmail.com</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-accent/10 p-3">
                      <Phone className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <div className="font-semibold mb-1">Phone</div>
                      <div className="text-muted-foreground">+91-9463605786</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-secondary/10 p-3">
                      <MapPin className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <div className="font-semibold mb-1">Office</div>
                      <div className="text-muted-foreground">
                        Model Town
                        <br />
                        Jalandhar
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Card
                id="contact-form"
                className={`scroll-trigger card-3d p-8 ${
                  visibleItems.has("contact-form") ? "animate-slide-in-3d" : "opacity-0"
                }`}
                style={{ animationDelay: "0.2s" }}
              >
                <form className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Your Name
                    </label>
                    <Input id="name" placeholder="Anmol" className="h-12" />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Your Email
                    </label>
                    <Input id="email" type="email" placeholder="Ansh@example.com" className="h-12" />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Message
                    </label>
                    <Textarea id="message" placeholder="Tell us how we can help..." className="min-h-32" />
                  </div>

                  <Button type="submit" className="w-full h-12 hover:scale-105 transition-transform">
                    Send Message
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t border-border glass px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center perspective-1000">
            <h3 className="text-4xl font-bold mb-6 animate-slide-in-3d">Ready to start saving?</h3>
            <p className="mt-4 text-xl text-muted-foreground mb-10">
              Join thousands of homes already tracking their consumption and reducing their bills.
            </p>
            <Link href="/signup">
              <Button size="lg" className="text-lg px-10 py-7 hover:scale-110 transition-transform shadow-2xl">
                Get Started Free
              </Button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="rounded-lg bg-gradient-to-br from-primary to-accent p-2">
                  <Zap className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-bold">WattsFlow</span>
              </Link>
              <p className="text-sm text-muted-foreground">Made with ❤️ by Anmol</p>
              <div className="flex gap-6 text-sm text-muted-foreground">
                <a href="#" className="hover:text-primary transition-colors">
                  Privacy
                </a>
                <a href="#" className="hover:text-primary transition-colors">
                  Terms
                </a>
                <a href="#contact" className="hover:text-primary transition-colors">
                  Contact
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
