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
    logo: "/images/papa-production-20logo-20no-20bg.png",
    url: "https://www.papa-production.com",
    preview: "/papa-production-videography-website-dark-elegant-i.jpg",
  },
  {
    name: "Swift Development",
    type: "Agency",
    logo: "/images/swiftdevlogo-20no-20bg.png",
    url: "https://www.swiftdev.agency",
    preview: "/swiftdev-digital-agency-website-dark-with-dotted-g.jpg",
  },
]

export default function Partners() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

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

      const cards = cardsRef.current?.querySelectorAll(".partner-card")
      if (cards) {
        cards.forEach((card, index) => {
          const direction = index % 2 === 0 ? -100 : 100
          gsap.from(card, {
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
            x: direction,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
          })
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-24 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <h2 ref={titleRef} className="text-xl sm:text-2xl font-medium text-center mb-16 tracking-[0.3em] uppercase">
          Partnered With
        </h2>

        <div ref={cardsRef} className="flex flex-col gap-12">
          {partners.map((partner, index) => (
            <a
              key={partner.name}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`partner-card group grid grid-cols-1 lg:grid-cols-2 gap-6 items-center ${
                index % 2 === 1 ? "lg:direction-rtl" : ""
              }`}
            >
              {/* Logo side */}
              <div className={`flex flex-col ${index % 2 === 1 ? "lg:order-2" : "lg:order-1"}`}>
                <div className="relative w-full max-w-xs h-24 mb-4 brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all duration-500">
                  <Image
                    src={partner.logo || "/placeholder.svg"}
                    alt={partner.name}
                    fill
                    className="object-contain object-left"
                  />
                </div>
                <span className="text-sm text-muted-foreground font-mono">#{partner.type.replace(" ", "")}</span>
                <span className="text-xs text-muted-foreground/60 mt-1">{partner.url.replace("https://", "")}</span>
              </div>

              {/* Preview image side */}
              <div className={`relative overflow-hidden rounded-sm ${index % 2 === 1 ? "lg:order-1" : "lg:order-2"}`}>
                <div className="relative aspect-[3/2] w-full overflow-hidden">
                  <Image
                    src={partner.preview || "/placeholder.svg"}
                    alt={`${partner.name} website preview`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
