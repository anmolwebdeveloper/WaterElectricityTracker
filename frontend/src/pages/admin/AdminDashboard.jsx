import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Shield, Users, CheckCircle, XCircle, Mail, Calendar, Loader2, LogOut, Search, Filter, Ban, RefreshCw, Eye, UserX, RotateCcw, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { adminAPI } from "@/utils/api"
import { useToast } from "@/hooks/use-toast"

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [pendingUsers, setPendingUsers] = useState([])
  const [verifiedUsers, setVerifiedUsers] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("pending")
  const [statusFilter, setStatusFilter] = useState("all")
  
  // Dialog states
  const [deactivateDialog, setDeactivateDialog] = useState({ open: false, user: null, reason: "" })
  const [auditDialog, setAuditDialog] = useState({ open: false, user: null, logs: [], loginHistory: [] })

  useEffect(() => {
    // Check if user is admin
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (user.email !== 'admin@wattsflow.com' && user.role !== 'admin') {
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
      const [pending, verified, all] = await Promise.all([
        adminAPI.getPending(),
        adminAPI.getVerified(),
        adminAPI.getUsers({ status: statusFilter !== 'all' ? statusFilter : undefined })
      ])
      setPendingUsers(pending.users || [])
      setVerifiedUsers(verified.users || [])
      setAllUsers(all.users || [])
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

  const handleDeactivate = async () => {
    const { user, reason } = deactivateDialog
    if (!user) return

    try {
      setProcessing(user._id)
      await adminAPI.deactivateUser(user._id, reason)
      
      toast({
        title: "✅ User Deactivated",
        description: `${user.name}'s account has been deactivated.`,
      })
      
      setDeactivateDialog({ open: false, user: null, reason: "" })
      await fetchUsers()
    } catch (error) {
      toast({
        title: "Deactivation Failed",
        description: error.message || "Failed to deactivate user",
        variant: "destructive",
      })
    } finally {
      setProcessing(null)
    }
  }

  const handleReactivate = async (user) => {
    if (!confirm(`Are you sure you want to reactivate ${user.name}?`)) {
      return
    }

    try {
      setProcessing(user._id)
      await adminAPI.reactivateUser(user._id)
      
      toast({
        title: "✅ User Reactivated",
        description: `${user.name}'s account has been reactivated.`,
      })
      
      await fetchUsers()
    } catch (error) {
      toast({
        title: "Reactivation Failed",
        description: error.message || "Failed to reactivate user",
        variant: "destructive",
      })
    } finally {
      setProcessing(null)
    }
  }

  const viewAuditLogs = async (user) => {
    try {
      const response = await adminAPI.getUserAuditLogs(user._id)
      setAuditDialog({
        open: true,
        user,
        logs: response.auditLogs || [],
        loginHistory: response.loginHistory || []
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch audit logs",
        variant: "destructive",
      })
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

  const filteredAllUsers = allUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (statusFilter === 'all') return matchesSearch
    return matchesSearch && user.status === statusFilter
  })

  const getStatusBadge = (status) => {
    const config = {
      active: { color: 'text-green-400 bg-green-500/10', label: 'Active' },
      removed: { color: 'text-red-400 bg-red-500/10', label: 'Removed' },
      pending: { color: 'text-yellow-400 bg-yellow-500/10', label: 'Pending' },
      suspended: { color: 'text-orange-400 bg-orange-500/10', label: 'Suspended' }
    }
    const { color, label } = config[status] || config.active
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>{label}</span>
  }

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
          <div className="grid md:grid-cols-4 gap-4 mb-6">
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
                  <p className="text-sm text-slate-400 mb-1">Removed Users</p>
                  <p className="text-3xl font-bold text-red-400">
                    {allUsers.filter(u => u.status === 'removed').length}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-red-500/10">
                  <UserX className="h-6 w-6 text-red-400" />
                </div>
              </div>
            </Card>

            <Card className="glass border-white/10 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Total Users</p>
                  <p className="text-3xl font-bold text-purple-400">{allUsers.length}</p>
                </div>
                <div className="p-3 rounded-lg bg-purple-500/10">
                  <Users className="h-6 w-6 text-purple-400" />
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
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 rounded-md transition-all ${
                  activeTab === "all"
                    ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                All Users ({allUsers.length})
              </button>
            </div>

            {/* Status Filter for All Users tab */}
            {activeTab === "all" && (
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="glass border-white/10 bg-slate-900/50 text-slate-200 px-4 py-2 rounded-lg"
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="removed">Removed Only</option>
                <option value="pending">Pending Only</option>
                <option value="suspended">Suspended Only</option>
              </select>
            )}
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
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">
                      {activeTab === "pending" ? "Requested" : "Date"}
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Status</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-slate-200">Actions</th>
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
                  ) : activeTab === "verified" ? (
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
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => viewAuditLogs(user)}
                                className="glass border-blue-500/30 hover:bg-blue-500/20 text-blue-400"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Logs
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setDeactivateDialog({ open: true, user, reason: "" })}
                                disabled={processing === user._id}
                                className="glass border-red-500/30 hover:bg-red-500/20 text-red-400"
                              >
                                <Ban className="h-4 w-4 mr-1" />
                                Deactivate
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
                              <CheckCircle className="h-8 w-8 text-slate-600" />
                            </div>
                            <p className="text-slate-400">No verified users found</p>
                          </div>
                        </td>
                      </tr>
                    )
                  ) : (
                    filteredAllUsers.length > 0 ? (
                      filteredAllUsers.map((user, index) => (
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
                              {new Date(user.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {getStatusBadge(user.status)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => viewAuditLogs(user)}
                                className="glass border-blue-500/30 hover:bg-blue-500/20 text-blue-400"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Logs
                              </Button>
                              {user.status === 'removed' || user.status === 'suspended' ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleReactivate(user)}
                                  disabled={processing === user._id}
                                  className="glass border-green-500/30 hover:bg-green-500/20 text-green-400"
                                >
                                  <RotateCcw className="h-4 w-4 mr-1" />
                                  Reactivate
                                </Button>
                              ) : user.status === 'active' ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setDeactivateDialog({ open: true, user, reason: "" })}
                                  disabled={processing === user._id}
                                  className="glass border-red-500/30 hover:bg-red-500/20 text-red-400"
                                >
                                  <Ban className="h-4 w-4 mr-1" />
                                  Deactivate
                                </Button>
                              ) : null}
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
                            <p className="text-slate-400">No users found</p>
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

      {/* Deactivate User Dialog */}
      <Dialog open={deactivateDialog.open} onOpenChange={(open) => !open && setDeactivateDialog({ open: false, user: null, reason: "" })}>
        <DialogContent className="glass border-white/10 bg-slate-900/95 text-slate-200">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              Deactivate User Account
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              This will mark {deactivateDialog.user?.name}'s account as "removed" and prevent them from accessing the dashboard.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Reason for deactivation</label>
              <textarea
                value={deactivateDialog.reason}
                onChange={(e) => setDeactivateDialog({ ...deactivateDialog, reason: e.target.value })}
                placeholder="Enter the reason for deactivating this account..."
                className="w-full min-h-[100px] px-4 py-3 glass border-white/10 bg-slate-900/50 text-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-red-500/50"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeactivateDialog({ open: false, user: null, reason: "" })}
              className="glass border-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeactivate}
              disabled={!deactivateDialog.reason.trim() || processing}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30"
            >
              {processing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deactivating...
                </>
              ) : (
                <>
                  <Ban className="h-4 w-4 mr-2" />
                  Deactivate Account
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Audit Logs Dialog */}
      <Dialog open={auditDialog.open} onOpenChange={(open) => !open && setAuditDialog({ open: false, user: null, logs: [], loginHistory: [] })}>
        <DialogContent className="glass border-white/10 bg-slate-900/95 text-slate-200 max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Eye className="h-5 w-5 text-blue-400" />
              Audit Logs - {auditDialog.user?.name}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              View all activity and login history for this user
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Login History */}
            <div>
              <h3 className="text-lg font-semibold text-slate-200 mb-3">Login History</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {auditDialog.loginHistory && auditDialog.loginHistory.length > 0 ? (
                  auditDialog.loginHistory.map((login, idx) => (
                    <div key={idx} className="glass border-white/10 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-300">
                          {new Date(login.timestamp).toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-500">{login.ipAddress}</div>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">{login.userAgent}</div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-sm">No login history available</p>
                )}
              </div>
            </div>

            {/* Action Logs */}
            <div>
              <h3 className="text-lg font-semibold text-slate-200 mb-3">Action Logs</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {auditDialog.logs && auditDialog.logs.length > 0 ? (
                  auditDialog.logs.map((log, idx) => (
                    <div key={idx} className="glass border-white/10 p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-slate-300">{log.action}</span>
                        <span className="text-xs text-slate-500">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400">By: {log.performedBy}</div>
                      {log.details && (
                        <div className="text-xs text-slate-500 mt-1">{log.details}</div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-sm">No action logs available</p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setAuditDialog({ open: false, user: null, logs: [], loginHistory: [] })}
              className="glass border-white/10"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
