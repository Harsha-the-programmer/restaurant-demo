import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const assets = [
      '/models/wine-glass.gltf',
      '/hdri/venice_sunset_1k.hdr',
      '/hdri/studio_small_04_1k.hdr',
      '/hdri/warehouse_1k.hdr',
    ];

    let loaded = 0;
    const total = assets.length;

    const checkAsset = async (url) => {
      try {
        const res = await fetch(url, { method: 'HEAD' });
        return res.ok;
      } catch {
        return false;
      }
    };

    const loadAll = async () => {
      for (const asset of assets) {
        await checkAsset(asset);
        loaded++;
        setProgress(Math.round((loaded / total) * 100));
      }
      setProgress(100);
      setTimeout(() => setIsComplete(true), 300);
    };

    loadAll();

    const timer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => setIsComplete(true), 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (isComplete) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        color: 'var(--cream)',
      }}
    >
      <motion.div
        className="loader-logo"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '3rem',
        }}
      >
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: 500,
          color: 'var(--gold)',
          letterSpacing: '0.05em',
        }}>
          EMBER & SPICE
        </span>
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.75rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--cream-muted)',
        }}>
          Fine Dining · Hyderabad
        </span>
      </motion.div>

      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: 0,
          height: '2px',
          background: 'linear-gradient(90deg, var(--gold-dim) 0%, var(--gold) 50%, var(--gold-light) 100%)',
          borderRadius: '1px',
          maxWidth: '300px',
        }}
      />

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        style={{
          marginTop: '1.5rem',
          fontSize: '0.875rem',
          color: 'var(--cream-muted)',
          fontFamily: 'var(--font-body)',
        }}
      >
        Loading experience... {progress}%
      </motion.p>
    </motion.div>
  );
}

export function LoadingBar({ progress = 0 }) {
  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '3px',
        background: 'transparent',
        zIndex: 9998,
      }}
    >
      <motion.div
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        style={{
          height: '100%',
          background: 'linear-gradient(90deg, var(--gold-dim) 0%, var(--gold) 50%, var(--gold-light) 100%)',
          borderRadius: '0 2px 2px 0',
          boxShadow: '0 0 20px var(--gold)',
        }}
      />
    </motion.div>
  );
}