"use client"

import { type ReactNode, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Dice1Icon as User, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface NavItemProps {
  href: string
  icon: React.ElementType
  children: ReactNode
}

function NavItem({ href, icon: Icon, children }: NavItemProps) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200 ${isActive ? "text-blue" : ""}`}
    >
      <Icon className="mr-3" />
      {children}
    </Link>
  )
}

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)


  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
          <Link href={"/"} className="flex items-center">
            <h2 className="text-xl font-semibold text-gray-800">Interactive TV Games</h2>
          </Link>
          <div className="flex bg-gray-100 rounded-md items-center">
            <NavItem href="/upload-qa" icon={Plus}>
              Upload Question
            </NavItem>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}

