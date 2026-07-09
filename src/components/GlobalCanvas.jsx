import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import * as THREE from 'three';
import { PostProcessing } from './PostProcessing';
import { GlobalParticlesInstanced } from './GlobalParticlesInstanced';
import { GlobalCamera } from './GlobalCamera';
import { GodRays, VolumetricFog } from './VolumetricEffects';
import { WineGlass } from './WineGlass';
import { Caustics, CausticsSpotlight } from './Caustics';
import { MorphingPillarModel } from './MorphingModels';
import { useStore } from './GlobalStore';
import { Suspense, useEffect, useMemo, useState, useRef } from 'react';

const HDRI_MAPS = {
  sunset: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/venice_sunset_1k.hdr',
  night: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/venice_sunset_1k.hdr',
  studio: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_04_1k.hdr',
  warehouse: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/warehouse_1k.hdr',
};

const sectionEnvs = {
  home: { preset: 'sunset', exposure: 1.3 },
  about: { preset: 'studio', exposure: 1.0 },
  menu: { preset: 'warehouse', exposure: 1.1 },
  experience: { preset: 'warehouse', exposure: 1.0 },
  gallery: { preset: 'studio', exposure: 0.9 },
  reserve: { preset: 'night', exposure: 0.8 },
};

function GlobalEnvironment() {
  const { currentSection, scrollProgress } = useStore();
  const { scene } = useThree();
  
  const [hdri, setHdri] = useState(null);
  const [currentPreset, setCurrentPreset] = useState('sunset');
  const pmremGenerator = useMemo(() => new THREE.PMREMGenerator(null), []);
  
  useEffect(() => {
    const env = sectionEnvs[currentSection] || sectionEnvs.home;
    if (env.preset !== currentPreset) {
      setCurrentPreset(env.preset);
      loadHDRI(env.preset);
    }
  }, [currentSection]);

  const loadHDRI = async (preset) => {
    try {
      const loader = new RGBELoader();
      const url = HDRI_MAPS[preset];
      const hdr = await new Promise((resolve, reject) => loader.load(url, resolve, undefined, reject));
      setHdri(hdr);
    } catch (e) {
      console.warn('HDRI load failed:', e);
    }
  };

  useFrame(() => {
    if (hdri && pmremGenerator) {
      const envMap = pmremGenerator.fromEquirectangular(hdri).texture;
      scene.environment = envMap;
      scene.background = hdri;
    }
  });

  return null;
}

function HeroContent() {
  return (
    <>
      <ContactShadows 
        opacity={0.4} 
        scale={15} 
        blur={2} 
        far={15} 
        position={[0, -0.5, 0]} 
      />
      <Caustics 
        position={[0, -0.4, -0.5]} 
        scale={20} 
        intensity={1.5} 
        color={0xffd700} 
      />
      <CausticsSpotlight 
        position={[0, -0.4, 0]} 
        scale={18} 
        intensity={1.2} 
        color={0xffd700} 
      />
      <WineGlass 
        position={[0, -0.3, 0]} 
        scale={1.2} 
        rotationSpeed={0.12}
        enableLiquid={true}
        liquidLevel={0.65}
      />
      <GodRays timeOfDay="sunset" />
    </>
  );
}

function ExperienceContent({ activePillar }) {
  return (
    <>
      <ContactShadows 
        opacity={0.3} 
        scale={10} 
        blur={2} 
        far={10} 
        position={[0, -0.5, 0]} 
        color="#000000"
      />
      <MorphingPillarModel 
        pillarId={activePillar} 
        isActive={true}
      />
      <GodRays timeOfDay="warehouse" />
    </>
  );
}

function OtherContent() {
  return (
    <>
      <ContactShadows 
        opacity={0.2} 
        scale={50} 
        blur={3} 
        far={20} 
        position={[0, -2, 0]} 
      />
      <GodRays timeOfDay="studio" />
    </>
  );
}

function GlobalScene() {
  const { currentSection, timeOfDay, activePillar } = useStore();
  
  return (
    <>
      <GlobalEnvironment />
      <VolumetricFog timeOfDay={timeOfDay} />
      <GlobalParticlesInstanced />
      <GlobalCamera />
      
      {currentSection === 'home' && <HeroContent />}
      {currentSection === 'experience' && <ExperienceContent activePillar={activePillar} />}
      {currentSection !== 'home' && currentSection !== 'experience' && <OtherContent />}
      
      <PostProcessing intensity={1.0} enableDOF={true} enableSSAO={false} enableBloom={true} />
    </>
  );
}

function ScrollTracker() {
  const { setCurrentSection, setScrollProgress } = useStore();
  const sectionsRef = useRef([]);

  useEffect(() => {
    const sections = ['home', 'about', 'menu', 'experience', 'gallery', 'reserve']
      .map(id => document.getElementById(id))
      .filter(Boolean);
    sectionsRef.current = sections;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            setCurrentSection(entry.target.id);
          }
        });
      },
      { threshold: [0.1, 0.3, 0.5, 0.7], rootMargin: '-20% 0px -20% 0px' }
    );

    sections.forEach(section => observer.observe(section));

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(Math.min(scrollY / docHeight, 1));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [setCurrentSection, setScrollProgress]);

  return null;
}

export function GlobalCanvas() {
  return (
    <>
      <ScrollTracker />
      <Canvas
        camera={{ position: [0, 1.5, 5], fov: 45 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -2,
          pointerEvents: 'none',
        }}
        gl={{
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: false,
          powerPreference: 'high-performance',
          logarithmicDepthBuffer: true,
          stencil: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
          colorSpace: THREE.SRGBColorSpace,
        }}
        shadows={{
          type: THREE.PCFShadowMap,
          autoUpdate: false,
          needsUpdate: true,
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <GlobalScene />
        </Suspense>
      </Canvas>
    </>
  );
}