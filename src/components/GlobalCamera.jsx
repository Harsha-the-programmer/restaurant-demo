import { useFrame, useThree } from '@react-three/fiber';
import { useStore } from './GlobalStore';
import { useRef } from 'react';
import * as THREE from 'three';

export function GlobalCamera() {
  const { scrollProgress, currentSection, reducedMotion, timeOfDay } = useStore();
  const { camera, scene } = useThree();
  const targetPos = useRef(new THREE.Vector3());
  const targetTarget = useRef(new THREE.Vector3());
  const currentPos = useRef(new THREE.Vector3());
  const currentTarget = useRef(new THREE.Vector3());
  const sunLightRef = useRef(null);
  const timeRef = useRef(0);

  const sectionCameras = {
    home: { 
      pos: [0, 0.5, 8], 
      target: [0, -0.3, 0], 
      fov: 35, 
      sun: { pos: [10, 15, 10], color: 0xffcc88, intensity: 1.5 } 
    },
    about: { 
      pos: [0, 1.5, 6], 
      target: [0, 0.5, 0], 
      fov: 45, 
      sun: { pos: [8, 12, 8], color: 0xffeedd, intensity: 1.2 } 
    },
    menu: { 
      pos: [0, 2, 7], 
      target: [0, 0.5, 0], 
      fov: 45, 
      sun: { pos: [5, 10, 5], color: 0xfff8e7, intensity: 1.0 } 
    },
    experience: { 
      pos: [0, 1, 6], 
      target: [0, 0, 0], 
      fov: 45, 
      sun: { pos: [3, 8, 3], color: 0xffddaa, intensity: 0.8 } 
    },
    gallery: { 
      pos: [0, 1.5, 8], 
      target: [0, 0.5, 0], 
      fov: 50, 
      sun: { pos: [0, 5, 0], color: 0xffcc88, intensity: 0.6 } 
    },
    reserve: { 
      pos: [0, 1, 5], 
      target: [0, 0.5, 0], 
      fov: 40, 
      sun: { pos: [-5, 5, -5], color: 0xcc8844, intensity: 0.4 } 
    },
  };

  useFrame((_, delta) => {
    if (reducedMotion) return;
    timeRef.current += delta;

    const section = sectionCameras[currentSection] || sectionCameras.home;
    
    targetPos.current.set(...section.pos);
    targetTarget.current.set(...section.target);

    const lerpFactor = 1 - Math.exp(-delta * 3);
    currentPos.current.lerp(targetPos.current, lerpFactor);
    currentTarget.current.lerp(targetTarget.current, lerpFactor);

    camera.position.copy(currentPos.current);
    camera.lookAt(currentTarget.current);
    camera.fov = THREE.MathUtils.lerp(camera.fov, section.fov, lerpFactor);
    camera.updateProjectionMatrix();

    if (sunLightRef.current && section.sun) {
      const sun = section.sun;
      const sunPos = new THREE.Vector3(...sun.pos);
      const dayCycle = Math.sin(timeRef.current * 0.1) * 0.3 + 0.7;
      sunPos.y *= dayCycle;
      sunLightRef.current.position.lerp(sunPos, 1 - Math.exp(-delta * 3));
      sunLightRef.current.color.lerp(new THREE.Color(sun.color), 1 - Math.exp(-delta * 3));
      sunLightRef.current.intensity = THREE.MathUtils.lerp(sunLightRef.current.intensity, sun.intensity * dayCycle, 1 - Math.exp(-delta * 3));
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