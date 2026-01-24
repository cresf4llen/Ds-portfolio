"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

// Tech stack with icons and descriptions
const techStack = [
  { 
    name: "Angular", 
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg",
    color: "#DD0031",
    experience: "3 years",
    description: "Enterprise apps & dashboards",
    orbit: 1,
    startAngle: 0 
  },
  { 
    name: "React", 
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    color: "#61DAFB",
    experience: "2 years",
    description: "Interactive UIs & SPAs",
    orbit: 1,
    startAngle: 120 
  },
  { 
    name: "TypeScript", 
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    color: "#3178C6",
    experience: "3 years",
    description: "Type-safe development",
    orbit: 1,
    startAngle: 240 
  },
  { 
    name: "C#", 
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg",
    color: "#512BD4",
    experience: "2 years",
    description: "Backend & game dev",
    orbit: 2,
    startAngle: 0 
  },
  { 
    name: ".NET Core", 
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dotnetcore/dotnetcore-original.svg",
    color: "#512BD4",
    experience: "2 years",
    description: "APIs & microservices",
    orbit: 2,
    startAngle: 90 
  },
  { 
    name: "SQL", 
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azuresqldatabase/azuresqldatabase-original.svg",
    color: "#CC2927",
    experience: "3 years",
    description: "Database design & optimization",
    orbit: 2,
    startAngle: 180 
  },
  { 
    name: "Node.js", 
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    color: "#339933",
    experience: "2 years",
    description: "Server-side JavaScript",
    orbit: 2,
    startAngle: 270 
  },
]

// Orbit configuration - more circular orbits for even spacing
const orbitConfig = {
  1: { radiusX: 90, radiusY: 90, duration: 18, tiltAngle: 60 },  // Circular orbit, tilted
  2: { radiusX: 150, radiusY: 150, duration: 28, tiltAngle: 60 }, // Circular orbit, tilted
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const orbitRef = useRef<HTMLDivElement>(null)
  const iconRefs = useRef<(HTMLDivElement | null)[]>([])
  const tweensRef = useRef<gsap.core.Tween[]>([])
  const [activeTech, setActiveTech] = useState<typeof techStack[0] | null>(null)

  // GSAP orbit animation - directly manipulates DOM, no React state updates
  useEffect(() => {
    if (!orbitRef.current) return

    // Kill any existing tweens
    tweensRef.current.forEach(tween => tween.kill())
    tweensRef.current = []

    iconRefs.current.forEach((iconEl, index) => {
      if (!iconEl) return

      const tech = techStack[index]
      const config = orbitConfig[tech.orbit as keyof typeof orbitConfig]
      const tiltRadian = (config.tiltAngle * Math.PI) / 180

      // Create a proxy object for GSAP to animate
      const proxy = { angle: tech.startAngle }

      const tween = gsap.to(proxy, {
        angle: tech.startAngle + 360,
        duration: config.duration,
        repeat: -1,
        ease: "none",
        onUpdate: () => {
          const radian = (proxy.angle * Math.PI) / 180
          
          // Calculate 3D position
          const x = Math.cos(radian) * config.radiusX
          const yFlat = Math.sin(radian) * config.radiusY
          const y = yFlat * Math.cos(tiltRadian)
          const z = yFlat * Math.sin(tiltRadian)
          
          // Calculate scale and opacity based on z
          const normalizedZ = (z + config.radiusY) / (config.radiusY * 2)
          const scale = 0.65 + normalizedZ * 0.45
          const opacity = 0.4 + normalizedZ * 0.6
          
          // Apply transforms directly to DOM element (no React state!)
          iconEl.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${scale})`
          iconEl.style.opacity = `${opacity}`
          iconEl.style.zIndex = `${Math.round(normalizedZ * 20)}`
          iconEl.style.filter = `brightness(${0.7 + normalizedZ * 0.3})`
        }
      })

      tweensRef.current.push(tween)
    })

    return () => {
      tweensRef.current.forEach(tween => tween.kill())
    }
  }, [])

  // Pause/resume on hover
  const handleMouseEnter = () => {
    tweensRef.current.forEach(tween => tween.pause())
  }

  const handleMouseLeave = () => {
    tweensRef.current.forEach(tween => tween.resume())
    setActiveTech(null)
  }

  // GSAP scroll animations
  useEffect(() => {
    const ctx = gsap.context(() => {
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

      gsap.from(orbitRef.current, {
        scrollTrigger: {
          trigger: orbitRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        scale: 0.8,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
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

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
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
            
            {/* Active tech details */}
            <div className={`mt-8 p-4 border border-border rounded-lg bg-secondary/30 transition-all duration-500 ${activeTech ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
              {activeTech && (
                <>
                  <div className="flex items-center gap-3 mb-2">
                    <img src={activeTech.icon} alt={activeTech.name} className="w-8 h-8" />
                    <h4 className="text-lg font-semibold" style={{ color: activeTech.color }}>{activeTech.name}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{activeTech.experience} of experience</p>
                  <p className="text-foreground">{activeTech.description}</p>
                </>
              )}
            </div>
          </div>

          {/* 3D Orbital Tech Stack */}
          <div className="flex flex-col items-center">
            <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-8">Tech Stack</h3>
            
            <div 
              ref={orbitRef}
              className="relative w-[340px] h-[340px] sm:w-[400px] sm:h-[400px]"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {/* 3D Orbit rings */}
              <div 
                className="absolute top-1/2 left-1/2 border border-border/20 rounded-full pointer-events-none"
                style={{
                  width: orbitConfig[1].radiusX * 2,
                  height: orbitConfig[1].radiusY * 2,
                  transform: `translate(-50%, -50%) rotateX(${orbitConfig[1].tiltAngle}deg)`,
                }}
              />
              <div 
                className="absolute top-1/2 left-1/2 border border-border/15 rounded-full pointer-events-none"
                style={{
                  width: orbitConfig[2].radiusX * 2,
                  height: orbitConfig[2].radiusY * 2,
                  transform: `translate(-50%, -50%) rotateX(${orbitConfig[2].tiltAngle}deg)`,
                }}
              />

              {/* Center core - DS */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-linear-to-br from-accent/30 to-accent/5 border border-accent/40 flex items-center justify-center z-30 shadow-lg shadow-accent/20">
                <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center">
                  <span className="text-accent font-bold text-lg">DS</span>
                </div>
              </div>

              {/* Tech icons */}
              {techStack.map((tech, index) => {
                const isActive = activeTech?.name === tech.name
                
                return (
                  <div
                    key={tech.name}
                    ref={el => { iconRefs.current[index] = el }}
                    className="absolute left-1/2 top-1/2 cursor-pointer will-change-transform"
                    onMouseEnter={() => setActiveTech(tech)}
                    onClick={() => setActiveTech(isActive ? null : tech)}
                  >
                    <div 
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-secondary/90 backdrop-blur-sm border-2 flex items-center justify-center transition-all duration-200 ${isActive ? 'scale-125' : ''}`}
                      style={{
                        borderColor: isActive ? tech.color : 'var(--border)',
                        boxShadow: isActive ? `0 0 25px ${tech.color}50, 0 0 50px ${tech.color}20` : 'none',
                      }}
                    >
                      <img 
                        src={tech.icon} 
                        alt={tech.name} 
                        className="w-7 h-7 sm:w-8 sm:h-8"
                      />
                    </div>
                    {/* Tooltip */}
                    <div 
                      className={`absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-popover border border-border rounded text-xs whitespace-nowrap transition-opacity duration-200 ${isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    >
                      {tech.name}
                    </div>
                  </div>
                )
              })}
            </div>

            <p className="text-xs text-muted-foreground mt-6">Hover to explore</p>
          </div>
        </div>
      </div>
    </section>
  )
}
