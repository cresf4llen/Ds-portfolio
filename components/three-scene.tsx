"use client"

import { useRef, useMemo, useEffect, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, MeshDistortMaterial } from "@react-three/drei"
import type * as THREE from "three"

function useMousePosition() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return mouse
}

function CentralGeometry({ mouse }: { mouse: { x: number; y: number } }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const targetRotation = useRef({ x: 0, y: 0 })

  useFrame((state) => {
    if (meshRef.current) {
      // Smooth mouse follow
      targetRotation.current.x = mouse.y * 0.3
      targetRotation.current.y = mouse.x * 0.3

      meshRef.current.rotation.x +=
        (targetRotation.current.x + state.clock.elapsedTime * 0.1 - meshRef.current.rotation.x) * 0.05
      meshRef.current.rotation.y +=
        (targetRotation.current.y + state.clock.elapsedTime * 0.15 - meshRef.current.rotation.y) * 0.05
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef} scale={3.5} position={[0, 0, -2]}>
        <torusKnotGeometry args={[1, 0.35, 200, 32, 2, 3]} />
        <MeshDistortMaterial
          color="#E84C30"
          emissive="#FF2200"
          emissiveIntensity={0.4}
          roughness={0.1}
          metalness={0.9}
          distort={0.2}
          speed={3}
        />
      </mesh>
    </Float>
  )
}

function OrbitingSpheres() {
  const groupRef = useRef<THREE.Group>(null)

  const spheres = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        radius: 5 + Math.random() * 2,
        speed: 0.2 + Math.random() * 0.3,
        offset: (i / 6) * Math.PI * 2,
        size: 0.1 + Math.random() * 0.15,
        yOffset: (Math.random() - 0.5) * 3,
      })),
    [],
  )

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05
    }
  })

  return (
    <group ref={groupRef}>
      {spheres.map((sphere, i) => (
        <OrbitingSphere key={i} {...sphere} index={i} />
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
}: {
  radius: number
  speed: number
  offset: number
  size: number
  yOffset: number
  index: number
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

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[size, 16, 16]} />
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

function ParticleField() {
  const particlesRef = useRef<THREE.Points>(null)

  const particleCount = 500
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
  }, [])

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

function Scene() {
  const mouse = useMousePosition()

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
      <pointLight position={[-10, -10, -5]} color="#E84C30" intensity={1} />
      <pointLight position={[10, -5, 10]} color="#FF6B4A" intensity={0.5} />
      <spotLight position={[0, 20, 0]} angle={0.3} penumbra={1} color="#E84C30" intensity={2} />
      <CentralGeometry mouse={mouse} />
      <OrbitingSpheres />
      <ParticleField />
      <GridLines />
      <fog attach="fog" args={["#0A0A0A", 10, 30]} />
    </>
  )
}

export default function ThreeScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
