import type React from "react"
import { useEffect, useState } from "react"
import { getCompanyDetails } from "@/api/company"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, MoreVertical } from "lucide-react"

const CompanyDetailsSection: React.FC<{
  selectedCompany: string
  onEdit: (details: any) => void
  onDelete: (id: string) => void
}> = ({ selectedCompany, onEdit, onDelete }) => {
  const [companyDetails, setCompanyDetails] = useState<any>(null)

  useEffect(() => {
    if (selectedCompany) {
      getCompanyDetails(selectedCompany).then((data) => setCompanyDetails(data))
    }
  }, [selectedCompany])

  if (!companyDetails) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Company Dashboard</h1>
      </div>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold">{companyDetails.name}</CardTitle>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Manage Company <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => (window.location.href = "/permissions")}>
                  Manage Permissions
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => (window.location.href = `/roles?companyId=${selectedCompany}`)}
                >
                  Manage Roles
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => (window.location.href = "/role-permissions")}>
                  Manage Role Permissions
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(companyDetails)}>
                  Edit Company
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(selectedCompany)}>
                  Delete Company
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium">Created Date:</span>
              <span>{companyDetails.createdDate}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium">Created By:</span>
              <span className="font-mono text-sm">{companyDetails.createdBy}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CompanyDetailsSection
