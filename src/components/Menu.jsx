import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Menu() {
  const [activeTab, setActiveTab] = useState('starters');

  const categories = [
    { id: 'starters', label: 'Starters' },
    { id: 'mains', label: 'Mains' },
    { id: 'desserts', label: 'Desserts' },
    { id: 'drinks', label: 'Drinks' },
  ];

  const menuItems = {
    starters: [
      {
        name: 'Galouti Kebab',
        desc: 'Awadhi-style melt-in-mouth minced lamb kebabs, infused with 32 spices, served with roomali roti',
        price: '₹850',
        icon: '🥩',
      },
      {
        name: 'Tandoori Broccoli',
        desc: 'Charred broccoli florets marinated in hung yogurt, kasuri methi, and rare spices from the Himalayas',
        price: '₹650',
        icon: '🥦',
      },
      {
        name: 'Scallop Malai',
        desc: 'Hokkaido scallops in cardamom-saffron cream, topped with caviar and micro-greens',
        price: '₹1,200',
        icon: '🐚',
      },
    ],
    mains: [
      {
        name: 'Dum Biryani',
        desc: 'Aged basmati rice slow-cooked with saffron, rose water, and tender lamb shank in a sealed handi',
        price: '₹1,450',
        icon: '🍚',
      },
      {
        name: 'Butter Chicken',
        desc: 'Tandoor-roasted chicken in velvety tomato-cashew gravy, finished with fenugreek and cream',
        price: '₹1,150',
        icon: '🍗',
      },
      {
        name: 'Paneer Lababdar',
        desc: 'Cottage cheese in slow-reduced onion-tomato gravy with aromatic whole spices and kasuri methi',
        price: '₹950',
        icon: '🧀',
      },
    ],
    desserts: [
      {
        name: 'Mango Rasmalai',
        desc: 'Alphonso mango-infused rasmalai with pistachio dust, saffron pearls, and rose petal jam',
        price: '₹550',
        icon: '🥭',
      },
      {
        name: 'Gulab Jamun Cheesecake',
        desc: 'Fusion classic — khoya-stuffed gulab jamun atop cardamom cheesecake with rose syrup gel',
        price: '₹580',
        icon: '🍰',
      },
      {
        name: 'Kulfi Falooda',
        desc: 'Traditional malai kulfi with vermicelli, basil seeds, rose syrup, and silver leaf garnish',
        price: '₹520',
        icon: '🍦',
      },
    ],
    drinks: [
      {
        name: 'Saffron Old Fashioned',
        desc: 'Bourbon, saffron-infused demerara, angostura, orange peel — aged in oak barrel for 30 days',
        price: '₹850',
        icon: '🥃',
      },
      {
        name: 'Tamarind Margarita',
        desc: 'Tequila blanco, house tamarind cordial, lime, tajín rim — sweet, sour, spicy harmony',
        price: '₹750',
        icon: '🍸',
      },
      {
        name: 'Masala Chai Martini',
        desc: 'Vodka, spiced chai reduction, vanilla, egg white foam, cinnamon dust — dessert in a glass',
        price: '₹780',
        icon: '☕',
      },
    ],
  };

  const currentItems = menuItems[activeTab];

  return (
    <section
      id="menu"
      className="section menu"
      style={{
        background: 'linear-gradient(180deg, var(--bg) 0%, #0a0a0a 100%)',
      }}
    >
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Our Signature Offerings</span>
          <h2 className="section-title">
            <span className="shimmer">Curated Menu</span>
          </h2>
        </div>

        <motion.div
          className="menu-tabs"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '3rem',
            flexWrap: 'wrap',
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`menu-tab ${activeTab === cat.id ? 'active' : ''}`}
              style={{
                padding: '0.875rem 2rem',
                fontSize: '0.8rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                fontWeight: 500,
                color: activeTab === cat.id ? 'var(--bg)' : 'var(--cream-muted)',
                background: activeTab === cat.id ? 'var(--gold)' : 'transparent',
                border: '1px solid',
                borderColor: activeTab === cat.id ? 'var(--gold)' : 'var(--charcoal-border)',
                borderRadius: '50px',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                if (activeTab !== cat.id) {
                  e.target.style.borderColor = 'var(--gold)';
                  e.target.style.color = 'var(--gold)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== cat.id) {
                  e.target.style.borderColor = 'var(--charcoal-border)';
                  e.target.style.color = 'var(--cream-muted)';
                }
              }}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem',
            }}
          >
            {currentItems.map((item, index) => (
              <motion.article
                key={item.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(201, 168, 76, 0.15)' }}
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--charcoal-border)',
                  borderRadius: '16px',
                  padding: '2rem',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <motion.span
                  className="dish-icon"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                  style={{
                    display: 'inline-block',
                    fontSize: '2.5rem',
                    marginBottom: '1rem',
                  }}
                >
                  {item.icon}
                </motion.span>

                <motion.div
                  className="dish-content"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="dish-name" style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.5rem',
                    fontWeight: 500,
                    color: 'var(--cream)',
                    marginBottom: '0.75rem',
                  }}>
                    {item.name}
                  </h3>
                  <p className="dish-desc" style={{
                    fontSize: '0.9375rem',
                    lineHeight: 1.6,
                    color: 'var(--cream-muted)',
                    marginBottom: '1.25rem',
                  }}>
                    {item.desc}
                  </p>
                  <span className="dish-price" style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.25rem',
                    fontWeight: 500,
                    color: 'var(--gold)',
                  }}>
                    {item.price}
                  </span>
                </motion.div>

                <div
                  className="card-glow"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(ellipse at top right, rgba(201, 168, 76, 0.08), transparent 70%)',
                    opacity: 0,
                    transition: 'opacity 0.4s ease',
                  }}
                />
              </motion.article>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}