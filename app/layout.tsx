import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from "@/components/theme-provider"
import { ServiceWorkerInitializer } from "./sw-init"

export const metadata: Metadata = {
  title: 'interactive-tv',
  description: 'interactive-tv app',
  generator: 'AKDebug',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Exo+2:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet"></link>
      </head>
      <body className="bg-white text-black">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ServiceWorkerInitializer />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
