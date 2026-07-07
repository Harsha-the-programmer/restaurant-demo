import { Link } from 'react-scroll';
import { motion } from 'framer-motion';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { name: 'About', href: 'about' },
    { name: 'Menu', href: 'menu' },
    { name: 'Experience', href: 'experience' },
    { name: 'Gallery', href: 'gallery' },
    { name: 'Reserve', href: 'reserve' },
  ];

  const contactInfo = {
    address: 'Road No. 12, Banjara Hills, Hyderabad, Telangana 500034',
    phone: '+91 40 2345 6789',
    email: 'reservations@emberandspice.com',
  };

  const hours = [
    { days: 'Monday – Thursday', time: '7:00 PM – 11:00 PM' },
    { days: 'Friday – Sunday', time: '6:00 PM – 12:00 AM' },
  ];

  const socialLinks = [
    { name: 'Instagram', href: 'https://instagram.com', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    )},
    { name: 'Facebook', href: 'https://facebook.com', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    )},
    { name: 'Twitter', href: 'https://twitter.com', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
      </svg>
    )},
  ];

  return (
    <footer
      id="footer"
      className="footer"
      style={{
        background: 'var(--bg)',
        borderTop: '1px solid var(--charcoal-border)',
        padding: '4rem 0 2rem',
        position: 'relative',
      }}
    >
      <div
        className="footer-top-border"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
        }}
      />

      <div className="container">
        <div
          className="footer-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.5fr repeat(3, 1fr)',
            gap: '3rem',
            marginBottom: '4rem',
          }}
        >
          <motion.div
            className="footer-brand reveal"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              to="home"
              smooth={true}
              duration={800}
              style={{ textDecoration: 'none', color: 'inherit', display: 'inline-block', marginBottom: '1.5rem', cursor: 'pointer' }}
            >
              <div className="footer-logo" style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                <span style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.75rem',
                  fontWeight: 500,
                  color: 'var(--gold)',
                  letterSpacing: '0.05em',
                }}>
                  EMBER & SPICE
                </span>
                <span style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--cream-muted)',
                  marginTop: '-2px',
                }}>
                  Fine Dining · Hyderabad
                </span>
              </div>
            </Link>
            <p style={{
              fontSize: '1rem',
              lineHeight: 1.7,
              color: 'var(--cream-muted)',
              maxWidth: '280px',
              marginBottom: '2rem',
            }}>
              Where every meal becomes a memory. Exquisite Indian cuisine crafted with global techniques in the heart of Hyderabad.
            </p>
            <div
              className="footer-social"
              style={{ display: 'flex', gap: '1rem' }}
            >
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  style={{
                    width: '44px',
                    height: '44px',
                    border: '1px solid var(--charcoal-border)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--cream-muted)',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--gold)';
                    e.currentTarget.style.color = 'var(--gold)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--charcoal-border)';
                    e.currentTarget.style.color = 'var(--cream-muted)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </motion.div>

          <motion.nav
            className="footer-nav reveal"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Footer navigation"
          >
            <h4 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.125rem',
              fontWeight: 500,
              color: 'var(--cream)',
              marginBottom: '1.5rem',
            }}>
              Quick Links
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    smooth={true}
                    duration={800}
                    spy={true}
                    offset={-80}
                    style={{
                      fontSize: '0.9375rem',
                      color: 'var(--cream-muted)',
                      transition: 'color 0.3s ease',
                      position: 'relative',
                      cursor: 'pointer',
                    }}
                  >
                    {link.name}
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '-2px',
                        left: 0,
                        width: '100%',
                        height: '1px',
                        background: 'var(--gold)',
                        transform: 'scaleX(0)',
                        transformOrigin: 'right',
                        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>

          <motion.div
            className="footer-contact reveal"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <h4 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.125rem',
              fontWeight: 500,
              color: 'var(--cream)',
              marginBottom: '1.5rem',
            }}>
              Contact
            </h4>
            <address style={{ fontStyle: 'normal', lineHeight: 1.8, color: 'var(--cream-muted)' }}>
              <p style={{ marginBottom: '1rem' }}>{contactInfo.address}</p>
              <p style={{ marginBottom: '0.5rem' }}>
                <a href={`tel:${contactInfo.phone}`} style={{ color: 'var(--cream-muted)', transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.target.style.color = 'var(--gold)'} onMouseLeave={(e) => e.target.style.color = 'var(--cream-muted)'}>
                  {contactInfo.phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${contactInfo.email}`} style={{ color: 'var(--cream-muted)', transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.target.style.color = 'var(--gold)'} onMouseLeave={(e) => e.target.style.color = 'var(--cream-muted)'}>
                  {contactInfo.email}
                </a>
              </p>
            </address>
          </motion.div>

          <motion.div
            className="footer-hours reveal"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <h4 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.125rem',
              fontWeight: 500,
              color: 'var(--cream)',
              marginBottom: '1.5rem',
            }}>
              Hours
            </h4>
            <dl style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--cream-muted)' }}>
              {hours.map((hour, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                  <dt style={{ fontSize: '0.9375rem', fontWeight: 500 }}>{hour.days}</dt>
                  <dd style={{ fontSize: '0.9375rem', textAlign: 'right' }}>{hour.time}</dd>
                </div>
              ))}
            </dl>
          </motion.div>
        </div>

        <motion.div
          className="footer-bottom"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            paddingTop: '2rem',
            borderTop: '1px solid var(--charcoal-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <p style={{
            fontSize: '0.875rem',
            color: 'var(--cream-muted)',
          }}>
            © {currentYear} Ember & Spice · Designed by Harsha Kamishetty
          </p>
          <p style={{
            fontSize: '0.875rem',
            color: 'var(--cream-muted)',
          }}>
            All rights reserved
          </p>
        </motion.div>
      </div>
    </footer>
  );
}