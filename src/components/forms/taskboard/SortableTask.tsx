import React from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Task } from "@/types/interfaces"

interface SortableTaskProps {
  id: string
  task: Task
  onTaskClick: (task: Task) => void
}

const SortableTask: React.FC<SortableTaskProps> = ({ id, task, onTaskClick }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log("SortableTask: Task clicked", task)
    onTaskClick(task)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-2 bg-white rounded shadow cursor-pointer"
      onClick={handleClick}
      onMouseDown={(e) => {
        if (e.button === 0) {
          e.stopPropagation()
        }
      }}
    >
      <h4 className="font-bold">{task.name}</h4>
      <p className="text-sm text-gray-500">{task.description}</p>
    </div>
  )
}

export default SortableTask
