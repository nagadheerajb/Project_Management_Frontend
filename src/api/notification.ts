import api from "@/api"

// Fetch all notifications
export const fetchNotifications = async () => {
  const response = await api.get("/notifications")
  return response.data.data // Assuming response.data.data contains the array of notifications
}

// Mark a notification as read
export const markNotificationAsRead = async (id: string) => {
  const response = await api.patch(`/notifications/${id}/read-status?isRead=true`)
  return response.data.data // Updated notification
}

// Delete a notification (if needed)
export const deleteNotification = async (id: string) => {
  const response = await api.delete(`/notifications/${id}`)
  return response.data // Success message or empty response
}
