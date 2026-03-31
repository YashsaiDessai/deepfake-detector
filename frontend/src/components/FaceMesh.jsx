import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Environment, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

useGLTF.preload('/models/human_face_young.glb')

function FaceModel() {
  const mainGroupRef = useRef(null)
  const { scene } = useGLTF('/models/human_face_young.glb')
  
  // We create the wireframe scene once. 
  // Using useState ensures it persists correctly across renders.
  const [wireframeScene] = useState(() => scene.clone())

  useEffect(() => {
    if (!scene || !wireframeScene) return

    // 1. Setup Realistic Materials
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({ 
          map: child.material.map, 
          roughness: 0.7, 
          metalness: 0.1 
        })
      }
    })

    // 2. Setup Netting (Wireframe) Materials
    wireframeScene.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshBasicMaterial({ 
          color: 0x00f2ff, 
          wireframe: true, 
          transparent: true, 
          opacity: 0 
        })
      }
    })
  }, [scene, wireframeScene])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    
    // 3. Apply your specific rotation/position parameters
    if (mainGroupRef.current) {
      mainGroupRef.current.rotation.y = Math.sin(t * 0.25) * 5.30
      mainGroupRef.current.position.y = 0 
    }
    
    // 4. Netting Reveal Logic
    const scanX = Math.sin(t * 1.5) * 0.8
    
    wireframeScene.traverse((child) => {
      if (child.isMesh) {
        const worldPos = new THREE.Vector3()
        child.getWorldPosition(worldPos)
        const dist = Math.abs(worldPos.x - scanX)
        // Adjust the '4' to make the netting strip wider or thinner
        child.material.opacity = Math.max(0, 1.0 - dist * 4)
      }
    })
  })

  return (
    <group ref={mainGroupRef}>
      {/* Layer 1: Realistic Head */}
      <primitive object={scene} />
      
      {/* Layer 2: Wireframe Head (Perfectly overlaid) */}
      <primitive object={wireframeScene} />
    </group>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={1.2} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <Environment preset="city" />
      <ContactShadows position={[0, -1.2, 0]} opacity={0.25} scale={10} blur={3} />
      <FaceModel />
    </>
  )
}

export default function FaceMesh() {
  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-full" style={{ height: '550px' }}>
        {/* The 'key' is the secret weapon. It forces the entire 3D engine to 
          re-initialize when you navigate, fixing the "random size" bug.
        */}
        <Canvas 
          key={Math.random()} 
          gl={{ antialias: true, alpha: true }} 
          camera={{ position: [0, 0, 2.6], fov: 22 }} 
        >
          <Scene />
        </Canvas>
      </div>
    </div>
  )
}