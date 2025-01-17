import React from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useSidebar } from "@/components/ui/sidebar"

const SidebarHeader: React.FC = () => {
  const { open, setOpen } = useSidebar()

  const toggleSidebar = () => setOpen(!open)

  return (
    <div className="p-4 flex items-center justify-between border-b">
      {open && <h2 className="font-semibold text-lg">Workspaces</h2>}
      <Button variant="ghost" size="icon" onClick={toggleSidebar} className="ml-auto">
        {open ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </Button>
    </div>
  )
}

export default SidebarHeader
