import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const MORPH_DURATION = 1.5;

const pillarConfigs = {
  'tasting-menu': {
    name: 'Tasting Menu',
    baseGeometry: () => new THREE.TorusKnotGeometry(0.8, 0.25, 64, 16, 2, 3),
    targetGeometry: () => new THREE.SphereGeometry(1, 64, 64),
    color: 0xc9a84c,
    metalness: 0.7,
    roughness: 0.2,
    emissive: 0x8b6914,
    emissiveIntensity: 0.3,
    transmission: 0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
  },
  'music': {
    name: 'Live Music',
    baseGeometry: () => new THREE.IcosahedronGeometry(1, 1),
    targetGeometry: () => new THREE.TorusGeometry(1, 0.3, 16, 100),
    color: 0xe8c97a,
    metalness: 0.5,
    roughness: 0.3,
    emissive: 0xc9a84c,
    emissiveIntensity: 0.2,
    transmission: 0,
    wireframe: true,
    clearcoat: 0,
  },
'wine': {
    name: 'Wine Selection',
    baseGeometry: () => new THREE.CylinderGeometry(0.3, 0.3, 2.5, 32),
    targetGeometry: () => new THREE.SphereGeometry(0.8, 64, 64),
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
  },
  'kitchen': {
    name: 'Open Kitchen',
    baseGeometry: () => new THREE.BoxGeometry(1.2, 0.8, 1.2),
    targetGeometry: () => new THREE.CylinderGeometry(0.6, 0.8, 1.5, 16),
    color: 0xc9a84c,
    metalness: 0.6,
    roughness: 0.3,
    emissive: 0x8b6914,
    emissiveIntensity: 0.25,
    transmission: 0,
    clearcoat: 0.5,
    clearcoatRoughness: 0.2,
  },
  'farm': {
    name: 'Farm to Table',
    baseGeometry: () => new THREE.SphereGeometry(0.9, 32, 32),
    targetGeometry: () => new THREE.ConeGeometry(0.8, 1.8, 32),
    color: 0x8b6914,
    metalness: 0.2,
    roughness: 0.6,
    transmission: 0,
    clearcoat: 0,
  },
};

function createMorphGeometry(baseGeo, targetGeo, steps = 30) {
  const basePositions = baseGeo.attributes.position;
  const targetPositions = targetGeo.attributes.position;
  
  const maxVertices = Math.max(basePositions.count, targetPositions.count);
  
  const morphAttributes = {};
  
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    const eased = THREE.MathUtils.smootherstep(t);
    const positions = new Float32Array(maxVertices * 3);
    
    for (let v = 0; v < maxVertices; v++) {
      const baseIdx = v % basePositions.count;
      const targetIdx = v % targetPositions.count;
      
      const bx = basePositions.getX(baseIdx);
      const by = basePositions.getY(baseIdx);
      const bz = basePositions.getZ(baseIdx);
      
      const tx = targetPositions.getX(targetIdx);
      const ty = targetPositions.getY(targetIdx);
      const tz = targetPositions.getZ(targetIdx);
      
      positions[v * 3] = THREE.MathUtils.lerp(bx, tx, eased);
      positions[v * 3 + 1] = THREE.MathUtils.lerp(by, ty, eased);
      positions[v * 3 + 2] = THREE.MathUtils.lerp(bz, tz, eased);
    }
    
    morphAttributes[`morphTarget${i}`] = new THREE.BufferAttribute(positions, 3);
  }
  
  const geometry = baseGeo.clone();
  geometry.morphAttributes = { position: Object.values(morphAttributes) };
  return geometry;
}

export function MorphingPillarModel({ pillarId, progress = 0, isActive = false }) {
  const { viewport } = useThree();
  const meshRef = useRef();
  const materialRef = useRef();
  const timeRef = useRef(0);
  const currentProgressRef = useRef(0);
  
  const isMobile = viewport.width < 768;
  const scale = isMobile ? 0.5 : 1;

  const config = useMemo(() => pillarConfigs[pillarId] || pillarConfigs['tasting-menu'], [pillarId]);
  
  const geometry = useMemo(() => {
    const baseGeo = config.baseGeometry();
    const targetGeo = config.targetGeometry();
    return createMorphGeometry(baseGeo, targetGeo);
  }, [config]);

  useFrame((state, delta) => {
    timeRef.current += delta;
    
    const targetProgress = isActive ? 1 : 0;
    currentProgressRef.current += (targetProgress - currentProgressRef.current) * delta * 3;
    
    if (meshRef.current) {
      meshRef.current.morphTargetInfluences[Math.floor(currentProgressRef.current * 29)] = currentProgressRef.current;
      
      meshRef.current.rotation.y += delta * 0.06;
      meshRef.current.rotation.x = Math.sin(timeRef.current * 0.3) * 0.1;
      meshRef.current.position.y = Math.sin(timeRef.current * 0.5) * (isActive ? 0.15 : 0.05);
      
      if (isActive) {
        meshRef.current.scale.setScalar(1 + Math.sin(timeRef.current * 2) * 0.02);
      } else {
        meshRef.current.scale.setScalar(1);
      }
    }
  });

  const materialProps = useMemo(() => ({
    color: config.color,
    metalness: config.metalness,
    roughness: config.roughness,
    emissive: config.emissive,
    emissiveIntensity: config.emissiveIntensity,
    transmission: config.transmission || 0,
    thickness: config.thickness,
    ior: config.ior,
    transparent: config.transparent,
    opacity: config.opacity,
    wireframe: config.wireframe,
    clearcoat: config.clearcoat,
    clearcoatRoughness: config.clearcoatRoughness,
    envMapIntensity: config.transmission ? 2.0 : 1.5,
    side: config.transparent ? THREE.DoubleSide : THREE.FrontSide,
  }), [config]);

  return (
    <group scale={scale} ref={meshRef}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <mesh
          geometry={geometry}
          castShadow
          receiveShadow
        >
          <meshPhysicalMaterial
            ref={materialRef}
            {...materialProps}
          />
        </mesh>
      </group>
      <pointLight
        position={[0, 2, 0]}
        color={config.color}
        intensity={isActive ? 2 : 0.5}
        distance={8}
        decay={2}
        castShadow
        shadow-mapSize={512}
      />
    </group>
  );
}

export function StaticPillarModel({ pillarId, isActive = false }) {
  const { viewport } = useThree();
  const meshRef = useRef();
  const timeRef = useRef(0);
  
  const isMobile = viewport.width < 768;
  const scale = isMobile ? 0.5 : 1;
  const config = useMemo(() => pillarConfigs[pillarId] || pillarConfigs['tasting-menu'], [pillarId]);
  
  const geometry = useMemo(() => config.baseGeometry(), [config]);
  
  useFrame((_, delta) => {
    timeRef.current += delta;
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.06;
      meshRef.current.rotation.x = Math.sin(timeRef.current * 0.3) * 0.1;
      meshRef.current.position.y = Math.sin(timeRef.current * 0.5) * (isActive ? 0.15 : 0.05);
      if (isActive) {
        meshRef.current.scale.setScalar(1 + Math.sin(timeRef.current * 2) * 0.02);
      }
    }
  });

  return (
    <group scale={scale} ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh castShadow receiveShadow>
        <meshPhysicalMaterial
          color={config.color}
          metalness={config.metalness}
          roughness={config.roughness}
          emissive={config.emissive}
          emissiveIntensity={config.emissiveIntensity}
          transmission={config.transmission || 0}
          thickness={config.thickness}
          ior={config.ior}
          transparent={config.transparent}
          opacity={config.opacity}
          wireframe={config.wireframe}
          clearcoat={config.clearcoat}
          clearcoatRoughness={config.clearcoatRoughness}
          envMapIntensity={config.transmission ? 2.0 : 1.5}
          side={config.transparent ? THREE.DoubleSide : THREE.FrontSide}
        />
        <boxGeometry args={geometry.parameters ? Object.values(geometry.parameters) : [1, 1, 1]} />
      </mesh>
      <pointLight
        position={[0, 2, 0]}
        color={config.color}
        intensity={isActive ? 2 : 0.5}
        distance={8}
        decay={2}
        castShadow
        shadow-mapSize={512}
      />
    </group>
  );
}