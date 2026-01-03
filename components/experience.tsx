"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const experiences = [
  {
    period: "22-24",
    company: "IT Step Academy Georgia",
    role: "Bootcamp",
    description: "Comprehensive full-stack development bootcamp covering modern web technologies, database management, and software engineering principles.",
    skills: [
      "Angular",
      "C#",
      "EF Core",
      "Asp.Net Core Web API",
      "Javascript",
      "MS SQL Server Programming and Administration",
    ],
    url: "https://itstep.org/",
  },
  {
    period: "24-25",
    company: "Swift Development Agency",
    role: "Full Stack Lead Engineer",
    description: "Led development of multiple client projects, architected scalable solutions, and mentored team members while delivering high-quality web and mobile applications.",
    skills: ["Angular", "React", "React Native", "Supabase", "GSAP", "TypeScript"],
    url: "https://www.swiftdev.agency/",
  },
  {
    period: "25",
    company: "KooberCoders",
    role: "Internship",
    description: "Developed the company website with WebGL and GSAP animations, creating immersive interactive experiences with modern web technologies.",
    skills: ["Angular", "React", "React Native", "Three.js", "GSAP", "TypeScript"],
    url: "https://koobercoders.com/",
  },
  {
    period: "25",
    company: "DevHealth",
    role: "Full Stack Lead Engineer",
    description: "Leading the development of a health-focused platform, building robust React applications with TypeScript, and ensuring optimal user experiences.",
    skills: ["React", "TypeScript"],
    url: "https://www.devhealth.online/",
  },
]

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])
  const progressRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[]
      const totalCards = cards.length

      // Set initial states - all cards start off-screen to the right
      gsap.set(cards, {
        xPercent: 100,
        opacity: 0,
        scale: 0.8,
      })

      // Create the main scroll-jack timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${window.innerHeight * totalCards}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            // Update progress bar
            if (progressRef.current) {
              gsap.to(progressRef.current, {
                scaleX: self.progress,
                duration: 0.1,
                ease: "none",
              })
            }
            // Update counter
            if (counterRef.current) {
              const currentIndex = Math.min(Math.floor(self.progress * totalCards), totalCards - 1)
              counterRef.current.textContent = String(currentIndex + 1).padStart(2, "0")
            }
          },
        },
      })

      // Animate each card in sequence
      cards.forEach((card, index) => {
        const isEven = index % 2 === 0

        // Card enters from alternating sides
        tl.to(
          card,
          {
            xPercent: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "power2.out",
          },
          index * 1.5,
        )

        // Card content stagger animation
        const content = card.querySelector(".card-content")
        const skills = card.querySelectorAll(".skill-tag")

        tl.from(
          content,
          {
            y: 30,
            opacity: 0,
            duration: 0.5,
            ease: "power2.out",
          },
          index * 1.5 + 0.3,
        )

        tl.from(
          skills,
          {
            y: 20,
            opacity: 0,
            stagger: 0.05,
            duration: 0.3,
            ease: "power2.out",
          },
          index * 1.5 + 0.5,
        )

        // If not the last card, animate current card out to opposite side
        if (index < totalCards - 1) {
          tl.to(
            card,
            {
              xPercent: isEven ? -100 : 100,
              opacity: 0,
              scale: 0.8,
              duration: 1,
              ease: "power2.in",
            },
            index * 1.5 + 1,
          )
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="experience" className="relative h-screen w-full overflow-hidden bg-background">
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `linear-gradient(var(--accent) 1px, transparent 1px),
                              linear-gradient(90deg, var(--accent) 1px, transparent 1px)`,
            backgroundSize: "100px 100px",
          }}
        />
      </div>

      {/* Fixed header */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 pt-24 sm:p-6 md:p-12 md:pt-28 overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
            <span className="text-accent">03.</span> Experience
          </h2>

          {/* Progress indicator */}
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="text-xs sm:text-sm text-muted-foreground font-mono">
              <span ref={counterRef} className="text-accent text-base sm:text-lg">
                01
              </span>
              <span className="mx-1">/</span>
              <span>{String(experiences.length).padStart(2, "0")}</span>
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="max-w-7xl mx-auto mt-4">
          <div className="h-[2px] bg-border overflow-hidden">
            <div ref={progressRef} className="h-full bg-accent origin-left" style={{ transform: "scaleX(0)" }} />
          </div>
        </div>
      </div>

      {/* Cards container */}
      <div ref={containerRef} className="absolute inset-0 flex items-center justify-center pt-24 overflow-hidden">
        {experiences.map((exp, index) => (
          <div
            key={exp.company}
            ref={(el) => {
              cardsRef.current[index] = el
            }}
            className="absolute w-[calc(100vw-2rem)] sm:w-[85vw] max-w-2xl px-2 sm:px-0"
          >
            {exp.url ? (
              <a
                href={exp.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block group relative p-4 sm:p-8 md:p-12 bg-card border border-border hover:border-accent/50 transition-colors cursor-pointer"
              >
              {/* Large background period */}
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 md:top-8 md:right-8 text-[4rem] sm:text-[8rem] md:text-[12rem] font-bold text-accent/5 leading-none select-none">
                {exp.period}
              </div>

              <div className="card-content relative z-10">
                {/* Period badge */}
                <div className="inline-flex items-center gap-2 px-2 sm:px-3 py-1 bg-accent/10 border border-accent/20 mb-4 sm:mb-6">
                  <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                  <span className="text-accent text-xs sm:text-sm font-mono">{exp.period}</span>
                </div>

                {/* Company & Role */}
                <h3 className="text-xl sm:text-3xl md:text-4xl font-bold mb-2 break-words">{exp.company}</h3>
                <p className="text-muted-foreground text-base sm:text-lg md:text-xl mb-4 sm:mb-6">{exp.role}</p>

                {/* Description */}
                {exp.description && (
                  <p className="text-sm sm:text-base text-foreground/80 mb-6 sm:mb-8 leading-relaxed">
                    {exp.description}
                  </p>
                )}

                {/* Skills */}
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {exp.skills.map((skill) => (
                    <span
                      key={skill}
                      className="skill-tag px-2 sm:px-3 py-1 text-xs sm:text-sm border border-border text-muted-foreground hover:text-accent hover:border-accent/50 transition-colors cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-accent via-accent/50 to-transparent" />
              </a>
            ) : (
              <div className="group relative p-4 sm:p-8 md:p-12 bg-card border border-border hover:border-accent/50 transition-colors">
                {/* Large background period */}
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4 md:top-8 md:right-8 text-[4rem] sm:text-[8rem] md:text-[12rem] font-bold text-accent/5 leading-none select-none">
                  {exp.period}
                </div>

                <div className="card-content relative z-10">
                  {/* Period badge */}
                  <div className="inline-flex items-center gap-2 px-2 sm:px-3 py-1 bg-accent/10 border border-accent/20 mb-4 sm:mb-6">
                    <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                    <span className="text-accent text-xs sm:text-sm font-mono">{exp.period}</span>
                  </div>

                  {/* Company & Role */}
                  <h3 className="text-xl sm:text-3xl md:text-4xl font-bold mb-2 break-words">{exp.company}</h3>
                  <p className="text-muted-foreground text-base sm:text-lg md:text-xl mb-4 sm:mb-6">{exp.role}</p>

                  {/* Description */}
                  {exp.description && (
                    <p className="text-sm sm:text-base text-foreground/80 mb-6 sm:mb-8 leading-relaxed">
                      {exp.description}
                    </p>
                  )}

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {exp.skills.map((skill) => (
                      <span
                        key={skill}
                        className="skill-tag px-2 sm:px-3 py-1 text-xs sm:text-sm border border-border text-muted-foreground hover:text-accent hover:border-accent/50 transition-colors cursor-default"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-accent via-accent/50 to-transparent" />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
