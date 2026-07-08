import { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PostProcessing } from './PostProcessing';
import { HeroEnvironment } from './Environment';
import { HeroCamera } from './CameraRig';
import { WineGlass } from './WineGlass';
import { GoldParticles, AmbientDust } from './Particles';
import { ContactShadows } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

function HeroCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0.5, 8], fov: 35 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
      }}
      gl={{ 
        antialias: true, 
        alpha: true, 
        preserveDrawingBuffer: false,
        powerPreference: 'high-performance',
        logarithmicDepthBuffer: true,
        stencil: false,
      }}
      shadows={{ 
        type: THREE.PCFSoftShadowMap,
        autoUpdate: false,
        needsUpdate: true,
      }}
      toneMapping={THREE.ACESFilmicToneMapping}
      toneMappingExposure={1.15}
      colorSpace={THREE.SRGBColorSpace}
      dpr={[1, 2]}
    >
      <Suspense fallback={null}>
        <HeroEnvironment />
      </Suspense>
      
      <ContactShadows 
        opacity={0.3} 
        scale={10} 
        blur={2} 
        far={10} 
        position={[0, -0.5, 0]} 
      />
      
      <HeroCamera position={[0, 0.5, 8]} target={[0, 0.5, 0]} focusDistance={8} />
      
      <AmbientDust count={1500} radius={25} color={0xe8c97a} opacity={0.25} />
      <GoldParticles count={2500} radius={18} speed={0.015} size={0.035} color={0xc9a84c} opacity={0.5} />
      
      <WineGlass 
        position={[0, -0.3, 0]} 
        scale={1.2} 
        rotationSpeed={0.12}
        enableLiquid={true}
        liquidLevel={0.65}
      />
      
      <PostProcessing 
        intensity={1.0} 
        enableDOF={true} 
        enableSSAO={true}
        enableBloom={true}
        enableChromaticAberration={false}
      />
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
          background: 'radial-gradient(ellipse at center, transparent 30%, #0d0d0d 100%)',
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