import React from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Task } from "@/types/interfaces"

const SortableTask: React.FC<{ id: string; task: Task }> = ({ id, task }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-2 bg-white rounded shadow cursor-pointer"
    >
      <h4 className="font-bold">{task.name}</h4>
      <p className="text-sm text-gray-500">{task.description}</p>
    </div>
  )
}

export default SortableTask
