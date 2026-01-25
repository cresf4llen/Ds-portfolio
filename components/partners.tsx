"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"
import Link from "next/link"
import GlowButton from "./glow-button"

gsap.registerPlugin(ScrollTrigger)

const partners = [
  {
    name: "Papa Production",
    type: "Videography Company",
    logo: "/images/papa-production-20logo-20no-20bg.webp",
    url: "https://www.papa-production.com/",
    preview: "/images/papa-production-preview.webp",
    logoSize: "h-16 sm:h-20",
    pageUrl: "/projects/papa-production",
  },
  {
    name: "Swift Development",
    type: "Agency",
    logo: "/images/swiftdevlogo-20no-20bg.webp",
    url: "https://www.swiftdev.agency/",
    preview: "/images/swiftdev-cover.webp",
    logoSize: "h-24 sm:h-32",
    pageUrl: "/projects/swiftdev-studio",
  },
]

function PreloadImage({
  src,
  alt,
  width,
  height,
}: {
  src: string
  alt: string
  width: number
  height: number
}) {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <div className="relative w-full">
      {/* Skeleton loader */}
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-zinc-800 animate-pulse rounded-sm"
          style={{ aspectRatio: `${width}/${height}` }}
        >
          <div className="absolute inset-0 shimmer" />
        </div>
      )}
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        width={width}
        height={height}
        className={`w-full h-auto object-contain transition-opacity duration-500 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  )
}

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
    <section ref={sectionRef} className="py-24 px-4 sm:px-6 border-t border-border overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <h2 ref={titleRef} className="text-xl sm:text-2xl font-medium text-center mb-4 tracking-[0.3em] uppercase">
          Partnered With
        </h2>
        <p className="text-center text-muted-foreground text-sm sm:text-base mb-16 max-w-xl mx-auto">
          Websites I fully designed and developed from the ground up
        </p>

        <div ref={cardsRef} className="flex flex-col gap-12">
          {partners.map((partner, index) => (
            <div
              key={partner.name}
              className={`partner-card group grid grid-cols-1 lg:grid-cols-2 gap-6 items-end ${
                index % 2 === 1 ? "lg:direction-rtl" : ""
              }`}
            >
              {/* Logo side */}
              <div className={`flex flex-col justify-end ${index % 2 === 1 ? "lg:order-2" : "lg:order-1"}`}>
                <div
                  className={`relative w-full max-w-[200px] sm:max-w-xs ${partner.logoSize} mb-2 brightness-0 invert`}
                >
                  <Image
                    src={partner.logo || "/placeholder.svg"}
                    alt={partner.name}
                    fill
                    className="object-contain object-left"
                  />
                </div>
                <span className="text-sm text-muted-foreground font-mono">#{partner.type.replace(" ", "")}</span>
                <span className="text-xs text-muted-foreground/60 mt-1">{partner.url.replace("https://", "")}</span>
                
                {/* Buttons */}
                <div className="flex flex-wrap gap-4 mt-6">
                  {partner.pageUrl && (
                    <Link href={partner.pageUrl}>
                      <GlowButton variant="primary" size="sm">
                        Learn More
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="group-hover:translate-x-1 transition-transform"
                        >
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </GlowButton>
                    </Link>
                  )}
                  {partner.url && (
                    <GlowButton href={partner.url} variant="outline" size="sm" external>
                      View Project
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="group-hover:translate-x-1 transition-transform"
                      >
                        <path d="M7 17L17 7M17 7H7M17 7V17" />
                      </svg>
                    </GlowButton>
                  )}
                </div>
              </div>

              {/* Preview image side */}
              <div className={`relative overflow-hidden rounded-sm ${index % 2 === 1 ? "lg:order-1" : "lg:order-2"}`}>
                <div className="relative w-full max-w-full overflow-hidden bg-zinc-900/50 rounded-sm group-hover:scale-[1.02] transition-transform duration-500">
                  <PreloadImage
                    src={partner.preview || "/placeholder.svg"}
                    alt={`${partner.name} website preview`}
                    width={1512}
                    height={800}
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
