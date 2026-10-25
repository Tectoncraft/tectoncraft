'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useRef, useEffect, useState } from 'react'
import { MeshTransmissionMaterial, Environment } from '@react-three/drei'
import * as THREE from 'three'

function InteractiveIcosahedron() {
  const meshRef = useRef<THREE.Mesh>(null)
  const wireframeRef = useRef<THREE.LineSegments>(null)
  const mousePos = useRef({ x: 0, y: 0 })
  const targetRotation = useRef({ x: 0, y: 0 })
  
  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      }
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useFrame((state) => {
    if (!meshRef.current || !wireframeRef.current) return

    // Smooth mouse-driven tilt with spring physics
    const tiltStrength = 0.3
    targetRotation.current.y = mousePos.current.x * tiltStrength
    targetRotation.current.x = mousePos.current.y * tiltStrength

    // Apply smooth interpolation (spring damping)
    meshRef.current.rotation.y += (targetRotation.current.y - meshRef.current.rotation.y) * 0.05
    meshRef.current.rotation.x += (targetRotation.current.x - meshRef.current.rotation.x) * 0.05

    // Gentle autonomous rotation
    meshRef.current.rotation.z = state.clock.elapsedTime * 0.1

    // Sync wireframe with main mesh
    wireframeRef.current.rotation.copy(meshRef.current.rotation)

    // Subtle breathing scale animation
    const breathScale = 1 + Math.sin(state.clock.elapsedTime * 0.6) * 0.04
    meshRef.current.scale.setScalar(breathScale)
    wireframeRef.current.scale.setScalar(breathScale)
  })

  return (
    <group>
      {/* Glass/Transmission Material Core */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.8, 1]} />
        <meshPhysicalMaterial
          color="#F4F4F0"
          metalness={0.1}
          roughness={0.1}
          transmission={0.95}
          thickness={0.5}
          transparent
          opacity={0.8}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Glowing Wireframe Overlay */}
      <lineSegments ref={wireframeRef}>
        <edgesGeometry args={[new THREE.IcosahedronGeometry(1.8, 1)]} />
        <lineBasicMaterial
          color="#111111"
          linewidth={2}
          transparent
          opacity={0.85}
        />
      </lineSegments>

      {/* Vertex Glow Points */}
      <points>
        <icosahedronGeometry args={[1.8, 1]} />
        <pointsMaterial
          size={0.12}
          color="#111111"
          transparent
          opacity={0.9}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}

export default function Scene3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      gl={{ 
        antialias: true, 
        alpha: true,
        powerPreference: 'high-performance'
      }}
      dpr={[1, 2]}
    >
      <color attach="background" args={['#0A0A0C']} />
      
      {/* Lighting setup for glass material */}
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color="#FFFFFF" />
      <pointLight position={[-5, -5, 2]} intensity={0.6} color="#F4F4F0" />
      <spotLight
        position={[0, 10, 0]}
        angle={0.5}
        penumbra={1}
        intensity={0.8}
        castShadow
      />
      
      <InteractiveIcosahedron />
    </Canvas>
  )
}
