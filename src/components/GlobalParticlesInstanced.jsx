import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { MeshBVH, acceleratedRaycast } from 'three-mesh-bvh';
import { useStore } from './GlobalStore';
import { useRef, useEffect } from 'react';

THREE.Mesh.prototype.raycast = acceleratedRaycast;

const AMBIENT_COUNT = 2000;
const GOLD_COUNT = 3000;

function AmbientDustInstanced() {
  const { reducedMotion, timeOfDay } = useStore();
  const { viewport } = useThree();
  const dummy = useRef(new THREE.Object3D());
  const meshRef = useRef();
  const countRef = useRef(0);
  const timeRef = useRef(0);

  const isMobile = viewport.width < 768;
  const count = isMobile ? Math.floor(AMBIENT_COUNT * 0.3) : AMBIENT_COUNT;
  countRef.current = count;

  useEffect(() => {
    if (meshRef.current) return;

    const geometry = new THREE.SphereGeometry(0.02, 4, 4);
    geometry.boundsTree = new MeshBVH(geometry);

    const material = new THREE.MeshBasicMaterial({
      color: timeOfDay === 'night' ? 0x444466 : timeOfDay === 'sunset' ? 0x332211 : 0x222222,
      transparent: true,
      opacity: 0.3,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    const instancedMesh = new THREE.InstancedMesh(geometry, material, count);
    instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    instancedMesh.frustumCulled = true;

    for (let i = 0; i < count; i++) {
      dummy.current.position.set(
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 80
      );
      dummy.current.scale.setScalar(0.5 + Math.random() * 1.5);
      dummy.current.updateMatrix();
      instancedMesh.setMatrixAt(i, dummy.current.matrix);
    }

    instancedMesh.instanceMatrix.needsUpdate = true;
    meshRef.current = instancedMesh;
  }, [count, timeOfDay]);

  useFrame((_, delta) => {
    if (reducedMotion || !meshRef.current) return;
    timeRef.current += delta;

    const instancedMesh = meshRef.current;
    instancedMesh.rotation.y += delta * 0.0005;
    instancedMesh.rotation.x += delta * 0.0003;

    const matrix = new THREE.Matrix4();
    for (let i = 0; i < count; i++) {
      instancedMesh.getMatrixAt(i, matrix);
      dummy.current.applyMatrix4(matrix);
      
      dummy.current.position.y += Math.sin(timeRef.current * 0.3 + i * 0.01) * 0.0003;
      dummy.current.position.x += Math.cos(timeRef.current * 0.2 + i * 0.01) * 0.0002;
      dummy.current.position.z += Math.sin(timeRef.current * 0.4 + i * 0.01) * 0.0002;
      
      dummy.current.updateMatrix();
      instancedMesh.setMatrixAt(i, dummy.current.matrix);
    }
    instancedMesh.instanceMatrix.needsUpdate = true;
  });

  const ambientColor = timeOfDay === 'night' ? 0x444466 : timeOfDay === 'sunset' ? 0x332211 : 0x222222;

  return (
    <instancedMesh
      ref={meshRef}
      args={[null, null, count]}
      frustumCulled
    >
      <sphereGeometry args={[0.02, 4, 4]} />
      <meshBasicMaterial
        color={ambientColor}
        transparent
        opacity={0.3}
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </instancedMesh>
  );
}

function GoldParticlesInstanced() {
  const { reducedMotion, timeOfDay } = useStore();
  const { viewport, camera } = useThree();
  const dummy = useRef(new THREE.Object3D());
  const meshRef = useRef();
  const countRef = useRef(0);
  const timeRef = useRef(0);

  const isMobile = viewport.width < 768;
  const count = isMobile ? Math.floor(GOLD_COUNT * 0.3) : GOLD_COUNT;
  countRef.current = count;

  useEffect(() => {
    if (meshRef.current) return;

    const geometry = new THREE.SphereGeometry(0.03, 6, 6);
    geometry.boundsTree = new MeshBVH(geometry);

    const material = new THREE.MeshBasicMaterial({
      color: timeOfDay === 'night' ? 0xffd700 : timeOfDay === 'sunset' ? 0xff8c00 : 0xc9a84c,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const instancedMesh = new THREE.InstancedMesh(geometry, material, count);
    instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    instancedMesh.frustumCulled = true;

    for (let i = 0; i < count; i++) {
      const r = 15 + Math.random() * 25;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      dummy.current.position.set(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
      dummy.current.scale.setScalar(0.5 + Math.random() * 1.5);
      dummy.current.updateMatrix();
      instancedMesh.setMatrixAt(i, dummy.current.matrix);
    }

    instancedMesh.instanceMatrix.needsUpdate = true;
    meshRef.current = instancedMesh;
  }, [count, timeOfDay]);

  useFrame((_, delta) => {
    if (reducedMotion || !meshRef.current) return;
    timeRef.current += delta;

    const instancedMesh = meshRef.current;
    const cameraPos = camera.position;

    instancedMesh.rotation.y += delta * 0.01;
    instancedMesh.rotation.x += delta * 0.005;

    const matrix = new THREE.Matrix4();
    for (let i = 0; i < count; i++) {
      instancedMesh.getMatrixAt(i, matrix);
      dummy.current.applyMatrix4(matrix);

      const noiseX = Math.sin(timeRef.current * 0.5 + i * 0.01) * 0.0005;
      const noiseY = Math.cos(timeRef.current * 0.3 + i * 0.01) * 0.0005;
      const noiseZ = Math.sin(timeRef.current * 0.7 + i * 0.01) * 0.0005;

      dummy.current.position.x += noiseX;
      dummy.current.position.y += noiseY;
      dummy.current.position.z += noiseZ;

      const dx = cameraPos.x - dummy.current.position.x;
      const dy = cameraPos.y - dummy.current.position.y;
      const dz = cameraPos.z - dummy.current.position.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (dist < 15) {
        const force = 0.0005 * (1 - dist / 15);
        dummy.current.position.x += dx * force;
        dummy.current.position.y += dy * force;
        dummy.current.position.z += dz * force;
      }

      const r = Math.sqrt(
        dummy.current.position.x ** 2 + 
        dummy.current.position.y ** 2 + 
        dummy.current.position.z ** 2
      );
      if (r > 45) {
        dummy.current.position.multiplyScalar(0.98);
      }

      dummy.current.updateMatrix();
      instancedMesh.setMatrixAt(i, dummy.current.matrix);
    }
    instancedMesh.instanceMatrix.needsUpdate = true;
  });

  const goldColor = timeOfDay === 'night' ? 0xffd700 : timeOfDay === 'sunset' ? 0xff8c00 : 0xc9a84c;

  return (
    <instancedMesh
      ref={meshRef}
      args={[null, null, countRef.current]}
      frustumCulled
    >
      <sphereGeometry args={[0.03, 6, 6]} />
      <meshBasicMaterial
        color={goldColor}
        transparent
        opacity={0.6}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  );
}

export function GlobalParticlesInstanced() {
  return (
    <>
      <AmbientDustInstanced />
      <GoldParticlesInstanced />
    </>
  );
}