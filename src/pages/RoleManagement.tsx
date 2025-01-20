import React from "react"
import PageLayout from "@/components/layout/page-layout"
import Sidebar from "@/components/forms/sidebar/Side-bar"
import Header from "@/components/forms/common/header"
import Footer from "@/components/forms/common/footer"
import RoleManagementContent from "@/components/forms/role/RoleManagementContent"
import { SidebarProvider } from "@/components/ui/sidebar"

/**
 * RoleManagement - Wrapper component for layout
 */
const RoleManagement: React.FC = () => {
  return (
    <SidebarProvider>
      <PageLayout header={<Header />} sidebar={<Sidebar />} footer={<Footer />}>
        <RoleManagementContent />
      </PageLayout>
    </SidebarProvider>
  )
}

export default RoleManagement
