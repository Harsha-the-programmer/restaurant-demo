import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

const particlesCount = 200;
const particlePositions = new Float32Array(particlesCount * 3);
const particleSizes = new Float32Array(particlesCount);
const particleAlphas = new Float32Array(particlesCount);

for (let i = 0; i < particlesCount; i++) {
  const radius = 5 + Math.random() * 10;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);

  particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
  particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
  particlePositions[i * 3 + 2] = radius * Math.cos(phi);

  particleSizes[i] = 0.02 + Math.random() * 0.05;
  particleAlphas[i] = 0.3 + Math.random() * 0.7;
}

function Particles() {
  const pointsRef = useRef();

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.02;
      pointsRef.current.rotation.x += delta * 0.01;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={particlePositions} itemSize={3} />
        <bufferAttribute attach="attributes-size" array={particleSizes} itemSize={1} />
        <bufferAttribute attach="attributes-alpha" array={particleAlphas} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={`
          attribute float size;
          attribute float alpha;
          varying float vAlpha;
          void main() {
            vAlpha = alpha;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          varying float vAlpha;
          uniform vec3 uColor;
          void main() {
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;
            float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
            gl_FragColor = vec4(uColor, alpha * vAlpha);
          }
        `}
        uniforms={{ uColor: { value: new THREE.Color(0xc9a84c) } }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function WineGlass() {
  const glassRef = useRef();
  const { viewport } = useThree();

  useFrame((state, delta) => {
    if (glassRef.current) {
      glassRef.current.rotation.y += delta * 0.15;
      glassRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
    }
  });

  return (
    <group ref={glassRef} scale={viewport.width < 768 ? 0.6 : 1}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.08, 0.08, 1.8, 32, 1, true]} />
          <meshPhysicalMaterial
            color={0xc9a84c}
            metalness={0.3}
            roughness={0.2}
            transmission={0.9}
            thickness={0.5}
            ior={1.5}
            transparent
            opacity={0.3}
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.45, 32, 32, 0, Math.PI * 2, 0, Math.PI / 1.8]} />
          <meshPhysicalMaterial
            color={0xc9a84c}
            metalness={0.2}
            roughness={0.1}
            transmission={0.95}
            thickness={0.8}
            ior={1.5}
            transparent
            opacity={0.25}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh>
          <torusGeometry args={[0.45, 0.02, 16, 32]} />
          <meshPhysicalMaterial
            color={0xe8c97a}
            metalness={0.8}
            roughness={0.1}
            emissive={0x8b6914}
            emissiveIntensity={0.3}
          />
        </mesh>
        <mesh>
          <cylinderGeometry args={[0.025, 0.025, 0.4, 16, 1, true]} />
          <meshPhysicalMaterial
            color={0xc9a84c}
            metalness={0.8}
            roughness={0.1}
            emissive={0x8b6914}
            emissiveIntensity={0.5}
          />
        </mesh>
        <mesh>
          <cylinderGeometry args={[0.18, 0, 0.18, 0.03, 32]} />
          <meshPhysicalMaterial
            color={0xc9a84c}
            metalness={0.8}
            roughness={0.1}
            emissive={0x8b6914}
            emissiveIntensity={0.3}
          />
        </mesh>
      </group>
      <pointLight
        position={[0, 1, 0]}
        color={0xffd700}
        intensity={2}
        distance={5}
        decay={2}
      />
    </group>
  );
}

function AmbientLights() {
  return (
    <>
      <ambientLight color={0x1a1a1a} intensity={0.5} />
      <directionalLight position={[5, 10, 5]} color={0xfff8e7} intensity={1} />
      <directionalLight position={[-5, 5, -5]} color={0xc9a84c} intensity={0.5} />
      <hemisphereLight skyColor={0x2a2a1a} groundColor={0x1a1a1a} intensity={0.5} />
    </>
  );
}

function HeroCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 45 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
      }}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
    >
      <AmbientLights />
      <Particles />
      <WineGlass />
    </Canvas>
  );
}

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      id="home"
      className="hero"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <HeroCanvas />

      <div
        className="hero-overlay"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 40%, #0d0d0d 100%)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="hero-content"
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          padding: '0 var(--container-padding)',
          maxWidth: '900px',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
          transition: 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <motion.span
          className="hero-eyebrow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: 'block',
            fontSize: '0.75rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            fontWeight: 500,
            marginBottom: '1.5rem',
            fontFamily: 'var(--font-body)',
          }}
        >
          EST. 2019 · HYDERABAD
        </motion.span>

        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 8vw, 5.5rem)',
            fontWeight: 500,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: 'var(--cream)',
            marginBottom: '1.5rem',
          }}
        >
          Where Every Meal{' '}
          <span
            className="gold-shimmer"
            style={{
              color: 'var(--gold)',
              background: 'linear-gradient(90deg, var(--gold-dim) 0%, var(--gold) 50%, var(--gold-light) 100%)',
              backgroundSize: '200% auto',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'shimmer 3s linear infinite',
            }}
          >
            Becomes a Memory
          </span>
        </motion.h1>

        <motion.p
          className="hero-subtext"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            lineHeight: 1.7,
            color: 'var(--cream-muted)',
            maxWidth: '600px',
            margin: '0 auto 3rem',
          }}
        >
          Exquisite Indian cuisine crafted with global techniques, served in an ambiance that speaks before we do.
        </motion.p>

        <motion.div
          className="hero-ctas"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: 'flex',
            gap: '1.5rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <a
            href="#menu"
            className="btn btn-primary"
            style={{
              padding: '1rem 2.5rem',
              fontSize: '0.875rem',
            }}
          >
            Explore Our Menu
          </a>
          <a
            href="#reserve"
            className="btn btn-outline"
            style={{
              padding: '1rem 2.5rem',
              fontSize: '0.875rem',
            }}
          >
            Reserve Tonight
          </a>
        </motion.div>
      </div>

      <motion.div
        className="scroll-indicator"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          bottom: '3rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          color: 'var(--gold)',
          opacity: 0.7,
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
        <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Scroll</span>
      </motion.div>

      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
      `}</style>
    </section>
  );
}