import { motion } from 'framer-motion';

export default function About() {
  const stats = [
    { value: '12+', label: 'Award-Winning Dishes' },
    { value: '200+', label: 'Tables Served Daily' },
    { value: '8 Years', label: 'Of Excellence' },
  ];

  return (
    <section
      id="about"
      className="section about"
      style={{
        position: 'relative',
      }}
    >
      <div className="container">
        <div
          className="about-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '6rem',
            alignItems: 'center',
            maxWidth: '1000px',
            margin: '0 auto',
          }}
        >
          <div className="about-quote">
            <motion.blockquote
              className="reveal"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: 'var(--font-accent)',
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontWeight: 300,
                fontStyle: 'italic',
                lineHeight: 1.3,
                color: 'var(--gold)',
                marginBottom: '2rem',
                position: 'relative',
                paddingLeft: '2rem',
              }}
            >
              &ldquo;Cooking is not just feeding the body &mdash; it&rsquo;s nourishing the soul.&rdquo;
            </motion.blockquote>

            <motion.div
              className="gold-divider reveal"
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: 'left', margin: '2rem 0' }}
            />
          </div>

          <div className="about-text">
            <motion.p
              className="reveal"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontSize: '1.125rem',
                lineHeight: 1.8,
                color: 'var(--cream-muted)',
                marginBottom: '1.5rem',
              }}
            >
              At Ember & Spice, we believe that a meal is more than sustenance &mdash; it is a journey
              through the rich tapestry of India&rsquo;s culinary heritage, reimagined through the lens
              of contemporary technique. Our chefs honor time-honored recipes while embracing innovation,
              sourcing the finest seasonal ingredients from local farms and purveyors across the subcontinent.
            </motion.p>

            <motion.p
              className="reveal"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontSize: '1.125rem',
                lineHeight: 1.8,
                color: 'var(--cream-muted)',
                marginBottom: '3rem',
              }}
            >
              Every plate that leaves our kitchen tells a story &mdash; of tradition preserved, boundaries
              pushed, and flavors elevated. From the smoky depth of our tandoor to the delicate balance
              of our tasting menus, each experience is crafted to linger in memory long after the last bite.
            </motion.p>
          </div>
        </div>

        <motion.div
          className="about-stats"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '2rem',
            marginTop: '5rem',
            paddingTop: '3rem',
            borderTop: '1px solid var(--charcoal-border)',
            maxWidth: '800px',
            marginLeft: 'auto',
            marginRight: 'auto',
            textAlign: 'center',
          }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.value}
              className="stat-card reveal"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              style={{
                padding: '1.5rem',
              }}
            >
              <div
                className="stat-value"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                  fontWeight: 500,
                  color: 'var(--gold)',
                  lineHeight: 1,
                  marginBottom: '0.5rem',
                }}
              >
                {stat.value}
              </div>
              <div
                className="stat-label"
                style={{
                  fontSize: '0.875rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--cream-muted)',
                  fontWeight: 500,
                }}
              >
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}