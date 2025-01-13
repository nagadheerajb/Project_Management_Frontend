import React from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface SidebarButtonProps {
  onClick: () => void
  label: string
}

const SidebarButton: React.FC<SidebarButtonProps> = ({ onClick, label }) => {
  return (
    <Button variant="outline" className="w-full" onClick={onClick}>
      <Plus className="mr-2 h-4 w-4" />
      {label}
    </Button>
  )
}

export default SidebarButton
