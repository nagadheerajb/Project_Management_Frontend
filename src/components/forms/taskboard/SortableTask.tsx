import type React from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import type { Task } from "@/types/interfaces"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface SortableTaskProps {
  id: string
  task: Task
  onTaskClick: (task: Task) => void
}

const SortableTask: React.FC<SortableTaskProps> = ({ id, task, onTaskClick }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: id,
    data: {
      type: "task",
      task
    }
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date()
  const isHighPriority = task.priority === "HIGH_PRIORITY"

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
      className={cn(
        "p-2 bg-white rounded shadow cursor-pointer transition-all duration-200",
        isOverdue && "border-l-4 border-red-500",
        isHighPriority && "border-r-4 border-yellow-500"
      )}
      onClick={handleClick}
    >
      <h4 className={cn("font-bold", isHighPriority && "text-yellow-600")}>{task.name}</h4>
      <p className="text-sm text-gray-500">{task.description}</p>
      <div className="flex justify-between items-center mt-2">
        <Badge variant={isOverdue ? "destructive" : "outline"} className="text-xs">
          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}
        </Badge>
        <Badge variant={isHighPriority ? "warning" : "outline"} className="text-xs">
          {task.priority.replace("_", " ")}
        </Badge>
      </div>
    </div>
  )
}

export default SortableTask
