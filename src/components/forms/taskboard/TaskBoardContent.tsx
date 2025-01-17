import React, { useState } from "react"
import {
  DndContext,
  DragOverlay,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor
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

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor))
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogTask, setDialogTask] = useState<Task | null>(null)

  const { createTaskMutation, updateTaskMutation, deleteTaskMutation } = useTaskMutations()
  const { userUUID } = useUser()

  const groupedTasks = columns.reduce((acc, column) => {
    acc[column.key] = tasks.filter((task) => task.taskStatus === column.key)
    return acc
  }, {} as Record<string, Task[]>)

  const openTaskDialog = (task: Task | null) => {
    console.log("Opening task dialog:", task)
    setDialogTask(task)
    setIsDialogOpen(true)
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setDialogTask(null)
  }

  const handleTaskUpdate = (updatedTask: Task) => {
    console.log("Handling task update:", updatedTask)
    if (!updatedTask.id) {
      console.log("Creating new task")
      createTaskMutation.mutate(
        { ...updatedTask, createdUserId: userUUID || "" },
        {
          onSuccess: () => {
            console.log("Task created successfully")
            setIsDialogOpen(false)
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
            setIsDialogOpen(false)
          },
          onError: (error) => {
            console.error("Error updating task:", error)
          }
        }
      )
    }
  }

  const handleTaskDelete = (taskId: string) => {
    console.log("Handling task delete:", taskId)
    deleteTaskMutation.mutate(taskId, {
      onSuccess: () => {
        console.log("Task deleted successfully")
        setIsDialogOpen(false)
      },
      onError: (error) => {
        console.error("Error deleting task:", error)
      }
    })
  }

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
        onDragStart={(event) => setActiveId(event.active.id as string)}
        onDragEnd={() => setActiveId(null)}
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
                    groupedTasks[key].map((task) =>
                      task.id ? (
                        <div key={task.id} onClick={() => openTaskDialog(task)}>
                          <SortableTask id={task.id} task={task} />
                        </div>
                      ) : null
                    )
                  ) : (
                    <p className="text-sm text-gray-400">No tasks</p>
                  )}
                </div>
              </SortableContext>
            </div>
          ))}
        </div>
        <DragOverlay>
          {activeId
            ? (() => {
                const activeTask = tasks.find((t) => t.id === activeId)
                return activeTask && activeTask.id ? (
                  <SortableTask id={activeTask.id} task={activeTask} />
                ) : null
              })()
            : null}
        </DragOverlay>
      </DndContext>

      {isDialogOpen && (
        <TaskDialog
          task={dialogTask}
          isOpen={isDialogOpen}
          onClose={handleDialogClose}
          onUpdate={handleTaskUpdate}
          onDelete={handleTaskDelete}
          projectId={projectId}
        />
      )}
    </div>
  )
}

export default TaskBoardContent
