import { Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { HouseholdProvider } from '@/context/household'
import { MeterProvider } from '@/context/meters'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import PendingVerification from './pages/PendingVerification'
import AdminDashboard from './pages/admin/AdminDashboard'
import DashboardLayout from './layouts/DashboardLayout'
import Dashboard from './pages/dashboard/Dashboard'
import Analytics from './pages/dashboard/Analytics'
import Goals from './pages/dashboard/Goals'
import Settings from './pages/dashboard/Settings'
import Profile from './pages/dashboard/Profile'

function App() {
  return (
    <HouseholdProvider>
      <MeterProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/pending-verification" element={<PendingVerification />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="goals" element={<Goals />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
        <Toaster />
      </MeterProvider>
    </HouseholdProvider>
  )
}

export default App
