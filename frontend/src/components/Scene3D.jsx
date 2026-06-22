import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, OrbitControls, MeshDistortMaterial, Sphere, Environment } from '@react-three/drei'
import * as THREE from 'three'

/* Skincare palette — clean, light, luxe */
const PALETTE = ['#e8a598', '#b5c9b8', '#f2c4b0', '#d4c5b0', '#c8b8d0', '#e8d0b8', '#a8c4c0']

function ProductBottle({ position, color, scale = 1, speed = 1 }) {
  const bodyRef  = useRef()
  const capRef   = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (bodyRef.current) {
      bodyRef.current.rotation.y = t * 0.25 * speed
      bodyRef.current.rotation.x = Math.sin(t * 0.4 * speed) * 0.07
    }
    if (capRef.current) capRef.current.rotation.y = t * 0.25 * speed
  })

  return (
    <Float speed={speed * 1.4} rotationIntensity={0.3} floatIntensity={1} position={position}>
      <group scale={scale}>
        {/* Body */}
        <mesh ref={bodyRef} castShadow>
          <cylinderGeometry args={[0.28, 0.32, 1.1, 40]} />
          <meshPhysicalMaterial
            color={color}
            metalness={0.0}
            roughness={0.08}
            transmission={0.55}
            thickness={0.6}
            transparent
            opacity={0.88}
            envMapIntensity={1.5}
            clearcoat={1}
            clearcoatRoughness={0.05}
          />
        </mesh>
        {/* Neck */}
        <mesh position={[0, 0.7, 0]}>
          <cylinderGeometry args={[0.16, 0.28, 0.28, 40]} />
          <meshPhysicalMaterial color={color} transmission={0.5} thickness={0.4} transparent opacity={0.9} clearcoat={1} clearcoatRoughness={0.05} />
        </mesh>
        {/* Cap — matte white/cream */}
        <mesh ref={capRef} position={[0, 0.93, 0]}>
          <cylinderGeometry args={[0.18, 0.16, 0.22, 40]} />
          <meshStandardMaterial color="#f5ede4" roughness={0.3} metalness={0.05} />
        </mesh>
        {/* Subtle label ring */}
        <mesh position={[0, -0.1, 0]}>
          <torusGeometry args={[0.33, 0.01, 8, 48]} />
          <meshStandardMaterial color="#ffffff" opacity={0.4} transparent />
        </mesh>
      </group>
    </Float>
  )
}

function SerumOrb({ position, color }) {
  const ref = useRef()
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.7) * 0.25
      ref.current.rotation.y = state.clock.elapsedTime * 0.4
    }
  })
  return (
    <Float speed={2} rotationIntensity={0.8} floatIntensity={1.5} position={position}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.22, 48, 48]} />
        <MeshDistortMaterial
          color={color}
          distort={0.35}
          speed={2.5}
          transparent
          opacity={0.7}
          roughness={0.05}
          metalness={0.0}
          transmission={0.6}
        />
      </mesh>
    </Float>
  )
}

/* Soft background orb — very low opacity */
function BackgroundOrb({ position, color, size }) {
  const ref = useRef()
  useFrame((state) => {
    if (ref.current) ref.current.material.distort = 0.2 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05
  })
  return (
    <Float speed={0.8} floatIntensity={0.3} position={position}>
      <Sphere ref={ref} args={[size, 32, 32]}>
        <MeshDistortMaterial color={color} distort={0.2} speed={1} transparent opacity={0.1} />
      </Sphere>
    </Float>
  )
}

/* Floating petals / dots */
function Particles() {
  const count = 80
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 18
      arr[i * 3 + 1] = (Math.random() - 0.5) * 18
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8
    }
    return arr
  }, [])

  const ref = useRef()
  useFrame((s) => { if (ref.current) ref.current.rotation.y = s.clock.elapsedTime * 0.015 })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#e8a598" size={0.05} transparent opacity={0.45} sizeAttenuation />
    </points>
  )
}

export default function Scene3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      {/* Soft warm lighting */}
      <ambientLight intensity={1.2} color="#fff8f4" />
      <directionalLight position={[4, 6, 4]}  intensity={1.5} color="#ffe8d8" />
      <directionalLight position={[-4, 2, 2]} intensity={0.8} color="#d8e8d4" />
      <pointLight position={[0, -4, 3]} intensity={0.6} color="#f2c4b0" />

      <Environment preset="dawn" />

      <Particles />

      {/* Soft background orbs */}
      <BackgroundOrb position={[-5, 2, -4]}  color="#f2c4b0" size={2.5} />
      <BackgroundOrb position={[5, -1, -4]}  color="#b5c9b8" size={2}   />
      <BackgroundOrb position={[0, 4, -5]}   color="#e8d0b8" size={1.5} />

      {/* Main bottles */}
      <ProductBottle position={[-2.8, 0.5,  0]}  color="#e8a598" scale={1.05} speed={0.8} />
      <ProductBottle position={[0,   -0.2,  1]}  color="#b5c9b8" scale={1.25} speed={1.0} />
      <ProductBottle position={[2.8,  0.8,  0]}  color="#c8b8d0" scale={0.95} speed={1.2} />
      <ProductBottle position={[-1.4,-1.4, -1]}  color="#f2c4b0" scale={0.8}  speed={0.7} />
      <ProductBottle position={[1.6,  1.6, -0.5]} color="#d4c5b0" scale={0.75} speed={1.3} />

      {/* Serum orbs */}
      <SerumOrb position={[-2.2, 2.2,  1]}  color="#e8a598" />
      <SerumOrb position={[2.4, -1.4,  0.5]} color="#b5c9b8" />
      <SerumOrb position={[0.5,  2.8, -1]}  color="#d4c5b0" />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.4}
        maxPolarAngle={Math.PI / 1.8}
        minPolarAngle={Math.PI / 3}
      />
    </Canvas>
  )
}
