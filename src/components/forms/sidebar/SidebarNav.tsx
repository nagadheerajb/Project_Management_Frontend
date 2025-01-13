import React, { useState } from "react"
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
  }

  const handleCompanyClick = (companyId: string) => {
    setSelectedCompany(companyId)
    setSelectedWorkspace("") // Set to empty string instead of null
    setSelectedType("company")
    toggleSection(companyId) // Toggle the section when company is clicked
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
    <ScrollArea className="h-[calc(100vh-8rem)] py-6">
      <nav className="space-y-4 px-2">
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
          <div className="p-4 text-sm text-red-500">
            <p>Failed to load workspaces</p>
            <pre>{error.message}</pre>
          </div>
        )}
        {groupedWorkspaces &&
          Object.entries(groupedWorkspaces).map(([companyId, { companyName, workspaces }]) => (
            <Collapsible key={companyId} open={openSections[companyId]} className="space-y-2">
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" onClick={() => toggleSection(companyId)}>
                  <ChevronsUpDown className="h-4 w-4" />
                  <span className="sr-only">Toggle</span>
                </Button>
                <CollapsibleTrigger asChild>
                  <Button
                    variant={selectedCompany === companyId ? "secondary" : "ghost"}
                    className="w-full text-left font-semibold"
                    onClick={() => handleCompanyClick(companyId)}
                  >
                    {companyName}
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
                    <TooltipContent>Create new workspace</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <CollapsibleContent>
                {workspaces.map((workspace) => (
                  <Button
                    key={workspace.workspaceId}
                    variant={selectedWorkspace === workspace.workspaceId ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => handleWorkspaceClick(workspace)}
                  >
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarFallback style={{ backgroundColor: workspace.color }}>
                        {workspace.workspaceName
                          ? workspace.workspaceName.charAt(0).toUpperCase()
                          : "W"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate">
                      {workspace.workspaceName || "Unnamed Workspace"}
                    </span>
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
