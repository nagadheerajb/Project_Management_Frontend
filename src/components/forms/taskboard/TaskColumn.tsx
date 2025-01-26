import type React from "react"
import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { AnimatePresence, motion } from "framer-motion"
import SortableTask from "./SortableTask"
import type { Task } from "@/types/interfaces"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Filter } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import type { FilterCriteria, ColumnFilterCriteria } from "./TaskBoardContent"

interface TaskColumnProps {
  title: string
  tasks: Task[]
  columnKey: string
  onTaskClick: (task: Task) => void
  columnFilters: ColumnFilterCriteria
  handleFilterChange: (key: keyof FilterCriteria, value: any, status: string) => void
  clearFilters: (status: string) => void
}

const TaskColumn: React.FC<TaskColumnProps> = ({
  title,
  tasks,
  columnKey,
  onTaskClick,
  columnFilters,
  handleFilterChange,
  clearFilters
}) => {
  const { setNodeRef } = useDroppable({
    id: columnKey
  })

  console.log(`Rendering TaskColumn: ${title}, Tasks: ${tasks.length}`)

  return (
    <div
      ref={setNodeRef}
      className="p-4 bg-white rounded-md shadow min-h-[200px] border-2 border-gray-200"
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold">{title}</h3>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <h4 className="font-medium">Column Filters</h4>
              <div className="space-y-2">
                <Label htmlFor={`assigned-user-${columnKey}`}>Assigned User</Label>
                <Input
                  id={`assigned-user-${columnKey}`}
                  value={columnFilters.assignedUser}
                  onChange={(e) => handleFilterChange("assignedUser", e.target.value, columnKey)}
                  placeholder="Filter by Assigned User"
                />
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                {Object.keys(columnFilters.priority).map((priority) => (
                  <div key={priority} className="flex items-center">
                    <Checkbox
                      id={`${columnKey}-${priority}`}
                      checked={
                        columnFilters.priority[priority as keyof typeof columnFilters.priority]
                      }
                      onCheckedChange={(checked) =>
                        handleFilterChange(
                          "priority",
                          {
                            ...columnFilters.priority,
                            [priority]: checked
                          },
                          columnKey
                        )
                      }
                    />
                    <Label htmlFor={`${columnKey}-${priority}`} className="ml-2">
                      {priority.replace("_", " ")}
                    </Label>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <Label>Due Date Range</Label>
                <DatePickerWithRange
                  value={columnFilters.dueDateRange}
                  onChange={(range) => handleFilterChange("dueDateRange", range, columnKey)}
                />
              </div>
              <div className="space-y-2">
                <Label>Created Date Range</Label>
                <DatePickerWithRange
                  value={columnFilters.createdDateRange}
                  onChange={(range) => handleFilterChange("createdDateRange", range, columnKey)}
                />
              </div>
              <div className="space-y-2">
                <Label>Resolved Date Range</Label>
                <DatePickerWithRange
                  value={columnFilters.resolvedDateRange}
                  onChange={(range) => handleFilterChange("resolvedDateRange", range, columnKey)}
                />
              </div>
              <Button onClick={() => clearFilters(columnKey)} variant="outline" size="sm">
                Clear Column Filters
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <SortableContext items={tasks.map((task) => task.id!)} strategy={verticalListSortingStrategy}>
        <AnimatePresence>
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <SortableTask id={task.id!} task={task} onTaskClick={onTaskClick} />
            </motion.div>
          ))}
        </AnimatePresence>
      </SortableContext>
    </div>
  )
}

export default TaskColumn
