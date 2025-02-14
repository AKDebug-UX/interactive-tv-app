import type { Metadata } from 'next'
import './globals.css'

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
      <body>{children}</body>
    </html>
  )
}
