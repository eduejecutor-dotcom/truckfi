import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TruckFi — Real Trucks. Real Yield. On Solana.',
  description: 'Invest in real freight trucks as NFTs on Solana. Earn 95% of monthly revenue on-chain.',
  openGraph: {
    title: 'TruckFi',
    description: 'Real World Asset protocol tokenizing freight trucks on Solana',
    siteName: 'TruckFi',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
