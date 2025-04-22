import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from 'lib/store'
import { useWindowSize } from 'react-use'

// Create a custom shader material for more advanced particle effects
const ParticleMaterial = ({
  color,
  emissiveIntensity = 0.8,
  size = 1,
  opacity = 0.7
}) => {
  // Create a unique shader for each particle
  const uniforms = useMemo(() => ({
    time: { value: 0 },
    color: { value: new THREE.Color(color) },
    emissiveIntensity: { value: emissiveIntensity },
    opacity: { value: opacity },
  }), [color, emissiveIntensity, opacity]);

  useFrame(({ clock }) => {
    if (uniforms.time) uniforms.time.value = clock.getElapsedTime();
  });

  return (
    <meshStandardMaterial
      color={color}
      emissive={color}
      emissiveIntensity={emissiveIntensity}
      transparent
      opacity={opacity}
      metalness={0.8}
      roughness={0.2}
      onBeforeCompile={(shader) => {
        shader.uniforms.time = uniforms.time;
        // Add a glow effect to the fragments
        shader.fragmentShader = shader.fragmentShader.replace(
          '#include <output_fragment>',
          `
          #include <output_fragment>
          vec3 glow = outgoingLight * 0.5;
          float glowFactor = sin(vUv.x * 10.0 + time * 2.0) * 0.5 + 0.5;
          gl_FragColor.rgb += glow * glowFactor * emissiveIntensity * 0.5;
          `
        );
      }}
    />
  );
};

// Individual particle with trail effect
const Particle = ({ position, color, size, speed }) => {
  const mesh = useRef()
  const lenis = useStore(({ lenis }) => lenis)
  const initialPosition = useMemo(() => [...position], [position])
  
  useFrame((state) => {
    if (!mesh.current) return
    
    // Subtle floating animation
    mesh.current.position.y += Math.sin(state.clock.elapsedTime * 0.2 + initialPosition[0]) * 0.001 * speed
    mesh.current.position.x += Math.cos(state.clock.elapsedTime * 0.1 + initialPosition[1]) * 0.0005 * speed
    
    // Rotate particle
    mesh.current.rotation.x = state.clock.elapsedTime * 0.1 * speed
    mesh.current.rotation.z = state.clock.elapsedTime * 0.05 * speed
    
    // Parallax effect with scroll if lenis is available
    if (lenis) {
      const scrollY = lenis.scroll || 0
      mesh.current.position.y = initialPosition[1] + (scrollY * 0.0001 * speed) + 
        Math.sin(state.clock.elapsedTime * 0.2 + initialPosition[0]) * 0.001 * speed
    }
  })
  
  return (
    <group>
      {/* Main particle */}
      <mesh ref={mesh} position={position}>
        <octahedronGeometry args={[size, 0]} />
        <ParticleMaterial 
          color={color} 
          emissiveIntensity={0.8 + Math.random() * 0.2}
          opacity={0.7}
        />
      </mesh>
      
      {/* Smaller companion particles */}
      {[...Array(2)].map((_, i) => (
        <mesh 
          key={i}
          position={[
            position[0] + Math.sin(i * Math.PI * 2) * 0.05,
            position[1] + Math.cos(i * Math.PI * 2) * 0.05,
            position[2] - 0.05
          ]}
          scale={0.3}
        >
          <sphereGeometry args={[size * 0.5, 8, 8]} />
          <ParticleMaterial 
            color={color} 
            emissiveIntensity={0.9}
            opacity={0.5}
          />
        </mesh>
      ))}
    </group>
  )
}

// Particle field
const ParticleField = ({ count = 50 }) => {
  const { width, height } = useWindowSize()
  
  // Generate random particles with memoization
  const particles = useMemo(() => {
    const temp = []
    const colors = [
      new THREE.Color('#3a86ff').getStyle(), // Blue
      new THREE.Color('#8338ec').getStyle(), // Purple
      new THREE.Color('#ff006e').getStyle(), // Pink
      new THREE.Color('#00b4d8').getStyle()  // Cyan
    ]
    
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 20
      const y = (Math.random() - 0.5) * 10
      const z = (Math.random() - 0.5) * 5 - 3
      const color = colors[Math.floor(Math.random() * colors.length)]
      const size = Math.random() * 0.05 + 0.05
      const speed = Math.random() * 2 + 0.5
      
      temp.push({
        id: i,
        position: [x, y, z],
        color,
        size,
        speed
      })
    }
    return temp
  }, [count])
  
  return (
    <>
      {particles.map((particle) => (
        <Particle 
          key={particle.id}
          position={particle.position}
          color={particle.color}
          size={particle.size}
          speed={particle.speed}
        />
      ))}
    </>
  )
}

// Add a custom ambient light that pulses for glow effect
const PulsingLight = () => {
  const light = useRef()
  
  useFrame(({ clock }) => {
    if (light.current) {
      // Create a subtle pulsing effect
      light.current.intensity = 0.2 + Math.sin(clock.elapsedTime * 0.5) * 0.1
    }
  })
  
  return <ambientLight ref={light} intensity={0.3} />
}

// Custom scene to handle global effects
const Scene = () => {
  const scene = useRef()
  
  useFrame(({ clock }) => {
    if (scene.current) {
      // Add subtle movement to the entire scene
      scene.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.05) * 0.02
    }
  })
  
  return (
    <group ref={scene}>
      <PulsingLight />
      <directionalLight position={[0, 10, 5]} intensity={0.5} />
      <directionalLight position={[-10, -10, -5]} intensity={0.2} color="#8338ec" />
      <fog attach="fog" args={['#000', 8, 25]} />
      <ParticleField count={30} />
    </group>
  )
}

export const ParticleBackground = () => {
  return (
    <div style={{ 
      position: 'absolute', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%', 
      pointerEvents: 'none',
      zIndex: 0,
      opacity: 0.7
    }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 1.5]} // Lower DPR for better performance
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <Scene />
      </Canvas>
    </div>
  )
} 