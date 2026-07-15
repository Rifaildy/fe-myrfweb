import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { href: '#hero', label: 'Home' },
  { href: '#projects', label: 'Projects' },
  { href: '#skills', label: 'Skills' },
  { href: '#contact', label: 'Contact' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      // Active section tracking
      const sections = ['hero', 'projects', 'skills', 'contact'];
      for (const id of sections.reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          padding: scrolled ? '0.75rem 2rem' : '1.25rem 2rem',
          background: scrolled
            ? 'rgba(7, 13, 31, 0.95)'
            : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(59,130,246,0.12)' : 'none',
          transition: 'all 0.4s ease',
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            justifySelf: 'start',
          }}
        >
          <div style={{
            width: 36,
            height: 36,
            background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            fontSize: '0.9rem',
            color: 'white',
            boxShadow: '0 0 16px rgba(59,130,246,0.4)',
          }}>RF</div>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            fontSize: '1rem',
            color: 'var(--text-primary)',
            letterSpacing: '-0.01em',
          }}>
            <span style={{ color: 'var(--blue-main)' }}>Rifaildy</span>
            {/* <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>.dev</span> */}
          </span>
        </Link>

        {/* Desktop Nav */}
        {!isAdmin && (
          <ul style={{
            display: 'flex',
            gap: '0.25rem',
            listStyle: 'none',
            alignItems: 'center',
            justifySelf: 'center',
          }} className="desktop-nav">
            {NAV_LINKS.map(({ href, label }) => {
              const id = href.replace('#', '');
              const isActive = activeSection === id;
              return (
                <li key={href}>
                  <a
                    href={href}
                    onClick={(e) => handleNavClick(e, href)}
                    style={{
                      display: 'block',
                      padding: '0.5rem 1rem',
                      color: isActive ? 'var(--blue-light)' : 'var(--text-secondary)',
                      textDecoration: 'none',
                      fontWeight: 500,
                      fontSize: '0.9rem',
                      borderRadius: 8,
                      background: isActive ? 'rgba(59,130,246,0.1)' : 'transparent',
                      transition: 'all 0.2s ease',
                      letterSpacing: '0.01em',
                    }}
                    onMouseEnter={e => { if (!isActive) e.target.style.color = 'var(--text-primary)'; }}
                    onMouseLeave={e => { if (!isActive) e.target.style.color = 'var(--text-secondary)'; }}
                    data-hover
                  >
                    {label}
                  </a>
                </li>
              );
            })}
          </ul>
        )}

        {/* Right side */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', justifySelf: 'end', gridColumn: 3 }}>

          {/* Hamburger */}
          {!isAdmin && (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="hamburger"
              data-hover
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'none',
                flexDirection: 'column',
                gap: 5,
                padding: '0.5rem',
              }}
            >
              {[0, 1, 2].map(i => (
                <span key={i} style={{
                  display: 'block',
                  width: 22,
                  height: 2,
                  background: 'var(--blue-light)',
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  transformOrigin: 'center',
                  transform: menuOpen
                    ? i === 0 ? 'translateY(7px) rotate(45deg)'
                    : i === 1 ? 'scale(0)'
                    : 'translateY(-7px) rotate(-45deg)'
                    : 'none',
                  opacity: menuOpen && i === 1 ? 0 : 1,
                }} />
              ))}
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && !isAdmin && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(7,13,31,0.97)',
          backdropFilter: 'blur(20px)',
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2rem',
        }}>

          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={(e) => handleNavClick(e, href)}
              style={{
                color: 'var(--text-primary)',
                textDecoration: 'none',
                fontSize: '2rem',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={e => e.target.style.color = 'var(--blue-light)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-primary)'}
            >
              {label}
            </a>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;
