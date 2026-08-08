import { useState, useEffect, useRef } from 'react';
import { profileAPI } from '../../services/api';

const ROLES = [
  'System Analyst',
  'Full-Stack Developer',
  'UI/UX Enthusiast',
  'Problem Solver',
  'Tech Explorer',
];

const TypingText = ({ texts }) => {
  const [display, setDisplay] = useState('');
  const [textIdx, setTextIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    if (waiting) return;
    const current = texts[textIdx];
    const timeout = deleting ? 60 : charIdx === current.length ? 1800 : 100;

    const timer = setTimeout(() => {
      if (!deleting && charIdx < current.length) {
        setDisplay(current.slice(0, charIdx + 1));
        setCharIdx(c => c + 1);
      } else if (!deleting && charIdx === current.length) {
        setWaiting(true);
        setTimeout(() => {
          setDeleting(true);
          setWaiting(false);
        }, 1800);
      } else if (deleting && charIdx > 0) {
        setDisplay(current.slice(0, charIdx - 1));
        setCharIdx(c => c - 1);
      } else {
        setDeleting(false);
        setTextIdx(i => (i + 1) % texts.length);
      }
    }, timeout);

    return () => clearTimeout(timer);
  }, [charIdx, deleting, textIdx, waiting, texts]);

  return (
    <span style={{ color: 'var(--cyan)', fontFamily: 'var(--font-mono)' }}>
      {display}
      <span style={{ animation: 'blink 1s step-end infinite', color: 'var(--blue-light)' }}>|</span>
    </span>
  );
};

const FloatingOrb = ({ size, color, x, y, delay }) => (
  <div style={{
    position: 'absolute',
    width: size,
    height: size,
    borderRadius: '50%',
    background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
    left: x,
    top: y,
    animation: `float ${4 + delay}s ease-in-out ${delay}s infinite`,
    pointerEvents: 'none',
    opacity: 0.25,
    filter: 'blur(30px)',
  }} />
);

const StatCard = ({ value, label }) => (
  <div className="glass-card" style={{
    padding: '1.25rem 1.5rem',
    textAlign: 'center',
    minWidth: 100,
    flex: 1,
  }}>
    <div style={{
      fontSize: '1.75rem',
      fontWeight: 800,
      background: 'linear-gradient(135deg, #60a5fa, #22d3ee)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontFamily: 'var(--font-mono)',
    }}>{value}</div>
    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem', letterSpacing: '0.05em' }}>
      {label}
    </div>
  </div>
);

const Hero = () => {
  const [profile, setProfile] = useState(null);
  const heroRef = useRef(null);

  useEffect(() => {
    profileAPI.get()
      .then(setProfile)
      .catch(() => setProfile({
        full_name: 'Rifaildy Nurhuda Assalam',
        profession: 'System Analyst & Full-Stack Developer',
        bio: 'modern web technologies.',
        github_url: 'https://github.com/rifaildy',
        linkedin_url: 'https://linkedin.com/in/rifaildy',
        cv_url: 'https://drive.google.com/file/d/1VzvRdSq0RyszwVKlkO b27FfkZvsSMkSI/view?usp=sharing',
        email: 'rifaildy.n.a@gmail.com',
      }));

    // Parallax on scroll
    const onScroll = () => {
      if (!heroRef.current) return;
      const y = window.scrollY;
      heroRef.current.style.transform = `translateY(${y * 0.25}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Staggered animation on mount
  useEffect(() => {
    const elements = document.querySelectorAll('.hero-reveal');
    elements.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      setTimeout(() => {
        el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 200 + i * 150);
    });
  }, [profile]);

  return (
    <section id="hero" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
      background: 'var(--gradient-hero)',
    }}>
      {/* Floating orbs */}
      <FloatingOrb size="600px" color="rgba(30,58,138,0.8)" x="-15%" y="-20%" delay={0} />
      <FloatingOrb size="500px" color="rgba(6,182,212,0.5)" x="70%" y="10%" delay={2} />
      <FloatingOrb size="400px" color="rgba(124,58,237,0.4)" x="85%" y="60%" delay={1} />

      {/* Grid overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        pointerEvents: 'none',
      }} />

      <div ref={heroRef} className="container" style={{
        position: 'relative',
        zIndex: 1,
        paddingTop: '8rem',
        paddingBottom: '5rem',
      }}>
        <div style={{ maxWidth: 750 }}>
          {/* Status badge */}
          <div className="hero-reveal" style={{ marginBottom: '1.5rem' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 1rem',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16,185,129,0.25)',
              borderRadius: '100px',
              fontSize: '0.8rem',
              color: '#34d399',
              fontFamily: 'var(--font-mono)',
            }}>
              <span className="status-dot online" />
              Available for opportunities
            </span>
          </div>

          {/* Main heading */}
          <h1 className="hero-reveal" style={{
            fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            marginBottom: '1rem',
          }}>
            <span style={{ display: 'block', color: 'var(--text-secondary)', fontSize: 'clamp(1rem, 2vw, 1.1rem)', fontWeight: 400, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem', fontFamily: 'var(--font-mono)' }}>
              {'// Hello, I am'}
            </span>
            <span style={{
              background: 'linear-gradient(135deg, #e2e8f0 0%, #93c5fd 50%, #22d3ee 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              {profile ? profile.full_name.split(' ')[0] : 'Rifaildy'}
            </span>
            <br />
            <span style={{ color: 'var(--text-primary)' }}>
              {profile ? profile.full_name.split(' ').slice(1).join(' ') : 'Nurhuda'}
            </span>
          </h1>

          {/* Typing effect */}
          <div className="hero-reveal" style={{
            fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
            fontWeight: 500,
            marginBottom: '1.5rem',
            minHeight: '2.5rem',
          }}>
            <TypingText texts={ROLES} />
          </div>

          {/* Bio */}
          <p className="hero-reveal" style={{
            fontSize: '1.05rem',
            color: 'var(--text-secondary)',
            maxWidth: 560,
            lineHeight: 1.75,
            marginBottom: '2.5rem',
          }}>
            {profile?.bio || 'modern web technologies.'}
          </p>

          {/* CTAs */}
          <div className="hero-reveal" style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            marginBottom: '3rem',
          }}>
            <a href={profile?.cv_url || '#'} target="_blank" rel="noopener noreferrer" className="btn-primary" data-hover>
              <span>⬇ Download CV</span>
            </a>
            <a href="#contact" onClick={e => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }} className="btn-outline" data-hover>
              <span>Contact Me →</span>
            </a>
          </div>

          {/* Social links */}
          <div className="hero-reveal" style={{ display: 'flex', gap: '1rem', marginBottom: '3.5rem' }}>
            {[
              { label: 'GitHub', icon: '⌨', url: profile?.github_url },
              { label: 'LinkedIn', icon: '💼', url: profile?.linkedin_url },
              { label: 'Instagram', icon: '📷', url: profile?.instagram_url },
            ].map(({ label, icon, url }) => (
              <a
                key={label}
                href={url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                data-hover
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 1rem',
                  background: 'rgba(13,26,51,0.6)',
                  border: '1px solid rgba(59,130,246,0.15)',
                  borderRadius: 8,
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(59,130,246,0.4)';
                  e.currentTarget.style.color = 'var(--blue-light)';
                  e.currentTarget.style.background = 'rgba(59,130,246,0.1)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(59,130,246,0.15)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.background = 'rgba(13,26,51,0.6)';
                }}
              >
                {icon} {label}
              </a>
            ))}
          </div>

          {/* Stats */}
          <div className="hero-reveal" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <StatCard value="4+" label="Projects Built" />
            <StatCard value="10+" label="Tech Stack" />
            <StatCard value="100%" label="Committed" />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute',
        bottom: '2.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
        zIndex: 1,
      }}>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>SCROLL</span>
        <div style={{
          width: 24,
          height: 38,
          border: '1.5px solid rgba(59,130,246,0.3)',
          borderRadius: 12,
          display: 'flex',
          justifyContent: 'center',
          paddingTop: 6,
        }}>
          <div style={{
            width: 4,
            height: 8,
            background: 'var(--blue-main)',
            borderRadius: 2,
            animation: 'float 1.5s ease-in-out infinite',
          }} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
