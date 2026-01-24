"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import ThreeScene from "./three-scene"
import GlowButton from "./glow-button"

gsap.registerPlugin(ScrollTrigger)

// Detect mobile for simplified animations
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent))
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return isMobile
}

function AnimatedText({
  text,
  className,
  delay = 0,
  stagger = 0.03,
  isMobile = false,
}: {
  text: string
  className?: string
  delay?: number
  stagger?: number
  isMobile?: boolean
}) {
  const containerRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    if (isMobile) {
      // Simplified animation for mobile: fade + slide without 3D transforms
      // Animate the whole text block instead of individual characters
      gsap.fromTo(
        containerRef.current,
        {
          y: 40,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          delay: delay,
        },
      )
    } else {
      // Full per-character 3D animation for desktop
      const chars = containerRef.current.querySelectorAll(".char")

      gsap.fromTo(
        chars,
        {
          y: 120,
          opacity: 0,
          rotateX: -90,
        },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1,
          ease: "power4.out",
          stagger: stagger,
          delay: delay,
        },
      )
    }
  }, [delay, stagger, isMobile])

  // On mobile, render text without per-character spans to reduce DOM nodes
  if (isMobile) {
    return (
      <span ref={containerRef} className={className} style={{ opacity: 0 }}>
        {text}
      </span>
    )
  }

  return (
    <span ref={containerRef} className={className} style={{ perspective: "1000px" }}>
      {text.split("").map((char, i) => (
        <span key={i} className="char inline-block" style={{ transformStyle: "preserve-3d" }}>
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  )
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const taglineRef = useRef<HTMLDivElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)
  const hasLoggedRef = useRef(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    // Trigger animations after mount
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (hasLoggedRef.current) return
    hasLoggedRef.current = true

    const pixel = "\u2588"
    const glyphs: Record<string, string[]> = {
      A: [" ### ", "#   #", "#   #", "#####", "#   #", "#   #", "#   #"],
      B: ["#### ", "#   #", "#   #", "#### ", "#   #", "#   #", "#### "],
      C: [" ####", "#    ", "#    ", "#    ", "#    ", "#    ", " ####"],
      D: ["#### ", "#   #", "#   #", "#   #", "#   #", "#   #", "#### "],
      E: ["#####", "#    ", "#    ", "#### ", "#    ", "#    ", "#####"],
      H: ["#   #", "#   #", "#   #", "#####", "#   #", "#   #", "#   #"],
      I: ["#####", "  #  ", "  #  ", "  #  ", "  #  ", "  #  ", "#####"],
      K: ["#   #", "#  # ", "# #  ", "##   ", "# #  ", "#  # ", "#   #"],
      R: ["#### ", "#   #", "#   #", "#### ", "# #  ", "#  # ", "#   #"],
      S: [" ####", "#    ", "#    ", " ### ", "    #", "    #", "#### "],
      V: ["#   #", "#   #", "#   #", "#   #", "#   #", " # # ", "  #  "],
      Z: ["#####", "   # ", "  #  ", " #   ", "#    ", "#    ", "#####"],
      " ": ["     ", "     ", "     ", "     ", "     ", "     ", "     "],
    }

    const renderWord = (word: string) => {
      const rows = Array.from({ length: 7 }, () => "")
      for (const char of word.toUpperCase()) {
        const glyph = glyphs[char] ?? glyphs[" "]
        for (let i = 0; i < rows.length; i += 1) {
          rows[i] += `${glyph[i]} `
        }
      }
      return rows.map((row) => row.replace(/#/g, pixel).replace(/\s+$/, ""))
    }

    const fullName = "Dachi Sebiskveradze"
    const [firstName, ...rest] = fullName.split(" ")
    const lastName = rest.join(" ")
    const top = renderWord(firstName)
    const bottom = renderWord(lastName)
    const baseStyle = [
      "font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
      "font-size: 12px",
      "line-height: 1",
      "letter-spacing: 0.02em",
      "white-space: pre",
      "text-shadow: 1px 0 #0B0F14, 0 1px #0B0F14, 1px 1px #0B0F14, 2px 2px #0B0F14",
    ].join("; ")
    const topStyle = `${baseStyle}; color: #E84C30`
    const bottomStyle = `${baseStyle}; color: #E5E7EB`

    console.log(`%c${top.join("\n")}\n%c${bottom.join("\n")}`, topStyle, bottomStyle)
  }, [])

  useEffect(() => {
    if (!isLoaded) return

    const ctx = gsap.context(() => {
      // Faster, simpler animations on mobile
      const baseDuration = isMobile ? 0.6 : 1
      const baseDelay = isMobile ? 0.8 : 1.2

      gsap.fromTo(
        taglineRef.current,
        { y: isMobile ? 30 : 50, opacity: 0 },
        { y: 0, opacity: 1, duration: baseDuration, ease: "power3.out", delay: baseDelay },
      )

      gsap.fromTo(
        buttonsRef.current?.children || [],
        { y: isMobile ? 20 : 30, opacity: 0 },
        { y: 0, opacity: 1, duration: isMobile ? 0.5 : 0.8, ease: "power3.out", stagger: 0.1, delay: baseDelay + 0.3 },
      )

      gsap.fromTo(scrollIndicatorRef.current, { opacity: 0 }, { opacity: 1, duration: baseDuration, delay: baseDelay + 0.8 })

      gsap.to(scrollIndicatorRef.current?.querySelector(".scroll-line"), {
        scaleY: 1,
        duration: 1,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true,
      })

      // Simplified scroll parallax on mobile - just fade out, no scale/transform
      if (isMobile) {
        gsap.to(overlayRef.current, {
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 2, // Higher scrub value = smoother but less responsive
          },
          opacity: 0,
        })
      } else {
        gsap.to(overlayRef.current, {
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
          y: -150,
          opacity: 0,
          scale: 0.95,
        })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [isLoaded, isMobile])

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <ThreeScene />

      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-transparent to-transparent z-[1]" />

      <div ref={overlayRef} className="relative z-10 text-center px-4 w-full">
        <h1 className="overflow-hidden mb-2">
          <AnimatedText
            text="DACHI"
            className="block text-[15vw] md:text-[12vw] lg:text-[10vw] font-bold tracking-tighter leading-[0.85] text-foreground"
            delay={0.2}
            stagger={0.05}
            isMobile={isMobile}
          />
        </h1>
        <h1 className="overflow-hidden">
          <AnimatedText
            text="SEBISKVERADZE"
            className="block text-[8vw] md:text-[6vw] lg:text-[5vw] font-bold tracking-tight leading-[0.9] text-accent"
            delay={0.5}
            stagger={0.03}
            isMobile={isMobile}
          />
        </h1>

        <div
          ref={taglineRef}
          className="mt-8 md:mt-12 flex flex-col items-center justify-center gap-3 md:gap-4 opacity-0"
        >
          <span className="text-sm sm:text-base md:text-lg lg:text-xl tracking-wide uppercase text-foreground/80">
            Fullstack Developer
          </span>

          <div className="flex items-center gap-3 md:gap-4">
            <span className="text-sm sm:text-base md:text-lg lg:text-xl tracking-wide uppercase text-foreground/60">
              Angular & React
            </span>
            <span className="text-accent text-lg">•</span>
            <span className="text-sm sm:text-base md:text-lg lg:text-xl tracking-wide uppercase text-foreground/60">
              WebGL Animations
            </span>
          </div>
        </div>

        <div ref={buttonsRef} className="mt-12 md:mt-16 flex items-center justify-center gap-4 md:gap-6">
          <GlowButton href="#projects" variant="primary" size="lg" pill>
            View Work
          </GlowButton>
          <GlowButton href="#contact" variant="outline" size="lg" pill>
            Get in Touch
          </GlowButton>
        </div>
      </div>

      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-0"
      >
        <span className="text-xs tracking-[0.3em] uppercase text-muted-foreground">Scroll</span>
        <div className="w-[1px] h-12 bg-muted-foreground/30 overflow-hidden">
          <div className="scroll-line w-full h-full bg-accent origin-top scale-y-0" />
        </div>
      </div>

      <div className="absolute bottom-8 left-8 text-muted-foreground/50 font-mono text-xs hidden md:block z-10">
        <span className="text-accent">01</span> / PORTFOLIO
      </div>
      <div className="absolute bottom-8 right-8 text-muted-foreground/50 font-mono text-xs hidden md:block z-10">
        2025
      </div>
    </section>
  )
}
