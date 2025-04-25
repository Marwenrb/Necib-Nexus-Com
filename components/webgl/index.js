import { Float, useGLTF, Environment } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useFrame as useRaf } from '@darkroom.engineering/hamo'
import { useScroll } from 'hooks/use-scroll'
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
  count = 2000,
  scale = 120,
  size = 180,
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
        value: new Color('rgb(0, 66, 255)'),
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
const createModelMaterial = (
  color = '#0042ff',
  roughness = 0.3,
  metalness = 1.0
) => {
  return new MeshPhysicalMaterial({
    color: new Color(color),
    metalness: metalness,
    roughness: roughness,
    envMapIntensity: 2.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    side: FrontSide,
    transparent: true,
    transmission: 0.3,
    reflectivity: 0.7,
    emissive: new Color(color).multiplyScalar(0.3),
    wireframe: false,
  })
}

// Basic material for wireframe effect
const wireMaterial = new MeshPhysicalMaterial({
  color: new Color('#5352ED'),
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

  // Target rotation values for smooth interpolation
  const targetRotation = useRef({
    x: 0,
    y: Math.PI * 0.5,
    z: 0,
  })

  // Target position values for smooth interpolation
  const targetPosition = useRef({
    x: 0,
    y: 0,
    z: 0,
  })

  // Target scale for smooth interpolation
  const targetScale = useRef(1)

  // Easing function for smoother transitions
  const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3)

  // Apply materials to models
  useEffect(() => {
    // Create model-specific materials
    const roboticMaterial = createModelMaterial('#5352ED', 0.25, 1.0)
    const maskMaterial = createModelMaterial('#5352ED', 0.2, 0.9)
    const computerMaterial = createModelMaterial('#5352ED', 0.3, 0.8)
    const armMaterial = createModelMaterial('#5352ED', 0.25, 1.0)
    const arm2Material = createModelMaterial('#5352ED', 0.25, 1.0)

    // Apply materials to each model
    if (roboticGlow) {
      roboticGlow.traverse((node) => {
        if (node.isMesh) {
          node.material = roboticMaterial
          node.castShadow = true
          node.receiveShadow = true
        }
      })
    }

    if (punkMask) {
      punkMask.traverse((node) => {
        if (node.isMesh) {
          node.material = maskMaterial
          node.castShadow = true
          node.receiveShadow = true
        }
      })
    }

    if (computer) {
      computer.traverse((node) => {
        if (node.isMesh) {
          node.material = computerMaterial
          node.castShadow = true
          node.receiveShadow = true
        }
      })
    }

    if (arm) {
      arm.traverse((node) => {
        if (node.isMesh) {
          node.material = armMaterial
          node.castShadow = true
          node.receiveShadow = true
        }
      })
    }

    if (arm2) {
      arm2.traverse((node) => {
        if (node.isMesh) {
          node.material = arm2Material
          node.castShadow = true
          node.receiveShadow = true
        }
      })
    }
  }, [roboticGlow, punkMask, computer, arm, arm2])

  const { viewport } = useThree()

  // Create floating animation for models with improved rotation
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    // Apply smooth lerping to parent group rotation, position and scale
    if (parentRef.current) {
      // Smooth rotation lerping with easing
      parentRef.current.rotation.x = MathUtils.lerp(
        parentRef.current.rotation.x,
        targetRotation.current.x,
        0.05
      )

      parentRef.current.rotation.y = MathUtils.lerp(
        parentRef.current.rotation.y,
        targetRotation.current.y,
        0.05
      )

      parentRef.current.rotation.z = MathUtils.lerp(
        parentRef.current.rotation.z,
        targetRotation.current.z,
        0.05
      )

      // Smooth position lerping
      parentRef.current.position.x = MathUtils.lerp(
        parentRef.current.position.x,
        targetPosition.current.x,
        0.05
      )

      parentRef.current.position.y = MathUtils.lerp(
        parentRef.current.position.y,
        targetPosition.current.y,
        0.05
      )

      // Smooth scale lerping
      const currentScale = parentRef.current.scale.x
      const newScale = MathUtils.lerp(currentScale, targetScale.current, 0.05)
      parentRef.current.scale.setScalar(newScale)
    }

    // Individual model rotations are now gentler and more continuous
    if (roboticRef.current) {
      // Smooth continuous rotation - slower and more elegant
      roboticRef.current.rotation.y += 0.003
      roboticRef.current.rotation.x += Math.sin(t * 0.2) * 0.0005
      roboticRef.current.position.y = Math.sin(t * 0.5) * 0.05
    }

    if (maskRef.current) {
      maskRef.current.rotation.y += 0.002
      maskRef.current.rotation.z += Math.sin(t * 0.2) * 0.0003
      maskRef.current.position.y = Math.sin(t * 0.4 + 1) * 0.05
    }

    if (computerRef.current) {
      computerRef.current.rotation.y += 0.0025
      computerRef.current.rotation.x += Math.cos(t * 0.3) * 0.0004
      computerRef.current.position.y = Math.sin(t * 0.6 + 2) * 0.05
    }

    if (armRef.current) {
      armRef.current.rotation.y += 0.002
      armRef.current.rotation.x += Math.sin(t * 0.4) * 0.0005
      armRef.current.rotation.z += Math.cos(t * 0.3) * 0.0003
      armRef.current.position.y = Math.sin(t * 0.3 + 3) * 0.05
    }

    if (arm2Ref.current) {
      arm2Ref.current.rotation.y += 0.0025
      arm2Ref.current.rotation.x += Math.cos(t * 0.5) * 0.0004
      arm2Ref.current.rotation.z += Math.sin(t * 0.3) * 0.0003
      arm2Ref.current.position.y = Math.sin(t * 0.7 + 4) * 0.05
    }
  })

  // Enhanced scroll handler with smooth transitions
  useScroll(({ scroll }) => {
    if (!parentRef.current) return

    // Get document height and calculate scroll percentage
    const docHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight
    )

    const scrollPercent = scroll / docHeight
    const viewportScale = viewport.height * 0.15

    // Update target values based on scroll position - the animation frame will smoothly interpolate to these values
    if (scrollPercent < 0.2) {
      setCurrentModel('roboticGlow')

      // Set target values instead of directly applying them
      targetScale.current = viewportScale
      targetPosition.current = {
        x: viewport.width * 0.1,
        y: viewport.height * -0.1,
        z: 0,
      }
      targetRotation.current = {
        x: 0,
        y: Math.PI * 0.5,
        z: 0,
      }
    } else if (scrollPercent < 0.4) {
      setCurrentModel('punkMask')

      targetScale.current = viewportScale
      targetPosition.current = {
        x: viewport.width * -0.1,
        y: viewport.height * -0.05,
        z: 0,
      }
      targetRotation.current = {
        x: MathUtils.degToRad(-15),
        y: MathUtils.degToRad(-180),
        z: MathUtils.degToRad(-15),
      }
    } else if (scrollPercent < 0.6) {
      setCurrentModel('computer')

      targetScale.current = viewportScale
      targetPosition.current = {
        x: viewport.width * -0.15,
        y: viewport.height * 0,
        z: 0,
      }
      targetRotation.current = {
        x: MathUtils.degToRad(-30),
        y: MathUtils.degToRad(-270),
        z: MathUtils.degToRad(-15),
      }
    } else if (scrollPercent < 0.8) {
      setCurrentModel('arm')

      targetScale.current = viewportScale
      targetPosition.current = {
        x: viewport.width * 0.05,
        y: viewport.height * 0.05,
        z: 0,
      }
      targetRotation.current = {
        x: MathUtils.degToRad(10),
        y: MathUtils.degToRad(-360),
        z: MathUtils.degToRad(10),
      }
    } else {
      setCurrentModel('arm2')

      targetScale.current = viewportScale
      targetPosition.current = {
        x: viewport.width * 0.2,
        y: viewport.height * 0.1,
        z: 0,
      }
      targetRotation.current = {
        x: MathUtils.degToRad(20),
        y: MathUtils.degToRad(-450),
        z: MathUtils.degToRad(15),
      }
    }

    // Instead of sharp transitions between models, fade them in/out
    // Set opacity based on how close we are to the model's scroll range
    if (roboticRef.current) {
      const fadePoint = Math.abs(scrollPercent - 0.1) / 0.1
      const opacity = Math.max(0, 1 - fadePoint)
      roboticRef.current.visible = opacity > 0.01
      roboticRef.current.traverse((node) => {
        if (node.isMesh && node.material) {
          node.material.opacity = opacity
        }
      })
    }

    if (maskRef.current) {
      const fadePoint = Math.abs(scrollPercent - 0.3) / 0.1
      const opacity = Math.max(0, 1 - fadePoint)
      maskRef.current.visible = opacity > 0.01
      maskRef.current.traverse((node) => {
        if (node.isMesh && node.material) {
          node.material.opacity = opacity
        }
      })
    }

    if (computerRef.current) {
      const fadePoint = Math.abs(scrollPercent - 0.5) / 0.1
      const opacity = Math.max(0, 1 - fadePoint)
      computerRef.current.visible = opacity > 0.01
      computerRef.current.traverse((node) => {
        if (node.isMesh && node.material) {
          node.material.opacity = opacity
        }
      })
    }

    if (armRef.current) {
      const fadePoint = Math.abs(scrollPercent - 0.7) / 0.1
      const opacity = Math.max(0, 1 - fadePoint)
      armRef.current.visible = opacity > 0.01
      armRef.current.traverse((node) => {
        if (node.isMesh && node.material) {
          node.material.opacity = opacity
        }
      })
    }

    if (arm2Ref.current) {
      const fadePoint = Math.abs(scrollPercent - 0.9) / 0.1
      const opacity = Math.max(0, 1 - fadePoint)
      arm2Ref.current.visible = opacity > 0.01
      arm2Ref.current.traverse((node) => {
        if (node.isMesh && node.material) {
          node.material.opacity = opacity
        }
      })
    }
  })

  return (
    <>
      {/* Ambient and directional lights */}
      <ambientLight args={[new Color('#0042ff'), 0.5]} />
      <directionalLight
        position={[-200, 150, 50]}
        args={[new Color('#0042ff'), 1.8]}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
      />
      <directionalLight
        position={[300, -100, 150]}
        args={[new Color('#0042ff'), 1.2]}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
      />
      <pointLight
        position={[0, 0, 120]}
        args={[new Color('#0042ff'), 1.2, 500]}
        castShadow={false}
      />

      {/* Environment for realistic reflections */}
      <Environment preset="city" background={false} blur={0.8} />

      {/* Main container with floating animation */}
      <Float
        floatIntensity={0.8}
        rotationIntensity={0.5}
        speed={1.8}
        floatingRange={[-0.05, 0.05]}
      >
        <group ref={parentRef} position={[0, 0, 0]} rotation={[0, 0, 0]}>
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
        width={viewport.width * 1.2}
        height={viewport.height * 1.2}
        depth={600}
        count={2000}
        scale={500}
        size={200}
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
      frameloop="always"
      shadows
      orthographic
      camera={{
        near: 0.01,
        far: 10000,
        position: [0, 0, 1000],
        zoom: 2.0,
        fov: 50,
      }}
    >
      <Raf render={render} />
      <Suspense fallback={null}>
        <Content />
      </Suspense>
    </Canvas>
  )
}
