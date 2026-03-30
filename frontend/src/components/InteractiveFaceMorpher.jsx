import { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'

function InteractiveFaceMorpher() {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const cameraRef = useRef(null)
  const faceRef = useRef(null)
  const scanLinesRef = useRef([])
  const rotationAngle = useRef(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    try {
      if (!containerRef.current) {
        console.error('Container not found')
        setError('Container not found')
        return
      }

      console.log('Initializing Three.js scene...')

      // Scene setup
      const scene = new THREE.Scene()
      sceneRef.current = scene
      scene.background = new THREE.Color(0x0a0a1a)

      // Camera setup
      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight
      const camera = new THREE.PerspectiveCamera(
        75,
        width / height || 1,
        0.1,
        1000
      )
      camera.position.z = 2.5
      cameraRef.current = camera

      // Renderer setup
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setSize(width, height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setClearColor(0x0a0a1a, 1)
      rendererRef.current = renderer

      try {
        containerRef.current.appendChild(renderer.domElement)
        console.log('Renderer added to DOM')
      } catch (e) {
        console.error('Error appending renderer:', e)
        setError('Failed to render 3D view')
        return
      }

      // Lighting - improved for larger face
      const ambientLight = new THREE.AmbientLight(0x00ffff, 0.6)
      scene.add(ambientLight)

      const pointLight1 = new THREE.PointLight(0x00ffff, 1.2)
      pointLight1.position.set(6, 4, 6)
      pointLight1.castShadow = true
      scene.add(pointLight1)

      const pointLight2 = new THREE.PointLight(0xff00ff, 0.8)
      pointLight2.position.set(-6, -4, 6)
      pointLight2.castShadow = true
      scene.add(pointLight2)

      const fillLight = new THREE.PointLight(0xffffff, 0.4)
      fillLight.position.set(0, 0, -3)
      scene.add(fillLight)

      // Create face group
      const faceGroup = new THREE.Group()
      scene.add(faceGroup)
      faceRef.current = faceGroup

      // Create realistic human face (larger and more detailed)
      const createHumanFace = () => {
        const face = new THREE.Group()

        // Head base - larger scale
        const headGeom = new THREE.IcosahedronGeometry(0.8, 7)
        const headMat = new THREE.MeshStandardMaterial({
          color: 0xf0d4cc,
          emissive: 0x00ffff,
          emissiveIntensity: 0.15,
          metalness: 0.05,
          roughness: 0.85,
          map: null,
        })
        const head = new THREE.Mesh(headGeom, headMat)
        head.scale.set(0.93, 1.28, 0.87)
        head.castShadow = true
        head.receiveShadow = true
        face.add(head)

        // Forehead highlight
        const foreheadGeom = new THREE.BoxGeometry(0.8, 0.3, 0.15)
        const foreheadMat = new THREE.MeshStandardMaterial({
          color: 0xf5ddd4,
          roughness: 0.75,
          metalness: 0.02,
        })
        const forehead = new THREE.Mesh(foreheadGeom, foreheadMat)
        forehead.position.set(0, 0.6, 0.35)
        face.add(forehead)

        // Ears - larger and more detailed
        const earGeom = new THREE.SphereGeometry(0.18, 16, 16)
        const earMat = new THREE.MeshStandardMaterial({
          color: 0xf0d4cc,
          roughness: 0.8,
          metalness: 0.02,
        })
        const leftEar = new THREE.Mesh(earGeom, earMat)
        leftEar.position.set(-0.68, 0.15, 0.12)
        leftEar.scale.set(1.1, 1.4, 0.65)
        leftEar.castShadow = true
        face.add(leftEar)

        const rightEar = leftEar.clone()
        rightEar.position.set(0.68, 0.15, 0.12)
        face.add(rightEar)

        // Eyebrows - more expressive
        const browGeom = new THREE.BoxGeometry(0.32, 0.12, 0.08)
        const browMat = new THREE.MeshStandardMaterial({
          color: 0x3a2817,
          roughness: 0.7,
        })
        const leftBrow = new THREE.Mesh(browGeom, browMat)
        leftBrow.position.set(-0.36, 0.45, 0.52)
        leftBrow.rotation.z = 0.22
        leftBrow.castShadow = true
        face.add(leftBrow)

        const rightBrow = leftBrow.clone()
        rightBrow.position.set(0.36, 0.45, 0.52)
        rightBrow.rotation.z = -0.22
        face.add(rightBrow)

        // Eye sockets (subtle shadow)
        const eyeSocketGeom = new THREE.SphereGeometry(0.22, 12, 12)
        const eyeSocketMat = new THREE.MeshStandardMaterial({
          color: 0xead4cc,
          roughness: 0.85,
          metalness: 0,
        })
        const leftSocket = new THREE.Mesh(eyeSocketGeom, eyeSocketMat)
        leftSocket.position.set(-0.36, 0.18, 0.48)
        leftSocket.scale.set(1.1, 1, 0.6)
        face.add(leftSocket)

        const rightSocket = leftSocket.clone()
        rightSocket.position.set(0.36, 0.18, 0.48)
        face.add(rightSocket)

        // Eyes - larger and more detailed
        const eyeGeom = new THREE.SphereGeometry(0.18, 20, 20)
        const eyeWhiteMat = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          roughness: 0.4,
          metalness: 0.1,
        })
        const leftEye = new THREE.Mesh(eyeGeom, eyeWhiteMat)
        leftEye.position.set(-0.36, 0.18, 0.62)
        leftEye.castShadow = true
        face.add(leftEye)

        const rightEye = leftEye.clone()
        rightEye.position.set(0.36, 0.18, 0.62)
        face.add(rightEye)

        // Iris - more detailed
        const irisGeom = new THREE.SphereGeometry(0.085, 20, 20)
        const irisMat = new THREE.MeshStandardMaterial({
          color: 0x6b5344,
          metalness: 0.25,
          roughness: 0.35,
          emissive: 0x3d3d3d,
          emissiveIntensity: 0.2,
        })
        const irisLeft = new THREE.Mesh(irisGeom, irisMat)
        irisLeft.position.set(-0.36, 0.18, 0.72)
        face.add(irisLeft)

        const irisRight = irisLeft.clone()
        irisRight.position.set(0.36, 0.18, 0.72)
        face.add(irisRight)

        // Iris ring
        const irisRingGeom = new THREE.TorusGeometry(0.088, 0.008, 8, 16)
        const irisRingMat = new THREE.MeshStandardMaterial({ color: 0x4a3f35 })
        const ringLeft = new THREE.Mesh(irisRingGeom, irisRingMat)
        ringLeft.position.set(-0.36, 0.18, 0.73)
        ringLeft.rotation.x = Math.PI / 2
        face.add(ringLeft)

        const ringRight = ringLeft.clone()
        ringRight.position.set(0.36, 0.18, 0.73)
        face.add(ringRight)

        // Pupils - sharp
        const pupilGeom = new THREE.SphereGeometry(0.04, 12, 12)
        const pupilMat = new THREE.MeshStandardMaterial({
          color: 0x000000,
          metalness: 0.4,
          roughness: 0.2,
        })
        const pupilLeft = new THREE.Mesh(pupilGeom, pupilMat)
        pupilLeft.position.set(-0.36, 0.18, 0.785)
        face.add(pupilLeft)

        const pupilRight = pupilLeft.clone()
        pupilRight.position.set(0.36, 0.18, 0.785)
        face.add(pupilRight)

        // Eye shine/reflection
        const shineGeom = new THREE.SphereGeometry(0.015, 8, 8)
        const shineMat = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          metalness: 1,
          roughness: 0,
          emissive: 0xffffff,
          emissiveIntensity: 0.8,
        })
        const shineLeft = new THREE.Mesh(shineGeom, shineMat)
        shineLeft.position.set(-0.33, 0.22, 0.8)
        face.add(shineLeft)

        const shineRight = shineLeft.clone()
        shineRight.position.set(0.33, 0.22, 0.8)
        face.add(shineRight)

        // Nose - more prominent
        const noseGeom = new THREE.ConeGeometry(0.13, 0.52, 10)
        const noseMat = new THREE.MeshStandardMaterial({
          color: 0xefd4cc,
          roughness: 0.82,
          metalness: 0.02,
        })
        const nose = new THREE.Mesh(noseGeom, noseMat)
        nose.position.set(0, 0.08, 0.72)
        nose.rotation.z = Math.PI
        nose.castShadow = true
        face.add(nose)

        // Nosril shadows
        const nostrilGeom = new THREE.SphereGeometry(0.06, 8, 8)
        const nostrilMat = new THREE.MeshStandardMaterial({
          color: 0xdcc4ba,
          roughness: 0.9,
          metalness: 0,
        })
        const leftNostril = new THREE.Mesh(nostrilGeom, nostrilMat)
        leftNostril.position.set(-0.08, -0.16, 0.8)
        face.add(leftNostril)

        const rightNostril = leftNostril.clone()
        rightNostril.position.set(0.08, -0.16, 0.8)
        face.add(rightNostril)

        // Mouth - fuller
        const mouthGeom = new THREE.TorusGeometry(0.22, 0.048, 10, 24)
        const mouthMat = new THREE.MeshStandardMaterial({
          color: 0xce7f7f,
          emissive: 0xff9999,
          emissiveIntensity: 0.15,
          roughness: 0.65,
          metalness: 0,
        })
        const mouth = new THREE.Mesh(mouthGeom, mouthMat)
        mouth.position.set(0, -0.38, 0.62)
        mouth.rotation.z = Math.PI
        mouth.scale.set(1, 0.6, 1)
        mouth.castShadow = true
        face.add(mouth)

        // Cheekbones - more pronounced
        const cheekGeom = new THREE.SphereGeometry(0.28, 16, 16)
        const cheekMat = new THREE.MeshStandardMaterial({
          color: 0xf0d4cc,
          emissive: 0xff9999,
          emissiveIntensity: 0.1,
          roughness: 0.75,
          metalness: 0.02,
        })
        const leftCheek = new THREE.Mesh(cheekGeom, cheekMat)
        leftCheek.position.set(-0.52, -0.08, 0.3)
        leftCheek.scale.set(0.85, 0.75, 0.55)
        leftCheek.castShadow = true
        face.add(leftCheek)

        const rightCheek = leftCheek.clone()
        rightCheek.position.set(0.52, -0.08, 0.3)
        face.add(rightCheek)

        // Jawline contour - larger
        const jawGeom = new THREE.BoxGeometry(1.15, 0.2, 0.35)
        const jawMat = new THREE.MeshStandardMaterial({
          color: 0xf0d4cc,
          roughness: 0.85,
          metalness: 0.02,
        })
        const jaw = new THREE.Mesh(jawGeom, jawMat)
        jaw.position.set(0, -0.52, 0.08)
        jaw.rotation.z = 0.08
        jaw.castShadow = true
        face.add(jaw)

        // Chin definition
        const chinGeom = new THREE.BoxGeometry(0.5, 0.18, 0.25)
        const chinMat = new THREE.MeshStandardMaterial({
          color: 0xead4cc,
          roughness: 0.8,
          metalness: 0.01,
        })
        const chin = new THREE.Mesh(chinGeom, chinMat)
        chin.position.set(0, -0.68, 0.15)
        chin.castShadow = true
        face.add(chin)

        return face
      }

      // Create scanning lines
      const createScanLines = () => {
        const scanLines = []
        const numberOfLines = 12

        for (let i = 0; i < numberOfLines; i++) {
          const lineGeom = new THREE.BufferGeometry()
          const positions = []

          for (let j = 0; j <= 25; j++) {
            const x = (j / 25 - 0.5) * 2.2
            const y = 0.8 - (i / numberOfLines) * 1.6
            const z = 0.5
            positions.push(x, y, z)
          }

          lineGeom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3))

          const lineMat = new THREE.LineBasicMaterial({
            color: 0x00ff88,
            transparent: true,
            opacity: 0.35,
            emissive: 0x00ff88,
            emissiveIntensity: 0.6,
            linewidth: 2,
          })

          const line = new THREE.Line(lineGeom, lineMat)
          scene.add(line)
          scanLines.push({ line, material: lineMat })
        }

        return scanLines
      }

      // Create holographic shell
      const createHoloShell = () => {
        const shellGeom = new THREE.IcosahedronGeometry(1.15, 4)
        const shellMat = new THREE.MeshBasicMaterial({
          color: 0x00ffff,
          wireframe: true,
          transparent: true,
          opacity: 0.12,
          emissive: 0x00ffff,
          emissiveIntensity: 0.35,
        })
        const shell = new THREE.Mesh(shellGeom, shellMat)
        return shell
      }

      // Add face to scene
      const face = createHumanFace()
      faceRef.current.add(face)
      console.log('Face created')

      // Add scan lines
      const scanLines = createScanLines()
      scanLinesRef.current = scanLines
      console.log('Scan lines created:', scanLines.length)

      // Add holo shell
      const holoShell = createHoloShell()
      faceRef.current.add(holoShell)
      console.log('Holo shell created')

      setIsLoading(false)

      // Handle window resize
      const onWindowResize = () => {
        if (!containerRef.current || !cameraRef.current || !rendererRef.current) return
        const newWidth = containerRef.current.clientWidth
        const newHeight = containerRef.current.clientHeight
        cameraRef.current.aspect = newWidth / newHeight
        cameraRef.current.updateProjectionMatrix()
        rendererRef.current.setSize(newWidth, newHeight)
      }

      window.addEventListener('resize', onWindowResize)

      // Animation loop
      let animationFrameId = null

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate)

        // Rotate face left to right
        rotationAngle.current += 0.01
        const rotation = Math.sin(rotationAngle.current) * Math.PI

        if (faceRef.current) {
          faceRef.current.rotation.y = rotation
        }

        // Update scan lines visibility
        scanLinesRef.current.forEach((scanLine, index) => {
          const lineOpacity = Math.abs(Math.sin(rotationAngle.current + index * 0.3)) * 0.5 + 0.2
          scanLine.material.opacity = lineOpacity
        })

        if (rendererRef.current && sceneRef.current && cameraRef.current) {
          rendererRef.current.render(sceneRef.current, cameraRef.current)
        }
      }

      animate()

      // Cleanup
      return () => {
        cancelAnimationFrame(animationFrameId)
        window.removeEventListener('resize', onWindowResize)

        if (containerRef.current && rendererRef.current?.domElement?.parentNode === containerRef.current) {
          containerRef.current.removeChild(rendererRef.current.domElement)
        }

        rendererRef.current?.dispose()
        console.log('Cleanup complete')
      }
    } catch (err) {
      console.error('Error in InteractiveFaceMorpher:', err)
      console.error('Stack:', err.stack)
      setError('Failed to initialize 3D scene: ' + err.message)
      setIsLoading(false)
    }
  }, [])

  if (error) {
    return (
      <div
        className="w-full rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-8"
        style={{ height: 'clamp(250px, 35vw, 400px)' }}
      >
        <div className="text-center">
          <p className="text-red-400 text-sm font-medium">{error}</p>
          <p className="text-gray-400 text-xs mt-3">Check browser console (F12) for more details</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {isLoading && (
        <div
          className="w-full rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center"
          style={{ height: 'clamp(250px, 35vw, 400px)' }}
        >
          <div className="text-center">
            <div className="inline-block">
              <div className="w-12 h-12 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-cyan-400 text-sm mt-4 font-medium tracking-wider">Initializing hologram...</p>
          </div>
        </div>
      )}

      <div
        ref={containerRef}
        className={`w-full rounded-xl overflow-hidden shadow-2xl transition-all duration-300 ${isLoading ? 'hidden' : ''}`}
        style={{
          height: 'clamp(250px, 35vw, 400px)',
          border: '1px solid rgba(0, 255, 255, 0.2)',
          boxShadow:
            '0 0 30px rgba(0, 255, 255, 0.1), inset 0 0 30px rgba(0, 255, 255, 0.05), 0 0 60px rgba(0, 255, 136, 0.05)',
        }}
      />

      <div className="text-center mt-6 max-w-2xl px-4">
        <p className="text-cyan-400 text-sm font-medium tracking-widest">✦ DEEPFAKE DETECTION SCAN ✦</p>
        <p className="text-gray-400 text-xs mt-3">Face scanning and authentication in progress</p>
        <p className="text-gray-500 text-xs mt-2 italic">Advanced AI-powered biometric analysis</p>
      </div>
    </div>
  )
}

export default InteractiveFaceMorpher
