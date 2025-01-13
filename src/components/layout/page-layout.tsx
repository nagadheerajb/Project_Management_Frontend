import React from "react"

interface PageLayoutProps {
  header: React.ReactNode
  sidebar: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
}

const PageLayout: React.FC<PageLayoutProps> = ({ header, sidebar, children, footer }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {sidebar}
      <div className="flex flex-1 flex-col">
        {header}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
        {footer && <footer className="bg-gray-800 text-white py-4 text-center">{footer}</footer>}
      </div>
    </div>
  )
}

export default PageLayout
