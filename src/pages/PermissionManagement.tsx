import React from "react"
import PageLayout from "@/components/layout/page-layout"
import Sidebar from "@/components/forms/sidebar/Side-bar"
import Header from "@/components/forms/common/header"
import Footer from "@/components/forms/common/footer"
import PermissionManagementContent from "@/components/forms/permission/PermissionManagementContent"
import { SidebarProvider } from "@/components/ui/sidebar"

/**
 * PermissionManagement - Wrapper component for layout
 */
const PermissionManagement: React.FC = () => {
  return (
    <SidebarProvider>
      <PageLayout header={<Header />} sidebar={<Sidebar />} footer={<Footer />}>
        <PermissionManagementContent />
      </PageLayout>
    </SidebarProvider>
  )
}

export default PermissionManagement
