import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle2, XCircle, Clock, User, Zap, Droplet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { adminAPI } from "@/utils/api"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

export default function AdminVerification() {
  const { toast } = useToast()
  const [pendingUsers, setPendingUsers] = useState([])
  const [verifiedUsers, setVerifiedUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("pending")
  const [rejectDialog, setRejectDialog] = useState({ open: false, userId: null })
  const [rejectReason, setRejectReason] = useState("")

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const [pending, verified] = await Promise.all([
        adminAPI.getPending(),
        adminAPI.getVerified(),
      ])
      setPendingUsers(pending.users)
      setVerifiedUsers(verified.users)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (userId) => {
    try {
      await adminAPI.verifyUser(userId)
      toast({
        title: "User Verified",
        description: "The user has been approved and can now access the dashboard",
      })
      fetchUsers()
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: error.message || "Failed to verify user",
        variant: "destructive",
      })
    }
  }

  const handleReject = async () => {
    if (!rejectDialog.userId) return

    try {
      await adminAPI.rejectUser(rejectDialog.userId, rejectReason)
      toast({
        title: "User Rejected",
        description: "The verification request has been rejected",
      })
      setRejectDialog({ open: false, userId: null })
      setRejectReason("")
      fetchUsers()
    } catch (error) {
      toast({
        title: "Rejection Failed",
        description: error.message || "Failed to reject user",
        variant: "destructive",
      })
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Loading users...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Verification</h1>
          <p className="text-muted-foreground">Manage user verification requests</p>
        </div>
        <Button onClick={fetchUsers} variant="outline">
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-3xl font-bold">{pendingUsers.length}</p>
            </div>
            <div className="bg-amber-500/10 rounded-full p-3">
              <Clock className="h-6 w-6 text-amber-500" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Verified</p>
              <p className="text-3xl font-bold">{verifiedUsers.length}</p>
            </div>
            <div className="bg-green-500/10 rounded-full p-3">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-3xl font-bold">{pendingUsers.length + verifiedUsers.length}</p>
            </div>
            <div className="bg-primary/10 rounded-full p-3">
              <User className="h-6 w-6 text-primary" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "pending"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Pending ({pendingUsers.length})
        </button>
        <button
          onClick={() => setActiveTab("verified")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "verified"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Verified ({verifiedUsers.length})
        </button>
      </div>

      {/* User List */}
      <div className="space-y-4">
        {activeTab === "pending" ? (
          pendingUsers.length === 0 ? (
            <div className="glass-card rounded-lg p-12 text-center">
              <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">No Pending Verifications</p>
              <p className="text-sm text-muted-foreground">All users have been verified</p>
            </div>
          ) : (
            pendingUsers.map((user, index) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card rounded-lg p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 rounded-full p-2">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{user.name}</h3>
                        <p className="text-sm text-muted-foreground">{user.email || user.phoneNumber}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {user.electricityMeterNo && (
                        <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-3">
                          <Zap className="h-4 w-4 text-amber-500" />
                          <div>
                            <p className="text-xs text-muted-foreground">Electricity Meter</p>
                            <code className="text-sm font-mono">{user.electricityMeterNo}</code>
                          </div>
                        </div>
                      )}
                      {user.waterMeterNo && (
                        <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-3">
                          <Droplet className="h-4 w-4 text-blue-500" />
                          <div>
                            <p className="text-xs text-muted-foreground">Water Meter</p>
                            <code className="text-sm font-mono">{user.waterMeterNo}</code>
                          </div>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Requested: {formatDate(user.verificationRequestedAt || user.createdAt)}
                    </p>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button
                      onClick={() => handleVerify(user._id)}
                      className="bg-green-500 hover:bg-green-600 text-white gap-2"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Verify
                    </Button>
                    <Button
                      onClick={() => setRejectDialog({ open: true, userId: user._id })}
                      variant="destructive"
                      className="gap-2"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))
          )
        ) : verifiedUsers.length === 0 ? (
          <div className="glass-card rounded-lg p-12 text-center">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium">No Verified Users</p>
            <p className="text-sm text-muted-foreground">Verified users will appear here</p>
          </div>
        ) : (
          verifiedUsers.map((user, index) => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card rounded-lg p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-500/10 rounded-full p-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">{user.email || user.phoneNumber}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {user.electricityMeterNo && (
                      <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-3">
                        <Zap className="h-4 w-4 text-amber-500" />
                        <div>
                          <p className="text-xs text-muted-foreground">Electricity Meter</p>
                          <code className="text-sm font-mono">{user.electricityMeterNo}</code>
                        </div>
                      </div>
                    )}
                    {user.waterMeterNo && (
                      <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-3">
                        <Droplet className="h-4 w-4 text-blue-500" />
                        <div>
                          <p className="text-xs text-muted-foreground">Water Meter</p>
                          <code className="text-sm font-mono">{user.waterMeterNo}</code>
                        </div>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Verified: {formatDate(user.verifiedAt)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Reject Dialog */}
      <Dialog open={rejectDialog.open} onOpenChange={(open) => setRejectDialog({ open, userId: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Verification</DialogTitle>
            <DialogDescription>
              This will permanently delete the user's account. Please provide a reason for rejection.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Enter rejection reason (optional)"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialog({ open: false, userId: null })}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Reject & Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
