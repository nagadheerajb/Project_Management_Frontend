import React from "react"

const Footer: React.FC = () => (
  <footer className="bg-gray-800 text-white text-center py-4">
    &copy; {new Date().getFullYear()} My App. All rights reserved.
  </footer>
)

export default Footer
