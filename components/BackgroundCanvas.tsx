'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'

interface Particle {
  position: THREE.Vector3
  velocity: THREE.Vector3
}

function ParticleNetwork() {
  const particlesRef = useRef<THREE.Points>(null)
  const linesRef = useRef<THREE.LineSegments>(null)
  const mousePos = useRef({ x: 0, y: 0 })
  
  const particleCount = 80
  const maxDistance = 3.5
  const mouseInfluence = 2.0

  const particles = useMemo(() => {
    const pts: Particle[] = []
    for (let i = 0; i < particleCount; i++) {
      pts.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 10
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.01
        )
      })
    }
    return pts
  }, [particleCount])

  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    particles.forEach((p, i) => {
      pos[i * 3] = p.position.x
      pos[i * 3 + 1] = p.position.y
      pos[i * 3 + 2] = p.position.z
    })
    return pos
  }, [particles, particleCount])

  useFrame((state) => {
    if (!particlesRef.current || !linesRef.current) return

    const posAttr = particlesRef.current.geometry.attributes.position
    const linePositions: number[] = []

    // Mouse influence vector
    const mouseVector = new THREE.Vector3(
      mousePos.current.x * 10,
      mousePos.current.y * 10,
      0
    )

    // Update particle positions with gentle drift and mouse attraction
    particles.forEach((particle, i) => {
      // Gentle autonomous drift
      particle.position.add(particle.velocity)

      // Mouse attraction
      const distToMouse = particle.position.distanceTo(mouseVector)
      if (distToMouse < mouseInfluence * 2) {
        const attraction = mouseVector.clone().sub(particle.position).normalize().multiplyScalar(0.008)
        particle.position.add(attraction)
      }

      // Boundary wrapping
      if (Math.abs(particle.position.x) > 10) particle.position.x *= -0.99
      if (Math.abs(particle.position.y) > 10) particle.position.y *= -0.99
      if (Math.abs(particle.position.z) > 5) particle.position.z *= -0.99

      posAttr.setXYZ(i, particle.position.x, particle.position.y, particle.position.z)
    })

    posAttr.needsUpdate = true

    // Generate connection lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dist = particles[i].position.distanceTo(particles[j].position)
        
        if (dist < maxDistance) {
          linePositions.push(
            particles[i].position.x,
            particles[i].position.y,
            particles[i].position.z,
            particles[j].position.x,
            particles[j].position.y,
            particles[j].position.z
          )
        }
      }
    }

    // Update line geometry
    const lineGeometry = new THREE.BufferGeometry()
    lineGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(linePositions, 3)
    )
    linesRef.current.geometry.dispose()
    linesRef.current.geometry = lineGeometry
  })

  // Track mouse movement
  if (typeof window !== 'undefined') {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      }
    }
    
    if (!mousePos.current.x) {
      window.addEventListener('mousemove', handleMouseMove)
    }
  }

  return (
    <>
      {/* Particle nodes */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={positions}
            itemSize={3}
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          color="#111111"
          transparent
          opacity={0.4}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Connection lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry />
        <lineBasicMaterial
          color="#111111"
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </>
  )
}

export default function BackgroundCanvas() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 50 }}
        gl={{ 
          antialias: false,
          alpha: true,
          powerPreference: 'high-performance'
        }}
        dpr={[1, 1.5]}
      >
        <ParticleNetwork />
      </Canvas>
    </div>
  )
}
