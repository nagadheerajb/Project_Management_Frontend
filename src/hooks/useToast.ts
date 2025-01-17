import { useState } from "react"

export const useToast = () => {
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [toastVariant, setToastVariant] = useState<"default" | "destructive">("default")

  const showToast = (message: string, variant: "default" | "destructive" = "default") => {
    setToastMessage(message)
    setToastVariant(variant)
  }

  const resetToast = () => {
    setToastMessage(null)
    setToastVariant("default")
  }

  return { toastMessage, toastVariant, showToast, resetToast }
}
