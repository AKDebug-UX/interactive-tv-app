"use client"

import { type ReactNode, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Dice1Icon as User, Plus } from "lucide-react"
import { InstallPWA } from "@/components/install-pwa"
import { NetworkStatus } from "@/components/network-status"
import Footer from "./Footer"
import Image from "next/image"

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
    <div className="flex flex-col h-screen">
      {/* Main Content */}
      {/* Header */}
      <header className="flex items-center justify-between px-6 lg:px-[1rem] xl:px-[7rem] py-4 bg-white shadow-md">
        <Link href={"/"} className="flex w-[180px] h-16 relative items-center">
          <Image src={`img/CiS_ACF_CCF_Banner_Kings_Crown.png`} alt="Dice Face" fill className="" />
        </Link>
        <div className="flex gap-3 items-center">
          <NetworkStatus />
          <InstallPWA />
           {/* <Link href="/pwa-debug">
        <button variant="outline">Open PWA Debug Page</button>
      </Link> */}

          <div className="flex bg-gray-100 rounded-md items-center">
            <NavItem href="/upload-qa" icon={Plus}>
              Upload Question
            </NavItem>
          </div>
        </div>
      </header>
      <div className="flex flex-col lg:px-[1rem] xl:px-[7rem] py-[3rem] overflow-y-auto">
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  )
}

