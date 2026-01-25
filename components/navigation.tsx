"use client"

import { useEffect, useState, useRef } from "react"
import { Mail } from "lucide-react"
import gsap from "gsap"
import Folder from "./Folder"

const navItems = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
]

const EMAIL = "dachisebiskveradze7@gmail.com"

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    gsap.from(navRef.current, {
      y: -100,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      delay: 0.5,
    })
  }, [])

  useEffect(() => {
    if (menuRef.current) {
      if (isMenuOpen) {
        gsap.to(menuRef.current, {
          height: "auto",
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        })
      } else {
        gsap.to(menuRef.current, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
        })
      }
    }
  }, [isMenuOpen])

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        isScrolled ? "bg-background/90 backdrop-blur-md border-b border-border" : ""
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-0.5">
            <a href="#" className="text-lg font-bold tracking-tight">
              <span className="text-foreground">Dachi</span>
              <span className="text-accent">.</span>
            </a>
            <div className="h-6 flex items-center overflow-visible">
              <Folder 
                color="#ef4444" 
                size={0.4} 
                items={[<div key="doc" className="w-full h-full bg-white rounded-lg"></div>]}
                href="https://drive.google.com/file/d/1G6Ip26yPngdkiEAYh6gQJg4bTTVYKJnI/view?usp=sharing"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-muted-foreground hover:text-accent transition-colors"
              >
                <span className="text-accent text-xs mr-1">0{index + 1}.</span>
                {item.label}
              </a>
            ))}

            <a
              href={`mailto:${EMAIL}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span className="hidden lg:inline">{EMAIL}</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-foreground p-2"
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {isMenuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div ref={menuRef} className="md:hidden overflow-hidden h-0 opacity-0">
          <div className="py-4 space-y-4">
            {navItems.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="block text-sm text-muted-foreground hover:text-accent transition-colors"
              >
                <span className="text-accent text-xs mr-2">0{index + 1}.</span>
                {item.label}
              </a>
            ))}

            <div className="pt-2 border-t border-border">
              <a
                href={`mailto:${EMAIL}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span className="text-xs">{EMAIL}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
