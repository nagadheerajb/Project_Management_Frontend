import type React from "react"
import { useState, useCallback, useEffect, useMemo } from "react"
import {
  DndContext,
  DragOverlay,
  closestCorners,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  type DragStartEvent,
  type DragEndEvent
} from "@dnd-kit/core"
import type { DateRange } from "react-day-picker"
import SortableTask from "./SortableTask"
import TaskDialog from "./TaskDialog"
import TaskColumn from "./TaskColumn"
import type { Task, TaskResponse } from "@/types/interfaces"
import { useTaskMutations } from "@/hooks/useTaskMutations"
import { Button } from "@/components/ui/button"
import { useUser } from "@/context/user-context"
import { formatDate } from "@/utils/format-date"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { createPortal } from "react-dom"
import { findTaskContainer, reorderTasks, moveBetweenContainers } from "@/utils/dnd-helpers"

export interface FilterCriteria {
  assignedUser: string
  priority: Record<string, boolean>
  dueDateRange: DateRange | undefined
  createdDateRange: DateRange | undefined
  resolvedDateRange: DateRange | undefined
}

export interface ColumnFilterCriteria extends FilterCriteria {
  status: FilterStatus
}

type GlobalFilterCriteria = Omit<FilterCriteria, "status">

type FilterStatus = "TODO" | "IN_DEVELOPMENT" | "COMPLETE" | "RELEASED"

interface TaskBoardContentProps {
  tasks: Task[]
  projectId: string
  onTasksUpdate?: (updatedTasks: Task[]) => void
}

const TaskBoardContent: React.FC<TaskBoardContentProps> = ({
  tasks: initialTasks,
  projectId,
  onTasksUpdate
}) => {
  const columns: { key: FilterStatus; title: string }[] = [
    { key: "TODO", title: "TODO" },
    { key: "IN_DEVELOPMENT", title: "IN DEVELOPMENT" },
    { key: "COMPLETE", title: "COMPLETED" },
    { key: "RELEASED", title: "RELEASED" }
  ]

  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [dialogState, setDialogState] = useState<{ isOpen: boolean; task: Task | null }>({
    isOpen: false,
    task: null
  })

  const { createTaskMutation, updateTaskMutation, deleteTaskMutation } = useTaskMutations()
  const { userUUID } = useUser()

  const [sortCriteria, setSortCriteria] = useState<"priority" | "dueDate">("priority")
  const [grouping, setGrouping] = useState<"status" | "dueDate">("status")

  const [globalFilters, setGlobalFilters] = useState<GlobalFilterCriteria>({
    assignedUser: "",
    priority: { LOW_PRIORITY: false, MEDIUM_PRIORITY: false, HIGH_PRIORITY: false },
    dueDateRange: undefined,
    createdDateRange: undefined,
    resolvedDateRange: undefined
  })

  const [columnFilters, setColumnFilters] = useState<Record<FilterStatus, ColumnFilterCriteria>>({
    TODO: { status: "TODO", ...globalFilters },
    IN_DEVELOPMENT: { status: "IN_DEVELOPMENT", ...globalFilters },
    COMPLETE: { status: "COMPLETE", ...globalFilters },
    RELEASED: { status: "RELEASED", ...globalFilters }
  })

  const [showGlobalFilters, setShowGlobalFilters] = useState(false)

  useEffect(() => {
    setTasks(initialTasks)
  }, [initialTasks])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    }),
    useSensor(KeyboardSensor)
  )

  const sortTasks = useCallback(
    (tasksToSort: Task[]) => {
      return [...tasksToSort].sort((a, b) => {
        if (sortCriteria === "priority") {
          const priorityOrder = { HIGH_PRIORITY: 3, MEDIUM_PRIORITY: 2, LOW_PRIORITY: 1 }
          return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0)
        } else {
          return new Date(a.dueDate || "").getTime() - new Date(b.dueDate || "").getTime()
        }
      })
    },
    [sortCriteria]
  )

  const filterTasks = useCallback(
    (tasksToFilter: Task[], status: FilterStatus) => {
      const globalCriteria = globalFilters
      const columnCriteria = columnFilters[status]

      return tasksToFilter.filter((task) => {
        const assignedUserMatch =
          (!globalCriteria.assignedUser || task.assignedUserId === globalCriteria.assignedUser) &&
          (!columnCriteria.assignedUser || task.assignedUserId === columnCriteria.assignedUser)

        const priorityMatch =
          (!Object.values(globalCriteria.priority).some((v) => v) ||
            globalCriteria.priority[task.priority]) &&
          (!Object.values(columnCriteria.priority).some((v) => v) ||
            columnCriteria.priority[task.priority])

        const dueDateMatch =
          (!globalCriteria.dueDateRange ||
            (task.dueDate &&
              (!globalCriteria.dueDateRange.from ||
                new Date(task.dueDate) >= globalCriteria.dueDateRange.from) &&
              (!globalCriteria.dueDateRange.to ||
                new Date(task.dueDate) <= globalCriteria.dueDateRange.to))) &&
          (!columnCriteria.dueDateRange ||
            (task.dueDate &&
              (!columnCriteria.dueDateRange.from ||
                new Date(task.dueDate) >= columnCriteria.dueDateRange.from) &&
              (!columnCriteria.dueDateRange.to ||
                new Date(task.dueDate) <= columnCriteria.dueDateRange.to)))

        const createdDateMatch =
          (!globalCriteria.createdDateRange ||
            (task.createdDate &&
              (!globalCriteria.createdDateRange.from ||
                new Date(task.createdDate) >= globalCriteria.createdDateRange.from) &&
              (!globalCriteria.createdDateRange.to ||
                new Date(task.createdDate) <= globalCriteria.createdDateRange.to))) &&
          (!columnCriteria.createdDateRange ||
            (task.createdDate &&
              (!columnCriteria.createdDateRange.from ||
                new Date(task.createdDate) >= columnCriteria.createdDateRange.from) &&
              (!columnCriteria.createdDateRange.to ||
                new Date(task.createdDate) <= columnCriteria.createdDateRange.to)))

        const resolvedDateMatch =
          (!globalCriteria.resolvedDateRange ||
            (task.resolvedDate &&
              (!globalCriteria.resolvedDateRange.from ||
                new Date(task.resolvedDate) >= globalCriteria.resolvedDateRange.from) &&
              (!globalCriteria.resolvedDateRange.to ||
                new Date(task.resolvedDate) <= globalCriteria.resolvedDateRange.to))) &&
          (!columnCriteria.resolvedDateRange ||
            (task.resolvedDate &&
              (!columnCriteria.resolvedDateRange.from ||
                new Date(task.resolvedDate) >= columnCriteria.resolvedDateRange.from) &&
              (!columnCriteria.resolvedDateRange.to ||
                new Date(task.resolvedDate) <= columnCriteria.resolvedDateRange.to)))

        return (
          assignedUserMatch &&
          priorityMatch &&
          dueDateMatch &&
          createdDateMatch &&
          resolvedDateMatch
        )
      })
    },
    [globalFilters, columnFilters]
  )

  const groupTasks = useCallback(
    (tasksToGroup: Task[]) => {
      console.log("Grouping tasks:", tasksToGroup.length)
      if (grouping === "status") {
        return columns.reduce((acc, column) => {
          acc[column.key] = sortTasks(
            filterTasks(
              tasksToGroup.filter((task) => task.taskStatus === column.key),
              column.key
            )
          )
          console.log(`Tasks in ${column.key}:`, acc[column.key].length)
          return acc
        }, {} as Record<string, Task[]>)
      } else {
        // Implement date-based grouping logic here if needed
        console.warn("Date-based grouping not implemented")
        return {}
      }
    },
    [grouping, sortTasks, filterTasks, columns]
  )

  const groupedTasks = useMemo(() => groupTasks(tasks), [groupTasks, tasks])

  const openTaskDialog = useCallback((task: Task | null) => {
    setDialogState({ isOpen: true, task })
  }, [])

  const handleDialogClose = useCallback(() => {
    setDialogState({ isOpen: false, task: null })
  }, [])

  const handleTaskUpdate = useCallback(
    (updatedTask: Task) => {
      if (!updatedTask.id) {
        const newTask = {
          ...updatedTask,
          createdUserId: userUUID || "",
          assignedUserName: undefined
        }
        createTaskMutation.mutate(newTask, {
          onSuccess: (newTaskResponse: TaskResponse) => {
            if ("data" in newTaskResponse) {
              const createdTask = Array.isArray(newTaskResponse.data)
                ? newTaskResponse.data[0]
                : newTaskResponse.data
              setTasks((prevTasks) => {
                const updatedTasks = [...prevTasks, createdTask as Task]
                if (typeof onTasksUpdate === "function") {
                  onTasksUpdate(updatedTasks)
                }
                return updatedTasks
              })
            }
            handleDialogClose()
          },
          onError: (error) => {
            console.error("Error creating task:", error)
          }
        })
      } else {
        updateTaskMutation.mutate(
          {
            id: updatedTask.id,
            updates: {
              ...updatedTask,
              createdUserId: updatedTask.createdUserId || userUUID || "",
              assignedUserName: undefined
            }
          },
          {
            onSuccess: (updatedTaskResponse: TaskResponse) => {
              if ("data" in updatedTaskResponse && !Array.isArray(updatedTaskResponse.data)) {
                const updatedTask = updatedTaskResponse.data as Task
                setTasks((prevTasks) => {
                  const updatedTasks = prevTasks.map((task) =>
                    task.id === updatedTask.id ? updatedTask : task
                  )
                  if (typeof onTasksUpdate === "function") {
                    onTasksUpdate(updatedTasks)
                  }
                  return updatedTasks
                })
              }
              handleDialogClose()
            },
            onError: (error) => {
              console.error("Error updating task:", error)
            }
          }
        )
      }
    },
    [createTaskMutation, updateTaskMutation, userUUID, handleDialogClose, onTasksUpdate]
  )

  const handleTaskDelete = useCallback(
    async (taskId: string) => {
      try {
        await deleteTaskMutation.mutateAsync(taskId)
        setTasks((prevTasks) => {
          const updatedTasks = prevTasks.filter((task) => task.id !== taskId)
          if (typeof onTasksUpdate === "function") {
            onTasksUpdate(updatedTasks)
          }
          return updatedTasks
        })
        handleDialogClose()
      } catch (error) {
        console.error("Error deleting task:", error)
      }
    },
    [deleteTaskMutation, handleDialogClose, onTasksUpdate]
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    setActiveId(active.id as string)
    console.log("Drag started:", active.id)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) {
      setActiveId(null)
      return
    }

    const activeId = active.id as string
    const overId = over.id as string

    console.log("Drag ended:", { activeId, overId })

    const activeContainer = findTaskContainer(activeId, groupedTasks)
    const overContainer = findTaskContainer(overId, groupedTasks)

    if (!activeContainer || !overContainer) {
      console.log("Container not found for active or over item")
      setActiveId(null)
      return
    }

    console.log("Containers:", { activeContainer, overContainer })

    if (activeContainer !== overContainer) {
      setTasks((prevTasks) => {
        const activeTask = prevTasks.find((task) => task.id === activeId)
        if (!activeTask) {
          console.log("Active task not found")
          return prevTasks
        }

        console.log("Updating task status:", { taskId: activeId, newStatus: overContainer })

        const updatedTasks = prevTasks.map((task) =>
          task.id === activeId ? { ...task, taskStatus: overContainer as Task["taskStatus"] } : task
        )

        // Update the backend
        updateTaskMutation.mutate(
          {
            id: activeId,
            updates: {
              ...activeTask,
              taskStatus: overContainer as Task["taskStatus"],
              dueDate: activeTask.dueDate ? formatDate(activeTask.dueDate) : undefined,
              resolvedDate: activeTask.resolvedDate
                ? formatDate(activeTask.resolvedDate)
                : undefined,
              createdUserId: activeTask.createdUserId || userUUID || "",
              assignedUserName: undefined
            }
          },
          {
            onSuccess: () => {
              console.log("Task status updated successfully")
            },
            onError: (error) => {
              console.error("Error updating task status:", error)
              // Revert the change in case of an error
              setTasks(prevTasks)
            }
          }
        )

        if (typeof onTasksUpdate === "function") {
          onTasksUpdate(updatedTasks)
        }

        return updatedTasks
      })
    } else {
      // Reordering within the same container
      const containerTasks = groupedTasks[activeContainer]
      const oldIndex = containerTasks.findIndex((task) => task.id === activeId)
      const newIndex = containerTasks.findIndex((task) => task.id === overId)

      console.log("Reordering within container:", { oldIndex, newIndex })

      if (oldIndex !== newIndex) {
        const newContainerTasks = reorderTasks(containerTasks, oldIndex, newIndex)
        const newTasks = tasks.map(
          (task) => newContainerTasks.find((t) => t.id === task.id) || task
        )
        setTasks(newTasks)
        if (typeof onTasksUpdate === "function") {
          onTasksUpdate(newTasks)
        }
      }
    }

    setActiveId(null)
  }

  const handleFilterChange = (key: keyof FilterCriteria, value: any, status?: FilterStatus) => {
    if (status) {
      setColumnFilters((prev) => ({
        ...prev,
        [status]: { ...prev[status], [key]: value }
      }))
    } else {
      setGlobalFilters((prev) => ({ ...prev, [key]: value }))
      setColumnFilters((prev) => {
        const updatedFilters: Record<FilterStatus, ColumnFilterCriteria> = {} as Record<
          FilterStatus,
          ColumnFilterCriteria
        >
        for (const [key, value] of Object.entries(prev)) {
          updatedFilters[key as FilterStatus] = { ...value, [key]: value }
        }
        return updatedFilters
      })
    }
  }

  const clearFilters = (status?: FilterStatus) => {
    const emptyFilters: FilterCriteria = {
      assignedUser: "",
      priority: { LOW_PRIORITY: false, MEDIUM_PRIORITY: false, HIGH_PRIORITY: false },
      dueDateRange: undefined,
      createdDateRange: undefined,
      resolvedDateRange: undefined
    }

    if (status) {
      setColumnFilters((prev) => ({
        ...prev,
        [status]: { ...emptyFilters, status }
      }))
    } else {
      setGlobalFilters(emptyFilters)
      setColumnFilters((prev) => {
        const updatedFilters: Record<FilterStatus, ColumnFilterCriteria> = {} as Record<
          FilterStatus,
          ColumnFilterCriteria
        >
        for (const key of Object.keys(prev)) {
          updatedFilters[key as FilterStatus] = { ...emptyFilters, status: key as FilterStatus }
        }
        return updatedFilters
      })
    }
  }

  return (
    <div className="flex flex-col space-y-4 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Task Board</h1>
        <div className="flex space-x-2">
          <Select
            value={sortCriteria}
            onValueChange={(value) => setSortCriteria(value as "priority" | "dueDate")}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="priority">Sort by Priority</SelectItem>
              <SelectItem value="dueDate">Sort by Due Date</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={grouping}
            onValueChange={(value) => setGrouping(value as "status" | "dueDate")}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Group by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="status">Group by Status</SelectItem>
              <SelectItem value="dueDate">Group by Due Date</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="secondary" onClick={() => openTaskDialog(null)}>
            Create Task
          </Button>
        </div>
      </div>

      <div className="flex flex-col space-y-4 mb-4">
        <Button
          variant="outline"
          onClick={() => setShowGlobalFilters(!showGlobalFilters)}
          className="self-start"
        >
          {showGlobalFilters ? "Hide Global Filters" : "Show Global Filters"}
        </Button>
        {showGlobalFilters && (
          <>
            <h2 className="text-xl font-semibold">Global Filters</h2>
            <div className="flex space-x-4 items-center">
              <Input
                placeholder="Filter by Assigned User"
                value={globalFilters.assignedUser}
                onChange={(e) => handleFilterChange("assignedUser", e.target.value)}
                className="w-48"
              />
              <div className="flex items-center space-x-2">
                <Label>Priority:</Label>
                {Object.keys(globalFilters.priority).map((priority) => (
                  <div key={priority} className="flex items-center">
                    <Checkbox
                      id={`global-${priority}`}
                      checked={
                        globalFilters.priority[priority as keyof typeof globalFilters.priority]
                      }
                      onCheckedChange={(checked) =>
                        handleFilterChange("priority", {
                          ...globalFilters.priority,
                          [priority]: checked
                        })
                      }
                    />
                    <Label htmlFor={`global-${priority}`} className="ml-2">
                      {priority.replace("_", " ")}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex space-x-4">
              <div>
                <Label>Due Date Range</Label>
                <DatePickerWithRange
                  value={globalFilters.dueDateRange}
                  onChange={(range) => handleFilterChange("dueDateRange", range)}
                />
              </div>
              <div>
                <Label>Created Date Range</Label>
                <DatePickerWithRange
                  value={globalFilters.createdDateRange}
                  onChange={(range) => handleFilterChange("createdDateRange", range)}
                />
              </div>
              <div>
                <Label>Resolved Date Range</Label>
                <DatePickerWithRange
                  value={globalFilters.resolvedDateRange}
                  onChange={(range) => handleFilterChange("resolvedDateRange", range)}
                />
              </div>
            </div>
            <Button onClick={() => clearFilters()} variant="outline">
              Clear Global Filters
            </Button>
          </>
        )}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="grid grid-cols-4 gap-4">
            {columns.map(({ key, title }) => (
              <TaskColumn
                key={key}
                title={title}
                tasks={groupedTasks[key] || []}
                columnKey={key}
                onTaskClick={openTaskDialog}
                columnFilters={columnFilters[key]}
                handleFilterChange={handleFilterChange}
                clearFilters={clearFilters}
              />
            ))}
          </div>
        </ScrollArea>
        {createPortal(
          <DragOverlay>
            {activeId ? (
              <SortableTask
                id={activeId}
                task={tasks.find((t) => t.id === activeId)!}
                onTaskClick={() => {}}
              />
            ) : null}
          </DragOverlay>,
          document.body
        )}
      </DndContext>

      <TaskDialog
        key={dialogState.task ? dialogState.task.id : "new-task"}
        task={dialogState.task}
        isOpen={dialogState.isOpen}
        onClose={handleDialogClose}
        onUpdate={handleTaskUpdate}
        onDelete={handleTaskDelete}
        projectId={projectId}
      />
    </div>
  )
}

export default TaskBoardContent
