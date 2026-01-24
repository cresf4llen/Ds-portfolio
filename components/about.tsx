"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

// Tech stack with icons, descriptions, and orbit positions
const techStack = [
  { 
    name: "Angular", 
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg",
    color: "#DD0031",
    experience: "3 years",
    description: "Enterprise apps & dashboards",
    orbit: 1,
    angle: 0 
  },
  { 
    name: "React", 
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    color: "#61DAFB",
    experience: "2 years",
    description: "Interactive UIs & SPAs",
    orbit: 1,
    angle: 120 
  },
  { 
    name: "TypeScript", 
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    color: "#3178C6",
    experience: "3 years",
    description: "Type-safe development",
    orbit: 1,
    angle: 240 
  },
  { 
    name: "C#", 
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg",
    color: "#512BD4",
    experience: "2 years",
    description: "Backend & game dev",
    orbit: 2,
    angle: 45 
  },
  { 
    name: ".NET Core", 
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dotnetcore/dotnetcore-original.svg",
    color: "#512BD4",
    experience: "2 years",
    description: "APIs & microservices",
    orbit: 2,
    angle: 135 
  },
  { 
    name: "SQL", 
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azuresqldatabase/azuresqldatabase-original.svg",
    color: "#CC2927",
    experience: "3 years",
    description: "Database design & optimization",
    orbit: 2,
    angle: 225 
  },
  { 
    name: "Node.js", 
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    color: "#339933",
    experience: "2 years",
    description: "Server-side JavaScript",
    orbit: 2,
    angle: 315 
  },
]

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const orbitRef = useRef<HTMLDivElement>(null)
  const [activeTech, setActiveTech] = useState<typeof techStack[0] | null>(null)
  const [orbitScale, setOrbitScale] = useState(1)
  
  // Store animation references for each icon and orbit ring
  const iconAnimationsRef = useRef<Map<string, gsap.core.Tween>>(new Map())
  const orbitAnimationsRef = useRef<Map<number, gsap.core.Tween>>(new Map())

  // Responsive orbit scale based on window width
  useEffect(() => {
    const updateOrbitScale = () => {
      const width = window.innerWidth
      if (width < 360) {
        setOrbitScale(0.55)
      } else if (width < 480) {
        setOrbitScale(0.65)
      } else if (width < 640) {
        setOrbitScale(0.75)
      } else if (width < 768) {
        setOrbitScale(0.85)
      } else {
        setOrbitScale(1)
      }
    }
    
    updateOrbitScale()
    window.addEventListener('resize', updateOrbitScale)
    return () => window.removeEventListener('resize', updateOrbitScale)
  }, [])

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

      // Orbit container fade in
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

  // Orbit animation - oscillate between -45 and +45 degrees (runs once on mount)
  useEffect(() => {
    if (!orbitRef.current) return

    const orbitElements = orbitRef.current.querySelectorAll('.orbit-ring')
    const allAnimations: gsap.core.Tween[] = []
    
    // Animate orbit rings
    orbitElements.forEach((ring, index) => {
      const direction = index % 2 === 0 ? 1 : -1
      const duration = 4 + index * 2
      const orbitIndex = index + 1 // 1-based orbit index
      
      gsap.set(ring, { rotation: direction * -30 })
      
      const anim = gsap.to(ring, {
        rotation: direction * 30,
        duration: duration,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      })
      
      // Store reference for this orbit ring's animation
      orbitAnimationsRef.current.set(orbitIndex, anim)
      allAnimations.push(anim)
    })

    // Animate each icon with counter-rotation and store references
    const icons = orbitRef.current.querySelectorAll('.orbit-icon')
    icons.forEach((icon) => {
      const techName = icon.getAttribute('data-tech') || ''
      const orbitIndex = parseInt(icon.getAttribute('data-orbit') || '1')
      const direction = orbitIndex % 2 === 0 ? 1 : -1
      const duration = 4 + (orbitIndex - 1) * 2
      
      gsap.set(icon, { rotation: -direction * -30 })
      
      const anim = gsap.to(icon, {
        rotation: -direction * 30,
        duration: duration,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      })
      
      // Store reference for this icon's animation
      iconAnimationsRef.current.set(techName, anim)
      allAnimations.push(anim)
    })

    return () => {
      allAnimations.forEach(anim => anim.kill())
      iconAnimationsRef.current.clear()
      orbitAnimationsRef.current.clear()
    }
  }, [])

  // Pause/resume individual icon animation and its orbit ring
  const handleIconHover = useCallback((element: HTMLElement, techName: string, orbitIndex: number, isPaused: boolean) => {
    const iconAnim = iconAnimationsRef.current.get(techName)
    const orbitAnim = orbitAnimationsRef.current.get(orbitIndex)
    
    if (isPaused) {
      iconAnim?.pause()
      orbitAnim?.pause()
      // Scale up the icon
      gsap.to(element, { scale: 1.25, duration: 0.3, ease: "power2.out" })
    } else {
      iconAnim?.resume()
      orbitAnim?.resume()
      // Scale back to normal
      gsap.to(element, { scale: 1, duration: 0.3, ease: "power2.out" })
    }
  }, [])

  const getOrbitRadius = useCallback((orbit: number) => {
    const baseRadius = 80 * orbitScale
    return baseRadius + (orbit * 60 * orbitScale)
  }, [orbitScale])

  const getPosition = useCallback((angle: number, orbit: number) => {
    const radius = getOrbitRadius(orbit)
    const radian = (angle * Math.PI) / 180
    return {
      x: Math.cos(radian) * radius,
      y: Math.sin(radian) * radius,
    }
  }, [getOrbitRadius])

  return (
    <section ref={sectionRef} id="about" className="min-h-screen py-16 px-4 sm:py-20 sm:px-6 md:py-24 flex items-center">
      <div className="max-w-6xl mx-auto w-full">
        <h2 ref={titleRef} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-8 sm:mb-12 md:mb-16">
          <span className="text-accent">01.</span> About
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
          <div ref={textRef} className="space-y-4 sm:space-y-6 relative order-1 md:order-1">
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              <span className="text-foreground font-semibold">18-year-old Fullstack Engineer</span> from Tbilisi, Georgia, 
              with <span className="text-foreground">3 years of experience</span> and expertise in frontend and Angular. 
              <span className="text-accent font-semibold"> Authorized to work in the United States</span> with a green card.
            </p>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Placed <span className="text-foreground font-semibold">20th</span> in the largest national hackathon, 
              developing <a href="https://www.devhealth.online/" target="_blank" rel="noopener noreferrer" className="text-accent font-semibold hover:underline">DevHealth</a> , 
              a software/extension to optimize your coding.
            </p>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Founded <span className="text-accent font-semibold">SwiftDev Agency</span> serving international clients with
              professional digital solutions for growing businesses.
            </p>
            
            {/* Active tech details - hidden on mobile, shown below orbit on mobile via separate element */}
            <div className={`hidden sm:block absolute left-0 right-0 top-full mt-4 p-4 border border-border rounded-lg bg-secondary/30 backdrop-blur-sm transition-all duration-500 ${activeTech ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
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

          {/* Orbital Tech Stack */}
          <div className="flex flex-col items-center order-2 md:order-2">
            <h3 className="text-xs sm:text-sm uppercase tracking-widest text-muted-foreground mb-4 sm:mb-8">Tech Stack</h3>
            
            <div 
              ref={orbitRef}
              className="relative w-[240px] h-[240px] xs:w-[280px] xs:h-[280px] sm:w-[320px] sm:h-[320px] md:w-[340px] md:h-[340px] lg:w-[380px] lg:h-[380px]"
            >
              {/* Center core */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-linear-to-br from-accent/20 to-accent/5 border border-accent/30 flex items-center justify-center z-10">
                <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-accent/20 flex items-center justify-center animate-pulse">
                  <span className="text-accent font-bold text-xs sm:text-sm">DS</span>
                </div>
              </div>

              {/* Orbital rings */}
              {[1, 2].map((orbitIndex) => (
                <div
                  key={orbitIndex}
                  className="orbit-ring absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border/30"
                  style={{
                    width: getOrbitRadius(orbitIndex) * 2,
                    height: getOrbitRadius(orbitIndex) * 2,
                  }}
                >
                  {/* Orbit glow effect */}
                  <div 
                    className="absolute inset-0 rounded-full opacity-20"
                    style={{
                      background: `radial-gradient(circle at 50% 0%, var(--accent) 0%, transparent 50%)`,
                    }}
                  />
                </div>
              ))}

              {/* Decorative glow particles */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" style={{ zIndex: 1 }}>
                <defs>
                  <radialGradient id="particleGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                  </radialGradient>
                </defs>
                {/* Static glow dots on orbits - using percentage-based positioning */}
                <circle cx="70" cy="25" r="1.5" fill="url(#particleGlow)" className="animate-pulse" />
                <circle cx="25" cy="75" r="1" fill="url(#particleGlow)" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
                <circle cx="80" cy="60" r="1.2" fill="url(#particleGlow)" className="animate-pulse" style={{ animationDelay: '0.3s' }} />
                <circle cx="30" cy="30" r="0.8" fill="url(#particleGlow)" className="animate-pulse" style={{ animationDelay: '0.7s' }} />
              </svg>

              {/* Tech icons */}
              {techStack.map((tech, index) => {
                const pos = getPosition(tech.angle, tech.orbit)
                return (
                  <div
                    key={tech.name}
                    className={`orbit-icon absolute w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl bg-secondary/80 backdrop-blur-sm border-2 flex items-center justify-center cursor-pointer transition-[border-color,box-shadow] duration-300 ${activeTech?.name === tech.name ? 'z-20' : ''}`}
                    data-orbit={tech.orbit}
                    data-tech={tech.name}
                    style={{
                      top: `calc(50% + ${pos.y}px)`,
                      left: `calc(50% + ${pos.x}px)`,
                      transform: 'translate(-50%, -50%)',
                      borderColor: activeTech?.name === tech.name ? tech.color : 'var(--border)',
                      boxShadow: activeTech?.name === tech.name ? `0 0 20px ${tech.color}40` : 'none',
                      zIndex: activeTech?.name === tech.name ? 20 : 5,
                    }}
                    onMouseEnter={(e) => {
                      setActiveTech(tech)
                      handleIconHover(e.currentTarget as HTMLElement, tech.name, tech.orbit, true)
                    }}
                    onMouseLeave={(e) => {
                      setActiveTech(null)
                      handleIconHover(e.currentTarget as HTMLElement, tech.name, tech.orbit, false)
                    }}
                    onClick={() => setActiveTech(activeTech?.name === tech.name ? null : tech)}
                  >
                    <img 
                      src={tech.icon} 
                      alt={tech.name} 
                      className="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 transition-transform duration-300"
                    />
                    {/* Tooltip - hidden on mobile, use tap to select instead */}
                    <div className={`hidden sm:block absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-popover border border-border rounded text-xs whitespace-nowrap transition-all duration-200 ${activeTech?.name === tech.name ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
                      {tech.name}
                    </div>
                  </div>
                )
              })}

              {/* Floating particles */}
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-accent/40 animate-float-particle"
                  style={{
                    top: `${25 + (i * 7) % 50}%`,
                    left: `${20 + (i * 11) % 60}%`,
                    animationDelay: `${i * 0.3}s`,
                  }}
                />
              ))}
            </div>

            <p className="text-xs text-muted-foreground mt-4 sm:mt-6 hidden sm:block">Hover to explore</p>
            <p className="text-xs text-muted-foreground mt-4 sm:hidden">Tap to explore</p>
            
            {/* Mobile tech details - shown below orbit on mobile only */}
            <div className={`sm:hidden w-full mt-4 p-3 border border-border rounded-lg bg-secondary/30 backdrop-blur-sm transition-all duration-500 ${activeTech ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              {activeTech && (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <img src={activeTech.icon} alt={activeTech.name} className="w-6 h-6" />
                    <h4 className="text-base font-semibold" style={{ color: activeTech.color }}>{activeTech.name}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{activeTech.experience} of experience</p>
                  <p className="text-sm text-foreground">{activeTech.description}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
