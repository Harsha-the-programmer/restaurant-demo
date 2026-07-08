import { useFrame, useThree } from '@react-three/fiber';
import { useStore } from './GlobalStore';
import * as THREE from 'three';
import { useRef, useEffect } from 'react';

function VolumetricLightImpl({ 
  position = [0, 5, 0], 
  intensity = 1.5,
  steps = 100,
  color = 0xffd700,
  attenuation = 5,
  coneAngle = Math.PI / 4,
  enabled = true,
  children
}) {
  const { viewport } = useThree();
  const isMobile = viewport.width < 768;
  const lightIntensity = isMobile ? intensity * 0.5 : intensity;
  
  const meshRef = useRef();
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    timeRef.current += delta;
    if (meshRef.current) {
      meshRef.current.rotation.z = timeRef.current * 0.02;
    }
  });

  if (!enabled) return null;

  return (
    <group position={position}>
      {children}
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} scale={15}>
        <circleGeometry args={[1, 64]} />
        <shaderMaterial
          vertexShader={`
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            varying vec2 vUv;
            uniform float uTime;
            uniform float uIntensity;
            uniform vec3 uColor;
            uniform float uAttenuation;
            
            void main() {
              float dist = length(vUv - 0.5);
              float radial = 1.0 - smoothstep(0.0, 0.5, dist);
              float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
              float shaft = sin(angle * 8.0 + uTime * 2.0) * 0.5 + 0.5;
              float combined = radial * shaft * uIntensity;
              combined = pow(combined, 2.0);
              gl_FragColor = vec4(uColor, combined * 0.3);
            }
          `}
          uniforms={{
            uTime: { value: 0 },
            uIntensity: { value: lightIntensity },
            uColor: { value: new THREE.Color(color) },
            uAttenuation: { value: attenuation },
          }}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

export function GodRays({ 
  position = [0, 5, 0], 
  intensity = 1.5,
  steps = 100,
  color = 0xffd700,
  attenuation = 5,
  coneAngle = Math.PI / 4,
  enabled = true
}) {
  const { viewport } = useThree();
  const isMobile = viewport.width < 768;
  const lightIntensity = isMobile ? intensity * 0.5 : intensity;

  return enabled && (
    <VolumetricLightImpl
      position={position}
      intensity={lightIntensity}
      steps={isMobile ? 50 : steps}
      color={color}
      attenuation={attenuation}
      coneAngle={coneAngle}
    >
      <spotLight 
        position={position} 
        angle={coneAngle} 
        penumbra={0.5}
        decay={2}
        intensity={lightIntensity * 50}
        distance={30}
        castShadow
        shadow-mapSize={1024}
        shadow-camera-near={1}
        shadow-camera-far={30}
      />
    </VolumetricLightImpl>
  );
}

export function VolumetricFog({ 
  color = '#0d0d1a',
  near = 10,
  far = 100,
  density = 0.02,
  heightFalloff = 0.1,
  groundColor = '#1a1a2e'
}) {
  return (
    <fog
      attach="fog"
      color={color}
      near={near}
      far={far}
      density={density}
      heightFalloff={heightFalloff}
      groundColor={groundColor}
    />
  );
}

export function LightShafts({ 
  position = [0, 3, 0],
  color = 0xffd700,
  intensity = 1.0,
  scale = 10,
  enabled = true
}) {
  const { viewport } = useThree();
  const isMobile = viewport.width < 768;
  
  return enabled && (
    <group>
      <VolumetricLightImpl
        position={position}
        intensity={isMobile ? intensity * 0.5 : intensity}
        steps={isMobile ? 50 : 100}
        color={color}
        attenuation={5}
        coneAngle={Math.PI / 3}
      >
        <spotLight 
          position={position} 
          angle={Math.PI / 3} 
          penumbra={0.5}
          decay={2}
          intensity={intensity * 30}
          distance={25}
          castShadow
        />
      </VolumetricLightImpl>
      <mesh
        position={position}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={scale}
      >
        <circleGeometry args={[1, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.1}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}