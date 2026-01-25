"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Mail, Copy, Check } from "lucide-react"

const EMAIL = "dachisebiskveradze7@gmail.com"

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const [copied, setCopied] = useState(false)

  const copyEmail = async (e: React.MouseEvent) => {
    e.preventDefault()
    await navigator.clipboard.writeText(EMAIL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <footer className="py-8 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-4">
            <Image src="/images/ds-logo.webp" alt="DS Logo" width={32} height={32} className="object-contain" />
            <span className="text-sm text-muted-foreground">
              Designed & Built by <span className="text-foreground">Dachi Sebiskveradze</span>
            </span>
          </div>
          <div className="flex items-center gap-2 ml-0 md:ml-12">
            <a
              href={`mailto:${EMAIL}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>{EMAIL}</span>
            </a>
            <button
              onClick={copyEmail}
              className="p-1.5 rounded-md hover:bg-accent/10 text-muted-foreground hover:text-accent transition-colors"
              title="Copy email"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          <span className="text-accent">&copy;</span> {currentYear} All rights reserved.
        </div>
      </div>
    </footer>
  )
}
