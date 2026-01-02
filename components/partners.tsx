"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"

gsap.registerPlugin(ScrollTrigger)

const partners = [
  {
    name: "Papa Production",
    type: "Videography Company",
    logo: "/images/papa-production-logo.png",
    url: "https://www.papa-production.com",
  },
  {
    name: "Swift Development",
    type: "Agency",
    logo: "/images/swiftdev-logo.png",
    url: "https://www.swiftdev.agency",
  },
  {
    name: "Flinkos",
    type: "Social Platform",
    logo: "/images/flinkos-logo.png",
    url: "#",
  },
]

export default function Partners() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      })

      gsap.from(gridRef.current?.children || [], {
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.7)",
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-24 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <h2 ref={titleRef} className="text-2xl sm:text-3xl font-bold text-center mb-16">
          Partnered With
        </h2>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {partners.map((partner) => (
            <a
              key={partner.name}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center justify-center p-8 bg-card border border-border hover:border-accent/50 transition-all duration-300"
            >
              <div className="relative w-32 h-16 mb-4 grayscale group-hover:grayscale-0 transition-all duration-300">
                <Image src={partner.logo || "/placeholder.svg"} alt={partner.name} fill className="object-contain" />
              </div>
              <h3 className="text-lg font-bold text-center">{partner.name}</h3>
              <span className="text-sm text-muted-foreground">{partner.type}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
