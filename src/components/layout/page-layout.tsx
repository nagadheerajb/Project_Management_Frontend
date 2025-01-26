import type React from "react"

interface PageLayoutProps {
  header: React.ReactNode
  sidebar: React.ReactNode
  children: React.ReactNode
}

const PageLayout: React.FC<PageLayoutProps> = ({ header, sidebar, children }) => {
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <div className="flex-none">{header}</div>
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-none">{sidebar}</div>
        <div className="flex-1 overflow-hidden">{children}</div>
      </div>
    </div>
  )
}

export default PageLayout
