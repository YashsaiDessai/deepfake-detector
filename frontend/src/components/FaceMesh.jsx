import { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

/**
 * HumanFaceGeometry - Creates a realistic human face mesh with distinct features
 */
function createHumanFaceGeometry() {
  const geometry = new THREE.BufferGeometry()
  const vertices = []
  const indices = []

  // Create a smooth, realistic human head using parametric ellipsoid
  const segments = 48
  const rings = 40
  const faceWidth = 1.0
  const faceHeight = 1.3
  const faceDepth = 0.85
  
  for (let ring = 0; ring <= rings; ring++) {
    const v = ring / rings
    const phi = Math.PI * v
    const sinPhi = Math.sin(phi)
    const cosPhi = Math.cos(phi)
    
    for (let seg = 0; seg <= segments; seg++) {
      const u = seg / segments
      const theta = Math.PI * 2 * u
      const sinTheta = Math.sin(theta)
      const cosTheta = Math.cos(theta)
      
      // Create smooth, realistic head proportions
      let x = faceWidth * cosTheta * sinPhi
      let y = faceHeight * cosPhi - 0.1 // Slightly centered
      let z = faceDepth * sinTheta * sinPhi
      
      // Subtle cheek indentation
      if (Math.abs(sinTheta) > 0.3 && Math.abs(sinTheta) < 0.7) {
        if (cosPhi > 0.2 && cosPhi < 0.7) {
          z *= 0.92 // Very subtle
        }
      }
      
      // Chin tapering
      if (cosPhi < -0.1) {
        x *= 0.85
        z *= 0.8
      }
      
      // Forehead rounding
      if (cosPhi > 0.8) {
        x *= 0.95
      }
      
      vertices.push(x, y, z)
    }
  }

  // Create faces
  for (let ring = 0; ring < rings; ring++) {
    for (let seg = 0; seg < segments; seg++) {
      const a = ring * (segments + 1) + seg
      const b = a + 1
      const c = a + segments + 1
      const d = c + 1

      indices.push(a, c, b)
      indices.push(b, c, d)
    }
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(
    new Float32Array(vertices),
    3
  ))
  geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(indices), 1))
  geometry.computeVertexNormals()

  return geometry
}

/**
 * AnimatedScanLines - Creates animated horizontal scan lines
 */
function AnimatedScanLines() {
  const scanRef = useRef(null)

  useFrame(({ clock }) => {
    if (scanRef.current) {
      // Sweep scan line down from top to bottom
      scanRef.current.position.y = 1.3 - ((clock.elapsedTime * 2) % 2.6)
    }
  })

  return (
    <group ref={scanRef}>
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([-1.2, 0, 0.9, 1.2, 0, 0.9])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color={0x00ffff} transparent opacity={0.85} linewidth={2} fog={false} />
      </line>
    </group>
  )
}

/**
 * HumanFaceMesh Component - Renders a procedural human face with scan lines
 */
function HumanFaceMesh() {
  const groupRef = useRef(null)
  const faceRef = useRef(null)

  const { faceGeometry, edges } = useMemo(() => {
    const geom = createHumanFaceGeometry()
    const edgeGeom = new THREE.EdgesGeometry(geom, 20)
    return { faceGeometry: geom, edges: edgeGeom }
  }, [])

  // Rotation and animation
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002
      groupRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.4) * 0.12
    }

    // Pulsing glow effect
    if (faceRef.current && faceRef.current.material) {
      faceRef.current.material.emissiveIntensity = 0.2 + Math.sin(clock.elapsedTime * 2) * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {/* Main face mesh */}
      <mesh ref={faceRef} geometry={faceGeometry}>
        <meshPhongMaterial
          color={0x00ffff}
          emissive={0x00ffff}
          emissiveIntensity={0.2}
          wireframe={false}
          transparent={true}
          opacity={0.95}
          shininess={120}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Wireframe lines overlay for facial definition */}
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={0x00ffff} transparent opacity={0.4} linewidth={1} />
      </lineSegments>

      {/* Animated scan lines - sweeping down */}
      <AnimatedScanLines />
    </group>
  )
}

/**
 * Scene Component - Sets up the Three.js scene with lights and camera
 */
function Scene() {
  return (
    <>
      {/* Primary key light */}
      <pointLight position={[8, 10, 8]} intensity={1.2} color={0x00ffff} />
      {/* Fill light */}
      <pointLight position={[-6, 5, 6]} intensity={0.5} color={0xff00ff} />
      {/* Back light for definition */}
      <pointLight position={[0, -8, -8]} intensity={0.4} color={0x00ff88} />
      {/* Ambient for overall visibility */}
      <ambientLight intensity={0.3} color={0x00ffff} />

      {/* Face Mesh */}
      <HumanFaceMesh />

      {/* Camera Controls */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={true}
        autoRotateSpeed={1.2}
        minPolarAngle={Math.PI * 0.35}
        maxPolarAngle={Math.PI * 0.65}
      />
    </>
  )
}

/**
 * FaceMesh Component - Main component to display 3D hologram
 * Renders a procedural human face with scan line effects
 */
export default function FaceMesh() {
  const [isLoading, setIsLoading] = useState(true)
  const containerRef = useRef(null)

  useEffect(() => {
    // Minimal loading delay to allow canvas to mount
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
            camera={{ position: [0, 0, 3.5], fov: 45 }}
            style={{ width: '100%', height: '100%' }}
          >
            <color attach="background" args={['#0a0e27']} />
            <Scene />
          </Canvas>
        )}
      </div>
    </div>
  )
}
