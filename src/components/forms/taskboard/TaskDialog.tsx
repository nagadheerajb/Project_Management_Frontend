import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import type { Task } from "@/types/interfaces"
import { formatDate } from "@/utils/format-date"
import Comments from "@/components/forms/taskboard/Comments"
import { Calendar, Clock, Link, User, AlertCircle, X } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface TaskDialogProps {
  task: Task | null
  isOpen: boolean
  onClose: () => void
  onUpdate: (updatedTask: Task) => void
  onDelete: (taskId: string) => void
  projectId: string
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "HIGH_PRIORITY":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    case "MEDIUM_PRIORITY":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    case "LOW_PRIORITY":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "TODO":
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    case "IN_DEVELOPMENT":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    case "COMPLETE":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    case "RELEASED":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
  }
}

const TaskDialog: React.FC<TaskDialogProps> = ({
  task,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
  projectId
}) => {
  const [isEditMode, setIsEditMode] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [localTask, setLocalTask] = useState<Task | null>(null)
  const [editedTask, setEditedTask] = useState<Task | null>(null)

  useEffect(() => {
    if (isOpen) {
      const initialTask: Task = task
        ? {
            ...task,
            dueDate: task.dueDate ? formatDate(task.dueDate) : undefined,
            resolvedDate: task.resolvedDate ? formatDate(task.resolvedDate) : undefined,
            createdDate: task.createdDate ? formatDate(task.createdDate) : undefined,
            taskStatus: task.taskStatus as Task["taskStatus"],
            priority: task.priority as Task["priority"]
          }
        : {
            name: "",
            description: "",
            taskStatus: "TODO" as const,
            projectId,
            createdUserId: "",
            assignedUserId: "",
            priority: "MEDIUM_PRIORITY" as const,
            attachments: [],
            dueDate: undefined,
            resolvedDate: undefined,
            createdDate: formatDate(new Date().toISOString())
          }
      setLocalTask(initialTask)
      setEditedTask(initialTask)
      setIsEditMode(!task?.id)
    } else {
      setLocalTask(null)
      setEditedTask(null)
      setIsEditMode(false)
    }
  }, [isOpen, task, projectId])

  const handleEditToggle = () => {
    setIsEditMode((prev) => !prev)
    setEditedTask(localTask)
  }

  const handleInputChange = (field: keyof Task, value: string) => {
    if (editedTask) {
      if (field === "taskStatus") {
        setEditedTask({
          ...editedTask,
          [field]: value as Task["taskStatus"]
        })
      } else if (field === "priority") {
        setEditedTask({
          ...editedTask,
          [field]: value as Task["priority"]
        })
      } else if (field === "attachments") {
        setEditedTask({
          ...editedTask,
          [field]: value.split(",").map((item) => item.trim())
        })
      } else {
        setEditedTask({
          ...editedTask,
          [field]: value
        })
      }
    }
  }

  const handleSave = () => {
    if (editedTask) {
      onUpdate(editedTask)
      setLocalTask(editedTask)
      setIsEditMode(false)
    }
  }

  const handleCancel = () => {
    setEditedTask(localTask)
    setIsEditMode(false)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-4xl h-[90vh] p-0 flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col h-full"
            >
              <DialogHeader className="p-6 pb-2">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <DialogTitle className="text-2xl font-bold">
                      {isEditMode ? (
                        <div className="space-y-1">
                          <label htmlFor="taskName" className="text-sm font-medium text-gray-500">
                            Task Name
                          </label>
                          <Input
                            id="taskName"
                            value={editedTask?.name || ""}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            className="text-2xl font-bold"
                            placeholder="Enter task name"
                          />
                        </div>
                      ) : (
                        localTask?.name || "New Task"
                      )}
                    </DialogTitle>
                  </div>
                  {!isEditMode && (
                    <div className="flex items-center gap-3 mr-6">
                      <Button variant="outline" size="sm" onClick={handleEditToggle}>
                        Edit
                      </Button>
                      {localTask?.id && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setShowDeleteConfirmation(true)}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </DialogHeader>

              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="p-6 pt-2">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="space-y-6">
                          {/* Status and Priority */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-500">Status</label>
                              {isEditMode ? (
                                <Select
                                  value={editedTask?.taskStatus}
                                  onValueChange={(value) => handleInputChange("taskStatus", value)}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="TODO">To Do</SelectItem>
                                    <SelectItem value="IN_DEVELOPMENT">In Development</SelectItem>
                                    <SelectItem value="COMPLETE">Complete</SelectItem>
                                    <SelectItem value="RELEASED">Released</SelectItem>
                                  </SelectContent>
                                </Select>
                              ) : (
                                <Badge
                                  variant="secondary"
                                  className={getStatusColor(localTask?.taskStatus || "TODO")}
                                >
                                  {(localTask?.taskStatus || "TODO").replace("_", " ")}
                                </Badge>
                              )}
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-500">Priority</label>
                              {isEditMode ? (
                                <Select
                                  value={editedTask?.priority}
                                  onValueChange={(value) => handleInputChange("priority", value)}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select priority" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="LOW_PRIORITY">Low Priority</SelectItem>
                                    <SelectItem value="MEDIUM_PRIORITY">Medium Priority</SelectItem>
                                    <SelectItem value="HIGH_PRIORITY">High Priority</SelectItem>
                                  </SelectContent>
                                </Select>
                              ) : (
                                <Badge
                                  variant="secondary"
                                  className={getPriorityColor(
                                    localTask?.priority || "MEDIUM_PRIORITY"
                                  )}
                                >
                                  {(localTask?.priority || "MEDIUM_PRIORITY").replace("_", " ")}
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Description */}
                          <div className="space-y-2">
                            <h3 className="text-lg font-semibold">Description</h3>
                            {isEditMode ? (
                              <Textarea
                                value={editedTask?.description || ""}
                                onChange={(e) => handleInputChange("description", e.target.value)}
                                placeholder="Task description"
                                className="min-h-[100px]"
                              />
                            ) : (
                              <p className="text-gray-700 dark:text-gray-300">
                                {localTask?.description || "No description provided"}
                              </p>
                            )}
                          </div>

                          <Separator />

                          {/* Task Details Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-gray-500" />
                                  <span className="font-medium">Assigned To:</span>
                                  {isEditMode ? (
                                    <Input
                                      value={editedTask?.assignedUserId || ""}
                                      onChange={(e) =>
                                        handleInputChange("assignedUserId", e.target.value)
                                      }
                                      placeholder="User ID"
                                      className="w-[200px]"
                                    />
                                  ) : (
                                    <span>{localTask?.assignedUserId || "Unassigned"}</span>
                                  )}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-gray-500" />
                                  <span className="font-medium">Due Date:</span>
                                  {isEditMode ? (
                                    <Input
                                      type="date"
                                      value={editedTask?.dueDate || ""}
                                      onChange={(e) => handleInputChange("dueDate", e.target.value)}
                                      className="w-[200px]"
                                    />
                                  ) : (
                                    <span>
                                      {localTask?.dueDate
                                        ? new Date(localTask.dueDate).toLocaleDateString()
                                        : "Not set"}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="space-y-4">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-gray-500" />
                                <span className="font-medium">Created:</span>
                                <span>
                                  {localTask?.createdDate
                                    ? new Date(localTask.createdDate).toLocaleDateString()
                                    : "Not set"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 text-gray-500" />
                                <span className="font-medium">Resolved:</span>
                                {isEditMode ? (
                                  <Input
                                    type="date"
                                    value={editedTask?.resolvedDate || ""}
                                    onChange={(e) =>
                                      handleInputChange("resolvedDate", e.target.value)
                                    }
                                    className="w-[200px]"
                                  />
                                ) : (
                                  <span>
                                    {localTask?.resolvedDate
                                      ? new Date(localTask.resolvedDate).toLocaleDateString()
                                      : "Not set"}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <Separator />

                          {/* Attachments */}
                          <div className="space-y-2">
                            <h3 className="text-lg font-semibold">Attachments</h3>
                            {isEditMode ? (
                              <Input
                                value={(editedTask?.attachments || []).join(", ")}
                                onChange={(e) => handleInputChange("attachments", e.target.value)}
                                placeholder="Comma-separated attachment URLs"
                              />
                            ) : localTask?.attachments && localTask.attachments.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {localTask.attachments.map((attachment, index) => (
                                  <a
                                    key={index}
                                    href={attachment}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 p-2 rounded-md bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                                  >
                                    <Link className="h-4 w-4" />
                                    <span className="text-sm truncate">{attachment}</span>
                                  </a>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-500">No attachments</p>
                            )}
                          </div>

                          {/* Comments Section */}
                          {!isEditMode && localTask?.id && (
                            <>
                              <Separator className="my-6" />
                              <Comments taskId={localTask.id} />
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </ScrollArea>
              </div>

              {isEditMode && (
                <div className="flex justify-end space-x-2 p-4 border-t bg-background">
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>Save Changes</Button>
                </div>
              )}
            </motion.div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {showDeleteConfirmation && localTask?.id && (
          <Dialog open onOpenChange={() => setShowDeleteConfirmation(false)}>
            <DialogContent>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <DialogHeader>
                  <DialogTitle>Delete Task</DialogTitle>
                </DialogHeader>
                <p>Are you sure you want to delete the task "{localTask.name}"?</p>
                <div className="flex justify-end space-x-2 mt-4">
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
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </AnimatePresence>
  )
}

export default TaskDialog
