"use client"

import type React from "react"
import { useState } from "react"
import { Moon, Sun, Menu, X, Zap, BarChart3, Target, Settings, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { Input } from "@/components/ui/input"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showAddReading, setShowAddReading] = useState(false)
  const [electricityInput, setElectricityInput] = useState("")
  const [waterInput, setWaterInput] = useState("")
  const pathname = usePathname()
  const router = useRouter()

  const toggleDarkMode = () => {
    setIsDark(!isDark)
    if (!isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const handleSignOut = () => {
    console.log("[v0] User signing out, redirecting to homepage")
    router.push("/")
  }

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: Zap },
    { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { label: "Goals", href: "/dashboard/goals", icon: Target },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
  ]

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="flex min-h-screen bg-background text-foreground">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? "w-64" : "w-20"} border-r border-border glass transition-all duration-300`}>
          <div className="flex h-16 items-center justify-between px-4">
            {sidebarOpen && (
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-gradient-to-br from-primary to-accent p-2">
                  <Zap className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-bold">WattsFlow</span>
              </div>
            )}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="rounded p-1 hover:bg-muted md:hidden">
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          <nav className="space-y-2 px-3 py-4">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:scale-105 ${
                    isActive
                      ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {sidebarOpen && <span>{item.label}</span>}
                </Link>
              )
            })}
          </nav>

          <div className="absolute bottom-4 left-4 right-4 space-y-2">
            {sidebarOpen && (
              <Button
                variant="outline"
                className="w-full justify-start gap-2 bg-transparent hover:bg-destructive hover:text-destructive-foreground transition-all"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <header className="border-b border-border glass px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Dashboard</h2>
              <div className="flex items-center gap-4">
                <Button
                  size="sm"
                  className="hover:scale-105 transition-transform"
                  onClick={() => setShowAddReading(!showAddReading)}
                >
                  + Add Reading
                </Button>
                <button
                  onClick={toggleDarkMode}
                  className="rounded-lg p-2 hover:bg-muted transition-all hover:scale-110 hover:rotate-12"
                  aria-label="Toggle dark mode"
                >
                  {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent hover:scale-110 transition-transform cursor-pointer flex items-center justify-center text-primary-foreground font-bold"
                  >
                    A
                  </button>

                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg animate-slide-in-up z-50">
                      <div className="p-3 border-b border-border">
                        <p className="font-semibold">Anmol</p>
                        <p className="text-xs text-muted-foreground">anmol@wattsflow.com</p>
                      </div>
                      <div className="p-2">
                        <Link
                          href="/dashboard/settings"
                          className="block px-3 py-2 text-sm rounded hover:bg-muted transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          Settings
                        </Link>
                        <button
                          onClick={() => {
                            setShowProfileMenu(false)
                            handleSignOut()
                          }}
                          className="w-full text-left px-3 py-2 text-sm rounded hover:bg-destructive/10 hover:text-destructive transition-colors"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {showAddReading && (
              <div className="mt-4 p-4 bg-muted/30 rounded-lg border border-border animate-slide-in-up">
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
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      console.log("[v0] Reading submitted from header:", electricityInput, waterInput)
                      setElectricityInput("")
                      setWaterInput("")
                      setShowAddReading(false)
                    }}
                  >
                    Submit
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowAddReading(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
