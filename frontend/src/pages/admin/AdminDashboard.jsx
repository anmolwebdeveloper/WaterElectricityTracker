import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Shield, Users, CheckCircle, XCircle, Mail, Calendar, Loader2, LogOut, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { adminAPI } from "@/utils/api"
import { useToast } from "@/hooks/use-toast"

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [pendingUsers, setPendingUsers] = useState([])
  const [verifiedUsers, setVerifiedUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("pending")

  useEffect(() => {
    // Check if user is admin
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (user.email !== 'admin@wattsflow.com') {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      })
      navigate('/dashboard')
      return
    }

    fetchUsers()
  }, [navigate])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const [pending, verified] = await Promise.all([
        adminAPI.getPending(),
        adminAPI.getVerified(),
      ])
      setPendingUsers(pending.users || [])
      setVerifiedUsers(verified.users || [])
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch users",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (userId) => {
    try {
      setProcessing(userId)
      await adminAPI.verifyUser(userId)
      
      toast({
        title: "✅ User Approved",
        description: "User has been successfully verified and can now access the dashboard.",
      })
      
      // Refresh the list
      await fetchUsers()
    } catch (error) {
      toast({
        title: "Approval Failed",
        description: error.message || "Failed to approve user",
        variant: "destructive",
      })
    } finally {
      setProcessing(null)
    }
  }

  const handleReject = async (userId) => {
    if (!confirm('Are you sure you want to reject this user? This will delete their account.')) {
      return
    }

    try {
      setProcessing(userId)
      await adminAPI.rejectUser(userId, "Account verification rejected by admin")
      
      toast({
        title: "User Rejected",
        description: "User account has been deleted.",
      })
      
      // Refresh the list
      await fetchUsers()
    } catch (error) {
      toast({
        title: "Rejection Failed",
        description: error.message || "Failed to reject user",
        variant: "destructive",
      })
    } finally {
      setProcessing(null)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const filteredPendingUsers = pendingUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.electricityMeterNo && user.electricityMeterNo.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.waterMeterNo && user.waterMeterNo.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const filteredVerifiedUsers = verifiedUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-300">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="text-lg">Loading Admin Dashboard...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "2s" }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30">
                  <Shield className="h-8 w-8 text-purple-400" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Admin Dashboard
                  </h1>
                  <p className="text-slate-400">User Verification Management</p>
                </div>
              </div>
            </div>
            
            <Button
              onClick={handleLogout}
              variant="outline"
              className="glass border-white/10 hover:border-red-500/50 hover:bg-red-500/10 text-red-400 transition-all"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <Card className="glass border-white/10 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Pending Verification</p>
                  <p className="text-3xl font-bold text-yellow-400">{pendingUsers.length}</p>
                </div>
                <div className="p-3 rounded-lg bg-yellow-500/10">
                  <Users className="h-6 w-6 text-yellow-400" />
                </div>
              </div>
            </Card>

            <Card className="glass border-white/10 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Verified Users</p>
                  <p className="text-3xl font-bold text-green-400">{verifiedUsers.length}</p>
                </div>
                <div className="p-3 rounded-lg bg-green-500/10">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </Card>

            <Card className="glass border-white/10 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Total Users</p>
                  <p className="text-3xl font-bold text-blue-400">{pendingUsers.length + verifiedUsers.length}</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-500/10">
                  <Users className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </Card>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Search by name, email, or meter number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 glass border-white/10 bg-slate-900/50 text-slate-200 h-12"
              />
            </div>
            
            {/* Tab Selector */}
            <div className="flex gap-2 glass border-white/10 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab("pending")}
                className={`px-4 py-2 rounded-md transition-all ${
                  activeTab === "pending"
                    ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Pending ({pendingUsers.length})
              </button>
              <button
                onClick={() => setActiveTab("verified")}
                className={`px-4 py-2 rounded-md transition-all ${
                  activeTab === "verified"
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Verified ({verifiedUsers.length})
              </button>
            </div>
          </div>
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">User</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Meters</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Requested</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Status</th>
                    {activeTab === "pending" && (
                      <th className="px-6 py-4 text-right text-sm font-semibold text-slate-200">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {activeTab === "pending" ? (
                    filteredPendingUsers.length > 0 ? (
                      filteredPendingUsers.map((user, index) => (
                        <motion.tr
                          key={user._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-white/5 hover:bg-white/5 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-medium text-slate-200">{user.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-slate-400">
                              <Mail className="h-4 w-4" />
                              <span className="text-sm">{user.email}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1 text-sm">
                              {user.electricityMeterNo && (
                                <div className="text-slate-400">
                                  <span className="text-yellow-400">⚡</span> {user.electricityMeterNo}
                                </div>
                              )}
                              {user.waterMeterNo && (
                                <div className="text-slate-400">
                                  <span className="text-cyan-400">💧</span> {user.waterMeterNo}
                                </div>
                              )}
                              {!user.electricityMeterNo && !user.waterMeterNo && (
                                <span className="text-slate-500">No meters</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-slate-400 text-sm">
                              <Calendar className="h-4 w-4" />
                              {new Date(user.verificationRequestedAt || user.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                              Pending
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleApprove(user._id)}
                                disabled={processing === user._id}
                                className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30"
                              >
                                {processing === user._id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <>
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Approve
                                  </>
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleReject(user._id)}
                                disabled={processing === user._id}
                                className="glass border-red-500/30 hover:bg-red-500/20 text-red-400"
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <div className="p-4 rounded-full bg-slate-800/50">
                              <Users className="h-8 w-8 text-slate-600" />
                            </div>
                            <p className="text-slate-400">No pending users found</p>
                          </div>
                        </td>
                      </tr>
                    )
                  ) : (
                    filteredVerifiedUsers.length > 0 ? (
                      filteredVerifiedUsers.map((user, index) => (
                        <motion.tr
                          key={user._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-white/5 hover:bg-white/5 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold">
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-medium text-slate-200">{user.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-slate-400">
                              <Mail className="h-4 w-4" />
                              <span className="text-sm">{user.email}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1 text-sm">
                              {user.electricityMeterNo && (
                                <div className="text-slate-400">
                                  <span className="text-yellow-400">⚡</span> {user.electricityMeterNo}
                                </div>
                              )}
                              {user.waterMeterNo && (
                                <div className="text-slate-400">
                                  <span className="text-cyan-400">💧</span> {user.waterMeterNo}
                                </div>
                              )}
                              {!user.electricityMeterNo && !user.waterMeterNo && (
                                <span className="text-slate-500">No meters</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-slate-400 text-sm">
                              <Calendar className="h-4 w-4" />
                              {new Date(user.verifiedAt || user.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                              Verified
                            </span>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <div className="p-4 rounded-full bg-slate-800/50">
                              <CheckCircle className="h-8 w-8 text-slate-600" />
                            </div>
                            <p className="text-slate-400">No verified users found</p>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
