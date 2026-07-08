import { OrbitControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DepthOfField } from '@react-three/postprocessing';

gsap.registerPlugin(ScrollTrigger);

export function HeroCamera({ 
  position = [0, 0.5, 8], 
  target = [0, 0.5, 0],
  fov = 35,
  aperture = 0.8,
  focusDistance = 8,
  enableDOF = true
}) {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(...position);
    camera.lookAt(...target);
    camera.fov = fov;
    camera.updateProjectionMatrix();
  }, [position, target, fov]);

  useFrame((state) => {
    if (enableDOF) {
      camera.focus = focusDistance;
      camera.aperture = aperture;
    }
  });

  return (
    enableDOF && (
      <DepthOfField
        focusDistance={focusDistance}
        focalLength={0.05}
        bokehScale={3}
        height={480}
      />
    )
  );
}

export function ExperienceCamera({ 
  position = [0, 1, 6], 
  target = [0, 0, 0],
  fov = 45,
  enableControls = true,
  enableAutoRotate = true,
  autoRotateSpeed = 0.3,
  minDistance = 3,
  maxDistance = 15,
}) {
  const controlsRef = useRef();
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(...position);
    camera.lookAt(...target);
    camera.fov = fov;
    camera.updateProjectionMatrix();
  }, [position, target, fov]);

  useFrame(() => {
    if (controlsRef.current && enableAutoRotate) {
      controlsRef.current.autoRotate = true;
      controlsRef.current.autoRotateSpeed = autoRotateSpeed;
    }
  });

  return (
    <>
      <DepthOfField
        focusDistance={6}
        focalLength={0.05}
        bokehScale={2}
        height={480}
      />
      {enableControls && (
        <OrbitControls
          ref={controlsRef}
          enableDamping={true}
          dampingFactor={0.05}
          enablePan={true}
          panSpeed={0.5}
          minDistance={minDistance}
          maxDistance={maxDistance}
          minPolarAngle={0.15}
          maxPolarAngle={Math.PI / 2 - 0.05}
          autoRotate={enableAutoRotate}
          autoRotateSpeed={autoRotateSpeed}
          target={target}
        />
      )}
    </>
  );
}

export function ScrollCamera({ 
  trigger = '#hero', 
  startPosition = [0, 0.5, 8],
  endPosition = [3, 2, 12],
  startRotation = [0, 0, 0],
  endRotation = [-0.15, -0.3, 0],
  scrub = 1,
}) {
  const { camera } = useThree();
  const tlRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger,
        start: 'top top',
        end: 'bottom top',
        scrub,
        onUpdate: (self) => {
          const progress = self.progress;
          camera.position.x = gsap.utils.interpolate(startPosition[0], endPosition[0], progress);
          camera.position.y = gsap.utils.interpolate(startPosition[1], endPosition[1], progress);
          camera.position.z = gsap.utils.interpolate(startPosition[2], endPosition[2], progress);
          camera.rotation.x = gsap.utils.interpolate(startRotation[0], endRotation[0], progress);
          camera.rotation.y = gsap.utils.interpolate(startRotation[1], endRotation[1], progress);
          camera.rotation.z = gsap.utils.interpolate(startRotation[2], endRotation[2], progress);
        },
      },
    });

    tlRef.current = tl;
    return () => tl.kill();
  }, [trigger, startPosition, endPosition, startRotation, endRotation, scrub]);

  return null;
}