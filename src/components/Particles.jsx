import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

const PARTICLE_COUNT = 3000;

export function GoldParticles({ 
  count = PARTICLE_COUNT, 
  radius = 15,
  speed = 0.02,
  size = 0.04,
  color = 0xc9a84c,
  opacity = 0.6,
  enableTurbulence = true,
  attractionStrength = 0.001
}) {
  const pointsRef = useRef();
  const { viewport, camera } = useThree();
  const positionsRef = useRef(null);
  const velocitiesRef = useRef(null);
  const sizesRef = useRef(null);
  const alphasRef = useRef(null);
  const timeRef = useRef(0);

  const isMobile = viewport.width < 768;
  const particleCount = isMobile ? Math.floor(count * 0.4) : count;

  if (!positionsRef.current) {
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const alphas = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const r = radius * (0.3 + Math.random() * 0.7);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      velocities[i * 3] = (Math.random() - 0.5) * 0.002;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.002;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.002;

      sizes[i] = size * (0.5 + Math.random() * 1.5);
      alphas[i] = opacity * (0.3 + Math.random() * 0.7);
    }

    positionsRef.current = positions;
    velocitiesRef.current = velocities;
    sizesRef.current = sizes;
    alphasRef.current = alphas;
  }

  useFrame((state, delta) => {
    timeRef.current += delta;
    const positions = positionsRef.current;
    const velocities = velocitiesRef.current;
    const cameraPos = camera.position;

    if (pointsRef.current && positions) {
      pointsRef.current.rotation.y += delta * speed * 0.3;
      pointsRef.current.rotation.x += delta * speed * 0.15;

      if (enableTurbulence) {
        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          
          const noiseX = Math.sin(timeRef.current * 0.5 + i * 0.01) * 0.001;
          const noiseY = Math.cos(timeRef.current * 0.3 + i * 0.01) * 0.001;
          const noiseZ = Math.sin(timeRef.current * 0.7 + i * 0.01) * 0.001;

          velocities[i3] += noiseX;
          velocities[i3 + 1] += noiseY;
          velocities[i3 + 2] += noiseZ;

          const dx = cameraPos.x - positions[i3];
          const dy = cameraPos.y - positions[i3 + 1];
          const dz = cameraPos.z - positions[i3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          
          if (dist < 10) {
            const force = attractionStrength * (1 - dist / 10);
            velocities[i3] += dx * force;
            velocities[i3 + 1] += dy * force;
            velocities[i3 + 2] += dz * force;
          }

          positions[i3] += velocities[i3];
          positions[i3 + 1] += velocities[i3 + 1];
          positions[i3 + 2] += velocities[i3 + 2];

          velocities[i3] *= 0.99;
          velocities[i3 + 1] *= 0.99;
          velocities[i3 + 2] *= 0.99;

          const r = Math.sqrt(positions[i3] ** 2 + positions[i3 + 1] ** 2 + positions[i3 + 2] ** 2);
          if (r > radius * 1.5) {
            positions[i3] *= 0.95;
            positions[i3 + 1] *= 0.95;
            positions[i3 + 2] *= 0.95;
          }
        }
        
        pointsRef.current.geometry.attributes.position.needsUpdate = true;
      }
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positionsRef.current} itemSize={3} usage={THREE.DynamicDrawUsage} />
        <bufferAttribute attach="attributes-size" array={sizesRef.current} itemSize={1} />
        <bufferAttribute attach="attributes-alpha" array={alphasRef.current} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={`
          attribute float size;
          attribute float alpha;
          varying float vAlpha;
          varying float vSize;
          void main() {
            vAlpha = alpha;
            vSize = size;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          varying float vAlpha;
          varying float vSize;
          uniform vec3 uColor;
          void main() {
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;
            float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
            alpha *= (1.0 - dist * 0.5);
            vec3 color = uColor * (1.0 + dist * 0.5);
            gl_FragColor = vec4(color, alpha * vAlpha);
          }
        `}
        uniforms={{ 
          uColor: { value: new THREE.Color(color) },
          uTime: { value: 0 }
        }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function AmbientDust({ 
  count = 2000, 
  radius = 20,
  color = 0xe8c97a,
  opacity = 0.3 
}) {
  const pointsRef = useRef();
  const positionsRef = useRef(null);
  const sizesRef = useRef(null);
  const alphasRef = useRef(null);
  const timeRef = useRef(0);
  const { viewport } = useThree();

  const isMobile = viewport.width < 768;
  const particleCount = isMobile ? Math.floor(count * 0.3) : count;

  if (!positionsRef.current) {
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const alphas = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * radius * 2;
      positions[i * 3 + 1] = (Math.random() - 0.5) * radius * 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * radius * 2;
      sizes[i] = 0.02 + Math.random() * 0.04;
      alphas[i] = opacity * (0.2 + Math.random() * 0.5);
    }

    positionsRef.current = positions;
    sizesRef.current = sizes;
    alphasRef.current = alphas;
  }

  useFrame((_, delta) => {
    timeRef.current += delta;
    const positions = positionsRef.current;

    if (pointsRef.current && positions) {
      pointsRef.current.rotation.y += delta * 0.002;
      pointsRef.current.rotation.x += delta * 0.001;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3 + 1] += Math.sin(timeRef.current * 0.5 + i * 0.01) * 0.0005;
        positions[i3] += Math.cos(timeRef.current * 0.3 + i * 0.01) * 0.0003;
      }
      
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positionsRef.current} itemSize={3} usage={THREE.DynamicDrawUsage} />
        <bufferAttribute attach="attributes-size" array={sizesRef.current} itemSize={1} />
        <bufferAttribute attach="attributes-alpha" array={alphasRef.current} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={`
          attribute float size;
          attribute float alpha;
          varying float vAlpha;
          void main() {
            vAlpha = alpha;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (200.0 / -mvPosition.z);
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
        uniforms={{ uColor: { value: new THREE.Color(color) } }}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  );
}