"use client"

import Image from "next/image"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="py-8 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Image src="/images/ds-logo.png" alt="DS Logo" width={32} height={32} className="object-contain" />
          <span className="text-sm text-muted-foreground">
            Designed & Built by <span className="text-foreground">Dachi Sebiskveradze</span>
          </span>
        </div>

        <div className="text-sm text-muted-foreground">
          <span className="text-accent">&copy;</span> {currentYear} All rights reserved.
        </div>
      </div>
    </footer>
  )
}
