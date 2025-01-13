import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate } from "@/utils/format-date"

interface DetailsCardProps {
  title: string
  details: {
    description?: string
    type?: string
    createdDate: string
    createdBy: string
    companyName?: string
    [key: string]: any
  }
}

const DetailsCard: React.FC<DetailsCardProps> = ({ title, details }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title} Details</CardTitle>
      </CardHeader>
      <CardContent>
        {details.description && (
          <p>
            <strong>Description:</strong> {details.description}
          </p>
        )}
        {details.type && (
          <p>
            <strong>Type:</strong> {details.type}
          </p>
        )}
        <p>
          <strong>Created Date:</strong> {formatDate(details.createdDate)}
        </p>
        <p>
          <strong>Created By:</strong> {details.createdBy}
        </p>
        {details.companyName && (
          <p>
            <strong>Company Name:</strong> {details.companyName}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export default DetailsCard
