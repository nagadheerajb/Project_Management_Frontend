import type React from "react"
import { formatDate } from "@/utils/format-date"

const CompanyDetails: React.FC<{
  companyDetails: any
}> = ({ companyDetails }) => (
  <div className="grid gap-4">
    <div className="flex items-center space-x-4">
      <span className="text-sm font-medium">Description:</span>
      <span>{companyDetails.description || "N/A"}</span>
    </div>
    <div className="flex items-center space-x-4">
      <span className="text-sm font-medium">Created Date:</span>
      <span>{formatDate(companyDetails.createdDate)}</span>
    </div>
    <div className="flex items-center space-x-4">
      <span className="text-sm font-medium">Created By:</span>
      <span>{companyDetails.createdBy}</span>
    </div>
    {/* Add more company details as needed */}
  </div>
)

export default CompanyDetails
