import { useState, useEffect } from 'react';
import { Link } from 'react-scroll';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: 'about' },
    { name: 'Menu', href: 'menu' },
    { name: 'Experience', href: 'experience' },
    { name: 'Gallery', href: 'gallery' },
    { name: 'Reserve', href: 'reserve' },
  ];

  return (
    <header
      className={`navbar ${isScrolled ? 'scrolled' : ''}`}
      role="banner"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        height: 'var(--nav-height)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 var(--container-padding)',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        background: isScrolled ? 'rgba(13, 13, 13, 0.95)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(20px)' : 'none',
        borderBottom: isScrolled ? '1px solid var(--gold)' : 'none',
      }}
    >
      <Link
        to="home"
        smooth={true}
        duration={800}
        spy={true}
        offset={-80}
        style={{
          textDecoration: 'none',
          color: 'inherit',
          cursor: 'pointer',
          marginLeft: '2rem',
        }}
      >
        <div className="logo" style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.5rem',
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

      <nav
        className="nav-links"
        role="navigation"
        aria-label="Main navigation"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '3rem',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.href}
            smooth={true}
            duration={800}
            spy={true}
            offset={-80}
            style={{
              fontSize: '0.875rem',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--cream-muted)',
              transition: 'color 0.3s ease',
              position: 'relative',
              cursor: 'pointer',
            }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {link.name}
            <span
              style={{
                position: 'absolute',
                bottom: '-4px',
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
        ))}
      </nav>

      <div
        className="nav-cta"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <Link
          to="reserve"
          smooth={true}
          duration={800}
          spy={true}
          offset={-80}
          className="btn btn-outline"
          onClick={() => setIsMobileMenuOpen(false)}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '0.75rem',
            cursor: 'pointer',
          }}
        >
          Reserve a Table
        </Link>

        <button
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMobileMenuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="mobile-menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(13, 13, 13, 0.98)',
              backdropFilter: 'blur(20px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2rem',
              zIndex: 1000,
              padding: 'var(--container-padding)',
            }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                smooth={true}
                duration={800}
                spy={true}
                offset={-80}
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--cream)',
                  transition: 'color 0.3s ease',
                  cursor: 'pointer',
                }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="reserve"
              smooth={true}
              duration={800}
              spy={true}
              offset={-80}
              className="btn btn-primary"
              style={{
                marginTop: '1rem',
                padding: '1rem 3rem',
                cursor: 'pointer',
              }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Reserve a Table
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}