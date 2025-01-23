import { useEffect, useState } from "react"
import { fetchNotifications } from "@/api/notification"

const useNotifications = (webSocketUrl: string) => {
  const [notifications, setNotifications] = useState<any[]>([])

  // Fetch initial notifications via REST API
  useEffect(() => {
    const fetchInitialNotifications = async () => {
      const data = await fetchNotifications()
      setNotifications(data)
    }

    fetchInitialNotifications()
  }, [])

  // Set up WebSocket connection for real-time notifications
  useEffect(() => {
    const socket = new WebSocket(webSocketUrl)

    socket.onopen = () => {
      console.log("Connected to WebSocket at", webSocketUrl)
    }

    socket.onmessage = (event) => {
      const newNotification = JSON.parse(event.data)
      setNotifications((prev) => [newNotification, ...prev]) // Add new notifications to the top
    }

    socket.onerror = (error) => {
      console.error("WebSocket error:", error)
    }

    socket.onclose = () => {
      console.log("WebSocket connection closed")
    }

    return () => {
      socket.close()
    }
  }, [webSocketUrl])

  return { notifications, setNotifications }
}

export default useNotifications
