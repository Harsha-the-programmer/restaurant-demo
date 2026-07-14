import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from './GlobalStore';

const pillars = [
  { 
    id: 'tasting', 
    icon: '🍽', 
    title: 'Curated Tasting Menus', 
    desc: 'Multi-course journeys designed by our executive chef, changing seasonally to showcase the finest ingredients.',
    model: 'tasting-menu'
  },
  { 
    id: 'music', 
    icon: '🎵', 
    title: 'Live Music on Weekends', 
    desc: 'Classical Indian and contemporary fusion performances every Friday and Saturday evening from 8 PM.',
    model: 'music'
  },
  { 
    id: 'wine', 
    icon: '🍷', 
    title: 'Imported Wine Selection', 
    desc: 'Over 200 labels from Bordeaux, Napa, Tuscany, and emerging Indian vineyards, curated by our sommelier.',
    model: 'wine'
  },
  { 
    id: 'kitchen', 
    icon: '👨‍🍳', 
    title: 'Open Kitchen Experience', 
    desc: 'Watch culinary mastery unfold at our chef\'s counter — interactive dining with front-row seats to the action.',
    model: 'kitchen'
  },
  { 
    id: 'farm', 
    icon: '🌿', 
    title: 'Farm-to-Table Sourcing', 
    desc: 'Direct partnerships with organic farms across Karnataka and Maharashtra, ensuring peak freshness daily.',
    model: 'farm'
  },
];

export default function Experience() {
  const [activePillar, setLocalActivePillar] = useState('tasting-menu');
  const { setCurrentSection, setActivePillar } = useStore();

  useEffect(() => {
    setCurrentSection('experience');
    return () => setCurrentSection('home');
  }, [setCurrentSection]);

  const handlePillarHover = (pillarId) => {
    setLocalActivePillar(pillarId);
    setActivePillar(pillarId);
  };

  return (
    <section
      id="experience"
      className="section experience"
      style={{
        background: 'var(--bg)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="section-header">
          <span className="section-eyebrow">The Ember & Spice Difference</span>
          <h2 className="section-title">
            <span className="shimmer">Why Choose Us</span>
          </h2>
        </div>

        <div
          className="experience-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4rem',
            alignItems: 'center',
          }}
        >
          <motion.div
            className="experience-content"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {pillars.map((pillar, index) => (
              <motion.div
                key={pillar.id}
                className="pillar-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  marginBottom: '2.5rem',
                  paddingRight: '2rem',
                  opacity: activePillar === pillar.id ? 1 : 0.5,
                  transition: 'opacity 0.4s ease',
                }}
                onMouseEnter={() => handlePillarHover(pillar.id)}
              >
                <motion.div
                  className="pillar-icon"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    fontSize: '2.5rem',
                    marginBottom: '1rem',
                    display: 'inline-block',
                    filter: 'drop-shadow(0 0 20px rgba(201, 168, 76, 0.5))',
                  }}
                >
                  {pillar.icon}
                </motion.div>
                <h3 className="pillar-title" style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.375rem',
                  fontWeight: 500,
                  color: 'var(--cream)',
                  marginBottom: '0.75rem',
                }}>
                  {pillar.title}
                </h3>
                <p className="pillar-desc" style={{
                  fontSize: '1rem',
                  lineHeight: 1.7,
                  color: 'var(--cream-muted)',
                }}>
                  {pillar.desc}
                </p>
                <div className="gold-divider" style={{
                  width: '60px',
                  margin: '1.5rem 0 0 0',
                }} />
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="experience-3d"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '1 / 1',
              maxWidth: '500px',
              margin: '0 auto',
            }}
          >
            <div 
              id="experience-3d-placeholder"
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--gold)',
                fontSize: '1.5rem',
                border: '1px solid var(--charcoal-border)',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, rgba(201, 168, 76, 0.05) 0%, transparent 100%)',
              }}
            >
              3D Content Rendered in Global Canvas
            </div>
            <style>{`
              @keyframes pulse {
                0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
                50% { transform: translate(-50%, -50%) scale(1.3); opacity: 0.1; }
              }
            `}</style>
          </motion.div>
        </div>
      </div>
    </section>
  );
}