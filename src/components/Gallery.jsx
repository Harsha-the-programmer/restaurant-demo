import { motion } from 'framer-motion';

const galleryItems = [
  {
    label: 'The Kitchen',
    image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&q=80',
    gradient: 'linear-gradient(135deg, #1a1a1a 0%, #3d2a1a 50%, #1a1a1a 100%)',
    overlay: 'radial-gradient(ellipse at center, rgba(201, 168, 76, 0.15) 0%, transparent 70%)',
    accent: 'linear-gradient(45deg, transparent 40%, rgba(201, 168, 76, 0.3) 50%, transparent 60%)',
  },
  {
    label: 'Dum Biryani',
    image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800&q=80',
    gradient: 'linear-gradient(145deg, #2d1b0e 0%, #5d3a1a 30%, #c9a84c 50%, #5d3a1a 70%, #1a0d05 100%)',
    overlay: 'radial-gradient(circle at 30% 30%, rgba(232, 201, 122, 0.2) 0%, transparent 50%)',
    accent: 'linear-gradient(90deg, transparent, rgba(201, 168, 76, 0.4), transparent)',
  },
  {
    label: 'Candlelit Evenings',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
    gradient: 'radial-gradient(ellipse at top right, #3d2a0f 0%, #1a0d05 50%, #0d0d0d 100%)',
    overlay: 'radial-gradient(circle at top right, rgba(255, 215, 100, 0.25) 0%, transparent 60%)',
    accent: 'linear-gradient(180deg, transparent 0deg, rgba(255, 215, 100, 0.3) 0%, transparent 100%)',
  },
  {
    label: 'The Tandoor',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80',
    gradient: 'linear-gradient(160deg, #3d150f 0%, #5d2510 40%, #c94a1c 60%, #3d150f 100%)',
    overlay: 'radial-gradient(ellipse at bottom left, rgba(201, 74, 28, 0.2) 0%, transparent 50%)',
    accent: 'linear-gradient(45deg, transparent 30%, rgba(255, 140, 50, 0.3) 50%, transparent 70%)',
  },
  {
    label: 'Wine Cellar',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80',
    gradient: 'linear-gradient(155deg, #1a0d08 0%, #3d1a0f 40%, #8b3a1a 60%, #1a0d08 100%)',
    overlay: 'radial-gradient(ellipse at center, rgba(139, 58, 26, 0.15) 0%, transparent 60%)',
    accent: 'linear-gradient(135deg, transparent, rgba(180, 100, 50, 0.2), transparent)',
  },
  {
    label: 'Private Dining',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
    gradient: 'radial-gradient(ellipse at center, #2d1f1a 0%, #1a1210 50%, #0d0808 100%)',
    overlay: 'radial-gradient(ellipse at 70% 30%, rgba(201, 168, 76, 0.12) 0%, transparent 50%)',
    accent: 'linear-gradient(90deg, transparent 20%, rgba(201, 168, 76, 0.2) 50%, transparent 80%)',
  },
  {
    label: 'Artisan Cocktails',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80',
    gradient: 'linear-gradient(135deg, #1a121a 0%, #3d1a2d 40%, #5d2a3d 60%, #2d1520 100%)',
    overlay: 'radial-gradient(circle at 20% 80%, rgba(139, 58, 80, 0.2) 0%, transparent 50%)',
    accent: 'linear-gradient(45deg, transparent, rgba(180, 80, 100, 0.25), transparent)',
  },
  {
    label: 'Sunday Brunch',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&q=80',
    gradient: 'linear-gradient(120deg, #1a1a15 0%, #3d3a1a 30%, #8b8a2d 50%, #3d3a1a 70%, #1a1a15 100%)',
    overlay: 'radial-gradient(ellipse at top left, rgba(139, 138, 45, 0.15) 0%, transparent 60%)',
    accent: 'linear-gradient(180deg, transparent, rgba(180, 180, 50, 0.2), transparent)',
  },
];

export default function Gallery() {
  return (
    <section
      id="gallery"
      className="section gallery"
      style={{
        background: 'var(--bg)',
      }}
    >
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">A Glimpse Into Our World</span>
          <h2 className="section-title">
            <span className="shimmer">Gallery</span>
          </h2>
        </div>

        <motion.div
          className="gallery-grid"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gridTemplateRows: 'repeat(2, 300px)',
            gap: '1.5rem',
            gridAutoFlow: 'dense',
          }}
        >
          {galleryItems.map((item, index) => (
            <motion.article
              key={item.label}
              className="gallery-card"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.02 }}
              style={{
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                background: item.gradient,
                cursor: 'pointer',
                gridColumn: index === 0 || index === 3 ? 'span 2' : 'span 1',
                gridRow: index === 1 ? 'span 2' : 'span 1',
                border: '1px solid transparent',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <img
                src={item.image}
                alt={item.label}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />
              <div
                className="gallery-overlay"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: item.overlay,
                  opacity: 0,
                  transition: 'opacity 0.4s ease',
                }}
              />

              <div
                className="gallery-accent"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: item.accent,
                  opacity: 0,
                  transform: 'translateX(-100%)',
                  transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />

              <div
                className="gallery-label"
                style={{
                  position: 'absolute',
                  bottom: '1.5rem',
                  left: '1.5rem',
                  right: '1.5rem',
                  transform: 'translateY(20px)',
                  opacity: 0,
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  textAlign: 'left',
                }}
              >
                <span
                  className="gallery-label-text"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.5rem',
                    fontWeight: 500,
                    color: 'var(--cream)',
                    display: 'block',
                    marginBottom: '0.25rem',
                  }}
                >
                  {item.label}
                </span>
                <span
                  className="gallery-divider"
                  style={{
                    display: 'block',
                    width: '40px',
                    height: '1px',
                    background: 'var(--gold)',
                    transform: 'scaleX(0)',
                    transformOrigin: 'left',
                    transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                />
              </div>

              <style jsx>{`
                .gallery-card:hover .gallery-overlay {
                  opacity: 1;
                }
                .gallery-card:hover .gallery-accent {
                  opacity: 1;
                  transform: translateX(100%);
                }
                .gallery-card:hover .gallery-label {
                  transform: translateY(0);
                  opacity: 1;
                }
                .gallery-card:hover .gallery-divider {
                  transform: scaleX(1);
                }
                .gallery-card:hover {
                  border-color: var(--gold);
                  box-shadow: 0 20px 40px rgba(201, 168, 76, 0.15);
                }
                .gallery-card:hover img {
                  transform: scale(1.08);
                }
              `}</style>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}