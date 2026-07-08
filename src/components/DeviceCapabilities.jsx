import { useEffect, useState } from 'react';

export function DeviceCapabilities() {
  const [caps, setCaps] = useState({
    isLowEnd: false,
    prefersReducedMotion: false,
    webgl2: true,
    memory: 0,
    cores: 0,
  });

  useEffect(() => {
    const checkCapabilities = () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      let isLowEnd = false;
      let webgl2 = true;
      let memory = 0;
      let cores = navigator.hardwareConcurrency || 4;

      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2');
        webgl2 = !!gl;
        if (gl) {
          const ext = gl.getExtension('WEBGL_debug_renderer_info');
          if (ext) {
            const renderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL);
            isLowEnd = /intel|integrated|basic|swiftshader|llvmpipe/i.test(renderer);
          }
          // Use standard renderer parameter as fallback
          if (!isLowEnd) {
            const renderer = gl.getParameter(gl.RENDERER);
            isLowEnd = /intel|integrated|basic|swiftshader|llvmpipe/i.test(renderer);
          }
        }
      } catch {
        webgl2 = false;
        isLowEnd = true;
      }

      if ('deviceMemory' in navigator) {
        memory = navigator.deviceMemory;
        if (memory < 4) isLowEnd = true;
      }

      if (cores < 4) isLowEnd = true;

      if (prefersReducedMotion) isLowEnd = true;

      setCaps({
        isLowEnd,
        prefersReducedMotion,
        webgl2,
        memory,
        cores,
      });
    };

    checkCapabilities();

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = () => checkCapabilities();
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return (
    <div data-device-caps={JSON.stringify(caps)}>
      {caps.isLowEnd && (
        <style jsx global>{`
          .low-end * {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
          .low-end canvas {
            display: none !important;
          }
          .low-end .hero-fallback {
            display: block !important;
          }
        `}</style>
      )}
    </div>
  );
}

export function HeroFallback() {
  return (
    <div className="hero-fallback" style={{ display: 'none', position: 'absolute', inset: 0, zIndex: -1 }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 50%, #0d0d0d 100%)',
      }} />
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'url("https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=1920&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.15,
      }} />
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 30%, #0d0d0d 100%)',
      }} />
    </div>
  );
}

export function ReducedMotionWrapper({ children, fallback }) {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mediaQuery.matches);
    const handler = (e) => setReduced(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  if (reduced && fallback) return fallback;
  return children;
}