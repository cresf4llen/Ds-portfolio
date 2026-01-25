"use client"

import { useEffect, useRef, useCallback } from "react"

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorDotRef = useRef<HTMLDivElement>(null)
  const mousePos = useRef({ x: 0, y: 0 })
  const cursorPos = useRef({ x: 0, y: 0 })
  const dotPos = useRef({ x: 0, y: 0 })
  const rafId = useRef<number | null>(null)
  const isHovered = useRef(false)

  // Use requestAnimationFrame for smooth, performant animation
  const animate = useCallback(() => {
    const cursor = cursorRef.current
    const cursorDot = cursorDotRef.current

    if (cursor && cursorDot) {
      // Smooth interpolation for the outer cursor (lag behind)
      cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * 0.15
      cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * 0.15

      // Faster interpolation for the dot (follows closely)
      dotPos.current.x += (mousePos.current.x - dotPos.current.x) * 0.5
      dotPos.current.y += (mousePos.current.y - dotPos.current.y) * 0.5

      // Use transform for GPU acceleration
      const scale = isHovered.current ? 1.5 : 1
      cursor.style.transform = `translate3d(${cursorPos.current.x}px, ${cursorPos.current.y}px, 0) translate(-50%, -50%) scale(${scale})`
      cursorDot.style.transform = `translate3d(${dotPos.current.x}px, ${dotPos.current.y}px, 0) translate(-50%, -50%)`
    }

    rafId.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return

    // Check if device has fine pointer (mouse) - skip on touch devices
    const hasFineMouse = window.matchMedia("(pointer: fine)").matches
    if (!hasFineMouse) return

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX
      mousePos.current.y = e.clientY
    }

    const handleMouseEnter = () => {
      isHovered.current = true
    }

    const handleMouseLeave = () => {
      isHovered.current = false
    }

    // Use passive listener for better scroll performance
    window.addEventListener("mousemove", handleMouseMove, { passive: true })

    // Add hover effect to interactive elements
    const interactiveElements = document.querySelectorAll("a, button")
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", handleMouseEnter)
      el.addEventListener("mouseleave", handleMouseLeave)
    })

    // Start animation loop
    rafId.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter)
        el.removeEventListener("mouseleave", handleMouseLeave)
      })
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }
    }
  }, [animate])

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-8 h-8 border border-accent rounded-full pointer-events-none z-[9999] hidden md:block mix-blend-difference will-change-transform transition-[width,height,border-width] duration-200"
      />
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-1 h-1 bg-accent rounded-full pointer-events-none z-[9999] hidden md:block will-change-transform"
      />
    </>
  )
}
