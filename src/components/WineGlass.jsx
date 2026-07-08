import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

export function WineGlass({ 
  position = [0, 0, 0], 
  scale = 1,
  rotationSpeed = 0.15,
  enableLiquid = true,
  liquidLevel = 0.6 
}) {
  const { viewport } = useThree();
  const glassRef = useRef();
  const liquidRef = useRef();
  const timeRef = useRef(0);

  const isMobile = viewport.width < 768;
  const modelScale = isMobile ? scale * 0.6 : scale;

  const { scene: glassModel, materials } = useGLTF('/models/wine-glass.glb', (gltf) => {
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.frustumCulled = true;
      }
    });
  }, { useSuspense: false });

  useFrame((state, delta) => {
    timeRef.current += delta;
    
    if (glassRef.current) {
      glassRef.current.rotation.y += delta * rotationSpeed;
      glassRef.current.rotation.x = Math.sin(timeRef.current * 0.3) * 0.08;
    }
    
    if (liquidRef.current && enableLiquid) {
      liquidRef.current.rotation.y += delta * rotationSpeed * 0.95;
      liquidRef.current.position.y = Math.sin(timeRef.current * 0.5) * 0.01;
    }

    if (materials.glassMaterial) {
      materials.glassMaterial.envMapIntensity = 1.5;
    }
    if (materials.liquidMaterial) {
      materials.liquidMaterial.envMapIntensity = 1.2;
    }
  });

  return (
    <group ref={glassRef} position={position} scale={modelScale}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        {glassModel ? (
          <>
            <primitive object={glassModel} dispose={null} />
          </>
        ) : (
          <>
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.08, 0.08, 1.8, 32, 1, true]} />
              <meshPhysicalMaterial
                color={0xc9a84c}
                metalness={0.3}
                roughness={0.15}
                transmission={0.95}
                thickness={0.5}
                ior={1.5}
                transparent
                opacity={0.25}
                envMapIntensity={1.5}
                clearcoat={1.0}
                clearcoatRoughness={0.05}
              />
            </mesh>
            <mesh castShadow receiveShadow>
              <sphereGeometry args={[0.45, 64, 64, 0, Math.PI * 2, 0, Math.PI / 1.7]} />
              <meshPhysicalMaterial
                color={0xc9a84c}
                metalness={0.1}
                roughness={0.05}
                transmission={0.98}
                thickness={0.8}
                ior={1.5}
                transparent
                opacity={0.2}
                side={THREE.DoubleSide}
                envMapIntensity={1.5}
                clearcoat={1.0}
                clearcoatRoughness={0.02}
              />
            </mesh>
            <mesh castShadow receiveShadow>
              <torusGeometry args={[0.45, 0.025, 16, 64]} />
              <meshPhysicalMaterial
                color={0xe8c97a}
                metalness={0.9}
                roughness={0.05}
                emissive={0x8b6914}
                emissiveIntensity={0.4}
                envMapIntensity={1.0}
              />
            </mesh>
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.03, 0.03, 0.4, 16, 1, true]} />
              <meshPhysicalMaterial
                color={0xc9a84c}
                metalness={0.8}
                roughness={0.1}
                emissive={0x8b6914}
                emissiveIntensity={0.6}
                envMapIntensity={1.0}
              />
            </mesh>
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.2, 0, 0.2, 0.04, 64]} />
              <meshPhysicalMaterial
                color={0xc9a84c}
                metalness={0.8}
                roughness={0.1}
                emissive={0x8b6914}
                emissiveIntensity={0.4}
                envMapIntensity={1.0}
              />
            </mesh>
          </>
        )}
        {enableLiquid && (
          <mesh ref={liquidRef} castShadow receiveShadow>
            <sphereGeometry args={[0.42, 64, 64, 0, Math.PI * 2, 0, Math.PI / 1.72]} />
            <meshPhysicalMaterial
              color={0x4a1a0a}
              metalness={0.0}
              roughness={0.1}
              transmission={0.9}
              thickness={1.2}
              ior={1.35}
              transparent
              opacity={0.7}
              side={THREE.DoubleSide}
              envMapIntensity={1.2}
              clearcoat={0.5}
              clearcoatRoughness={0.1}
            />
          </mesh>
        )}
      </group>
      <pointLight
        position={[0, 1.5, 0]}
        color={0xffd700}
        intensity={3}
        distance={8}
        decay={2}
        castShadow
        shadow-mapSize={1024}
      />
    </group>
  );
}

export function WineGlassFallback({ ...props }) {
  return <WineGlass {...props} />;
}