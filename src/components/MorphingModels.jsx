import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

const pillarConfigs = {
  'tasting-menu': {
    name: 'Tasting Menu',
    modelPath: '/models/pillar-tasting.glb',
    fallback: {
      geometry: () => new THREE.TorusKnotGeometry(0.8, 0.25, 64, 16, 2, 3),
      color: 0xc9a84c,
      metalness: 0.7,
      roughness: 0.2,
      emissive: 0x8b6914,
      emissiveIntensity: 0.3,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    }
  },
  'music': {
    name: 'Live Music',
    modelPath: '/models/pillar-music.glb',
    fallback: {
      geometry: () => new THREE.IcosahedronGeometry(1, 1),
      color: 0xe8c97a,
      metalness: 0.5,
      roughness: 0.3,
      emissive: 0xc9a84c,
      emissiveIntensity: 0.2,
      wireframe: true,
    }
  },
  'wine': {
    name: 'Wine Selection',
    modelPath: '/models/pillar-wine.glb',
    fallback: {
      geometry: () => new THREE.CylinderGeometry(0.3, 0.3, 2.5, 32),
      color: 0x4a1a0a,
      metalness: 0.1,
      roughness: 0.2,
      transmission: 0.9,
      thickness: 1.5,
      ior: 1.5,
      transparent: true,
      opacity: 0.7,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    }
  },
  'kitchen': {
    name: 'Open Kitchen',
    modelPath: '/models/pillar-kitchen.glb',
    fallback: {
      geometry: () => new THREE.BoxGeometry(1.2, 0.8, 1.2),
      color: 0xc9a84c,
      metalness: 0.6,
      roughness: 0.3,
      emissive: 0x8b6914,
      emissiveIntensity: 0.25,
      clearcoat: 0.5,
      clearcoatRoughness: 0.2,
    }
  },
  'farm': {
    name: 'Farm to Table',
    modelPath: '/models/pillar-farm.glb',
    fallback: {
      geometry: () => new THREE.SphereGeometry(0.9, 32, 32),
      color: 0x8b6914,
      metalness: 0.2,
      roughness: 0.6,
    }
  },
};

function GLTFPillarModel({ pillarId, isActive = false }) {
  const { viewport } = useThree();
  const modelRef = useRef();
  const timeRef = useRef(0);
  const config = useMemo(() => pillarConfigs[pillarId] || pillarConfigs['tasting-menu'], [pillarId]);

  const isMobile = viewport.width < 768;
  const scale = isMobile ? 0.5 : 1;

  const { scene: model, materials } = useGLTF(config.modelPath, (gltf) => {
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.frustumCulled = true;
      }
    });
  }, { useSuspense: false });

  useFrame((_, delta) => {
    timeRef.current += delta;
    if (modelRef.current) {
      modelRef.current.rotation.y += delta * 0.06;
      modelRef.current.rotation.x = Math.sin(timeRef.current * 0.3) * 0.1;
      modelRef.current.position.y = Math.sin(timeRef.current * 0.5) * (isActive ? 0.15 : 0.05);
      if (isActive) {
        modelRef.current.scale.setScalar(1 + Math.sin(timeRef.current * 2) * 0.02);
      } else {
        modelRef.current.scale.setScalar(1);
      }
    }
  });

  if (model) {
    return (
      <group ref={modelRef} scale={scale} rotation={[-Math.PI / 2, 0, 0]}>
        <primitive object={model} dispose={null} />
        <pointLight
          position={[0, 2, 0]}
          color={config.fallback.color}
          intensity={isActive ? 2 : 0.5}
          distance={8}
          decay={2}
          castShadow
          shadow-mapSize={512}
        />
      </group>
    );
  }

  // Fallback to procedural geometry while loading
  const fallbackConfig = config.fallback;
  const geometry = useMemo(() => fallbackConfig.geometry(), [fallbackConfig]);

  return (
    <group ref={modelRef} scale={scale} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh castShadow receiveShadow geometry={geometry}>
        <meshPhysicalMaterial
          color={fallbackConfig.color}
          metalness={fallbackConfig.metalness}
          roughness={fallbackConfig.roughness}
          emissive={fallbackConfig.emissive}
          emissiveIntensity={fallbackConfig.emissiveIntensity}
          transmission={fallbackConfig.transmission}
          thickness={fallbackConfig.thickness}
          ior={fallbackConfig.ior}
          transparent={fallbackConfig.transparent}
          opacity={fallbackConfig.opacity}
          wireframe={fallbackConfig.wireframe}
          clearcoat={fallbackConfig.clearcoat}
          clearcoatRoughness={fallbackConfig.clearcoatRoughness}
          envMapIntensity={fallbackConfig.transmission ? 2.0 : 1.5}
          side={fallbackConfig.transparent ? THREE.DoubleSide : THREE.FrontSide}
        />
      </mesh>
      <pointLight
        position={[0, 2, 0]}
        color={fallbackConfig.color}
        intensity={isActive ? 2 : 0.5}
        distance={8}
        decay={2}
        castShadow
        shadow-mapSize={512}
      />
    </group>
  );
}

export function MorphingPillarModel({ pillarId, isActive = false }) {
  return <GLTFPillarModel pillarId={pillarId} isActive={isActive} />;
}