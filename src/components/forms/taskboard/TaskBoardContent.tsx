import React, { useState, useCallback, useEffect } from "react"
import {
  DndContext,
  DragOverlay,
  closestCorners,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent
} from "@dnd-kit/core"
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import SortableTask from "./SortableTask"
import TaskDialog from "./TaskDialog"
import { Task, TaskResponse } from "@/types/interfaces"
import { useTaskMutations } from "@/hooks/useTaskMutations"
import { Button } from "@/components/ui/button"
import { useUser } from "@/context/user-context"
import { formatDate } from "@/utils/format-date"

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
  const columns = [
    { key: "TODO", title: "TODO" },
    { key: "IN_DEVELOPMENT", title: "IN DEVELOPMENT" },
    { key: "COMPLETE", title: "COMPLETED" },
    { key: "RELEASED", title: "RELEASED" }
  ]

  const [tasks, setTasks] = useState<Task[]>(initialTasks)

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
  const { userUUID } = useUser()

  const groupedTasks = columns.reduce((acc, column) => {
    acc[column.key] = tasks.filter((task) => task.taskStatus === column.key)
    return acc
  }, {} as Record<string, Task[]>)

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
        createTaskMutation.mutate(
          { ...updatedTask, createdUserId: userUUID || "" },
          {
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
          }
        )
      } else {
        console.log("Updating existing task")
        updateTaskMutation.mutate(
          {
            id: updatedTask.id,
            updates: {
              name: updatedTask.name,
              description: updatedTask.description,
              taskStatus: updatedTask.taskStatus,
              priority: updatedTask.priority,
              assignedUserId: updatedTask.assignedUserId,
              projectId: updatedTask.projectId,
              createdUserId: updatedTask.createdUserId,
              dueDate: updatedTask.dueDate,
              resolvedDate: updatedTask.resolvedDate,
              attachments: updatedTask.attachments || []
            }
          },
          {
            onSuccess: (updatedTaskResponse: TaskResponse) => {
              console.log("Task updated successfully")
              if ("data" in updatedTaskResponse && !Array.isArray(updatedTaskResponse.data)) {
                const updatedTask = updatedTaskResponse.data as Task
                const updatedTasks = tasks.map((task) =>
                  task.id === updatedTask.id ? updatedTask : task
                )
                setTasks(updatedTasks)
                if (typeof onTasksUpdate === "function") {
                  onTasksUpdate(updatedTasks)
                }
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
        resolvedDate: taskToUpdate.resolvedDate ? formatDate(taskToUpdate.resolvedDate) : undefined
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
            const finalUpdatedTasks = prevTasks.map((task) =>
              task.id === taskId ? serverUpdatedTask : task
            )
            console.log("Final updated tasks:", finalUpdatedTasks)
            if (typeof onTasksUpdate === "function") {
              onTasksUpdate(finalUpdatedTasks)
            }
            return finalUpdatedTasks
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
    [tasks, updateTaskMutation, onTasksUpdate]
  )

  const findContainer = (id: string) => {
    if (id in groupedTasks) {
      return id
    }
    return Object.keys(groupedTasks).find((key) => groupedTasks[key].some((task) => task.id === id))
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    const overId = over?.id

    if (!overId) return

    const activeContainer = findContainer(active.id as string)
    const overContainer = findContainer(overId as string)

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return
    }

    const activeTask = tasks.find((task) => task.id === active.id)
    if (activeTask) {
      updateTaskStatus(activeTask.id!, overContainer as Task["taskStatus"])
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    console.log("Drag ended:", event)
    const { active, over } = event

    if (!over) {
      console.log("No over container found")
      return
    }

    const activeContainer = findContainer(active.id as string)
    const overContainer = findContainer(over.id as string)

    console.log("Active container:", activeContainer)
    console.log("Over container:", overContainer)

    if (activeContainer !== overContainer) {
      const activeTask = tasks.find((task) => task.id === active.id)
      if (activeTask) {
        console.log("Updating task status after drag:", activeTask.id, overContainer)
        updateTaskStatus(activeTask.id!, overContainer as Task["taskStatus"])
      } else {
        console.error("Active task not found:", active.id)
      }
    } else {
      console.log("Task dropped in the same container, no update needed")
    }

    setActiveId(null)
  }

  useEffect(() => {
    console.log("TaskBoardContent: Tasks updated:", tasks)
    if (typeof onTasksUpdate === "function") {
      onTasksUpdate(tasks)
    }
  }, [tasks, onTasksUpdate])

  useEffect(() => {
    console.log("TaskBoardContent: Dialog state changed:", dialogState)
  }, [dialogState])

  console.log("TaskBoardContent render:", { dialogState, tasksCount: tasks.length })

  return (
    <div className="flex flex-col space-y-4 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Task Board</h1>
        <Button variant="secondary" onClick={() => openTaskDialog(null)}>
          Create Task
        </Button>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-4 gap-4">
          {columns.map(({ key, title }) => (
            <div key={key} className="p-4 bg-gray-100 rounded-md shadow min-h-[200px]">
              <h3 className="text-lg font-bold mb-2">{title}</h3>
              <SortableContext
                items={
                  groupedTasks[key]
                    ?.map((task) => task.id!)
                    .filter((id): id is string => id !== undefined) || []
                }
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {groupedTasks[key]?.length ? (
                    groupedTasks[key].map((task) => (
                      <SortableTask
                        key={task.id}
                        id={task.id!}
                        task={task}
                        onTaskClick={openTaskDialog}
                      />
                    ))
                  ) : (
                    <p className="text-sm text-gray-400">No tasks</p>
                  )}
                </div>
              </SortableContext>
            </div>
          ))}
        </div>
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
