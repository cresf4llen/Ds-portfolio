"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const skills = [
  { name: "Angular", level: 90 },
  { name: "React", level: 85 },
  { name: "TypeScript", level: 90 },
  { name: "Three.js", level: 80 },
  { name: "GSAP", level: 85 },
  { name: "Node.js", level: 75 },
]

const techStack = [
  "Angular",
  "React",
  "C#",
  ".NET Core",
  "EF Core", 
  "SQL",
]

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const skillsRef = useRef<HTMLDivElement>(null)

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

      // Text reveal
      gsap.from(textRef.current?.children || [], {
        scrollTrigger: {
          trigger: textRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
      })

      // Skills animation
      const skillItems = skillsRef.current?.children || []
      gsap.set(skillItems, {
        x: 60,
        opacity: 0,
        rotateY: -15,
      })

      gsap.to(skillItems, {
        scrollTrigger: {
          trigger: skillsRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        x: 0,
        opacity: 1,
        rotateY: 0,
        duration: 0.6,
        stagger: {
          each: 0.08,
          from: "start",
        },
        ease: "power2.out",
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="about" className="min-h-screen py-24 px-6 flex items-center">
      <div className="max-w-6xl mx-auto w-full">
        <h2 ref={titleRef} className="text-3xl sm:text-4xl md:text-5xl font-bold mb-16">
          <span className="text-accent">01.</span> About
        </h2>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          <div ref={textRef} className="space-y-6">
            <p className="text-muted-foreground leading-relaxed">
              <span className="text-foreground font-semibold">18-year-old Fullstack Engineer</span> from Tbilisi, Georgia, 
              with <span className="text-foreground">3 years of experience</span> and expertise in frontend and Angular. 
              <span className="text-accent font-semibold"> Authorized to work in the United States</span> with a green card.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Placed <span className="text-foreground font-semibold">20th</span> in the largest national hackathon, 
              developing <a href="https://www.devhealth.online/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">DevHealth</a> , 
              a software/extension to optimize your coding.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Founded <span className="text-accent">SwiftDev Agency</span> serving international clients with
              professional digital solutions for growing businesses.
            </p>
          </div>

          <div>
            <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-6">Tech Stack</h3>
            <div ref={skillsRef} className="flex flex-wrap gap-3" style={{ perspective: "1000px" }}>
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 bg-secondary text-secondary-foreground text-sm border border-border hover:border-accent hover:text-accent transition-all duration-300 cursor-default hover:translate-x-1"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
