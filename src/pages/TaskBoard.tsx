import React from "react"
import { useLocation } from "react-router-dom"
import { useTasks } from "@/hooks/useTasks"
import PageLayout from "@/components/layout/page-layout"
import Header from "@/components/forms/common/header"
import Sidebar from "@/components/forms/sidebar/Side-bar"
import Footer from "@/components/forms/common/footer"
import { SidebarProvider } from "@/components/ui/sidebar"
import TaskBoardContent from "@/components/forms/taskboard/TaskBoardContent"

const TaskBoard: React.FC = () => {
  const location = useLocation()
  const projectId = location.state?.projectId

  const { data, isLoading, isError, error } = useTasks(projectId)

  if (!projectId) {
    return <div>No Project ID provided. Please navigate from the project details page.</div>
  }

  if (isLoading) {
    return <div>Loading tasks...</div>
  }

  if (isError) {
    return <div>Error loading tasks: {error?.message}</div>
  }

  const tasks = Array.isArray(data?.data) ? data.data : []

  return (
    <SidebarProvider>
      <PageLayout header={<Header />} sidebar={<Sidebar />} footer={<Footer />}>
        <TaskBoardContent tasks={tasks} projectId={projectId} />
      </PageLayout>
    </SidebarProvider>
  )
}

export default TaskBoard
