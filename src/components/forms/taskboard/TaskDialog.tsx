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
  const [isEditMode, setIsEditMode] = useState(!task?.id)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [localTask, setLocalTask] = useState<Task>(
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

  useEffect(() => {
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
  }, [task, projectId])

  const handleEditToggle = () => setIsEditMode((prev) => !prev)

  const handleUpdate = (updatedTask: Task) => {
    console.log("Updating task:", updatedTask)
    onUpdate(updatedTask)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {isEditMode
              ? task?.id
                ? "Edit Task"
                : "Create Task"
              : `Task Details: ${task?.name || "New Task"}`}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh]">
          <div className="space-y-4 p-4">
            {isEditMode ? (
              <TaskForm
                formData={localTask}
                onSave={handleUpdate}
                isPending={false}
                onCancel={() => {
                  if (!task?.id) {
                    onClose()
                  } else {
                    setIsEditMode(false)
                  }
                }}
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>{task?.name || "New Task"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    <strong>Description:</strong> {task?.description || "No description"}
                  </p>
                  <p>
                    <strong>Status:</strong> {task?.taskStatus || "Not set"}
                  </p>
                  <p>
                    <strong>Priority:</strong> {task?.priority || "Not set"}
                  </p>
                  <p>
                    <strong>Assigned To:</strong> {task?.assignedUserId || "Not assigned"}
                  </p>
                  <p>
                    <strong>Due Date:</strong> {task?.dueDate || "Not set"}
                  </p>
                  {task?.attachments?.length ? (
                    <div>
                      <strong>Attachments:</strong>
                      <ul>
                        {task.attachments.map((attachment, index) => (
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
            )}

            {!isEditMode && (
              <div className="flex justify-end space-x-2">
                <Button variant="secondary" onClick={handleEditToggle}>
                  Edit
                </Button>
                {task?.id && (
                  <Button variant="destructive" onClick={() => setShowDeleteConfirmation(true)}>
                    Delete
                  </Button>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
      {showDeleteConfirmation && task?.id && (
        <Dialog open onOpenChange={() => setShowDeleteConfirmation(false)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Task</DialogTitle>
            </DialogHeader>
            <p>Are you sure you want to delete the task "{task.name}"?</p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowDeleteConfirmation(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  onDelete(task.id!)
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
