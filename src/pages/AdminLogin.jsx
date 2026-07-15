import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate('/admin-dashboard');
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-deepest)',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* BG effects */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '10%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(30,58,138,0.25) 0%, transparent 70%)',
        pointerEvents: 'none',
        animation: 'float 6s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '10%',
        width: '350px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
        animation: 'float 8s ease-in-out 2s infinite',
      }} />
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
      }} />

      <div style={{
        width: '100%',
        maxWidth: 420,
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={{
              width: 60,
              height: 60,
              background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-mono)',
              fontWeight: 800,
              fontSize: '1.4rem',
              color: 'white',
              boxShadow: '0 0 30px rgba(59,130,246,0.4), 0 0 60px rgba(59,130,246,0.15)',
              margin: '0 auto 1.25rem',
              transition: 'transform 0.2s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08) rotate(-3deg)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}
            >RF</div>
          </Link>
          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #e2e8f0, #93c5fd)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '0.5rem',
          }}>
            Admin Panel
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontFamily: 'var(--font-mono)' }}>
            {'// Restricted access'}
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(10, 20, 40, 0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(59,130,246,0.2)',
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem',
          boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(59,130,246,0.08)',
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                marginBottom: '0.5rem',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.05em',
              }}>
                USERNAME
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter username"
                className="input-field"
                autoComplete="username"
                required
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                marginBottom: '0.5rem',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.05em',
              }}>
                PASSWORD
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="input-field"
                  autoComplete="current-password"
                  required
                  style={{ paddingRight: '3rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    fontSize: '1rem',
                    padding: '0.2rem',
                  }}
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                padding: '0.75rem 1rem',
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: 8,
                color: '#f87171',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '0.9rem',
                fontSize: '1rem',
                marginTop: '0.5rem',
                opacity: loading ? 0.7 : 1,
              }}
              data-hover
            >
              <span>{loading ? '🔐 Authenticating...' : '🔑 Login'}</span>
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/" style={{
            color: 'var(--text-muted)',
            textDecoration: 'none',
            fontSize: '0.85rem',
            fontFamily: 'var(--font-mono)',
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={e => e.target.style.color = 'var(--blue-light)'}
          onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
          >
            ← Back to Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
