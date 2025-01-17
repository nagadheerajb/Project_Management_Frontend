import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import TaskForm from "./TaskForm"
import { Task } from "@/types/interfaces"

interface TaskDialogProps {
  task: Task | null
  isOpen: boolean
  onClose: () => void
  onUpdate: (updatedTask: Task) => void
  onDelete: (taskId: string) => void
  projectId: string
}

const TaskDialog: React.FC<TaskDialogProps> = ({
  task,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
  projectId
}) => {
  console.log("TaskDialog render:", { isOpen, task })
  const [isEditMode, setIsEditMode] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [localTask, setLocalTask] = useState<Task | null>(null)

  useEffect(() => {
    console.log("TaskDialog useEffect:", { isOpen, task })
    if (isOpen) {
      setLocalTask(
        task || {
          name: "",
          description: "",
          taskStatus: "TODO",
          projectId,
          createdUserId: "",
          assignedUserId: "",
          priority: "MEDIUM_PRIORITY",
          attachments: [],
          dueDate: undefined,
          resolvedDate: undefined
        }
      )
      setIsEditMode(!task?.id)
    } else {
      setLocalTask(null)
      setIsEditMode(false)
    }
  }, [isOpen, task, projectId])

  const handleEditToggle = () => setIsEditMode((prev) => !prev)

  const handleUpdate = (updatedTask: Task) => {
    console.log("TaskDialog: Updating task:", updatedTask)
    onUpdate(updatedTask)
    setIsEditMode(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {isEditMode
              ? localTask?.id
                ? "Edit Task"
                : "Create Task"
              : `Task Details: ${localTask?.name || "New Task"}`}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh]">
          <div className="space-y-4 p-4">
            {isEditMode && localTask ? (
              <TaskForm
                formData={localTask}
                onSave={handleUpdate}
                isPending={false}
                onCancel={() => {
                  if (!localTask.id) {
                    onClose()
                  } else {
                    setIsEditMode(false)
                  }
                }}
              />
            ) : localTask ? (
              <Card>
                <CardHeader>
                  <CardTitle>{localTask.name || "New Task"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    <strong>Description:</strong> {localTask.description || "No description"}
                  </p>
                  <p>
                    <strong>Status:</strong> {localTask.taskStatus || "Not set"}
                  </p>
                  <p>
                    <strong>Priority:</strong> {localTask.priority || "Not set"}
                  </p>
                  <p>
                    <strong>Assigned To:</strong> {localTask.assignedUserId || "Not assigned"}
                  </p>
                  <p>
                    <strong>Due Date:</strong> {localTask.dueDate || "Not set"}
                  </p>
                  {localTask.attachments?.length ? (
                    <div>
                      <strong>Attachments:</strong>
                      <ul>
                        {localTask.attachments.map((attachment, index) => (
                          <li key={index}>
                            <a href={attachment} target="_blank" rel="noopener noreferrer">
                              {attachment}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p>No attachments</p>
                  )}
                </CardContent>
              </Card>
            ) : null}

            {!isEditMode && localTask && (
              <div className="flex justify-end space-x-2">
                <Button variant="secondary" onClick={handleEditToggle}>
                  Edit
                </Button>
                {localTask.id && (
                  <Button variant="destructive" onClick={() => setShowDeleteConfirmation(true)}>
                    Delete
                  </Button>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
      {showDeleteConfirmation && localTask?.id && (
        <Dialog open onOpenChange={() => setShowDeleteConfirmation(false)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Task</DialogTitle>
            </DialogHeader>
            <p>Are you sure you want to delete the task "{localTask.name}"?</p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowDeleteConfirmation(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  onDelete(localTask.id!)
                  setShowDeleteConfirmation(false)
                  onClose()
                }}
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  )
}

export default TaskDialog
