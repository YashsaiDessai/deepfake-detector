import { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Realistic 3D head model (procedurally generated)
function RealisticHead() {
  const groupRef = useRef(null)
  const rotationRef = useRef(0)

  useFrame(() => {
    if (!groupRef.current) return
    rotationRef.current += 0.004
    groupRef.current.rotation.y = Math.sin(rotationRef.current) * Math.PI * 0.65
    groupRef.current.position.y = Math.sin(rotationRef.current * 0.5) * 0.08
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={[1, 1, 1]}>
      {/* Main head */}
      <mesh>
        <icosahedronGeometry args={[0.85, 7]} />
        <meshStandardMaterial
          color={0xf5d4cc}
          emissive={0x003366}
          emissiveIntensity={0.15}
          metalness={0.05}
          roughness={0.85}
        />
      </mesh>

      {/* Left eye socket */}
      <mesh position={[-0.28, 0.25, 0.75]}>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshStandardMaterial color={0xf0d4cc} roughness={0.9} metalness={0} />
      </mesh>

      {/* Right eye socket */}
      <mesh position={[0.28, 0.25, 0.75]}>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshStandardMaterial color={0xf0d4cc} roughness={0.9} metalness={0} />
      </mesh>

      {/* Left eye white */}
      <mesh position={[-0.28, 0.25, 0.82]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color={0xffffff} roughness={0.5} metalness={0.1} />
      </mesh>

      {/* Right eye white */}
      <mesh position={[0.28, 0.25, 0.82]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color={0xffffff} roughness={0.5} metalness={0.1} />
      </mesh>

      {/* Left iris */}
      <mesh position={[-0.28, 0.25, 0.91]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color={0x7d5f3f}
          metalness={0.3}
          roughness={0.4}
          emissive={0x3d3d3d}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Right iris */}
      <mesh position={[0.28, 0.25, 0.91]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color={0x7d5f3f}
          metalness={0.3}
          roughness={0.4}
          emissive={0x3d3d3d}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Left pupil */}
      <mesh position={[-0.28, 0.25, 0.96]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color={0x000000} metalness={0.5} roughness={0.2} />
      </mesh>

      {/* Right pupil */}
      <mesh position={[0.28, 0.25, 0.96]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color={0x000000} metalness={0.5} roughness={0.2} />
      </mesh>

      {/* Nose */}
      <mesh position={[0, 0.05, 0.85]}>
        <coneGeometry args={[0.12, 0.5, 8]} />
        <meshStandardMaterial color={0xf0d4cc} roughness={0.85} metalness={0.02} />
      </mesh>

      {/* Mouth */}
      <mesh position={[0, -0.35, 0.8]} rotation={[Math.PI, 0, 0]} scale={[1, 0.65, 1]}>
        <torusGeometry args={[0.22, 0.05, 10, 24]} />
        <meshStandardMaterial
          color={0xd87777}
          emissive={0xff9999}
          emissiveIntensity={0.1}
          roughness={0.65}
        />
      </mesh>

      {/* Left cheekbone */}
      <mesh position={[-0.52, 0.05, 0.4]}>
        <sphereGeometry args={[0.25, 12, 12]} />
        <meshStandardMaterial
          color={0xf5d4cc}
          emissive={0xff9999}
          emissiveIntensity={0.08}
          roughness={0.78}
        />
      </mesh>

      {/* Right cheekbone */}
      <mesh position={[0.52, 0.05, 0.4]}>
        <sphereGeometry args={[0.25, 12, 12]} />
        <meshStandardMaterial
          color={0xf5d4cc}
          emissive={0xff9999}
          emissiveIntensity={0.08}
          roughness={0.78}
        />
      </mesh>
    </group>
  )
}

// Scanning line effect with glow
function ScanningLineEffect() {
  const groupRef = useRef(null)
  const timeRef = useRef(0)
  const linesRef = useRef([])

  // Initialize lines once
  if (linesRef.current.length === 0) {
    for (let i = 0; i < 15; i++) {
      const lineGeom = new THREE.BufferGeometry()
      const positions = []

      for (let j = 0; j <= 80; j++) {
        const x = (j / 80 - 0.5) * 2.6
        const y = 0.75 - (i / 15) * 1.5
        const z = 0.05 + i * 0.02
        positions.push(x, y, z)
      }

      lineGeom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3))

      const lineMat = new THREE.LineBasicMaterial({
        color: 0x00ff88,
        transparent: true,
        opacity: 0.6,
        linewidth: 3,
        emissive: 0x00ff88,
        emissiveIntensity: 0.8,
      })

      const line = new THREE.Line(lineGeom, lineMat)
      linesRef.current.push({ line, material: lineMat })
    }
  }

  useFrame(() => {
    timeRef.current += 0.015
    const progress = (Math.sin(timeRef.current * 0.6) + 1) / 2

    linesRef.current.forEach(({ material }, idx) => {
      const normalizedIdx = idx / linesRef.current.length
      const distance = Math.abs(progress - normalizedIdx)
      const opacity = Math.pow(Math.max(0, 1 - distance * 2.2), 1.5) * 0.75
      material.opacity = opacity
      material.emissiveIntensity = opacity * 1.2
    })
  })

  return (
    <group ref={groupRef}>
      {linesRef.current.map(({ line }, idx) => (
        <primitive key={idx} object={line} />
      ))}
    </group>
  )
}

// Holographic wireframe shell
function HolographicShell() {
  const meshRef = useRef(null)
  const rotateRef = useRef(0)

  useFrame(() => {
    if (meshRef.current) {
      rotateRef.current += 0.001
      meshRef.current.rotation.x = Math.sin(rotateRef.current * 0.4) * 0.15
      meshRef.current.rotation.z = rotateRef.current * 0.3
    }
  })

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.3, 4]} />
      <meshBasicMaterial
        color={0x00ffff}
        wireframe={true}
        transparent={true}
        opacity={0.18}
        emissive={0x00ffff}
        emissiveIntensity={0.4}
      />
    </mesh>
  )
}

// Particle shimmer and glow
function ParticleGlow() {
  const pointsRef = useRef(null)
  const timeRef = useRef(0)
  const particleCount = 400

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      const idx3 = i * 3
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      const radius = 0.9 + Math.random() * 0.6

      positions[idx3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[idx3 + 1] = radius * Math.cos(phi)
      positions[idx3 + 2] = radius * Math.sin(phi) * Math.sin(theta)

      // Cyan to blue gradient
      colors[idx3] = Math.random() * 0.4
      colors[idx3 + 1] = 0.8 + Math.random() * 0.2
      colors[idx3 + 2] = 1

      sizes[i] = Math.random() * 0.08 + 0.015
    }

    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geom.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    return geom
  }, [])

  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: 0x00ffff,
        size: 0.06,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.55,
        vertexColors: true,
        emissive: 0x00ffff,
        emissiveIntensity: 0.4,
      }),
    []
  )

  useFrame(() => {
    timeRef.current += 0.002
    const pulse = 0.3 + Math.sin(timeRef.current * 1.4) * 0.35
    material.opacity = pulse

    if (pointsRef.current) {
      pointsRef.current.rotation.z += 0.0001
      pointsRef.current.rotation.x += 0.00005
    }
  })

  return <points ref={pointsRef} geometry={geometry} material={material} />
}

// Professional lighting
function LightingSetup() {
  return (
    <>
      <ambientLight intensity={0.55} color={0x00ffff} />
      <pointLight position={[7, 7, 7]} intensity={1.3} color={0x00ffff} />
      <pointLight position={[-7, 5, 6]} intensity={1.0} color={0xff00ff} />
      <pointLight position={[0, 4, -7]} intensity={0.9} color={0x0088ff} />
      <directionalLight position={[0, 0, 5]} intensity={0.6} color={0xffffff} />
    </>
  )
}

// Loading fallback
function LoadingFallback() {
  return (
    <mesh position={[0, 0, 0]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial color={0x00ffff} wireframe opacity={0.5} transparent />
    </mesh>
  )
}

// Canvas scene content
function SceneContent() {
  return (
    <>
      <LightingSetup />
      <RealisticHead />
      <HolographicShell />
      <ScanningLineEffect />
      <ParticleGlow />
    </>
  )
}

// Main component
export default function FaceScanner() {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      {/* 3D Scanner Canvas */}
      <div
        className="w-full rounded-xl overflow-hidden shadow-2xl relative"
        style={{
          height: 'clamp(300px, 45vw, 600px)',
          border: '2px solid rgba(0, 255, 255, 0.4)',
          boxShadow:
            '0 0 60px rgba(0, 255, 255, 0.3), inset 0 0 60px rgba(0, 255, 255, 0.1), 0 0 120px rgba(0, 128, 255, 0.15)',
          background:
            'linear-gradient(135deg, rgba(5,5,15,0.98) 0%, rgba(10,10,25,0.95) 50%, rgba(5,5,15,0.98) 100%)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <Canvas
          camera={{
            position: [0, 0.15, 3.2],
            fov: 50,
            near: 0.1,
            far: 1000,
          }}
          gl={{
            antialias: true,
            alpha: true,
            pixelRatio: Math.min(window.devicePixelRatio, 2),
            toneMappingExposure: 1.1,
            outputColorSpace: THREE.SRGBColorSpace,
          }}
          style={{ width: '100%', height: '100%' }}
        >
          <Suspense fallback={<LoadingFallback />}>
            <SceneContent />
          </Suspense>
        </Canvas>

        {/* Scan overlay effect */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(0,255,255,0.1) 0%, transparent 50%, rgba(0,255,136,0.05) 100%)',
            mixBlendMode: 'screen',
          }}
        />
      </div>

      {/* Info section */}
      <div className="text-center mt-10 max-w-3xl px-4">
        <div className="space-y-2">
          <p className="text-cyan-400 text-sm font-bold tracking-widest uppercase">
            ✦ DEEPFAKE DETECTION SYSTEM ✦
          </p>

          <p className="text-gray-300 text-sm leading-relaxed">
            Advanced AI-powered holographic face scanning and biometric authentication
          </p>

          <p className="text-gray-500 text-xs italic">
            Real-time analysis of facial landmarks, texture authenticity, and synthetic trace detection
          </p>
        </div>

        {/* Scan progress indicator */}
        <div className="mt-6 flex flex-col items-center gap-4">
          <div className="flex gap-2">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-cyan-400"
                style={{
                  animation: `scanPulse 2s ease-in-out infinite`,
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>

          <span className="text-cyan-400 text-xs font-mono tracking-wider">
            HOLOGRAPHIC SCAN IN PROGRESS...
          </span>

          {/* Status cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 w-full max-w-md">
            <div className="border border-cyan-400/40 rounded-lg px-3 py-2 backdrop-blur-sm bg-cyan-400/5">
              <p className="text-cyan-400 text-xs font-mono">Authenticity</p>
              <p className="text-cyan-300 font-bold text-sm">99.2%</p>
            </div>

            <div className="border border-cyan-400/40 rounded-lg px-3 py-2 backdrop-blur-sm bg-cyan-400/5">
              <p className="text-cyan-400 text-xs font-mono">Confidence</p>
              <p className="text-cyan-300 font-bold text-sm">98.8%</p>
            </div>

            <div className="border border-cyan-400/40 rounded-lg px-3 py-2 backdrop-blur-sm bg-cyan-400/5">
              <p className="text-cyan-400 text-xs font-mono">Liveness</p>
              <p className="text-cyan-300 font-bold text-sm">100%</p>
            </div>

            <div className="border border-cyan-400/40 rounded-lg px-3 py-2 backdrop-blur-sm bg-cyan-400/5">
              <p className="text-cyan-400 text-xs font-mono">Status</p>
              <p className="text-green-400 font-bold text-sm">VERIFIED</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scanPulse {
          0% {
            box-shadow: 0 0 8px rgba(0, 255, 255, 0.8);
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            box-shadow: 0 0 2px rgba(0, 255, 255, 0.4);
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  )
}
