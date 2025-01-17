import React, { useEffect, useState } from "react"
import { getCompanyDetails } from "@/api/company"
import CompanyDetails from "@/components/forms/dashboard/company-details"

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

  return (
    <>
      {companyDetails && (
        <CompanyDetails
          companyDetails={companyDetails}
          onEdit={() => onEdit(companyDetails)}
          onDelete={() => onDelete(selectedCompany)}
        />
      )}
    </>
  )
}

export default CompanyDetailsSection
