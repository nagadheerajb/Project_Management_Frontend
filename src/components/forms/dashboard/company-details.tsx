import React from "react"
import DetailsCard from "@/components/forms/dashboard/DetailsCard"
import EditButton from "@/components/forms/dashboard/EditButton"
import DeleteButton from "@/components/forms/dashboard/DeleteButton"

const CompanyDetails: React.FC<{
  companyDetails: any
  onEdit: () => void
  onDelete: (id: string) => void
}> = ({ companyDetails, onEdit, onDelete }) => (
  <div>
    <div className="flex justify-between items-center">
      <h2 className="text-3xl font-bold">{companyDetails.name}</h2>
      <div className="space-x-2">
        <EditButton onClick={onEdit} />
        <DeleteButton onClick={onDelete} id={companyDetails.id} />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <DetailsCard title="Company" details={companyDetails} />
      {/* Add more cards for other company-related information */}
    </div>
  </div>
)

export default CompanyDetails
