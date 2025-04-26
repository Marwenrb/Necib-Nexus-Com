import React, { useRef, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom, ChromaticAberration, DepthOfField } from '@react-three/postprocessing';
import { Vector3, Color, AdditiveBlending, MathUtils } from 'three';
import { useMousePosition } from '../../utils/useMousePosition';
import ModelViewer from './ModelViewer';
import { Environment, Html, Float, Sparkles } from '@react-three/drei';

// Particle class for background dots
const Particles = ({ count = 2000, mouse }) => {
  const mesh = useRef();
  const light = useRef();
  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;

  // Generate random particles
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const time = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const x = (Math.random() - 0.5) * 50;
      const y = (Math.random() - 0.5) * 50;
      const z = (Math.random() - 0.5) * 50;

      temp.push({ time, factor, speed, x, y, z, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  // Positions and colors for all particles
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = particles[i].x;
      positions[i3 + 1] = particles[i].y;
      positions[i3 + 2] = particles[i].z;
      
      const colorIndex = i % 5;
      const primary = new Color('#7c3aed');
      const secondary = new Color('#4895ef');
      const tertiary = new Color('#3730a3');
      
      if (colorIndex === 0) {
        primary.toArray(colors, i3);
      } else if (colorIndex === 1) {
        secondary.toArray(colors, i3);
      } else {
        tertiary.toArray(colors, i3);
      }
    }
    
    return [positions, colors];
  }, [count, particles]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Move light in a circular pattern
    light.current.position.x = Math.sin(time * 0.2) * 20;
    light.current.position.z = Math.cos(time * 0.2) * 20;
    
    // Update particles
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Time and factor based movement
      particles[i].time += particles[i].speed;
      
      // Mouse influence (normalized coordinates)
      const mouseX = mouse.current[0] / viewport.width;
      const mouseY = mouse.current[1] / viewport.height;
      
      particles[i].mx += (mouseX - particles[i].mx) * 0.01;
      particles[i].my += (mouseY - particles[i].my) * 0.01;
      
      // Calculate new position
      const x = particles[i].x + Math.sin(particles[i].time) * 0.1 + particles[i].mx * 2;
      const y = particles[i].y + Math.cos(particles[i].time) * 0.1 - particles[i].my * 2;
      const z = particles[i].z + Math.sin(particles[i].time) * 0.1;
      
      // Update positions
      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;
    }
    
    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <>
      <pointLight ref={light} distance={60} intensity={30} color="#7c3aed" />
      <points ref={mesh}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={colors.length / 3}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.5}
          vertexColors
          blending={AdditiveBlending}
          sizeAttenuation
          transparent
          opacity={0.8}
        />
      </points>
    </>
  );
};

// Floating line grid
const Grid = ({ mouse }) => {
  const grid = useRef();
  const { viewport } = useThree();
  
  // Create grid lines
  const linePositions = useMemo(() => {
    const positions = [];
    const size = 40;
    const divisions = 20;
    const step = size / divisions;
    
    // Create horizontal lines
    for (let i = 0; i <= divisions; i++) {
      const y = (i * step) - (size / 2);
      positions.push(-size/2, y, 0);
      positions.push(size/2, y, 0);
    }
    
    // Create vertical lines
    for (let i = 0; i <= divisions; i++) {
      const x = (i * step) - (size / 2);
      positions.push(x, -size/2, 0);
      positions.push(x, size/2, 0);
    }
    
    return new Float32Array(positions);
  }, []);
  
  useFrame(() => {
    // Rotate grid slightly based on mouse position
    const mouseX = mouse.current[0] / viewport.width;
    const mouseY = mouse.current[1] / viewport.height;
    
    grid.current.rotation.x = MathUtils.lerp(grid.current.rotation.x, mouseY * 0.1, 0.05);
    grid.current.rotation.y = MathUtils.lerp(grid.current.rotation.y, mouseX * 0.1, 0.05);
  });
  
  return (
    <group ref={grid} position={[0, 0, -10]} rotation={[0.1, 0.1, 0]}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={linePositions.length / 3}
            array={linePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#4895ef" transparent opacity={0.1} />
      </lineSegments>
    </group>
  );
};

// Loading component
const Loader = () => {
  return (
    <Html center>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontFamily: 'sans-serif'
      }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '3px solid rgba(124, 58, 237, 0.3)',
          borderTop: '3px solid rgba(124, 58, 237, 1)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '20px'
        }} />
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <p>Loading 3D Experience...</p>
      </div>
    </Html>
  );
};

// Main component export
const ExploreBackground = ({ className }) => {
  const mouse = useRef([0, 0]);
  const mousePosition = useMousePosition();
  
  useEffect(() => {
    mouse.current = [mousePosition.x - window.innerWidth / 2, -(mousePosition.y - window.innerHeight / 2)];
  }, [mousePosition]);
  
  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 0, 15], fov: 75 }}>
        <ambientLight intensity={0.2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        
        <Suspense fallback={<Loader />}>
          {/* Our custom model */}
          <Float
            speed={2}
            rotationIntensity={0.2}
            floatIntensity={0.5}
          >
            <ModelViewer 
              modelPath="/models/energized_tvman_accurate.glb" 
              mouse={mouse}
              position={[0, -1, 0]}
              rotation={[0, Math.PI, 0]}
              scale={2.5}
            />
          </Float>
          
          {/* Enhanced particles */}
          <Particles count={1800} mouse={mouse} />
          <Grid mouse={mouse} />
          
          {/* Sparkles for magical effect */}
          <Sparkles 
            count={50} 
            scale={12} 
            size={4} 
            speed={0.3} 
            opacity={0.5}
            color={'#7c3aed'} 
          />
          
          {/* Enhanced post-processing */}
          <EffectComposer>
            <Bloom 
              luminanceThreshold={0.2} 
              luminanceSmoothing={0.9} 
              height={300} 
              opacity={1.5}
            />
            <ChromaticAberration 
              offset={[0.0015, 0.0015]} 
              radialModulation={true}
              modulationOffset={0.5}
            />
            <DepthOfField
              focusDistance={0.01}
              focalLength={0.02}
              bokehScale={3}
            />
          </EffectComposer>
          
          {/* Environment lighting */}
          <Environment preset="night" background={false} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ExploreBackground; 