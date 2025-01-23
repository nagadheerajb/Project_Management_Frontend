import type { Task } from "@/types/interfaces"

export const findTaskContainer = (
  id: string,
  groupedTasks: Record<string, Task[]>
): string | undefined => {
  console.log("Finding container for task:", id)
  if (id in groupedTasks) return id
  for (const [key, tasks] of Object.entries(groupedTasks)) {
    if (tasks.some((task) => task.id === id)) {
      console.log(`Task ${id} found in container:`, key)
      return key
    }
  }
  console.log(`No container found for task ${id}`)
  return undefined
}

export const reorderTasks = (tasks: Task[], startIndex: number, endIndex: number): Task[] => {
  const result = Array.from(tasks)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

export const moveBetweenContainers = (
  source: Task[],
  destination: Task[],
  droppableSource: { index: number },
  droppableDestination: { index: number }
): { newSource: Task[]; newDestination: Task[] } => {
  const sourceClone = Array.from(source)
  const destClone = Array.from(destination)
  const [removed] = sourceClone.splice(droppableSource.index, 1)

  destClone.splice(droppableDestination.index, 0, removed)

  return { newSource: sourceClone, newDestination: destClone }
}
