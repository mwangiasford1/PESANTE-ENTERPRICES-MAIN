import React, { useState } from 'react';
import { addAppointment } from '../api';

export default function Appointment() {
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    const form = e.target;
    const data = {
      name: form[0].value,
      phone: form[1].value,
      property_id: 'general',
      date: form[2].value,
    };
    try {
      await addAppointment(data);
      setStatus('Appointment request sent! We will contact you soon.');
      form.reset();
    } catch {
      setStatus('Failed to send appointment. Please try again later.');
    }
  };

  return (
    <section className="appointment" id="appointment" style={{ background: '#7c9a6d', color: '#fff', padding: '48px 20px 64px 20px', textAlign: 'center' }}>
      <h2>Book an Appointment</h2>
      <form className="appointment-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 350, width: '100%', margin: '0 auto 1.5rem auto' }}>
        <input type="text" placeholder="Your Name" required style={{ fontSize: '1rem', padding: '10px', borderRadius: 6, border: 'none' }} />
        <input type="tel" placeholder="Your Phone Number" required style={{ fontSize: '1rem', padding: '10px', borderRadius: 6, border: 'none' }} />
        <input type="datetime-local" required style={{ fontSize: '1rem', padding: '10px', borderRadius: 6, border: 'none' }} />
        <button type="submit" style={{ background: '#b6a179', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 0', fontSize: '1rem', cursor: 'pointer', transition: 'background 0.2s' }}>Book Appointment</button>
      </form>
      {status && <div style={{ marginTop: 10, color: '#fff' }}>{status}</div>}
      <div className="appointment-info" style={{ fontSize: '1.05rem' }}>
        <p>Email: Pesante001@outlook.com</p>
        <p>WhatsApp: +254 722 899 340</p>
        <p>OR</p>
        <p>WhatsApp: +254 723 503 372</p>
      </div>
      <style>{`
        @media (max-width: 600px) {
          .appointment {
            padding: 32px 6px 40px 6px !important;
          }
          .appointment-form {
            max-width: 98vw !important;
            padding: 0 2px;
          }
        }
      `}</style>
    </section>
  );
} 