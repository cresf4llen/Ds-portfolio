"use client"

import type React from "react"

import { useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface GlowButtonProps {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  variant?: "primary" | "outline"
  size?: "sm" | "md" | "lg"
  pill?: boolean
  className?: string
  external?: boolean
}

export default function GlowButton({
  children,
  href,
  onClick,
  variant = "primary",
  size = "md",
  pill = false,
  className,
  external = false,
}: GlowButtonProps) {
  const buttonRef = useRef<HTMLAnchorElement | HTMLButtonElement>(null)
  const [isPressed, setIsPressed] = useState(false)
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsPressed(true)

    const rect = buttonRef.current?.getBoundingClientRect()
    if (rect) {
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const id = Date.now()
      setRipples((prev) => [...prev, { x, y, id }])

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id))
      }, 600)
    }
  }

  const handleMouseUp = () => {
    setIsPressed(false)
  }

  const sizeClasses = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  }

  const pillSizeClasses = {
    sm: "px-5 py-2 text-xs",
    md: "px-8 py-3 text-sm",
    lg: "px-10 py-4 text-base",
  }

  const baseClasses = cn(
    "relative inline-flex items-center justify-center gap-2 font-medium tracking-wide overflow-hidden",
    "transition-all duration-300 ease-out",
    pill ? pillSizeClasses[size] : sizeClasses[size],
    pill ? "rounded-full" : "rounded-none",
    "hover:scale-105",
    isPressed && "scale-95",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    className,
  )

  const primaryClasses = cn(
    baseClasses,
    "bg-accent text-accent-foreground",
    "shadow-[0_0_0_rgba(232,76,48,0)] hover:shadow-[0_0_30px_rgba(232,76,48,0.5)]",
    isPressed && "shadow-[0_0_40px_rgba(232,76,48,0.7)]",
  )

  const outlineClasses = cn(
    baseClasses,
    "border border-border text-foreground bg-transparent",
    "before:absolute before:inset-0 before:bg-accent before:origin-left before:scale-x-0 before:transition-transform before:duration-300",
    pill && "before:rounded-full",
    "hover:before:scale-x-100 hover:text-accent-foreground hover:border-accent",
    "hover:shadow-[0_0_20px_rgba(232,76,48,0.3)]",
    isPressed && "shadow-[0_0_30px_rgba(232,76,48,0.5)]",
  )

  const variantClasses = variant === "primary" ? primaryClasses : outlineClasses

  const content = (
    <>
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 animate-ripple pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}

      <span className="relative z-10 flex items-center gap-2">{children}</span>

      {variant === "primary" && (
        <span
          className={cn(
            "absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300",
            pill ? "rounded-full" : "rounded-[inherit]",
          )}
        >
          <span
            className={cn(
              "absolute inset-[-2px] bg-gradient-to-r from-accent via-accent/50 to-accent animate-border-glow",
              pill ? "rounded-full" : "rounded-[inherit]",
            )}
          />
        </span>
      )}
    </>
  )

  if (href) {
    return (
      <a
        ref={buttonRef as React.RefObject<HTMLAnchorElement>}
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={variantClasses}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {content}
      </a>
    )
  }

  return (
    <button
      ref={buttonRef as React.RefObject<HTMLButtonElement>}
      onClick={onClick}
      className={variantClasses}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {content}
    </button>
  )
}
