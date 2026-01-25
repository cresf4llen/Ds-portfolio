"use client"

import { useRef, useMemo, useEffect, useState, Suspense } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Float, MeshDistortMaterial } from "@react-three/drei"
import type * as THREE from "three"

// Detect mobile device
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent))
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return isMobile
}

// Hook to pause rendering when not visible
function useVisibility() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 }
    )

    // Find the hero section to observe
    const heroSection = document.querySelector('section')
    if (heroSection) {
      observer.observe(heroSection)
    }

    return () => observer.disconnect()
  }, [])

  return isVisible
}

// Component to control frame loop based on visibility
function FrameLoopController({ isVisible }: { isVisible: boolean }) {
  const { invalidate, clock } = useThree()
  
  useEffect(() => {
    if (!isVisible) {
      clock.stop()
    } else {
      clock.start()
      invalidate()
    }
  }, [isVisible, invalidate, clock])

  return null
}

function useMousePosition(enabled: boolean) {
  // Use ref instead of state to avoid re-renders on every mouse move
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (!enabled) return

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      }
    }
    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [enabled])

  return mouseRef
}

function CentralGeometry({ 
  mouseRef, 
  isMobile 
}: { 
  mouseRef: React.RefObject<{ x: number; y: number }>
  isMobile: boolean 
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const targetRotation = useRef({ x: 0, y: 0 })

  useFrame((state) => {
    if (meshRef.current) {
      const mouse = mouseRef.current || { x: 0, y: 0 }
      // Smooth mouse follow (disabled on mobile)
      targetRotation.current.x = isMobile ? 0 : mouse.y * 0.3
      targetRotation.current.y = isMobile ? 0 : mouse.x * 0.3

      meshRef.current.rotation.x +=
        (targetRotation.current.x + state.clock.elapsedTime * 0.1 - meshRef.current.rotation.x) * 0.05
      meshRef.current.rotation.y +=
        (targetRotation.current.y + state.clock.elapsedTime * 0.15 - meshRef.current.rotation.y) * 0.05
    }
  })

  // Reduce geometry complexity on mobile: 64 segments vs 200
  const tubularSegments = isMobile ? 64 : 200
  const radialSegments = isMobile ? 16 : 32

  return (
    <Float speed={isMobile ? 1 : 1.5} rotationIntensity={0.2} floatIntensity={isMobile ? 0.3 : 0.5}>
      <mesh ref={meshRef} scale={3.5} position={[0, 0, -2]}>
        <torusKnotGeometry args={[1, 0.35, tubularSegments, radialSegments, 2, 3]} />
        {isMobile ? (
          // Simpler material on mobile - no distortion shader
          <meshStandardMaterial
            color="#E84C30"
            emissive="#FF2200"
            emissiveIntensity={0.4}
            roughness={0.1}
            metalness={0.9}
          />
        ) : (
          <MeshDistortMaterial
            color="#E84C30"
            emissive="#FF2200"
            emissiveIntensity={0.4}
            roughness={0.1}
            metalness={0.9}
            distort={0.2}
            speed={3}
          />
        )}
      </mesh>
    </Float>
  )
}

function OrbitingSpheres({ isMobile }: { isMobile: boolean }) {
  const groupRef = useRef<THREE.Group>(null)

  // Reduce number of spheres on mobile: 3 vs 6
  const sphereCount = isMobile ? 3 : 6
  const spheres = useMemo(
    () =>
      Array.from({ length: sphereCount }, (_, i) => ({
        radius: 5 + Math.random() * 2,
        speed: 0.2 + Math.random() * 0.3,
        offset: (i / sphereCount) * Math.PI * 2,
        size: 0.1 + Math.random() * 0.15,
        yOffset: (Math.random() - 0.5) * 3,
      })),
    [sphereCount],
  )

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05
    }
  })

  return (
    <group ref={groupRef}>
      {spheres.map((sphere, i) => (
        <OrbitingSphere key={i} {...sphere} index={i} isMobile={isMobile} />
      ))}
    </group>
  )
}

function OrbitingSphere({
  radius,
  speed,
  offset,
  size,
  yOffset,
  index,
  isMobile,
}: {
  radius: number
  speed: number
  offset: number
  size: number
  yOffset: number
  index: number
  isMobile: boolean
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime * speed + offset
      meshRef.current.position.x = Math.cos(t) * radius
      meshRef.current.position.z = Math.sin(t) * radius
      meshRef.current.position.y = yOffset + Math.sin(t * 2) * 0.5
    }
  })

  // Reduce sphere segments on mobile: 8 vs 16
  const segments = isMobile ? 8 : 16

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[size, segments, segments]} />
      <meshStandardMaterial
        color={index % 2 === 0 ? "#E84C30" : "#ffffff"}
        emissive={index % 2 === 0 ? "#E84C30" : "#ffffff"}
        emissiveIntensity={0.5}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  )
}

function ParticleField({ isMobile }: { isMobile: boolean }) {
  const particlesRef = useRef<THREE.Points>(null)

  // Reduce particle count on mobile: 150 vs 500
  const particleCount = isMobile ? 150 : 500
  const { positions, sizes } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    const siz = new Float32Array(particleCount)
    for (let i = 0; i < particleCount; i++) {
      // Spread particles in a sphere
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      const r = 8 + Math.random() * 15

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)

      siz[i] = Math.random() * 0.05 + 0.02
    }
    return { positions: pos, sizes: siz }
  }, [particleCount])

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02
      particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#E84C30" transparent opacity={0.7} sizeAttenuation />
    </points>
  )
}

function GridLines() {
  const gridRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.position.z = (state.clock.elapsedTime * 0.5) % 2
    }
  })

  return (
    <group ref={gridRef} position={[0, -5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <gridHelper args={[50, 50, "#E84C30", "#1a1a1a"]} />
    </group>
  )
}

function Scene({ isMobile, isVisible }: { isMobile: boolean; isVisible: boolean }) {
  const mouseRef = useMousePosition(!isMobile && isVisible)

  return (
    <>
      <FrameLoopController isVisible={isVisible} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
      {/* Reduce number of lights on mobile */}
      {!isMobile && (
        <>
          <pointLight position={[-10, -10, -5]} color="#E84C30" intensity={1} />
          <pointLight position={[10, -5, 10]} color="#FF6B4A" intensity={0.5} />
        </>
      )}
      <spotLight position={[0, 20, 0]} angle={0.3} penumbra={1} color="#E84C30" intensity={2} />
      <CentralGeometry mouseRef={mouseRef} isMobile={isMobile} />
      <OrbitingSpheres isMobile={isMobile} />
      <ParticleField isMobile={isMobile} />
      {/* Skip grid lines on mobile for performance */}
      {!isMobile && <GridLines />}
      <fog attach="fog" args={["#0A0A0A", 10, 30]} />
    </>
  )
}

export default function ThreeScene() {
  const isMobile = useIsMobile()
  const isVisible = useVisibility()

  return (
    <div className="absolute inset-0 z-0">
      <Suspense fallback={<div className="absolute inset-0 bg-background" />}>
        <Canvas
          camera={{ position: [0, 0, 12], fov: 50 }}
          gl={{ 
            antialias: !isMobile, // Disable antialiasing on mobile
            alpha: true,
            powerPreference: isMobile ? "low-power" : "high-performance",
            // Reduce GPU memory usage
            preserveDrawingBuffer: false,
          }}
          // Limit pixel ratio to reduce GPU load
          dpr={isMobile ? [1, 1] : [1, 1.5]}
          // Performance mode with adaptive quality
          performance={{ min: 0.3, max: 0.8, debounce: 200 }}
          style={{ background: "transparent" }}
          // Use on-demand rendering when not visible
          frameloop={isVisible ? "always" : "never"}
        >
          <Scene isMobile={isMobile} isVisible={isVisible} />
        </Canvas>
      </Suspense>
    </div>
  )
}
