import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Dachi Sebiskveradze | Fullstack Developer",
  description:
    "Georgian Fullstack Developer specializing in Angular, React, and WebGL Animations. Founder of SwiftDev Agency.",
  keywords: ["Fullstack Developer", "Angular", "React", "WebGL", "Three.js", "GSAP", "Georgian Developer"],
  authors: [{ name: "Dachi Sebiskveradze" }],
  icons: {
    icon: "/favicon.png",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "Dachi Sebiskveradze | Fullstack Developer",
    description: "Georgian Fullstack Developer specializing in Angular, React, and WebGL Animations.",
    url: "https://dachisebiskveradze.com",
    siteName: "Dachi Sebiskveradze Portfolio",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Dachi Sebiskveradze - Fullstack Developer Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dachi Sebiskveradze | Fullstack Developer",
    description: "Georgian Fullstack Developer specializing in Angular, React, and WebGL Animations.",
    images: ["/og-image.jpg"],
  },
  generator: "v0.app",
}

export const viewport = {
  themeColor: "#0A0A0A",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
