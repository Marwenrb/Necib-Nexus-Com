import { Float, useGLTF, Environment } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useFrame as useRaf } from '@darkroom.engineering/hamo'
import { useScroll } from 'hooks/use-scroll'
import { button, useControls } from 'leva'
import { mapRange } from 'lib/maths'
import { useStore } from 'lib/store'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import {
  Color,
  DoubleSide,
  Euler,
  MathUtils,
  MeshPhysicalMaterial,
  Vector2,
  Vector3,
  FrontSide,
} from 'three'
import fragmentShader from './particles/fragment.glsl'
import vertexShader from './particles/vertex.glsl'

function Raf({ render = true }) {
  const { advance } = useThree()

  useRaf((time) => {
    if (render) {
      advance(time / 1000)
    }
  })
}

function Particles({
  width = 250,
  height = 250,
  depth = 250,
  count = 1500,
  scale = 100,
  size = 150,
}) {
  const positions = useMemo(() => {
    const array = new Array(count * 3)

    for (let i = 0; i < array.length; i += 3) {
      array[i] = MathUtils.randFloatSpread(width)
      array[i + 1] = MathUtils.randFloatSpread(height)
      array[i + 2] = MathUtils.randFloatSpread(depth)
    }

    return Float32Array.from(array)
  }, [count, scale, width, height, depth])

  const noise = useMemo(
    () =>
      Float32Array.from(
        Array.from({ length: count * 3 }, () => Math.random() * 100)
      ),
    [count]
  )

  const sizes = useMemo(
    () =>
      Float32Array.from(
        Array.from({ length: count }, () => Math.random() * size)
      ),
    [count, size]
  )

  const speeds = useMemo(
    () =>
      Float32Array.from(
        Array.from({ length: count }, () => Math.random() * 0.2)
      ),
    [count]
  )

  const scales = useMemo(
    () =>
      Float32Array.from(
        Array.from({ length: count }, () => Math.random() * 100)
      ),
    [count]
  )

  const material = useRef()
  const points = useRef()

  const uniforms = useMemo(
    () => ({
      uTime: {
        value: 0,
      },
      uColor: {
        value: new Color('rgb(0, 179, 255)'),
      },
      uScroll: {
        value: 0,
      },
      uResolution: {
        value: new Vector2(width, height),
      },
    }),
    []
  )

  useEffect(() => {
    uniforms.uResolution.value.set(width, height)
  }, [width, height])

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.elapsedTime
  })

  useScroll(({ scroll }) => {
    uniforms.uScroll.value = scroll
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-noise" args={[noise, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-speed" args={[speeds, 1]} />
        <bufferAttribute attach="attributes-scale" args={[scales, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        uniforms={uniforms}
      />
    </points>
  )
}

// Enhanced model sequence steps for a more premium experience
const steps = [
  // Robotic Glow - Entry and initial animation
  {
    position: [0, -0.5, 0],
    scale: 0.12,
    rotation: [0, Math.PI * 0.5, 0],
    type: 'roboticGlow',
  },
  {
    position: [0.15, -0.4, 0],
    scale: 0.15,
    rotation: [
      MathUtils.degToRad(-15),
      MathUtils.degToRad(-90),
      MathUtils.degToRad(-15),
    ],
    type: 'roboticGlow',
  },
  // Transition to mask
  {
    position: [0.1, -0.3, 0],
    scale: 0.12,
    rotation: [
      MathUtils.degToRad(15),
      MathUtils.degToRad(-180),
      MathUtils.degToRad(-15),
    ],
    type: 'punkMask',
  },
  {
    position: [-0.1, -0.2, 0],
    scale: 0.15,
    rotation: [
      MathUtils.degToRad(-20),
      MathUtils.degToRad(-225),
      MathUtils.degToRad(-20),
    ],
    type: 'punkMask',
  },
  // Transition to computer
  {
    position: [-0.3, -0.1, 0],
    scale: 0.15,
    rotation: [
      MathUtils.degToRad(-45),
      MathUtils.degToRad(-270),
      MathUtils.degToRad(-15),
    ],
    type: 'computer',
  },
  {
    position: [-0.2, -0.3, 0],
    scale: 0.18,
    rotation: [
      MathUtils.degToRad(-30),
      MathUtils.degToRad(-315),
      MathUtils.degToRad(-30),
    ],
    type: 'computer',
  },
  // Transition to arm
  {
    position: [0, -0.4, 0],
    scale: 0.14,
    rotation: [
      MathUtils.degToRad(10),
      MathUtils.degToRad(-360),
      MathUtils.degToRad(10),
    ],
    type: 'arm',
  },
  {
    position: [0.2, -0.3, 0],
    scale: 0.15,
    rotation: [
      MathUtils.degToRad(30),
      MathUtils.degToRad(-405),
      MathUtils.degToRad(15),
    ],
    type: 'arm',
  },
  // Transition to arm2
  {
    position: [0.3, -0.2, 0],
    scale: 0.16,
    rotation: [
      MathUtils.degToRad(45),
      MathUtils.degToRad(-450),
      MathUtils.degToRad(30),
    ],
    type: 'arm2',
  },
  {
    position: [0, -0.1, 0],
    scale: 0.18,
    rotation: [
      MathUtils.degToRad(20),
      MathUtils.degToRad(-495),
      MathUtils.degToRad(15),
    ],
    type: 'arm2',
  },
]

// Premium material settings for models
const createModelMaterial = (color = '#00B3FF', roughness = 0.4, metalness = 1.0) => {
  return new MeshPhysicalMaterial({
    color: new Color(color),
    metalness: metalness,
    roughness: roughness,
    envMapIntensity: 1.5,
    clearcoat: 0.8,
    clearcoatRoughness: 0.2,
    side: FrontSide,
    transparent: true,
    transmission: 0.2,
    reflectivity: 0.5,
    wireframe: false,
  })
}

// Basic material for wireframe effect
const wireMaterial = new MeshPhysicalMaterial({
  color: new Color('#00B3FF'),
  metalness: 1,
  roughness: 0.4,
  wireframe: true,
  side: DoubleSide,
})

export function Arm() {
  // Load all models
  const { scene: roboticGlow } = useGLTF('/models/robotic_glow_fbx.glb')
  const { scene: punkMask } = useGLTF('/models/handpainted_punk_mask_face.glb')
  const { scene: computer } = useGLTF('/models/old_computer.glb')
  const { scene: arm } = useGLTF('/models/arm.glb')
  const { scene: arm2 } = useGLTF('/models/arm2.glb')
  
  const [currentModel, setCurrentModel] = useState('roboticGlow')

  // Create refs for model groups
  const roboticRef = useRef()
  const maskRef = useRef()
  const computerRef = useRef()
  const armRef = useRef()
  const arm2Ref = useRef()
  const parentRef = useRef()

  // Apply materials to models
  useEffect(() => {
    // Create model-specific materials
    const roboticMaterial = createModelMaterial('#00B3FF', 0.3, 1)
    const maskMaterial = createModelMaterial('#00B3FF', 0.24, 0.9)
    const computerMaterial = createModelMaterial('#00B3FF', 0.36, 0.8)
    const armMaterial = createModelMaterial('#00B3FF', 0.3, 1)
    const arm2Material = createModelMaterial('#00B3FF', 0.3, 1)
    
    // Apply materials to each model
    if (roboticGlow) {
      roboticGlow.traverse((node) => {
        if (node.isMesh) {
          node.material = roboticMaterial;
          node.castShadow = true;
          node.receiveShadow = true;
        }
      })
    }
    
    if (punkMask) {
      punkMask.traverse((node) => {
        if (node.isMesh) {
          node.material = maskMaterial;
          node.castShadow = true;
          node.receiveShadow = true;
        }
      })
    }
    
    if (computer) {
      computer.traverse((node) => {
        if (node.isMesh) {
          node.material = computerMaterial;
          node.castShadow = true;
          node.receiveShadow = true;
        }
      })
    }
    
    if (arm) {
      arm.traverse((node) => {
        if (node.isMesh) {
          node.material = armMaterial;
          node.castShadow = true;
          node.receiveShadow = true;
        }
      })
    }
    
    if (arm2) {
      arm2.traverse((node) => {
        if (node.isMesh) {
          node.material = arm2Material;
          node.castShadow = true;
          node.receiveShadow = true;
        }
      })
    }
  }, [roboticGlow, punkMask, computer, arm, arm2])

  const { viewport } = useThree()

  // Create floating animation for models
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    
    if (roboticRef.current) {
      roboticRef.current.rotation.y += 0.001;
      roboticRef.current.position.y = Math.sin(t * 0.5) * 0.05;
    }
    
    if (maskRef.current) {
      maskRef.current.rotation.y += 0.0015;
      maskRef.current.position.y = Math.sin(t * 0.4 + 1) * 0.05;
    }
    
    if (computerRef.current) {
      computerRef.current.rotation.y += 0.001;
      computerRef.current.position.y = Math.sin(t * 0.6 + 2) * 0.05;
    }
    
    if (armRef.current) {
      armRef.current.rotation.y += 0.002;
      armRef.current.position.y = Math.sin(t * 0.3 + 3) * 0.05;
    }
    
    if (arm2Ref.current) {
      arm2Ref.current.rotation.y += 0.0025;
      arm2Ref.current.position.y = Math.sin(t * 0.7 + 4) * 0.05;
    }
  });

  // Simple scroll handler for model visibility
  useScroll(({ scroll }) => {
    if (!parentRef.current) return

    // Show model based on scroll position
    const scrollPercent = scroll / document.body.scrollHeight;
    
    if (scrollPercent < 0.2) {
      setCurrentModel('roboticGlow');
    } else if (scrollPercent < 0.4) {
      setCurrentModel('punkMask');
    } else if (scrollPercent < 0.6) {
      setCurrentModel('computer');
    } else if (scrollPercent < 0.8) {
      setCurrentModel('arm');
    } else {
      setCurrentModel('arm2');
    }
    
    // Simple position and scale adjustments
    parentRef.current.position.y = -scroll * 0.001;
    parentRef.current.rotation.y = scroll * 0.001;
  })

  return (
    <>
      {/* Ambient and directional lights */}
      <ambientLight args={[new Color('#00B3FF'), 0.5]} />
      <directionalLight 
        position={[-200, 150, 50]}
        args={[new Color('#00B3FF'), 1.5]} 
        castShadow 
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
      />
      <directionalLight 
        position={[300, -100, 150]}
        args={[new Color('#00B3FF'), 1.2]}
        castShadow 
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
      />
      
      {/* Environment for realistic reflections */}
      <Environment preset="city" />
      
      {/* Main container with floating animation */}
      <Float 
        floatIntensity={0.8} 
        rotationIntensity={0.5} 
        speed={2}
      >
        <group
          ref={parentRef}
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
        >
          {/* Robotic glow model */}
          <group 
            ref={roboticRef} 
            visible={currentModel === 'roboticGlow'}
            scale={[1, 1, 1]}
          >
            {roboticGlow && <primitive object={roboticGlow} />}
          </group>
          
          {/* Punk mask model */}
          <group 
            ref={maskRef} 
            visible={currentModel === 'punkMask'}
            scale={[1, 1, 1]}
          >
            {punkMask && <primitive object={punkMask} />}
          </group>
          
          {/* Computer model */}
          <group 
            ref={computerRef} 
            visible={currentModel === 'computer'}
            scale={[1, 1, 1]}
          >
            {computer && <primitive object={computer} />}
          </group>
          
          {/* Arm model */}
          <group 
            ref={armRef} 
            visible={currentModel === 'arm'}
            scale={[1, 1, 1]}
          >
            {arm && <primitive object={arm} />}
          </group>
          
          {/* Arm2 model */}
          <group 
            ref={arm2Ref} 
            visible={currentModel === 'arm2'}
            scale={[1, 1, 1]}
          >
            {arm2 && <primitive object={arm2} />}
          </group>
        </group>
      </Float>
    </>
  )
}

function Content() {
  const { viewport } = useThree()

  return (
    <>
      <Particles
        width={viewport.width}
        height={viewport.height}
        depth={500}
        count={1500}
        scale={500}
        size={150}
      />
      <Arm />
    </>
  )
}

export function WebGL({ render = true }) {
  return (
    <Canvas
      gl={{
        powerPreference: 'high-performance',
        antialias: true,
        alpha: true,
      }}
      dpr={[1, 2]}
      frameloop="never"
      shadows
      orthographic
      camera={{ 
        near: 0.01, 
        far: 10000, 
        position: [0, 0, 1000],
        zoom: 1.5
      }}
    >
      <Raf render={render} />
      <Suspense fallback={null}>
        <Content />
      </Suspense>
    </Canvas>
  )
}
