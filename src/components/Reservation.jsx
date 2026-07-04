import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Reservation() {
  const [formState, setFormState] = useState('form');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
    requests: '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^[\d\s\-\+\(\)]{10,}$/.test(formData.phone)) newErrors.phone = 'Invalid phone number';
    if (!formData.date) newErrors.date = 'Date is required';
    else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) newErrors.date = 'Date cannot be in the past';
    }
    if (!formData.time) newErrors.time = 'Time is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setFormState('success');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const timeSlots = ['7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM', '10:00 PM'];
  const guestOptions = Array.from({ length: 10 }, (_, i) => `${i + 1}`);

  const minDate = new Date().toISOString().split('T')[0];

  const inputStyle = {
    width: '100%',
    padding: '1rem 1.25rem',
    fontSize: '1rem',
    fontFamily: 'var(--font-body)',
    background: 'var(--bg)',
    border: '1px solid var(--charcoal-border)',
    borderRadius: '8px',
    color: 'var(--cream)',
    transition: 'all 0.3s ease',
    outline: 'none',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.8rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--gold)',
    marginBottom: '0.5rem',
    fontWeight: 500,
  };

  const errorStyle = {
    fontSize: '0.75rem',
    color: '#e85d5d',
    marginTop: '0.375rem',
    display: 'block',
    minHeight: '1rem',
  };

  return (
    <section
      id="reserve"
      className="section reservation"
      style={{
        background: 'linear-gradient(180deg, var(--bg) 0%, #0a0a0a 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        className="reservation-bg"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 20% 50%, rgba(201, 168, 76, 0.03) 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, rgba(201, 168, 76, 0.03) 0%, transparent 50%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="section-header reveal">
          <span className="section-eyebrow">Reserve Your Evening</span>
          <h2 className="section-title">
            <span className="shimmer">Book a Table</span>
          </h2>
        </div>

        <div
          className="reservation-wrapper"
          style={{
            maxWidth: '600px',
            margin: '0 auto',
          }}
        >
          <AnimatePresence mode="wait">
            {formState === 'form' && (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--charcoal-border)',
                  borderRadius: '24px',
                  padding: '3rem',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  className="form-glow"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
                  }}
                />

                <div
                  className="form-row"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1.5rem',
                    marginBottom: '1.5rem',
                  }}
                >
                  <div className="form-group">
                    <label htmlFor="name" style={labelStyle}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      style={inputStyle}
                      placeholder="Harsha Kamishetty"
                      aria-invalid={errors.name ? 'true' : 'false'}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                    />
                    {errors.name && <span id="name-error" style={errorStyle} role="alert">{errors.name}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email" style={labelStyle}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      style={inputStyle}
                      placeholder="harsha@example.com"
                      aria-invalid={errors.email ? 'true' : 'false'}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                    />
                    {errors.email && <span id="email-error" style={errorStyle} role="alert">{errors.email}</span>}
                  </div>
                </div>

                <div
                  className="form-row"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1.5rem',
                    marginBottom: '1.5rem',
                  }}
                >
                  <div className="form-group">
                    <label htmlFor="phone" style={labelStyle}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      style={inputStyle}
                      placeholder="+91 98765 43210"
                      aria-invalid={errors.phone ? 'true' : 'false'}
                      aria-describedby={errors.phone ? 'phone-error' : undefined}
                    />
                    {errors.phone && <span id="phone-error" style={errorStyle} role="alert">{errors.phone}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="guests" style={labelStyle}>
                      Number of Guests
                    </label>
                    <select
                      id="guests"
                      name="guests"
                      value={formData.guests}
                      onChange={handleChange}
                      style={{ ...inputStyle, cursor: 'pointer' }}
                    >
                      {guestOptions.map((g) => (
                        <option key={g} value={g}>
                          {g} {g === '1' ? 'Guest' : 'Guests'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div
                  className="form-row"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1.5rem',
                    marginBottom: '1.5rem',
                  }}
                >
                  <div className="form-group">
                    <label htmlFor="date" style={labelStyle}>
                      Date
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      style={inputStyle}
                      min={minDate}
                      aria-invalid={errors.date ? 'true' : 'false'}
                      aria-describedby={errors.date ? 'date-error' : undefined}
                    />
                    {errors.date && <span id="date-error" style={errorStyle} role="alert">{errors.date}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="time" style={labelStyle}>
                      Time
                    </label>
                    <select
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      style={{ ...inputStyle, cursor: 'pointer' }}
                      aria-invalid={errors.time ? 'true' : 'false'}
                      aria-describedby={errors.time ? 'time-error' : undefined}
                    >
                      <option value="">Select a time</option>
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>{slot}</option>))}
                    </select>
                    {errors.time && <span id="time-error" style={errorStyle} role="alert">{errors.time}</span>}
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '2rem' }}>
                  <label htmlFor="requests" style={labelStyle}>
                    Special Requests (Optional)
                  </label>
                  <textarea
                    id="requests"
                    name="requests"
                    value={formData.requests}
                    onChange={handleChange}
                    style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
                    placeholder="Dietary restrictions, celebration details, seating preferences..."
                    rows={4}
                  />
                </div>

                <motion.button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    padding: '1.125rem 2.5rem',
                    fontSize: '0.875rem',
                  }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  Confirm Reservation
                </motion.button>
              </motion.form>
            )}

            {formState === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--gold)',
                  borderRadius: '24px',
                  padding: '4rem 3rem',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <motion.div
                  className="success-checkmark"
                  animate={{ scale: [0, 1.2, 1], rotate: [0, 0, 0] }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    width: '80px',
                    height: '80px',
                    margin: '0 auto 2rem',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--gold-dim), var(--gold))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 40px rgba(201, 168, 76, 0.4)',
                  }}
                >
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#0D0D0D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '2rem',
                    fontWeight: 500,
                    color: 'var(--cream)',
                    marginBottom: '1rem',
                  }}
                >
                  Reservation Confirmed
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    fontSize: '1.125rem',
                    lineHeight: 1.7,
                    color: 'var(--cream-muted)',
                    marginBottom: '2rem',
                    maxWidth: '400px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}
                >
                  Thank you, <strong style={{ color: 'var(--gold)' }}>{formData.name}</strong>! Your table for <strong style={{ color: 'var(--gold)' }}>{formData.guests} {formData.guests === '1' ? 'guest' : 'guests'}</strong> on <strong style={{ color: 'var(--gold)' }}>{new Date(formData.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong> at <strong style={{ color: 'var(--gold)' }}>{formData.time}</strong> has been reserved. A confirmation has been sent to <strong style={{ color: 'var(--gold)' }}>{formData.email}</strong>.
                </motion.p>

                <motion.button
                  onClick={() => {
                    setFormState('form');
                    setFormData({
                      name: '',
                      email: '',
                      phone: '',
                      date: '',
                      time: '',
                      guests: '2',
                      requests: '',
                    });
                    setErrors({});
                  }}
                  className="btn btn-outline"
                  style={{
                    padding: '1rem 2.5rem',
                    fontSize: '0.875rem',
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  Make Another Reservation
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}