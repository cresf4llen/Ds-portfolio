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
    skills: [
      "Angular",
      "C#",
      "EF Core",
      "Asp.Net Core Web API",
      "Javascript",
      "MS SQL Server Programming and Administration",
    ],
  },
  {
    period: "24-25",
    company: "Swift Development Agency",
    role: "Full Stack Lead Engineer",
    skills: ["Angular", "React", "React Native", "Supabase", "GSAP", "TypeScript"],
  },
  {
    period: "25",
    company: "KooberCoders",
    role: "Internship",
    skills: ["Angular", "React", "React Native", "Three.js", "GSAP", "TypeScript"],
  },
  {
    period: "25",
    company: "DevHealth",
    role: "Full Stack Lead Engineer",
    skills: ["React", "TypeScript"],
  },
]

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.from(titleRef.current, {
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        x: -100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      })

      // Cards stagger animation
      const cards = cardsRef.current?.children || []
      gsap.from(cards, {
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
        y: 80,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      })

      // Horizontal scroll on desktop
      if (window.innerWidth >= 768) {
        const scrollContainer = cardsRef.current
        if (scrollContainer) {
          const scrollWidth = scrollContainer.scrollWidth - scrollContainer.clientWidth

          gsap.to(scrollContainer, {
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 20%",
              end: () => `+=${scrollWidth}`,
              scrub: 1,
              pin: true,
              anticipatePin: 1,
            },
            x: -scrollWidth,
            ease: "none",
          })
        }
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="experience" className="py-24 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <h2 ref={titleRef} className="text-3xl sm:text-4xl md:text-5xl font-bold mb-16">
          <span className="text-accent">03.</span> Experience
        </h2>

        <div ref={cardsRef} className="flex flex-col md:flex-row gap-6 md:gap-8 md:w-max">
          {experiences.map((exp, index) => (
            <div
              key={exp.company}
              className="group relative p-6 md:p-8 bg-card border border-border hover:border-accent/50 transition-colors md:w-[320px] flex-shrink-0"
            >
              <div className="absolute top-6 right-6 text-5xl md:text-6xl font-bold text-muted/20 group-hover:text-accent/20 transition-colors">
                {exp.period}
              </div>

              <div className="relative z-10">
                <span className="text-accent text-sm font-medium">{exp.period}</span>
                <h3 className="text-xl font-bold mt-2 mb-1">{exp.company}</h3>
                <p className="text-muted-foreground text-sm mb-6">{exp.role}</p>

                <div className="flex flex-wrap gap-2">
                  {exp.skills.map((skill) => (
                    <span key={skill} className="text-xs text-muted-foreground hover:text-accent transition-colors">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="absolute bottom-0 left-0 h-1 w-0 bg-accent group-hover:w-full transition-all duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
