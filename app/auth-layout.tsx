"use client"

import type React from "react"

import { Moon, Sun, Zap, Droplet, Sparkles } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false)

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
      <div className="flex min-h-screen bg-background text-foreground overflow-hidden">
        {/* Left side - Branding with Enhanced 3D Effects */}
        <div className="hidden w-2/5 bg-gradient-to-br from-primary via-primary/90 to-accent p-12 lg:flex lg:flex-col relative overflow-hidden animate-fade-in">
          <div className="absolute inset-0 opacity-20">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  width: Math.random() * 100 + 40 + "px",
                  height: Math.random() * 100 + 40 + "px",
                  left: Math.random() * 100 + "%",
                  top: Math.random() * 100 + "%",
                  animation: `wave ${Math.random() * 15 + 15}s ease-in-out infinite`,
                  animationDelay: Math.random() * 5 + "s",
                }}
              />
            ))}
          </div>

          <div className="absolute top-1/4 right-12 opacity-10 animate-wave">
            <Droplet className="h-72 w-72 text-white" />
          </div>

          <div
            className="absolute bottom-1/4 left-12 opacity-10"
            style={{
              animation: "wave 25s ease-in-out infinite 5s",
            }}
          >
            <Zap className="h-64 w-64 text-white" />
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="h-96 w-96 rounded-full bg-white/5 blur-3xl animate-pulse-glow" />
          </div>

          {/* Logo Section */}
          <div className="relative z-10">
            <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
              <div className="rounded-xl bg-white/20 backdrop-blur-sm p-3 shadow-2xl hover:scale-110 transition-transform">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">WattsFlow</h1>
            </Link>
          </div>

          {/* Main Content - Centered */}
          <div className="flex-1 flex flex-col justify-center space-y-8 relative z-10">
            {/* Hero Message */}
            <div className="space-y-4">
              <div className="inline-block px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium">
                <Sparkles className="inline h-4 w-4 mr-2" />
                Trusted by 50,000+ households
              </div>
              <h2 className="text-5xl font-bold text-white leading-tight">
                Save 20% on
                <br />
                Your Bills
              </h2>
              <p className="text-xl text-white/90">
                Track your water and electricity usage with AI-powered insights and real-time analytics.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:scale-110 transition-transform">
                <div className="text-3xl font-bold text-white">50K+</div>
                <div className="text-sm text-white/80 mt-1">Active Users</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:scale-110 transition-transform">
                <div className="text-3xl font-bold text-white">20%</div>
                <div className="text-sm text-white/80 mt-1">Avg Savings</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:scale-110 transition-transform">
                <div className="text-3xl font-bold text-white">$350</div>
                <div className="text-sm text-white/80 mt-1">Saved/Year</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Form area */}
        <div className="flex w-full flex-col lg:w-3/5">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <Link href="/" className="flex items-center gap-2 md:hidden hover:opacity-80 transition-opacity">
              <div className="rounded-lg bg-primary p-2">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold">WattsFlow</span>
            </Link>
            <div className="ml-auto">
              <button
                onClick={toggleDarkMode}
                className="rounded-lg p-2 hover:bg-muted transition-colors"
                aria-label="Toggle dark mode"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="flex flex-1 items-center justify-center px-6 py-8 overflow-hidden">{children}</div>
        </div>
      </div>
    </div>
  )
}
