import { useFrame, useThree } from '@react-three/fiber';
import { useStore } from './GlobalStore';
import * as THREE from 'three';

export function GlobalCamera() {
  const { scrollProgress, currentSection, reducedMotion } = useStore();
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3());
  const targetRot = useRef(new THREE.Euler());
  const currentPos = useRef(new THREE.Vector3());
  const currentRot = useRef(new THREE.Euler());

  const sectionCameras = {
    home: { pos: [0, 0.5, 8], rot: [0, 0, 0], fov: 35 },
    about: { pos: [0, 1.5, 6], rot: [-0.1, 0, 0], fov: 45 },
    menu: { pos: [0, 2, 7], rot: [-0.15, 0, 0], fov: 45 },
    experience: { pos: [0, 1, 6], rot: [0, 0, 0], fov: 45 },
    gallery: { pos: [0, 1.5, 8], rot: [-0.1, 0, 0], fov: 50 },
    reserve: { pos: [0, 1, 5], rot: [0, 0, 0], fov: 40 },
  };

  useFrame((_, delta) => {
    if (reducedMotion) return;

    const section = sectionCameras[currentSection] || sectionCameras.home;
    targetPos.set(...section.pos);
    targetRot.set(...section.rot);

    const lerpFactor = 1 - Math.exp(-delta * 3);
    currentPos.lerp(targetPos, lerpFactor);
    currentRot.set(
      THREE.MathUtils.lerp(currentRot.x, targetRot.x, lerpFactor),
      THREE.MathUtils.lerp(currentRot.y, targetRot.y, lerpFactor),
      THREE.MathUtils.lerp(currentRot.z, targetRot.z, lerpFactor)
    );

    camera.position.copy(currentPos);
    camera.rotation.copy(currentRot);
    camera.fov = THREE.MathUtils.lerp(camera.fov, section.fov, lerpFactor);
    camera.updateProjectionMatrix();
  });

  return null;
}

import { useRef } from 'react';