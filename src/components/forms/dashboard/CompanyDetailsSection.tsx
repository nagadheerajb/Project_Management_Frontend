import type React from "react"
import { useEffect, useState } from "react"
import { getCompanyDetails } from "@/api/company"
import CompanyDetails from "@/components/forms/dashboard/company-details"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

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

  const handleManageOption = (option: string) => {
    switch (option) {
      case "permissions":
        window.location.href = "/permissions"
        break
      case "roles":
        window.location.href = "/roles"
        break
      case "role-permissions":
        window.location.href = "/role-permissions"
        break
    }
  }

  return (
    <>
      {companyDetails && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <CompanyDetails companyDetails={companyDetails} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Manage Company <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => onEdit(companyDetails)}>
                  Edit Company
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => onDelete(selectedCompany)}>
                  Delete Company
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleManageOption("permissions")}>
                  Manage Permissions
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleManageOption("roles")}>
                  Manage Roles
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleManageOption("role-permissions")}>
                  Manage Role Permissions
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}
    </>
  )
}

export default CompanyDetailsSection
