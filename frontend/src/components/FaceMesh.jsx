import { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

// Preload the model for better performance
useGLTF.preload('/models/barack_obama.glb')

/**
 * ParticleModel Component - Renders a particle system from a loaded 3D model
 */
function ParticleModel({ modelPath }) {
  const groupRef = useRef(null)
  const [hasError, setHasError] = useState(false)
  const gltf = useGLTF(modelPath, true)

  // Convert mesh to particle system
  const particleSystem = useMemo(() => {
    if (!gltf.scene) return null

    try {
      let geometry = null

      // Extract geometry from the scene
      gltf.scene.traverse((child) => {
        if (child.isMesh && !geometry) {
          geometry = child.geometry.clone()
        }
      })

      if (!geometry) {
        throw new Error('No mesh found in model')
      }

      // Get positions or create from vertices
      let positions
      if (geometry.attributes.position) {
        positions = geometry.attributes.position.array
      } else {
        positions = geometry.vertices
          ? new Float32Array(
              geometry.vertices.flatMap((v) => [v.x, v.y, v.z])
            )
          : null
      }

      if (!positions || positions.length === 0) {
        throw new Error('No valid positions in geometry')
      }

      // Create buffer geometry from positions
      const particleGeometry = new THREE.BufferGeometry()
      particleGeometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3)
      )

      // Create material with cyan glow
      const particleMaterial = new THREE.PointsMaterial({
        color: new THREE.Color(0x00ffff),
        size: 0.08,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.8,
        emissive: new THREE.Color(0x00ffff),
        emissiveIntensity: 0.5,
      })

      return { geometry: particleGeometry, material: particleMaterial }
    } catch (error) {
      console.error('Error creating particle system:', error)
      setHasError(true)
      return null
    }
  }, [gltf.scene])

  // Rotation animation
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0015
      groupRef.current.rotation.x += 0.0005
    }
  })

  if (hasError || !particleSystem) {
    return <WireframeSphere />
  }

  return (
    <group ref={groupRef}>
      <points
        geometry={particleSystem.geometry}
        material={particleSystem.material}
      />
    </group>
  )
}

/**
 * WireframeSphere Component - Fallback when model fails to load
 */
function WireframeSphere() {
  const meshRef = useRef(null)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.0015
      meshRef.current.rotation.x += 0.0005
    }
  })

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[2, 5]} />
      <meshPhongMaterial
        color={0x00ffff}
        wireframe={true}
        transparent={true}
        opacity={0.8}
        emissive={0x00ffff}
        emissiveIntensity={0.3}
      />
    </mesh>
  )
}

/**
 * Scene Component - Sets up the Three.js scene with lights and camera
 */
function Scene({ modelPath }) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} color={0x00ffff} />
      <pointLight position={[10, 10, 10]} intensity={1.2} color={0x00ffff} />
      <pointLight
        position={[-10, -10, 10]}
        intensity={0.6}
        color={0xff00ff}
      />

      {/* Model or Fallback */}
      <ParticleModel modelPath={modelPath} />

      {/* Camera Controls */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={true}
        autoRotateSpeed={2}
      />
    </>
  )
}

/**
 * FaceMesh Component - Main component to display 3D hologram
 * Renders a 3D particle face hologram with loading state
 */
export default function FaceMesh({ modelPath = '/models/barack_obama.glb' }) {
  const [isLoading, setIsLoading] = useState(true)
  const containerRef = useRef(null)

  useEffect(() => {
    // Simulate minimal loading delay to allow canvas to mount
    const timer = setTimeout(() => setIsLoading(false), 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {/* Container with responsive height */}
      <div
        ref={containerRef}
        className="w-full rounded-xl overflow-hidden shadow-2xl transition-all duration-300"
        style={{
          height: 'clamp(250px, 35vw, 400px)',
          background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.05) 0%, rgba(139, 0, 255, 0.05) 100%)',
          border: '1px solid rgba(0, 255, 255, 0.2)',
          boxShadow:
            '0 0 30px rgba(0, 255, 255, 0.1), inset 0 0 30px rgba(0, 255, 255, 0.05)',
        }}
      >
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
            <div className="text-center">
              <div className="inline-block">
                <div className="w-12 h-12 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-cyan-400 text-sm mt-4 font-medium tracking-wider">
                Loading hologram...
              </p>
            </div>
          </div>
        ) : (
          <Canvas
            gl={{
              antialias: true,
              alpha: true,
              preserveDrawingBuffer: false,
              powerPreference: 'high-performance',
            }}
            camera={{ position: [0, 0, 5], fov: 50, near: 0.1, far: 1000 }}
            className="w-full h-full"
            style={{ background: 'transparent' }}
            dpr={Math.min(window.devicePixelRatio, 2)}
          >
            <Scene modelPath={modelPath} />
          </Canvas>
        )}
      </div>

      {/* Info text below hologram */}
      <div className="text-center mt-6">
        <p className="text-cyan-400 text-sm font-medium tracking-widest">
          ✦ 3D FACE ANALYSIS HOLOGRAM ✦
        </p>
        <p className="text-gray-400 text-xs mt-2">
          Real-time deepfake detection powered by neural networks
        </p>
      </div>
    </div>
  )
}
