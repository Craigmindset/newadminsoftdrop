import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClientToaster } from '@/components/client-toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SoftDropWeb',
  description: 'Fast and reliable',
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <ClientToaster />
      </body>
    </html>
  )
}
