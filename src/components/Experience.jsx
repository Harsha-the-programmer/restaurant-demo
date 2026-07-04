import { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

const pillars = [
  { icon: '🍽', title: 'Curated Tasting Menus', desc: 'Multi-course journeys designed by our executive chef, changing seasonally to showcase the finest ingredients.' },
  { icon: '🎵', title: 'Live Music on Weekends', desc: 'Classical Indian and contemporary fusion performances every Friday and Saturday evening from 8 PM.' },
  { icon: '🍷', title: 'Imported Wine Selection', desc: 'Over 200 labels from Bordeaux, Napa, Tuscany, and emerging Indian vineyards, curated by our sommelier.' },
  { icon: '👨‍🍳', title: 'Open Kitchen Experience', desc: 'Watch culinary mastery unfold at our chef\'s counter — interactive dining with front-row seats to the action.' },
  { icon: '🌿', title: 'Farm-to-Table Sourcing', desc: 'Direct partnerships with organic farms across Karnataka and Maharashtra, ensuring peak freshness daily.' },
];

function FloatingOrbit() {
  const { viewport } = useThree();
  const groupRef = useRef();
  const timeRef = useRef(0);

  useFrame((state, delta) => {
    timeRef.current += delta;
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08;
      groupRef.current.rotation.x = Math.sin(timeRef.current * 0.3) * 0.15;
    }
  });

  const isMobile = viewport.width < 768;
  const scale = isMobile ? 0.5 : 1;

  return (
    <group ref={groupRef} scale={scale}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <mesh>
          <torusGeometry args={[1.8, 0.02, 16, 100]} />
          <meshPhysicalMaterial
            color={0xc9a84c}
            metalness={0.9}
            roughness={0.1}
            emissive={0x8b6914}
            emissiveIntensity={0.4}
            wireframe
            transparent
            opacity={0.6}
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.6, 32, 32]} />
          <meshPhysicalMaterial
            color={0xc9a84c}
            metalness={0.3}
            roughness={0.2}
            transmission={0.9}
            thickness={0.5}
            ior={1.5}
            transparent
            opacity={0.15}
          />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[1.2, 0]} />
          <meshBasicMaterial
            color={0xe8c97a}
            wireframe
            transparent
            opacity={0.3}
          />
        </mesh>
      </group>

      <Html
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
        transform
        scaleFactor={1 / scale}
      >
        <div style={{
          width: '120px',
          height: '120px',
          border: '1px solid var(--gold)',
          borderRadius: '50%',
          opacity: 0.3,
          animation: 'pulse 3s ease-in-out infinite',
        }} />
      </Html>

      <Html
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
        transform
        scaleFactor={1 / scale}
      >
        <div style={{
          width: '60px',
          height: '60px',
          border: '1px solid var(--gold-light)',
          borderRadius: '50%',
          opacity: 0.2,
          animation: 'pulse 4s ease-in-out infinite reverse',
        }} />
      </Html>
    </group>
  );
}

function ExperienceCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
      style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
    >
      <ambientLight color={0xc9a84c} intensity={0.3} />
      <directionalLight position={[3, 5, 3]} color={0xffeedd} intensity={0.8} />
      <pointLight position={[-2, 2, 2]} color={0xc9a84c} intensity={0.5} distance={10} decay={2} />
      <FloatingOrbit />
    </Canvas>
  );
}

export default function Experience() {
  return (
    <section
      id="experience"
      className="section experience"
      style={{
        background: 'var(--bg)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="section-header reveal">
          <span className="section-eyebrow">The Ember & Spice Difference</span>
          <h2 className="section-title">
            <span className="shimmer">Why Choose Us</span>
          </h2>
        </div>

        <div
          className="experience-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4rem',
            alignItems: 'center',
          }}
        >
          <motion.div
            className="experience-content"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {pillars.map((pillar, index) => (
              <motion.div
                key={pillar.title}
                className="pillar-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  marginBottom: '2.5rem',
                  paddingRight: '2rem',
                }}
              >
                <motion.div
                  className="pillar-icon"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    fontSize: '2.5rem',
                    marginBottom: '1rem',
                    display: 'inline-block',
                    filter: 'drop-shadow(0 0 20px rgba(201, 168, 76, 0.5))',
                  }}
                >
                  {pillar.icon}
                </motion.div>
                <h3 className="pillar-title" style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.375rem',
                  fontWeight: 500,
                  color: 'var(--cream)',
                  marginBottom: '0.75rem',
                }}>
                  {pillar.title}
                </h3>
                <p className="pillar-desc" style={{
                  fontSize: '1rem',
                  lineHeight: 1.7,
                  color: 'var(--cream-muted)',
                }}>
                  {pillar.desc}
                </p>
                <div className="gold-divider" style={{
                  width: '60px',
                  margin: '1.5rem 0 0 0',
                }} />
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="experience-3d"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '1 / 1',
              maxWidth: '500px',
              margin: '0 auto',
            }}
          >
            <ExperienceCanvas />
            <style jsx global>{`
              @keyframes pulse {
                0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
                50% { transform: translate(-50%, -50%) scale(1.3); opacity: 0.1; }
              }
            `}</style>
          </motion.div>
        </div>
      </div>
    </section>
  );
}