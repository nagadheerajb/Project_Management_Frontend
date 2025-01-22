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
  type DragEndEvent,
  type DragOverEvent
} from "@dnd-kit/core"
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { AnimatePresence, motion } from "framer-motion"
import type { DateRange } from "react-day-picker"
import SortableTask from "./SortableTask"
import TaskDialog from "./TaskDialog"
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Filter } from "lucide-react"

type GroupedTasks = Record<string, Task[]>

interface TaskBoardContentProps {
  tasks: Task[]
  projectId: string
  onTasksUpdate?: (updatedTasks: Task[]) => void
}

interface FilterCriteria {
  assignedUser: string
  priority: Record<string, boolean>
  dueDateRange: DateRange | undefined
  createdDateRange: DateRange | undefined
  resolvedDateRange: DateRange | undefined
}

interface ColumnFilterCriteria extends FilterCriteria {
  status: FilterStatus
}

type GlobalFilterCriteria = Omit<FilterCriteria, "status">

type FilterStatus = "TODO" | "IN_DEVELOPMENT" | "COMPLETE" | "RELEASED"

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
  const [activeId, setActiveId] = useState<string | null>(null)
  const [dialogState, setDialogState] = useState<{ isOpen: boolean; task: Task | null }>({
    isOpen: false,
    task: null
  })

  const { createTaskMutation, updateTaskMutation, deleteTaskMutation } = useTaskMutations()
  const { user, userUUID } = useUser()

  const [sortCriteria, setSortCriteria] = useState<"priority" | "dueDate">("priority")
  const [grouping, setGrouping] = useState<"status" | "dueDate">("status")

  const sortTasks = useCallback(
    (tasks: Task[]) => {
      return tasks.sort((a, b) => {
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
    (tasks: Task[], status: FilterStatus) => {
      const globalCriteria = globalFilters
      const columnCriteria = columnFilters[status]

      return tasks.filter((task) => {
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
    (tasks: Task[]): GroupedTasks => {
      if (grouping === "status") {
        return columns.reduce((acc, column) => {
          acc[column.key] = sortTasks(
            filterTasks(
              tasks.filter((task) => task.taskStatus === column.key),
              column.key
            )
          )
          return acc
        }, {} as Record<string, Task[]>)
      } else {
        const now = new Date()
        const overdue = sortTasks(
          filterTasks(
            tasks.filter((task) => task.dueDate && new Date(task.dueDate) < now),
            "OVERDUE"
          )
        )
        const dueSoon = sortTasks(
          filterTasks(
            tasks.filter(
              (task) =>
                task.dueDate &&
                new Date(task.dueDate) >= now &&
                new Date(task.dueDate) <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
            ),
            "DUE_SOON"
          )
        )
        const noDueDate = sortTasks(
          filterTasks(
            tasks.filter((task) => !task.dueDate),
            "NO_DUE_DATE"
          )
        )
        const upcoming = sortTasks(
          filterTasks(
            tasks.filter(
              (task) =>
                task.dueDate &&
                new Date(task.dueDate) > new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
            ),
            "UPCOMING"
          )
        )

        return {
          OVERDUE: overdue,
          DUE_SOON: dueSoon,
          UPCOMING: upcoming,
          NO_DUE_DATE: noDueDate
        }
      }
    },
    [grouping, sortTasks, filterTasks]
  )

  const groupedTasks = useMemo(() => groupTasks(tasks), [groupTasks, tasks])

  const openTaskDialog = useCallback((task: Task | null) => {
    console.log("TaskBoardContent: Opening task dialog:", task)
    setDialogState({ isOpen: true, task })
  }, [])

  const handleDialogClose = useCallback(() => {
    console.log("TaskBoardContent: Closing task dialog")
    setDialogState({ isOpen: false, task: null })
  }, [])

  const handleTaskUpdate = useCallback(
    (updatedTask: Task) => {
      console.log("TaskBoardContent: Handling task update:", updatedTask)
      if (!updatedTask.id) {
        console.log("Creating new task")
        const newTask = {
          ...updatedTask,
          createdUserId: userUUID || "",
          assignedUserName: undefined // Remove this field
        }
        createTaskMutation.mutate(newTask, {
          onSuccess: (newTaskResponse: TaskResponse) => {
            console.log("Task created successfully")
            if ("data" in newTaskResponse && Array.isArray(newTaskResponse.data)) {
              const newTask = newTaskResponse.data[0] as Task
              const updatedTasks = [...tasks, newTask]
              setTasks(updatedTasks)
              if (typeof onTasksUpdate === "function") {
                onTasksUpdate(updatedTasks)
              }
            } else if ("data" in newTaskResponse && !Array.isArray(newTaskResponse.data)) {
              const newTask = newTaskResponse.data as Task
              const updatedTasks = [...tasks, newTask]
              setTasks(updatedTasks)
              if (typeof onTasksUpdate === "function") {
                onTasksUpdate(updatedTasks)
              }
            }
            handleDialogClose()
          },
          onError: (error) => {
            console.error("Error creating task:", error)
          }
        })
      } else {
        console.log("Updating existing task")
        updateTaskMutation.mutate(
          {
            id: updatedTask.id,
            updates: {
              ...updatedTask,
              createdUserId: updatedTask.createdUserId || userUUID || "",
              assignedUserName: undefined // Remove this field
            }
          },
          {
            onSuccess: (updatedTaskResponse: TaskResponse) => {
              console.log("Task updated successfully")
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
    [createTaskMutation, updateTaskMutation, userUUID, handleDialogClose, tasks, onTasksUpdate]
  )

  const handleTaskDelete = useCallback(
    (taskId: string) => {
      console.log("TaskBoardContent: Handling task delete:", taskId)
      deleteTaskMutation.mutate(taskId, {
        onSuccess: () => {
          console.log("Task deleted successfully")
          const updatedTasks = tasks.filter((task) => task.id !== taskId)
          setTasks(updatedTasks)
          if (typeof onTasksUpdate === "function") {
            onTasksUpdate(updatedTasks)
          }
          handleDialogClose()
        },
        onError: (error) => {
          console.error("Error deleting task:", error)
        }
      })
    },
    [deleteTaskMutation, handleDialogClose, tasks, onTasksUpdate]
  )

  const handleDragStart = (event: DragStartEvent) => {
    console.log("Drag started:", event)
    setActiveId(event.active.id as string)
  }

  const updateTaskStatus = useCallback(
    async (taskId: string, newStatus: Task["taskStatus"]) => {
      console.log("Updating task status:", taskId, newStatus)

      // Find the task to update
      const taskToUpdate = tasks.find((task) => task.id === taskId)
      if (!taskToUpdate) {
        console.error("Task not found:", taskId)
        return
      }

      // Create a new task object with updated status
      const updatedTask: Task = {
        ...taskToUpdate,
        taskStatus: newStatus,
        dueDate: taskToUpdate.dueDate ? formatDate(taskToUpdate.dueDate) : undefined,
        resolvedDate: taskToUpdate.resolvedDate ? formatDate(taskToUpdate.resolvedDate) : undefined,
        createdUserId: taskToUpdate.createdUserId || userUUID || "",
        assignedUserName: undefined // Remove this field
      }

      // Log the payload we're about to send to the backend
      console.log("Payload for backend update:", updatedTask)

      // Update local state immediately
      setTasks((prevTasks) => {
        const updatedTasks = prevTasks.map((task) => (task.id === taskId ? updatedTask : task))
        console.log("Updated tasks locally:", updatedTasks)
        if (typeof onTasksUpdate === "function") {
          onTasksUpdate(updatedTasks)
        }
        return updatedTasks
      })

      try {
        const updatedTaskResponse = await updateTaskMutation.mutateAsync({
          id: taskId,
          updates: {
            taskStatus: newStatus,
            name: updatedTask.name,
            description: updatedTask.description,
            priority: updatedTask.priority || "MEDIUM_PRIORITY",
            assignedUserId: updatedTask.assignedUserId,
            projectId: updatedTask.projectId,
            createdUserId: updatedTask.createdUserId,
            dueDate: updatedTask.dueDate,
            resolvedDate: updatedTask.resolvedDate,
            attachments: updatedTask.attachments || []
          }
        })
        console.log("Backend response:", updatedTaskResponse)
        if ("data" in updatedTaskResponse && !Array.isArray(updatedTaskResponse.data)) {
          const serverUpdatedTask = updatedTaskResponse.data as Task
          console.log("Task status updated successfully:", serverUpdatedTask)

          // Update local state with server response
          setTasks((prevTasks) => {
            const updatedTasks = prevTasks.map((task) =>
              task.id === taskId ? serverUpdatedTask : task
            )
            console.log("Final updated tasks:", updatedTasks)
            if (typeof onTasksUpdate === "function") {
              onTasksUpdate(updatedTasks)
            }
            return updatedTasks
          })
        }
      } catch (error) {
        console.error("Error updating task status:", error)
        // Revert the change in the UI if the backend update fails
        setTasks((prevTasks) => {
          const originalTasks = prevTasks.map((task) =>
            task.id === taskId ? { ...task, taskStatus: taskToUpdate.taskStatus } : task
          )
          console.log("Reverted tasks due to error:", originalTasks)
          if (typeof onTasksUpdate === "function") {
            onTasksUpdate(originalTasks)
          }
          return originalTasks
        })
      }
    },
    [tasks, updateTaskMutation, user, onTasksUpdate]
  )

  const findContainer = (id: string): string | undefined => {
    if (id in groupedTasks) {
      return id
    }
    return Object.keys(groupedTasks).find((key) => groupedTasks[key].some((task) => task.id === id))
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeContainer = findContainer(active.id as string)
    const overContainer = findContainer(over.id as string)

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return
    }

    const activeTask = tasks.find((task) => task.id === active.id)
    if (activeTask) {
      updateTaskStatus(activeTask.id!, overContainer as Task["taskStatus"])
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) {
      setActiveId(null)
      return
    }

    const activeContainer = findContainer(active.id as string)
    const overContainer = findContainer(over.id as string)

    if (activeContainer !== overContainer) {
      const activeTask = tasks.find((task) => task.id === active.id)
      if (activeTask) {
        updateTaskStatus(activeTask.id!, overContainer as Task["taskStatus"])
      }
    } else if (activeContainer && activeContainer in groupedTasks) {
      const oldIndex = groupedTasks[activeContainer].findIndex(
        (task: Task) => task.id === active.id
      )
      const newIndex = groupedTasks[activeContainer].findIndex((task: Task) => task.id === over.id)

      const newTasks = arrayMove(groupedTasks[activeContainer], oldIndex, newIndex)
      setTasks((prevTasks) => {
        const updatedTasks = prevTasks.map((task) => {
          const newTask = newTasks.find((t) => t.id === task.id)
          return newTask || task
        })
        if (typeof onTasksUpdate === "function") {
          onTasksUpdate(updatedTasks)
        }
        return updatedTasks
      })
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
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="grid grid-cols-4 gap-4">
            {columns.map(({ key, title }) => (
              <div
                key={key}
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
                          <Label htmlFor={`assigned-user-${key}`}>Assigned User</Label>
                          <Input
                            id={`assigned-user-${key}`}
                            value={columnFilters[key].assignedUser}
                            onChange={(e) =>
                              handleFilterChange("assignedUser", e.target.value, key)
                            }
                            placeholder="Filter by Assigned User"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Priority</Label>
                          {(
                            Object.keys(columnFilters[key].priority) as Array<
                              keyof (typeof columnFilters)[typeof key]["priority"]
                            >
                          ).map((priority) => (
                            <div key={priority} className="flex items-center">
                              <Checkbox
                                id={`${key}-${priority}`}
                                checked={columnFilters[key].priority[priority]}
                                onCheckedChange={(checked: boolean) =>
                                  handleFilterChange(
                                    "priority",
                                    {
                                      ...columnFilters[key].priority,
                                      [priority]: checked
                                    },
                                    key
                                  )
                                }
                              />
                              <Label htmlFor={`${key}-${priority}`} className="ml-2">
                                {priority.replace("_", " ")}
                              </Label>
                            </div>
                          ))}
                        </div>
                        <div className="space-y-2">
                          <Label>Due Date Range</Label>
                          <DatePickerWithRange
                            value={columnFilters[key].dueDateRange}
                            onChange={(range) => handleFilterChange("dueDateRange", range, key)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Created Date Range</Label>
                          <DatePickerWithRange
                            value={columnFilters[key].createdDateRange}
                            onChange={(range) => handleFilterChange("createdDateRange", range, key)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Resolved Date Range</Label>
                          <DatePickerWithRange
                            value={columnFilters[key].resolvedDateRange}
                            onChange={(range) =>
                              handleFilterChange("resolvedDateRange", range, key)
                            }
                          />
                        </div>
                        <Button onClick={() => clearFilters(key)} variant="outline" size="sm">
                          Clear Column Filters
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <SortableContext
                  items={groupedTasks[key].map((task) => task.id!)}
                  strategy={verticalListSortingStrategy}
                >
                  <AnimatePresence>
                    {groupedTasks[key].map((task) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                      >
                        <SortableTask id={task.id!} task={task} onTaskClick={openTaskDialog} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </SortableContext>
              </div>
            ))}
          </div>
        </ScrollArea>
        <DragOverlay>
          {activeId ? (
            <SortableTask
              id={activeId}
              task={tasks.find((t) => t.id === activeId)!}
              onTaskClick={() => {}}
            />
          ) : null}
        </DragOverlay>
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
