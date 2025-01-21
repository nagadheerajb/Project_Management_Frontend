import type React from "react"
import PageLayout from "@/components/layout/page-layout"
import Sidebar from "@/components/forms/sidebar/Side-bar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Header from "@/components/forms/common/header"
import Footer from "@/components/forms/common/footer"
import DashboardContent from "@/components/forms/dashboard/dashboard-content"
import { WorkspaceProvider } from "@/context/workspace-context"
import { UserProvider } from "@/context/user-context"
import "@/styles/tailwind.css"

const queryClient = new QueryClient()

const Dashboard: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <UserProvider>
          <WorkspaceProvider>
            <PageLayout header={<Header />} sidebar={<Sidebar />} footer={<Footer />}>
              <DashboardContent />
            </PageLayout>
          </WorkspaceProvider>
        </UserProvider>
      </SidebarProvider>
    </QueryClientProvider>
  )
}

export default Dashboard
