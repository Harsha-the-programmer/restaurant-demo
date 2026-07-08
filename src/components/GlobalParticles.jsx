import { useFrame, useThree } from '@react-three/fiber';
import { useStore } from './GlobalStore';
import { useRef } from 'react';
import * as THREE from 'three';

const AMBIENT_COUNT = 3000;
const GOLD_COUNT = 4000;

function AmbientDustParticles() {
  const { reducedMotion, timeOfDay } = useStore();
  const { viewport } = useThree();
  const pointsRef = useRef();
  const positionsRef = useRef(null);
  const sizesRef = useRef(null);
  const alphasRef = useRef(null);
  const timeRef = useRef(0);

  const isMobile = viewport.width < 768;
  const count = isMobile ? Math.floor(AMBIENT_COUNT * 0.3) : AMBIENT_COUNT;

  if (!positionsRef.current) {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const alphas = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 80;
      sizes[i] = 0.02 + Math.random() * 0.04;
      alphas[i] = 0.15 * (0.2 + Math.random() * 0.5);
    }

    positionsRef.current = positions;
    sizesRef.current = sizes;
    alphasRef.current = alphas;
  }

  useFrame((_, delta) => {
    if (reducedMotion) return;
    timeRef.current += delta;

    const positions = positionsRef.current;
    if (pointsRef.current && positions) {
      pointsRef.current.rotation.y += delta * 0.0005;
      pointsRef.current.rotation.x += delta * 0.0003;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        positions[i3 + 1] += Math.sin(timeRef.current * 0.3 + i * 0.01) * 0.0003;
        positions[i3] += Math.cos(timeRef.current * 0.2 + i * 0.01) * 0.0002;
        positions[i3 + 2] += Math.sin(timeRef.current * 0.4 + i * 0.01) * 0.0002;
      }

      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const ambientColor = timeOfDay === 'night' ? 0x444466 : timeOfDay === 'sunset' ? 0x332211 : 0x222222;

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
        uniforms={{ uColor: { value: new THREE.Color(ambientColor) } }}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  );
}

function GoldParticles() {
  const { reducedMotion, scrollProgress, timeOfDay } = useStore();
  const { viewport, camera } = useThree();
  const pointsRef = useRef();
  const positionsRef = useRef(null);
  const velocitiesRef = useRef(null);
  const sizesRef = useRef(null);
  const alphasRef = useRef(null);
  const timeRef = useRef(0);

  const isMobile = viewport.width < 768;
  const count = isMobile ? Math.floor(GOLD_COUNT * 0.3) : GOLD_COUNT;

  if (!positionsRef.current) {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const alphas = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const r = 15 + Math.random() * 25;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      velocities[i * 3] = (Math.random() - 0.5) * 0.002;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.002;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
      sizes[i] = 0.03 + Math.random() * 0.05;
      alphas[i] = 0.4 * (0.3 + Math.random() * 0.7);
    }

    positionsRef.current = positions;
    velocitiesRef.current = velocities;
    sizesRef.current = sizes;
    alphasRef.current = alphas;
  }

  useFrame((_, delta) => {
    if (reducedMotion) return;
    timeRef.current += delta;

    const positions = positionsRef.current;
    const velocities = velocitiesRef.current;
    const cameraPos = camera.position;

    if (pointsRef.current && positions) {
      pointsRef.current.rotation.y += delta * 0.01;
      pointsRef.current.rotation.x += delta * 0.005;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const noiseX = Math.sin(timeRef.current * 0.5 + i * 0.01) * 0.0005;
        const noiseY = Math.cos(timeRef.current * 0.3 + i * 0.01) * 0.0005;
        const noiseZ = Math.sin(timeRef.current * 0.7 + i * 0.01) * 0.0005;
        velocities[i3] += noiseX;
        velocities[i3 + 1] += noiseY;
        velocities[i3 + 2] += noiseZ;

        const dx = cameraPos.x - positions[i3];
        const dy = cameraPos.y - positions[i3 + 1];
        const dz = cameraPos.z - positions[i3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < 15) {
          const force = 0.0005 * (1 - dist / 15);
          velocities[i3] += dx * force;
          velocities[i3 + 1] += dy * force;
          velocities[i3 + 2] += dz * force;
        }

        positions[i3] += velocities[i3];
        positions[i3 + 1] += velocities[i3 + 1];
        positions[i3 + 2] += velocities[i3 + 2];
        velocities[i3] *= 0.98;
        velocities[i3 + 1] *= 0.98;
        velocities[i3 + 2] *= 0.98;

        const r = Math.sqrt(positions[i3] ** 2 + positions[i3 + 1] ** 2 + positions[i3 + 2] ** 2);
        if (r > 45) {
          positions[i3] *= 0.98;
          positions[i3 + 1] *= 0.98;
          positions[i3 + 2] *= 0.98;
        }
      }

      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const goldColor = timeOfDay === 'night' ? 0xffd700 : timeOfDay === 'sunset' ? 0xff8c00 : 0xc9a84c;

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
            alpha *= (1.0 - dist * 0.5);
            vec3 color = uColor * (1.0 + dist * 0.3);
            gl_FragColor = vec4(color, alpha * vAlpha);
          }
        `}
        uniforms={{ uColor: { value: new THREE.Color(goldColor) } }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function GlobalParticles() {
  return (
    <>
      <AmbientDustParticles />
      <GoldParticles />
    </>
  );
}