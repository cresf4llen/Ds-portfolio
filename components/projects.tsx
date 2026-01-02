"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"

gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    id: 1,
    title: "Flinkos",
    subtitle: "Social Connection App",
    description:
      "Full-stack social platform with real-time video connections. Built production applications processing payments and supporting hundreds of concurrent video users.",
    tags: ["Angular", "React Native", "TypeScript", "WebRTC"],
    image: "/images/screenshot-202025-12-25-20163709.png",
    year: "2024",
    type: "Website & Mobile App",
  },
  {
    id: 2,
    title: "DevHealth",
    subtitle: "AI Wellness Extension",
    description:
      "Browser extension helping developers build sustainable focus routines with AI wellness support. Prevents burnout with guided focus sessions and recovery reminders.",
    tags: ["React", "TypeScript", "AI Integration", "Chrome Extension"],
    image: "/images/screenshot-202025-12-25-20163738.png",
    year: "2025",
    type: "Extension & Website",
    url: "https://www.devhealth.online",
  },
  {
    id: 3,
    title: "SwiftDev Agency",
    subtitle: "Development Agency",
    description:
      "Founded and lead a development agency serving international clients with professional digital solutions. Delivering quality development fast and efficient.",
    tags: ["Next.js", "React", "Supabase", "GSAP"],
    image: "/images/screenshot-202025-12-25-20163725.png",
    year: "2024-25",
    type: "Agency",
    url: "https://www.swiftdev.agency",
  },
]

function ProjectCard({ project, index }: { project: (typeof projects)[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Image reveal animation
      gsap.from(imageRef.current, {
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
        clipPath: "inset(0 100% 0 0)",
        duration: 1.2,
        ease: "power4.inOut",
      })

      // Content slide in
      gsap.from(contentRef.current?.children || [], {
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.3,
      })
    }, cardRef)

    return () => ctx.revert()
  }, [])

  const isEven = index % 2 === 0

  return (
    <div ref={cardRef} className="grid md:grid-cols-12 gap-8 items-center py-16 md:py-24">
      <div
        ref={imageRef}
        className={`md:col-span-7 relative aspect-video overflow-hidden bg-secondary ${isEven ? "md:order-1" : "md:order-2"}`}
        style={{ clipPath: "inset(0 0 0 0)" }}
      >
        <Image
          src={project.image || "/placeholder.svg"}
          alt={project.title}
          fill
          className="object-cover object-top hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
      </div>

      <div ref={contentRef} className={`md:col-span-5 ${isEven ? "md:order-2 md:pl-8" : "md:order-1 md:pr-8"}`}>
        <div className="flex items-center gap-4 mb-4">
          <span className="text-accent text-sm font-medium">{project.year}</span>
          <span className="text-muted-foreground text-sm">{project.type}</span>
        </div>

        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">{project.title}</h3>
        <p className="text-muted-foreground text-sm mb-6">{project.subtitle}</p>

        <p className="text-muted-foreground leading-relaxed mb-6">{project.description}</p>

        <div className="flex flex-wrap gap-2 mb-8">
          {project.tags.map((tag) => (
            <span key={tag} className="text-xs text-accent border border-accent/30 px-3 py-1">
              {tag}
            </span>
          ))}
        </div>

        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-foreground hover:text-accent transition-colors group"
          >
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
          </a>
        )}
      </div>
    </div>
  )
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current?.children || [], {
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power4.out",
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="projects" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div ref={titleRef} className="mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            <span className="text-accent">02.</span> Selected Works
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl">
            A collection of projects that showcase my expertise in building scalable applications with modern
            technologies.
          </p>
        </div>

        <div className="divide-y divide-border">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
