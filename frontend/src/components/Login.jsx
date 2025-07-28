import React, { useState } from 'react';

// Default API base: uses VITE_API_URL if set, otherwise falls back to '/api'
const API_BASE = import.meta.env.VITE_API_URL || '/api';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem('pesante_admin_logged_in', 'yes');
        onLogin();
      } else {
        setError('Invalid username or password');
      }
    } catch {
      setError('Login failed. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f7f5ef'
    }}>
      <form onSubmit={handleSubmit} style={{
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 2px 16px rgba(60,40,20,0.10)',
        padding: '2.5rem 2.5rem',
        minWidth: 320,
        display: 'flex',
        flexDirection: 'column',
        gap: 18
      }}>
        <h2 style={{ color: '#7c9a6d', margin: 0, textAlign: 'center' }}>
          Admin Login
        </h2>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Username"
          required
          autoFocus
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button
          type="submit"
          style={{
            background: '#7c9a6d',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '0.7rem 1.2rem',
            fontWeight: 600,
            fontSize: '1rem',
            cursor: 'pointer'
          }}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && (
          <div style={{
            color: '#b60000',
            marginTop: 4,
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}
      </form>
    </div>
  );
}
