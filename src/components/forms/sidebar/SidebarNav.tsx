import React, { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useWorkspace, useCompany } from "@/context/workspace-context"
import api from "@/api"
import { Workspace } from "@/types/interfaces"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import { ChevronsUpDown, Plus } from "lucide-react"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import { useSidebar } from "@/components/ui/sidebar"
import { useNavigate } from "react-router-dom" // Add this import

async function fetchWorkspaces(): Promise<Workspace[]> {
  const response = await api.get("/workspace-users/my-workspaces")
  return response.data.data
}

const SidebarNav: React.FC<{ handleAddWorkspaceClick: (companyId: string) => void }> = ({
  handleAddWorkspaceClick
}) => {
  const { selectedWorkspace, setSelectedWorkspace, selectedType, setSelectedType } = useWorkspace()
  const { selectedCompany, setSelectedCompany } = useCompany()
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({})
  const { open } = useSidebar()
  const navigate = useNavigate() // Initialize navigation

  const toggleSection = (companyId: string) => {
    setOpenSections((prev) => ({ ...prev, [companyId]: !prev[companyId] }))
  }

  const {
    data: workspaces,
    isLoading,
    error
  } = useQuery<Workspace[]>({
    queryKey: ["workspaces"],
    queryFn: fetchWorkspaces
  })

  const handleWorkspaceClick = (workspace: Workspace) => {
    setSelectedWorkspace(workspace.workspaceId)
    setSelectedCompany(workspace.companyId)
    setSelectedType("workspace")
    localStorage.setItem("workspaceId", workspace.workspaceId)
    navigate("/dashboard") // Navigate to the workspace dashboard
  }

  const handleCompanyClick = (companyId: string) => {
    setSelectedCompany(companyId)
    setSelectedWorkspace("")
    setSelectedType("company")
    toggleSection(companyId)
    navigate("/dashboard") // Navigate to the company dashboard
  }

  const groupedWorkspaces = workspaces?.reduce((acc, workspace) => {
    const { companyId, companyName } = workspace
    if (!acc[companyId]) {
      acc[companyId] = {
        companyName,
        workspaces: []
      }
    }
    acc[companyId].workspaces.push(workspace)
    return acc
  }, {} as Record<string, { companyName: string; workspaces: Workspace[] }>)

  return (
    <ScrollArea className="h-[calc(100vh-8rem)] py-2">
      <nav className="space-y-1 px-2">
        {isLoading &&
          Array(3)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex items-center space-x-2 p-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
        {error && (
          <div className="p-4 text-sm text-destructive">
            <p>Failed to load workspaces</p>
            <pre>{error.message}</pre>
          </div>
        )}
        {groupedWorkspaces &&
          Object.entries(groupedWorkspaces).map(([companyId, { companyName, workspaces }]) => (
            <Collapsible key={companyId} open={openSections[companyId]} className="space-y-1">
              <div className="flex items-center">
                <CollapsibleTrigger asChild>
                  <Button
                    variant={selectedCompany === companyId ? "secondary" : "ghost"}
                    className="w-full justify-start px-2"
                    onClick={() => handleCompanyClick(companyId)} // Trigger navigation
                  >
                    <ChevronsUpDown className="h-4 w-4 mr-2" />
                    {open && <span className="truncate">{companyName}</span>}
                  </Button>
                </CollapsibleTrigger>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleAddWorkspaceClick(companyId)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">Create new workspace</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <CollapsibleContent className="space-y-1">
                {workspaces.map((workspace) => (
                  <Button
                    key={workspace.workspaceId}
                    variant={selectedWorkspace === workspace.workspaceId ? "secondary" : "ghost"}
                    className="w-full justify-start pl-6"
                    onClick={() => handleWorkspaceClick(workspace)} // Trigger navigation
                  >
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarFallback style={{ backgroundColor: workspace.color }}>
                        {workspace.workspaceName
                          ? workspace.workspaceName.charAt(0).toUpperCase()
                          : "W"}
                      </AvatarFallback>
                    </Avatar>
                    {open && (
                      <span className="truncate">
                        {workspace.workspaceName || "Unnamed Workspace"}
                      </span>
                    )}
                  </Button>
                ))}
              </CollapsibleContent>
            </Collapsible>
          ))}
      </nav>
    </ScrollArea>
  )
}

export default SidebarNav
