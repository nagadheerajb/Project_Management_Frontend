import React, { useState, useCallback, useEffect } from "react"
import {
  DndContext,
  DragOverlay,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  DragStartEvent,
  DragEndEvent
} from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import SortableTask from "./SortableTask"
import TaskDialog from "./TaskDialog"
import { Task } from "@/types/interfaces"
import { useTaskMutations } from "@/hooks/useTaskMutations"
import { Button } from "@/components/ui/button"
import { useUser } from "@/context/user-context"

interface TaskBoardContentProps {
  tasks: Task[]
  projectId: string
}

const TaskBoardContent: React.FC<TaskBoardContentProps> = ({ tasks, projectId }) => {
  const columns = [
    { key: "TODO", title: "TODO" },
    { key: "IN_DEVELOPMENT", title: "IN DEVELOPMENT" },
    { key: "COMPLETE", title: "COMPLETED" },
    { key: "RELEASED", title: "RELEASED" }
  ]

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
            onSuccess: () => {
              console.log("Task created successfully")
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
          { id: updatedTask.id, updates: updatedTask },
          {
            onSuccess: () => {
              console.log("Task updated successfully")
              handleDialogClose()
            },
            onError: (error) => {
              console.error("Error updating task:", error)
            }
          }
        )
      }
    },
    [createTaskMutation, updateTaskMutation, userUUID, handleDialogClose]
  )

  const handleTaskDelete = useCallback(
    (taskId: string) => {
      console.log("TaskBoardContent: Handling task delete:", taskId)
      deleteTaskMutation.mutate(taskId, {
        onSuccess: () => {
          console.log("Task deleted successfully")
          handleDialogClose()
        },
        onError: (error) => {
          console.error("Error deleting task:", error)
        }
      })
    },
    [deleteTaskMutation, handleDialogClose]
  )

  const handleDragStart = (event: DragStartEvent) => {
    console.log("Drag started:", event)
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    console.log("Drag ended:", event)
    setActiveId(null)
    // Implement drag end logic here if needed
  }

  useEffect(() => {
    console.log("TaskBoardContent: Dialog state changed:", dialogState)
  }, [dialogState])

  console.log("TaskBoardContent render:", dialogState)

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
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-4 gap-4">
          {columns.map(({ key, title }) => (
            <div key={key} className="p-4 bg-gray-100 rounded-md shadow min-h-[200px]">
              <h3 className="text-lg font-bold mb-2">{title}</h3>
              <SortableContext
                items={groupedTasks[key]?.map((task) => task.id || "").filter(Boolean) as string[]}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {groupedTasks[key]?.length ? (
                    groupedTasks[key].map((task) => (
                      <SortableTask
                        key={task.id}
                        id={task.id || ""}
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
              task={tasks.find((t) => t.id === activeId) || tasks[0]}
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
