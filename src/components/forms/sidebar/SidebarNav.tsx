import React, { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useWorkspace } from "@/context/workspace-context"
import api from "@/api"
import { Workspace, CompanyData } from "@/types/interfaces"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import { ChevronsUpDown, Plus } from "lucide-react"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import { useSidebar } from "@/components/ui/sidebar"
import { useNavigate } from "react-router-dom"

async function fetchWorkspaces(): Promise<Workspace[]> {
  const response = await api.get("/workspace-users/my-workspaces")
  return response.data.data
}

const SidebarNav: React.FC<{
  handleAddWorkspaceClick: (companyId: string) => void
  companies: CompanyData[]
  isLoadingCompanies: boolean
  onRefresh: () => void
}> = ({ handleAddWorkspaceClick, companies, isLoadingCompanies, onRefresh }) => {
  const {
    selectedWorkspace,
    setSelectedWorkspace,
    selectedType,
    setSelectedType,
    selectedCompany,
    setSelectedCompany
  } = useWorkspace()
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({})
  const { open } = useSidebar()
  const navigate = useNavigate()

  const {
    data: workspaces,
    isLoading,
    error
  } = useQuery({
    queryKey: ["workspaces"],
    queryFn: fetchWorkspaces
  })

  const handleWorkspaceClick = (workspace: Workspace) => {
    setSelectedWorkspace(workspace.workspaceId)
    setSelectedCompany(workspace.companyId)
    setSelectedType("workspace")
    localStorage.setItem("workspaceId", workspace.workspaceId)
    onRefresh()
    navigate("/dashboard")
  }

  const handleCompanyClick = (companyId: string) => {
    setSelectedCompany(companyId)
    setSelectedWorkspace(null)
    setSelectedType("company")
    setOpenSections((prev) => ({ ...prev, [companyId]: !prev[companyId] }))
    navigate("/dashboard")
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
        {/* Skeleton Loader */}
        {isLoading &&
          Array(3)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex items-center space-x-2 p-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}

        {/* Error Message */}
        {error && (
          <div className="p-4 text-sm text-destructive">
            <p>Failed to load workspaces</p>
            <pre>{error.message}</pre>
          </div>
        )}

        {/* Companies with Workspaces */}
        {groupedWorkspaces &&
          Object.entries(groupedWorkspaces).map(([companyId, { companyName, workspaces }]) => (
            <Collapsible key={companyId} open={openSections[companyId]} className="space-y-1">
              <div className="flex items-center">
                <CollapsibleTrigger asChild>
                  <Button
                    variant={selectedCompany === companyId ? "secondary" : "ghost"}
                    className="w-full justify-start px-2"
                    onClick={() => handleCompanyClick(companyId)}
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
                    onClick={() => handleWorkspaceClick(workspace)}
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

        {/* Companies Without Workspaces */}
        <h3 className="text-muted-foreground mt-4 px-2">Companies Without Workspaces</h3>
        {companies
          .filter((company) => !groupedWorkspaces?.[company.id])
          .map((company) => (
            <div key={company.id} className="flex items-center justify-between">
              <Button
                variant={selectedCompany === company.id ? "secondary" : "ghost"}
                className="w-full justify-start px-2"
                onClick={() => handleCompanyClick(company.id)}
              >
                {company.name}
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleAddWorkspaceClick(company.id)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Create new workspace</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ))}
      </nav>
    </ScrollArea>
  )
}

export default SidebarNav
