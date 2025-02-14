"use client"

import { type ReactNode, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Dice1Icon as DiceIcon, HelpCircle, Settings, User, Menu, X } from "lucide-react"
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
      className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200 ${isActive ? "bg-gray-200" : ""}`}
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

  const Sidebar = () => (
    <>
      <nav className="flex flex-col flex-1 mt-[6rem] gap-6 overflow-y-auto">
        <NavItem href="/" icon={Home}>
          Home
        </NavItem>
        <NavItem href="/dice-game" icon={DiceIcon}>
          Dice Game
        </NavItem>
        <NavItem href="/qa-game" icon={HelpCircle}>
          Q&A Game
        </NavItem>
        <NavItem href="/settings" icon={Settings}>
          Settings
        </NavItem>
      </nav>
    </>
  )

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for larger screens */}
      <div className="hidden md:flex md:flex-col md:w-64 bg-white shadow-lg">
        <Sidebar />
      </div>

      {/* Sidebar for mobile */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <Sidebar />
          {/* <Button variant="ghost" className="absolute top-4 right-4 md:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-6 w-6" />
          </Button> */}
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
          <div className="flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className="md:hidden mr-2" onClick={() => setSidebarOpen(true)}>
                  <Menu />
                </Button>
              </SheetTrigger>
            </Sheet>
            <h2 className="text-xl font-semibold text-gray-800">Interactive TV Games</h2>
          </div>
          <div className="flex items-center">
            <span className="mr-2"></span>
            <User className="text-gray-600" />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}

