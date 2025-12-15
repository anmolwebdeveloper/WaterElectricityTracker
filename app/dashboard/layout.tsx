"use client"

import type React from "react"
import { useState } from "react"
import { Moon, Sun, Menu, X, Zap, BarChart3, Target, Settings, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { Input } from "@/components/ui/input"
import { HouseholdProvider, useHousehold } from '@/context/household'
import { useEffect, useRef } from 'react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showAddReading, setShowAddReading] = useState(false)
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

  function HeaderContent() {
    const { addReading, user } = useHousehold()
    const menuRef = useRef<HTMLDivElement | null>(null)
    const buttonRef = useRef<HTMLButtonElement | null>(null)

    useEffect(() => {
      function onDocClick(e: MouseEvent) {
        const target = e.target as Node
        if (
          showProfileMenu &&
          menuRef.current &&
          buttonRef.current &&
          !menuRef.current.contains(target) &&
          !buttonRef.current.contains(target)
        ) {
          setShowProfileMenu(false)
        }
      }
      document.addEventListener('click', onDocClick)
      return () => document.removeEventListener('click', onDocClick)
    }, [showProfileMenu])

    return (
      <>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <div className="flex items-center gap-4">

            <button
              onClick={toggleDarkMode}
              className="rounded-lg p-2 hover:bg-muted transition-all hover:scale-110 hover:rotate-12"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <div className="relative">
              <button
                ref={buttonRef}
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent hover:scale-110 transition-transform cursor-pointer flex items-center justify-center text-primary-foreground font-bold"
                aria-haspopup="menu"
                aria-expanded={showProfileMenu}
              >
                {user.name[0]}
              </button>

              {showProfileMenu && (
                <div ref={menuRef} className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg animate-slide-in-up z-[9999]">
                  <div className="p-3 border-b border-border">
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-xs text-muted-foreground break-words">{user.email}</p>
                  </div>
                  <div className="p-2">
                    <Link
                      href="/dashboard/profile"
                      className="block px-3 py-2 text-sm rounded hover:bg-muted transition-colors"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      View Profile
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
      </>
    )
  }

  return (
    <div className={isDark ? "dark" : ""}>
      <HouseholdProvider>
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
          <header className="border-b border-border glass px-6 py-4">
            <HeaderContent />
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </div>
      </HouseholdProvider>
    </div>
  )
}
