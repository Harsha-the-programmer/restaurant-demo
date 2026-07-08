import { useFrame, useThree } from '@react-three/fiber';
import { useStore } from './GlobalStore';
import { useRef } from 'react';
import * as THREE from 'three';

export function GlobalCamera() {
  const { scrollProgress, currentSection, reducedMotion, timeOfDay } = useStore();
  const { camera, scene } = useThree();
  const targetPos = useRef(new THREE.Vector3());
  const targetRot = useRef(new THREE.Euler());
  const currentPos = useRef(new THREE.Vector3());
  const currentRot = useRef(new THREE.Euler());
  const sunLightRef = useRef(null);
  const timeRef = useRef(0);

  const sectionCameras = {
    home: { pos: [0, 0.5, 8], rot: [0, 0, 0], fov: 35, sun: { pos: [10, 15, 10], color: 0xffcc88, intensity: 1.5 } },
    about: { pos: [0, 1.5, 6], rot: [-0.1, 0, 0], fov: 45, sun: { pos: [8, 12, 8], color: 0xffeedd, intensity: 1.2 } },
    menu: { pos: [0, 2, 7], rot: [-0.15, 0, 0], fov: 45, sun: { pos: [5, 10, 5], color: 0xfff8e7, intensity: 1.0 } },
    experience: { pos: [0, 1, 6], rot: [0, 0, 0], fov: 45, sun: { pos: [3, 8, 3], color: 0xffddaa, intensity: 0.8 } },
    gallery: { pos: [0, 1.5, 8], rot: [-0.1, 0, 0], fov: 50, sun: { pos: [0, 5, 0], color: 0xffcc88, intensity: 0.6 } },
    reserve: { pos: [0, 1, 5], rot: [0, 0, 0], fov: 40, sun: { pos: [-5, 5, -5], color: 0xcc8844, intensity: 0.4 } },
  };

  useFrame((_, delta) => {
    if (reducedMotion) return;
    timeRef.current += delta;

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

    if (sunLightRef.current && section.sun) {
      const sun = section.sun;
      const sunPos = new THREE.Vector3(...sun.pos);
      const dayCycle = Math.sin(timeRef.current * 0.1) * 0.3 + 0.7;
      sunPos.y *= dayCycle;
      sunLightRef.current.position.lerp(sunPos, lerpFactor);
      sunLightRef.current.color.lerp(new THREE.Color(sun.color), lerpFactor);
      sunLightRef.current.intensity = THREE.MathUtils.lerp(sunLightRef.current.intensity, sun.intensity * dayCycle, lerpFactor);
    }
  });

  return (
    <directionalLight
      ref={sunLightRef}
      castShadow
      shadow-mapSize={2048}
      shadow-camera-near={0.1}
      shadow-camera-far={50}
      shadow-camera-left={-25}
      shadow-camera-right={25}
      shadow-camera-top={25}
      shadow-camera-bottom={-25}
    />
  );
}