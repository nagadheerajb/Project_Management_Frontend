import React from "react"
import { Button } from "@/components/ui/button"
import { Trash } from "lucide-react"

interface DeleteButtonProps {
  onClick: () => void
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ onClick }) => {
  return (
    <Button variant="destructive" onClick={onClick}>
      <Trash className="h-4 w-4 mr-2" /> Delete
    </Button>
  )
}

export default DeleteButton
