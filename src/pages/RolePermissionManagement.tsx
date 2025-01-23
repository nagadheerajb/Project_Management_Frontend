import React from "react"
import PageLayout from "@/components/layout/page-layout"
import Sidebar from "@/components/forms/sidebar/Side-bar"
import Header from "@/components/forms/common/header"
import RolePermissionManagementContent from "@/components/forms/rolepermission/RolePermissionManagementContent"
import { SidebarProvider } from "@/components/ui/sidebar"

/**
 * RolePermissionManagement - Wrapper component for layout
 */
const RolePermissionManagement: React.FC = () => {
  return (
    <SidebarProvider>
      <PageLayout header={<Header />} sidebar={<Sidebar />}>
        <RolePermissionManagementContent />
      </PageLayout>
    </SidebarProvider>
  )
}

export default RolePermissionManagement
