import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Task } from "@/types/interfaces"

interface TaskFormProps {
  formData: Task
  onSave: (data: Task) => void
  onCancel: () => void
  isPending: boolean
}

const TaskForm: React.FC<TaskFormProps> = ({ formData, onSave, onCancel, isPending }) => {
  const [localFormData, setLocalFormData] = useState<Task>(formData)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setLocalFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAttachmentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLocalFormData((prev) => ({
      ...prev,
      attachments: value ? value.split(",").map((a) => a.trim()) : []
    }))
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name">Name</label>
        <Input
          id="name"
          name="name"
          value={localFormData.name}
          onChange={handleInputChange}
          placeholder="Task Name"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={localFormData.description}
          onChange={handleInputChange}
          placeholder="Task Description"
          className="w-full rounded-md border border-gray-300 px-3 py-2"
          rows={4}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="priority">Priority</label>
        <select
          id="priority"
          name="priority"
          value={localFormData.priority}
          onChange={handleInputChange}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        >
          <option value="LOW_PRIORITY">Low</option>
          <option value="MEDIUM_PRIORITY">Medium</option>
          <option value="HIGH_PRIORITY">High</option>
        </select>
      </div>
      <div className="space-y-2">
        <label htmlFor="taskStatus">Task Status</label>
        <select
          id="taskStatus"
          name="taskStatus"
          value={localFormData.taskStatus}
          onChange={handleInputChange}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        >
          <option value="TODO">To Do</option>
          <option value="IN_DEVELOPMENT">In Development</option>
          <option value="COMPLETE">Complete</option>
          <option value="RELEASED">Released</option>
        </select>
      </div>
      <div className="space-y-2">
        <label htmlFor="assignedUserId">Assigned User</label>
        <Input
          id="assignedUserId"
          name="assignedUserId"
          value={localFormData.assignedUserId}
          onChange={handleInputChange}
          placeholder="Assigned User ID"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="dueDate">Due Date</label>
        <Input
          id="dueDate"
          name="dueDate"
          type="date"
          value={localFormData.dueDate || ""}
          onChange={handleInputChange}
          placeholder="Due Date"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="resolvedDate">Resolved Date</label>
        <Input
          id="resolvedDate"
          name="resolvedDate"
          type="date"
          value={localFormData.resolvedDate || ""}
          onChange={handleInputChange}
          placeholder="Resolved Date"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="attachments">Attachments</label>
        <Input
          id="attachments"
          name="attachments"
          value={(localFormData.attachments || []).join(", ")}
          onChange={handleAttachmentsChange}
          placeholder="Comma-separated attachment URLs"
        />
      </div>
      <div className="flex justify-between items-center mt-4">
        <Button variant="outline" disabled={isPending} onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="secondary" disabled={isPending} onClick={() => onSave(localFormData)}>
          {isPending ? "Saving..." : formData.id ? "Update" : "Create"}
        </Button>
      </div>
    </div>
  )
}

export default TaskForm
