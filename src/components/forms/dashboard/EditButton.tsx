import React from "react"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"

interface EditButtonProps {
  onClick: () => void
}

const EditButton: React.FC<EditButtonProps> = ({ onClick }) => {
  return (
    <Button variant="outline" onClick={onClick}>
      <Pencil className="h-4 w-4 mr-2" /> Edit
    </Button>
  )
}

export default EditButton
