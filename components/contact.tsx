"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const socialLinks = [
  {
    name: "GitHub",
    url: "https://github.com/dachiseb",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/dachiseb/",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
]

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const lettersRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)
  const copiedTextRef = useRef<HTMLSpanElement>(null)

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText("dachisebiskveradze7@gmail.com")
      setCopied(true)
    } catch (err) {
      console.error("Failed to copy email:", err)
    }
  }

  // Animate the copied text when it appears
  useEffect(() => {
    if (copied && copiedTextRef.current) {
      // Animate in
      gsap.fromTo(
        copiedTextRef.current,
        { opacity: 0, y: 10, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(1.7)" }
      )

      // Animate out after 2.5 seconds
      const timeout = setTimeout(() => {
        if (copiedTextRef.current) {
          gsap.to(copiedTextRef.current, {
            opacity: 0,
            y: -10,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => setCopied(false),
          })
        }
      }, 2500)

      return () => clearTimeout(timeout)
    }
  }, [copied])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate the card sliding up
      gsap.from(cardRef.current, {
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
      })

      // Animate each letter with stagger
      const letters = lettersRef.current?.querySelectorAll(".letter-row")
      if (letters) {
        gsap.from(letters, {
          scrollTrigger: {
            trigger: lettersRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
          y: 80,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Animated text - wodniack style with stacked letters
  const words = ["LET'S", "WORK", "TOGETHER"]

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="min-h-screen py-24 px-4 sm:px-6 flex items-center justify-center relative overflow-hidden"
    >
      {/* Subtle background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/95" />
      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-accent/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-accent/5 rounded-full blur-[100px]" />

      {/* Main card container */}
      <div
        ref={cardRef}
        className="relative w-full max-w-4xl mx-auto bg-gradient-to-br from-foreground/[0.03] to-foreground/[0.01] border border-foreground/10 rounded-2xl p-8 sm:p-12 md:p-16 backdrop-blur-sm"
      >
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-accent/40 rounded-tl-2xl" />
        <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-accent/40 rounded-tr-2xl" />
        <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-accent/40 rounded-bl-2xl" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-accent/40 rounded-br-2xl" />

        {/* Section label */}
        <span className="text-accent text-sm font-medium tracking-widest uppercase mb-8 block">04. Contact</span>

        {/* Animated stacked text */}
        <div ref={lettersRef} className="mb-12">
          {words.map((word, wordIndex) => (
            <div key={wordIndex} className="letter-row overflow-hidden">
              <h2
                className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tight ${
                  wordIndex === 1 ? "text-accent" : "text-foreground"
                }`}
              >
                {word}
              </h2>
            </div>
          ))}
        </div>

        {/* Email section */}
        <div className="space-y-6">
          <p className="text-muted-foreground text-base sm:text-lg max-w-md leading-relaxed">
            Got a project in mind? Let's create something amazing together. Drop me a line and let's chat.
          </p>

          {/* Let's Talk Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleCopyEmail}
              className="group relative inline-flex items-center gap-2 px-8 py-4 bg-accent text-background font-semibold text-lg rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(var(--accent-rgb),0.3)]"
            >
              <span className="relative z-10">Let's Talk</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-r from-accent via-accent to-accent/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
            
            {/* Copied confirmation */}
            {copied && (
              <span
                ref={copiedTextRef}
                className="inline-flex items-center gap-2 text-accent font-medium"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Email copied!
              </span>
            )}
          </div>

          {/* Email display - commented out
          <div>
            <a
              href="mailto:dachisebiskveradze7@gmail.com"
              className="group flex items-center gap-3 text-lg sm:text-xl md:text-2xl font-mono text-foreground hover:text-accent transition-colors duration-300"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <span className="border-b border-dashed border-foreground/30 group-hover:border-accent pb-0.5 break-all">
                dachisebiskveradze7@gmail.com
              </span>
            </a>
          </div>
          */}

          {/* Social links */}
          <div className="flex items-center gap-4 pt-6 border-t border-foreground/10 mt-8">
            <span className="text-sm text-muted-foreground">Find me on</span>
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-muted-foreground hover:text-accent hover:scale-110 transition-all duration-300"
                aria-label={link.name}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Decorative GO text like wodniack */}
        <div className="absolute -bottom-4 -right-4 sm:bottom-8 sm:right-8 text-[80px] sm:text-[120px] font-bold text-foreground/[0.03] leading-none select-none pointer-events-none">
          GO
        </div>
      </div>
    </section>
  )
}
