import { Environment, useEnvironment } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { Suspense, useMemo } from 'react';
import * as THREE from 'three';

const HDRI_PATHS = {
  sunset: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/venice_sunset_1k.hdr',
  night: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/venice_sunset_1k.hdr',
  studio: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_04_1k.hdr',
  warehouse: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/warehouse_1k.hdr',
};

function HDRIBackground({ preset = 'sunset', background = true, ground = false, exposure = 1.2 }) {
  const hdriUrl = HDRI_PATHS[preset] || HDRI_PATHS.sunset;
  
  const hdri = useLoader(RGBELoader, hdriUrl);
  const hdriBlur = useLoader(RGBELoader, hdriUrl);

  const envMap = useMemo(() => {
    if (!hdri) return null;
    const pmremGenerator = new THREE.PMREMGenerator(undefined);
    pmremGenerator.compileEquirectangularShader();
    const envMap = pmremGenerator.fromEquirectangular(hdri).texture;
    pmremGenerator.dispose();
    return envMap;
  }, [hdri]);

  return (
    <Environment
      background={background ? hdri : null}
      map={envMap}
      files={hdriBlur}
      preset={preset}
      ground={ground}
      toneMappingExposure={exposure}
    />
  );
}

export function HeroEnvironment() {
  return (
    <Suspense fallback={null}>
      <HDRIBackground 
        preset="sunset" 
        background={true} 
        ground={false} 
        exposure={1.3}
      />
    </Suspense>
  );
}

export function ExperienceEnvironment() {
  return (
    <Suspense fallback={null}>
      <HDRIBackground 
        preset="warehouse" 
        background={false} 
        ground={true} 
        exposure={1.0}
      />
    </Suspense>
  );
}

export function GlobalEnvironment() {
  return (
    <Suspense fallback={null}>
      <HDRIBackground 
        preset="studio" 
        background={false} 
        ground={false} 
        exposure={0.8}
      />
    </Suspense>
  );
}