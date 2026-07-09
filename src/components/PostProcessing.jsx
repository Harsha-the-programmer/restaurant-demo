import { EffectComposer, Bloom, ToneMapping, DepthOfField, SSAO, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import { useMemo } from 'react';
import * as THREE from 'three';

export function PostProcessing({ 
  intensity = 1.0, 
  enableDOF = true, 
  enableSSAO = false,
  enableBloom = true,
  enableChromaticAberration = false 
}) {
  const bloom = useMemo(() => ({
    intensity: 0.8 * intensity,
    mipmapBlur: true,
    luminanceThreshold: 0.85,
    luminanceSmoothing: 0.025,
    height: 480,
  }), [intensity]);

  const toneMapping = useMemo(() => ({
    mode: ToneMapping.ACESFilmic,
    exposure: 1.15,
    resolution: 256,
  }), []);

  const depthOfField = useMemo(() => ({
    focusDistance: 8,
    focalLength: 0.05,
    bokehScale: 3,
    height: 480,
  }), []);

  const ssao = useMemo(() => ({
    kernelRadius: 16,
    minDistance: 0.005,
    maxDistance: 0.1,
    intensity: 2.5,
    color: new THREE.Color(0x0a0a0a),
    samples: 16,
    rings: 8,
  }), []);

  const chromaticAberration = useMemo(() => ({
    offset: [0.0015, 0.0015],
  }), []);

  const vignette = useMemo(() => ({
    offset: 0.35,
    darkness: 1.2,
  }), []);

  return (
    <EffectComposer multisampling={4} frameBufferType={THREE.HalfFloatType}>
      {enableSSAO && <SSAO {...ssao} />}
      {enableDOF && <DepthOfField {...depthOfField} />}
      {enableBloom && <Bloom {...bloom} />}
      <ToneMapping {...toneMapping} />
      {enableChromaticAberration && <ChromaticAberration {...chromaticAberration} />}
      <Vignette {...vignette} />
    </EffectComposer>
  );
}