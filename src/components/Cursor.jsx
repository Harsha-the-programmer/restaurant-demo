import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function Cursor() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isVisible]);

  useEffect(() => {
    const animate = () => {
      if (dotRef.current && ringRef.current) {
        const dot = dotRef.current;
        const ring = ringRef.current;

        const dotX = parseFloat(dot.style.getPropertyValue('--x')) || mousePos.x;
        const dotY = parseFloat(dot.style.getPropertyValue('--y')) || mousePos.y;

        const newDotX = dotX + (mousePos.x - dotX) * 0.3;
        const newDotY = dotY + (mousePos.y - dotY) * 0.3;

        dot.style.setProperty('--x', newDotX);
        dot.style.setProperty('--y', newDotY);

        const ringX = parseFloat(ring.style.getPropertyValue('--x')) || mousePos.x;
        const ringY = parseFloat(ring.style.getPropertyValue('--y')) || mousePos.y;

        const newRingX = ringX + (mousePos.x - ringX) * 0.1;
        const newRingY = ringY + (mousePos.y - ringY) * 0.1;

        ring.style.setProperty('--x', newRingX);
        ring.style.setProperty('--y', newRingY);
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(rafRef.current);
  }, [mousePos]);

  if (!isVisible) return null;

  return (
    <>
      <motion.div
        ref={dotRef}
        className="cursor-dot"
        style={{
          '--x': mousePos.x,
          '--y': mousePos.y,
        }}
        initial={false}
        animate={{ opacity: 1 }}
      />
      <motion.div
        ref={ringRef}
        className="cursor-ring"
        style={{
          '--x': mousePos.x,
          '--y': mousePos.y,
        }}
        initial={false}
        animate={{ opacity: 1 }}
      />
    </>
  );
}