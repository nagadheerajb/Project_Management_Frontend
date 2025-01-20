import React from "react"
import PageLayout from "@/components/layout/page-layout"
import Sidebar from "@/components/forms/sidebar/Side-bar"
import Header from "@/components/forms/common/header"
import Footer from "@/components/forms/common/footer"
import RolePermissionManagementContent from "@/components/forms/rolepermission/RolePermissionManagementContent"
import { SidebarProvider } from "@/components/ui/sidebar"

/**
 * RolePermissionManagement - Wrapper component for layout
 */
const RolePermissionManagement: React.FC = () => {
  return (
    <SidebarProvider>
      <PageLayout header={<Header />} sidebar={<Sidebar />} footer={<Footer />}>
        <RolePermissionManagementContent />
      </PageLayout>
    </SidebarProvider>
  )
}

export default RolePermissionManagement
