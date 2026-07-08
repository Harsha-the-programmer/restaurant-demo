import { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { PostProcessing } from './PostProcessing';
import { ExperienceCamera } from './CameraRig';
import { GoldParticles, AmbientDust } from './Particles';
import { ExperienceEnvironment } from './Environment';
import { MorphingPillarModel } from './MorphingModels';

const pillars = [
  { 
    id: 'tasting', 
    icon: '🍽', 
    title: 'Curated Tasting Menus', 
    desc: 'Multi-course journeys designed by our executive chef, changing seasonally to showcase the finest ingredients.',
    model: 'tasting-menu'
  },
  { 
    id: 'music', 
    icon: '🎵', 
    title: 'Live Music on Weekends', 
    desc: 'Classical Indian and contemporary fusion performances every Friday and Saturday evening from 8 PM.',
    model: 'music'
  },
  { 
    id: 'wine', 
    icon: '🍷', 
    title: 'Imported Wine Selection', 
    desc: 'Over 200 labels from Bordeaux, Napa, Tuscany, and emerging Indian vineyards, curated by our sommelier.',
    model: 'wine'
  },
  { 
    id: 'kitchen', 
    icon: '👨‍🍳', 
    title: 'Open Kitchen Experience', 
    desc: 'Watch culinary mastery unfold at our chef\'s counter — interactive dining with front-row seats to the action.',
    model: 'kitchen'
  },
  { 
    id: 'farm', 
    icon: '🌿', 
    title: 'Farm-to-Table Sourcing', 
    desc: 'Direct partnerships with organic farms across Karnataka and Maharashtra, ensuring peak freshness daily.',
    model: 'farm'
  },
];

function ExperienceCanvas({ activePillar }) {
  const { viewport } = useThree();
  const isMobile = viewport.width < 768;
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    timeRef.current += delta;
  });

  return (
    <Canvas
      camera={{ position: [0, 1, 6], fov: 45 }}
      gl={{ 
        antialias: true, 
        alpha: true, 
        preserveDrawingBuffer: false,
        powerPreference: 'high-performance',
      }}
      shadows={{ 
        type: THREE.PCFSoftShadowMap,
        autoUpdate: false,
        needsUpdate: true,
      }}
      toneMapping={THREE.ACESFilmicToneMapping}
      toneMappingExposure={1.1}
      colorSpace={THREE.SRGBColorSpace}
      dpr={[1, 2]}
      style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
    >
      <ExperienceEnvironment />
      
      <ContactShadows 
        opacity={0.3} 
        scale={10} 
        blur={2} 
        far={10} 
        color="#000000"
      />
      
      <ambientLight color={0xffeedd} intensity={0.5} />
      <directionalLight 
        position={[5, 10, 5]} 
        color={0xfff8e7} 
        intensity={1.5} 
        castShadow
        shadow-mapSize={2048}
        shadow-camera-near={0.1}
        shadow-camera-far={20}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <directionalLight 
        position={[-5, 5, -5]} 
        color={0xc9a84c} 
        intensity={0.8} 
      />
      <pointLight 
        position={[-3, 3, 3]} 
        color={0xc9a84c} 
        intensity={1} 
        distance={15} 
        decay={2} 
        castShadow
        shadow-mapSize={1024}
      />
      
      <GoldParticles 
        count={isMobile ? 800 : 2000} 
        radius={12}
        speed={0.015}
        size={0.03}
        color={0xc9a84c}
        opacity={0.5}
        enableTurbulence={true}
      />
      
      <AmbientDust 
        count={isMobile ? 500 : 1500} 
        radius={15}
        color={0xe8c97a}
        opacity={0.2}
      />
      
      <MorphingPillarModel 
        pillarId={activePillar} 
        isActive={true}
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

export default function Experience() {
  const [activePillar, setActivePillar] = useState('tasting-menu');
  const [hoveredPillar, setHoveredPillar] = useState(null);

  const handlePillarHover = (pillarId) => {
    setHoveredPillar(pillarId);
    setActivePillar(pillarId);
  };

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
                key={pillar.id}
                className="pillar-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  marginBottom: '2.5rem',
                  paddingRight: '2rem',
                  opacity: activePillar === pillar.id ? 1 : 0.5,
                  transition: 'opacity 0.4s ease',
                }}
                onMouseEnter={() => handlePillarHover(pillar.id)}
                onMouseLeave={() => setHoveredPillar(null)}
              >
                <motion.div
                  className="pillar-icon"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
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
            <ExperienceCanvas activePillar={activePillar} />
            <ExperienceCamera 
              position={[0, 1, 6]} 
              target={[0, 0, 0]}
              fov={45}
              enableControls={false}
              enableAutoRotate={true}
              autoRotateSpeed={0.2}
            />
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