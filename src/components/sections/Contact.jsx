import { useState, useEffect } from 'react';
import { profileAPI, messagesAPI } from '../../services/api';

const ContactInfo = ({ icon, label, value, href }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    data-hover
    className="glass-card"
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '1.1rem 1.25rem',
      textDecoration: 'none',
      cursor: 'pointer',
    }}
  >
    <div style={{
      width: 42,
      height: 42,
      background: 'linear-gradient(135deg, rgba(37,99,235,0.3), rgba(6,182,212,0.2))',
      border: '1px solid rgba(59,130,246,0.3)',
      borderRadius: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.1rem',
      flexShrink: 0,
    }}>
      {icon}
    </div>
    <div>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.15rem', fontFamily: 'var(--font-mono)' }}>
        {label}
      </div>
      <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500 }}>
        {value}
      </div>
    </div>
  </a>
);

const Contact = () => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ sender_name: '', sender_email: '', sender_phone: '', message_content: '' });
  const [status, setStatus] = useState(null); // 'loading' | 'success' | 'error'
  const [msg, setMsg] = useState('');

  useEffect(() => {
    profileAPI.get().then(setProfile).catch(() => {});
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    const targets = document.querySelectorAll('#contact .reveal, #contact .reveal-left, #contact .reveal-right');
    targets.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [profile]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.sender_name || !form.message_content) {
      setStatus('error');
      setMsg('Nama dan pesan wajib diisi.');
      return;
    }
    setStatus('loading');
    try {
      const res = await messagesAPI.send(form);
      setStatus('success');
      setMsg(res.message || 'Pesan terkirim! Saya akan segera menghubungi kamu. 🚀');
      setForm({ sender_name: '', sender_email: '', sender_phone: '', message_content: '' });
    } catch (err) {
      setStatus('error');
      setMsg(err.message || 'Gagal mengirim pesan. Coba lagi.');
    }
  };

  return (
    <section id="contact" className="section" style={{
      background: 'linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-deepest) 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background effects */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        top: '20%',
        right: '10%',
        width: '350px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="container">
        <div className="section-header reveal">
          <div className="section-tag">Get In Touch</div>
          <h2 className="section-title">
            Let's <span className="gradient-text">Connect</span>
          </h2>
          <div className="glow-divider" />
          <p className="section-desc">
            Punya proyek menarik atau ingin berkolaborasi? Jangan ragu untuk menghubungi saya!
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2.5rem',
          alignItems: 'start',
        }}>
          {/* Left: Info */}
          <div className="reveal-left">
            <h3 style={{
              fontSize: '1.3rem',
              fontWeight: 700,
              marginBottom: '0.5rem',
              color: 'var(--text-primary)',
            }}>
              Hubungi Saya
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.65, fontSize: '0.95rem' }}>
              Saya selalu terbuka untuk diskusi mengenai proyek baru, peluang kerja, atau sekadar ngobrol tentang teknologi.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
              {profile?.phone_number && (
                <ContactInfo
                  icon="📱"
                  label="Phone / WhatsApp"
                  value={profile.phone_number}
                  href={`https://wa.me/${profile.phone_number.replace(/[^0-9]/g, '')}`}
                />
              )}
              {profile?.email && (
                <ContactInfo
                  icon="✉️"
                  label="Email"
                  value={profile.email}
                  href={`mailto:${profile.email}`}
                />
              )}
              {profile?.linkedin_url && (
                <ContactInfo
                  icon="💼"
                  label="LinkedIn"
                  value="Rifaildy Nurhuda"
                  href={profile.linkedin_url}
                />
              )}
              {profile?.github_url && (
                <ContactInfo
                  icon="⌨"
                  label="GitHub"
                  value="@rifaildy"
                  href={profile.github_url}
                />
              )}
            </div>

            {/* Fun terminal block */}
            <div style={{
              padding: '1.25rem',
              background: 'rgba(7,13,31,0.9)',
              border: '1px solid rgba(59,130,246,0.15)',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
            }}>
              <div style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>~/rifaildy $ status</div>
              <div style={{ color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="status-dot online" />
                Available for freelance & full-time roles
              </div>
              <div style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                Response time: <span style={{ color: 'var(--cyan)' }}>{'< 24 hours'}</span>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="reveal-right">
            <form
              onSubmit={handleSubmit}
              style={{
                background: 'var(--bg-glass)',
                backdropFilter: 'blur(16px)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem',
                boxShadow: 'var(--glow-card)',
              }}
            >
              <h3 style={{
                fontSize: '1.15rem',
                fontWeight: 700,
                marginBottom: '1.5rem',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                <span style={{ color: 'var(--cyan)' }}>✉</span> Kirim Pesan
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontFamily: 'var(--font-mono)' }}>
                    Nama *
                  </label>
                  <input
                    type="text"
                    name="sender_name"
                    value={form.sender_name}
                    onChange={handleChange}
                    placeholder="Nama lengkap kamu"
                    className="input-field"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontFamily: 'var(--font-mono)' }}>
                      Email
                    </label>
                    <input
                      type="email"
                      name="sender_email"
                      value={form.sender_email}
                      onChange={handleChange}
                      placeholder="email@kamu.com"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontFamily: 'var(--font-mono)' }}>
                      No. Telepon
                    </label>
                    <input
                      type="tel"
                      name="sender_phone"
                      value={form.sender_phone}
                      onChange={handleChange}
                      placeholder="+62 xxx-xxxx"
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontFamily: 'var(--font-mono)' }}>
                    Pesan *
                  </label>
                  <textarea
                    name="message_content"
                    value={form.message_content}
                    onChange={handleChange}
                    placeholder="Ceritakan tentang proyek atau tujuanmu menghubungi saya..."
                    className="input-field"
                    rows={5}
                    required
                  />
                </div>

                {/* Status message */}
                {status && (
                  <div style={{
                    padding: '0.75rem 1rem',
                    borderRadius: 8,
                    fontSize: '0.875rem',
                    background: status === 'success' ? 'rgba(16,185,129,0.1)' : status === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(59,130,246,0.1)',
                    border: `1px solid ${status === 'success' ? 'rgba(16,185,129,0.3)' : status === 'error' ? 'rgba(239,68,68,0.3)' : 'rgba(59,130,246,0.3)'}`,
                    color: status === 'success' ? '#34d399' : status === 'error' ? '#f87171' : 'var(--blue-light)',
                  }}>
                    {status === 'loading' ? '⏳ Mengirim pesan...' : msg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '0.9rem',
                    fontSize: '1rem',
                    opacity: status === 'loading' ? 0.7 : 1,
                  }}
                  data-hover
                >
                  <span>{status === 'loading' ? '⏳ Mengirim...' : '🚀 Kirim Pesan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        borderTop: '1px solid rgba(59,130,246,0.1)',
        marginTop: '5rem',
        paddingTop: '2.5rem',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1,
      }}>
        <div className="container">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
            marginBottom: '1rem',
          }}>
            <div style={{
              width: 32,
              height: 32,
              background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
              borderRadius: 7,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              fontSize: '0.8rem',
              color: 'white',
              boxShadow: '0 0 12px rgba(59,130,246,0.4)',
            }}>RF</div>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Rifaildy Nurhuda
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
            © {new Date().getFullYear()} Built with ❤️ using React + Express + Supabase
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
