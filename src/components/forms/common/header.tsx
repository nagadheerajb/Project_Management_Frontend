import React, { useState } from "react"
import { useWorkspace } from "@/context/workspace-context"
import { useUser } from "@/context/user-context"
import { User, Bell } from "lucide-react"
import LogoutButton from "@/components/forms/common/logout-button"
import ProfileDetailsDialog from "@/components/forms/profile/ProfileDetailsDialog"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import useNotifications from "@/hooks/useNotifications"
import { markNotificationAsRead } from "@/api/notification"

interface HeaderProps {
  title?: string // Optional title prop
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { selectedType } = useWorkspace()
  const { user } = useUser() // Access user details from context
  const [isProfileDialogOpen, setProfileDialogOpen] = useState(false) // State for profile dialog
  const [isNotificationDialogOpen, setNotificationDialogOpen] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState<any>(null) // For dialog
  const { notifications, setNotifications } = useNotifications("ws://localhost:9099/ws") // Use notification hook

  // Handle notification click
  const handleNotificationClick = async (notification: any) => {
    setSelectedNotification(notification)
    setNotificationDialogOpen(true)

    if (!notification.read) {
      await markNotificationAsRead(notification.id)
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
      )
    }
  }

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">
        {title
          ? title
          : selectedType === "workspace"
          ? "Workspace Dashboard"
          : selectedType === "company"
          ? "Company Dashboard"
          : selectedType === "task"
          ? "Task Dashboard"
          : "Dashboard"}
      </h1>

      <div className="flex items-center space-x-4">
        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative">
              <Bell className="w-6 h-6 text-gray-700" />
              {notifications.some((n) => !n.read) && (
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-600" />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 p-0">
            <div className="px-4 py-2 font-medium text-gray-800">Notifications</div>
            <ScrollArea className="h-48">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className={`text-sm px-4 py-2 ${
                      notification.read
                        ? "text-gray-500"
                        : "font-bold bg-gray-100 hover:bg-gray-200"
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    {notification.content}
                    <span className="block text-xs text-gray-400">
                      {new Date(notification.createdDate).toLocaleString()}
                    </span>
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem className="text-sm text-gray-500 px-4 py-2">
                  No new notifications
                </DropdownMenuItem>
              )}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Shadcn Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center space-x-2">
              <User className="w-6 h-6 text-gray-700" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <div className="px-4 py-2">
              <p className="text-sm font-medium text-gray-800">
                {user?.firstName || "User"} {user?.lastName || ""}
              </p>
              <p className="text-xs text-gray-500">{user?.email || "Email"}</p>
            </div>
            <DropdownMenuItem
              onClick={() => {
                setProfileDialogOpen(true) // Open profile dialog
              }}
            >
              Profile Details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LogoutButton /> {/* Reuse existing logout button */}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Profile Details Dialog */}
      <ProfileDetailsDialog
        isOpen={isProfileDialogOpen}
        onClose={() => setProfileDialogOpen(false)}
        user={user}
      />

      {/* Notification Dialog */}
      <Dialog open={isNotificationDialogOpen} onOpenChange={setNotificationDialogOpen}>
        <DialogContent>
          <DialogTitle>Notification</DialogTitle>
          <DialogDescription>
            {selectedNotification && selectedNotification.content}
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </header>
  )
}

export default Header
