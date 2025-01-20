import type React from "react"
import DetailsCard from "@/components/forms/dashboard/DetailsCard"
import EditButton from "@/components/forms/dashboard/EditButton"
import DeleteButton from "@/components/forms/dashboard/DeleteButton"

const CompanyDetails: React.FC<{
  companyDetails: any
}> = ({ companyDetails }) => (
  <div className="flex-grow">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-3xl font-bold">{companyDetails.name}</h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <DetailsCard title="Company" details={companyDetails} />
      {/* Add more cards for other company-related information */}
    </div>
  </div>
)

export default CompanyDetails
