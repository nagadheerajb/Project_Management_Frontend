import React from "react"
import { Button } from "@/components/ui/button"
import { Trash } from "lucide-react"

interface DeleteButtonProps {
  onClick: (id: string) => void
  id: string
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ onClick, id }) => {
  return (
    <Button variant="destructive" onClick={() => onClick(id)}>
      <Trash className="h-4 w-4 mr-2" /> Delete
    </Button>
  )
}

export default DeleteButton
