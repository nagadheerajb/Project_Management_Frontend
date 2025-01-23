import React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog"
import { UserReadDTO } from "@/types/interfaces"

interface ProfileDetailsDialogProps {
  isOpen: boolean
  onClose: () => void
  user: UserReadDTO | null
}

const ProfileDetailsDialog: React.FC<ProfileDetailsDialogProps> = ({ isOpen, onClose, user }) => {
  if (!user) {
    return null // Don't render if user data is not available
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Profile Details</DialogTitle>
          <DialogDescription>View your account information below.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <p>
            <strong>Name:</strong> {user.firstName} {user.lastName}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Phone:</strong> {user.phone || "Not Provided"}
          </p>
          <p>
            <strong>Created Date:</strong> {new Date(user.createdDate).toLocaleDateString()}
          </p>
          {user.profileImage && (
            <img
              src={user.profileImage}
              alt="Profile"
              className="w-24 h-24 rounded-full border border-gray-300"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ProfileDetailsDialog
