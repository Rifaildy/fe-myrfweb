import { useState, useEffect, useRef, useCallback } from 'react';
import { projectsAPI } from '../../services/api';

const TECH_COLORS = {
  'React.js': '#61dafb', 'Node.js': '#68a063', 'PostgreSQL': '#336791',
  'Express.js': '#999', 'Tailwind CSS': '#38bdf8', 'Python': '#ffd43b',
  'Flask': '#fff', 'Supabase': '#3ecf8e', 'JWT': '#d63aff',
  'Google Maps API': '#4285f4', 'Chart.js': '#ff6384', 'TypeScript': '#3178c6',
  'TensorFlow': '#ff6f00', 'Scikit-learn': '#f7931e',
};

// ─── Project Detail Modal ────────────────────────────────────────────────────
const ProjectDetailModal = ({ project, onClose }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);

  const images   = Array.isArray(project.detail_images)   ? project.detail_images.filter(Boolean)   : [];
  const captions = Array.isArray(project.detail_captions) ? project.detail_captions : [];
  const tags     = Array.isArray(project.tech_stack_tags)
    ? project.tech_stack_tags
    : (project.tech_stack_tags?.split(',') || []);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const prev = () => { setImgLoaded(false); setActiveIdx(i => (i - 1 + images.length) % images.length); };
  const next = () => { setImgLoaded(false); setActiveIdx(i => (i + 1) % images.length); };

  const activeCaption = captions[activeIdx] ?? null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.88)',
        backdropFilter: 'blur(14px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .modal-inner { animation: slideUp 0.25s ease; }
        .thumb-strip::-webkit-scrollbar { height: 4px; }
        .thumb-strip::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); }
        .thumb-strip::-webkit-scrollbar-thumb { background: rgba(59,130,246,0.4); border-radius: 2px; }
        .detail-content p { margin-bottom: 0.85rem; }
        .detail-content h2, .detail-content h3 { color: var(--blue-light); margin: 1.25rem 0 0.5rem; font-weight: 700; }
      `}</style>

      {/* Modal content */}
      <div
        className="modal-inner"
        onClick={e => e.stopPropagation()}
        style={{
          background: 'linear-gradient(145deg, #0d1a33, #070d1f)',
          border: '1px solid rgba(59,130,246,0.25)',
          borderRadius: 20,
          width: '100%',
          maxWidth: 860,
          maxHeight: '92vh',
          overflowY: 'auto',
          position: 'relative',
          boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 60px rgba(59,130,246,0.08)',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1.5rem 1.75rem 1.25rem',
          borderBottom: '1px solid rgba(59,130,246,0.12)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem',
          position: 'sticky', top: 0, zIndex: 10,
          background: 'rgba(7,13,31,0.95)', backdropFilter: 'blur(12px)',
        }}>
          <div style={{ flex: 1 }}>
            <h2 style={{
              fontSize: 'clamp(1.1rem, 3vw, 1.5rem)', fontWeight: 800,
              color: 'var(--text-primary)', marginBottom: '0.6rem',
              background: 'var(--gradient-text)', WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>{project.title}</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {tags.map(tag => (
                <span key={tag} style={{
                  padding: '0.15rem 0.55rem', borderRadius: 100,
                  fontSize: '0.7rem', fontFamily: 'var(--font-mono)', fontWeight: 500,
                  background: `${TECH_COLORS[tag.trim()] || '#3b82f6'}18`,
                  color: TECH_COLORS[tag.trim()] || 'var(--blue-light)',
                  border: `1px solid ${TECH_COLORS[tag.trim()] || '#3b82f6'}35`,
                }}>{tag.trim()}</span>
              ))}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8, color: 'var(--text-muted)', cursor: 'pointer',
              width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem', flexShrink: 0, transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#f87171'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
          >✕</button>
        </div>

        <div style={{ padding: '1.5rem 1.75rem' }}>

          {/* ── Image Carousel ─────────────────────────────────── */}
          {images.length > 0 && (
            <div style={{ marginBottom: '1.75rem' }}>
              {/* Main image */}
              <div style={{
                position: 'relative', borderRadius: 12, overflow: 'hidden',
                background: 'rgba(13,26,51,0.8)',
                border: '1px solid rgba(59,130,246,0.15)',
                aspectRatio: '16/9',
              }}>
                {!imgLoaded && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(90deg, rgba(13,26,51,0.4) 25%, rgba(30,58,138,0.2) 50%, rgba(13,26,51,0.4) 75%)',
                    backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite',
                  }} />
                )}
                <img
                  key={activeIdx}
                  src={images[activeIdx]}
                  alt={`${project.title} screenshot ${activeIdx + 1}`}
                  onLoad={() => setImgLoaded(true)}
                  style={{
                    width: '100%', height: '100%', objectFit: 'cover',
                    opacity: imgLoaded ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                    display: 'block',
                  }}
                />

                {/* Nav arrows */}
                {images.length > 1 && (
                  <>
                    <button onClick={prev} style={{
                      position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
                      background: 'rgba(7,13,31,0.75)', backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(59,130,246,0.25)', borderRadius: 8,
                      color: 'var(--text-primary)', cursor: 'pointer',
                      width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1rem', transition: 'all 0.2s ease', zIndex: 2,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(37,99,235,0.4)'; e.currentTarget.style.borderColor = 'rgba(59,130,246,0.5)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(7,13,31,0.75)'; e.currentTarget.style.borderColor = 'rgba(59,130,246,0.25)'; }}
                    >‹</button>
                    <button onClick={next} style={{
                      position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                      background: 'rgba(7,13,31,0.75)', backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(59,130,246,0.25)', borderRadius: 8,
                      color: 'var(--text-primary)', cursor: 'pointer',
                      width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1rem', transition: 'all 0.2s ease', zIndex: 2,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(37,99,235,0.4)'; e.currentTarget.style.borderColor = 'rgba(59,130,246,0.5)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(7,13,31,0.75)'; e.currentTarget.style.borderColor = 'rgba(59,130,246,0.25)'; }}
                    >›</button>
                  </>
                )}

                {/* Image counter badge */}
                <div style={{
                  position: 'absolute', bottom: 10, right: 12,
                  background: 'rgba(7,13,31,0.8)', backdropFilter: 'blur(6px)',
                  border: '1px solid rgba(59,130,246,0.2)',
                  borderRadius: 6, padding: '0.2rem 0.55rem',
                  fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)',
                }}>{activeIdx + 1} / {images.length}</div>
              </div>

              {/* Caption for active image */}
              {activeCaption && (
                <div style={{
                  marginTop: '0.65rem',
                  padding: '0.6rem 0.9rem',
                  background: 'rgba(37,99,235,0.08)',
                  border: '1px solid rgba(59,130,246,0.15)',
                  borderRadius: 8,
                  fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6,
                  fontStyle: 'italic',
                }}>
                  <span style={{ color: 'var(--blue-light)', marginRight: '0.4rem', fontStyle: 'normal' }}>📷</span>
                  {activeCaption}
                </div>
              )}

              {/* Thumbnail strip */}
              {images.length > 1 && (
                <div className="thumb-strip" style={{
                  display: 'flex', gap: '0.5rem', marginTop: '0.75rem',
                  overflowX: 'auto', paddingBottom: '0.25rem',
                }}>
                  {images.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => { setImgLoaded(false); setActiveIdx(i); }}
                      style={{
                        flexShrink: 0, width: 72, height: 50,
                        borderRadius: 6, overflow: 'hidden', padding: 0,
                        border: `2px solid ${i === activeIdx ? 'var(--blue-main)' : 'rgba(59,130,246,0.15)'}`,
                        cursor: 'pointer',
                        transition: 'border-color 0.2s ease, transform 0.2s ease',
                        transform: i === activeIdx ? 'scale(1.05)' : 'scale(1)',
                        boxShadow: i === activeIdx ? '0 0 12px rgba(59,130,246,0.4)' : 'none',
                      }}
                    >
                      <img src={url} alt={`thumb ${i + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Detail Content ──────────────────────────────────── */}
          {project.detail_content && (
            <div style={{ marginBottom: '1.75rem' }}>
              <h3 style={{
                fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.1em', color: 'var(--blue-light)',
                fontFamily: 'var(--font-mono)', marginBottom: '0.85rem',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
              }}>
                <span style={{ display: 'inline-block', width: 20, height: 1.5, background: 'var(--blue-main)' }} />
                Detail Proyek
              </h3>
              <div
                className="detail-content"
                style={{
                  fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.75,
                  padding: '1.25rem',
                  background: 'rgba(13,26,51,0.5)',
                  border: '1px solid rgba(59,130,246,0.1)',
                  borderRadius: 10,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {project.detail_content}
              </div>
            </div>
          )}

          {/* ── Footer Links ────────────────────────────────────── */}
          <div style={{
            display: 'flex', gap: '0.75rem', flexWrap: 'wrap',
            paddingTop: '1.25rem', borderTop: '1px solid rgba(59,130,246,0.1)',
          }}>
            {project.repo_url && (
              <a href={project.repo_url} target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.5rem 1.1rem',
                  background: 'transparent', border: '1px solid rgba(59,130,246,0.25)',
                  borderRadius: 8, color: 'var(--text-secondary)',
                  textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.6)'; e.currentTarget.style.color = 'var(--blue-light)'; e.currentTarget.style.background = 'rgba(59,130,246,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.25)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent'; }}
              >⌨ View Code</a>
            )}
            {project.live_url && (
              <a href={project.live_url} target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.5rem 1.1rem',
                  background: 'linear-gradient(135deg, rgba(37,99,235,0.3), rgba(6,182,212,0.2))',
                  border: '1px solid rgba(59,130,246,0.4)',
                  borderRadius: 8, color: 'var(--blue-light)',
                  textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(37,99,235,0.5), rgba(6,182,212,0.35))'; e.currentTarget.style.boxShadow = 'var(--glow-blue)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(37,99,235,0.3), rgba(6,182,212,0.2))'; e.currentTarget.style.boxShadow = 'none'; }}
              >↗ Live Demo</a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Project Card ────────────────────────────────────────────────────────────
const ProjectCard = ({ project, index, onDetail }) => {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef(null);
  const tags = Array.isArray(project.tech_stack_tags)
    ? project.tech_stack_tags
    : (project.tech_stack_tags?.split(',') || []);

  const hasDetail = project.detail_content ||
    (Array.isArray(project.detail_images) && project.detail_images.some(Boolean));

  // 3D tilt on mouse move
  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
      cardRef.current.style.transition = 'transform 0.5s ease';
    }
    setHovered(false);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => {
        setHovered(true);
        if (cardRef.current) cardRef.current.style.transition = 'transform 0.1s ease';
      }}
      onMouseLeave={handleMouseLeave}
      className="reveal"
      style={{
        background: 'var(--gradient-card)',
        border: `1px solid ${hovered ? 'rgba(59,130,246,0.4)' : 'rgba(59,130,246,0.12)'}`,
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: hovered
          ? '0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(59,130,246,0.12)'
          : '0 8px 32px rgba(0,0,0,0.4)',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        animationDelay: `${index * 0.1}s`,
        position: 'relative',
        willChange: 'transform',
      }}
      data-hover
    >
      {/* Image */}
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        height: 200,
        background: 'var(--bg-secondary)',
      }}>
        {project.image_url ? (
          <img
            src={project.image_url}
            alt={project.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.6s ease',
              transform: hovered ? 'scale(1.08)' : 'scale(1)',
              filter: 'brightness(0.7) saturate(0.8)',
            }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, var(--blue-darkest), var(--bg-card))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem',
          }}>🚀</div>
        )}
        {/* Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: hovered
            ? 'linear-gradient(to top, rgba(7,13,31,0.95) 0%, rgba(7,13,31,0.3) 100%)'
            : 'linear-gradient(to top, rgba(7,13,31,0.85) 0%, transparent 60%)',
          transition: 'background 0.3s ease',
        }} />

        {/* Project number */}
        <div style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          color: 'rgba(59,130,246,0.7)',
          background: 'rgba(7,13,31,0.7)',
          padding: '0.2rem 0.6rem',
          borderRadius: 6,
          backdropFilter: 'blur(8px)',
        }}>
          {String(index + 1).padStart(2, '0')}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '1.5rem' }}>
        <h3 style={{
          fontSize: '1.15rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: '0.6rem',
          transition: 'color 0.2s ease',
          ...(hovered ? { color: 'var(--blue-light)' } : {}),
        }}>
          {project.title}
        </h3>
        <p style={{
          fontSize: '0.875rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.65,
          marginBottom: '1.25rem',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {project.description}
        </p>

        {/* Tech tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
          {tags.slice(0, 4).map(tag => (
            <span key={tag} style={{
              padding: '0.2rem 0.6rem',
              borderRadius: 100,
              fontSize: '0.72rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 500,
              background: `${TECH_COLORS[tag.trim()] || '#3b82f6'}18`,
              color: TECH_COLORS[tag.trim()] || 'var(--blue-light)',
              border: `1px solid ${TECH_COLORS[tag.trim()] || '#3b82f6'}35`,
            }}>
              {tag.trim()}
            </span>
          ))}
          {tags.length > 4 && (
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', padding: '0.2rem 0.3rem' }}>
              +{tags.length - 4} more
            </span>
          )}
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          {/* Detail button — only when content/images exist */}
          {hasDetail && (
            <button
              onClick={() => onDetail(project)}
              data-hover
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                padding: '0.45rem 1rem',
                background: 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(59,130,246,0.15))',
                border: '1px solid rgba(124,58,237,0.35)',
                borderRadius: 8, color: '#a78bfa',
                fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(124,58,237,0.4), rgba(59,130,246,0.25))';
                e.currentTarget.style.boxShadow = '0 0 16px rgba(124,58,237,0.3)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(59,130,246,0.15))';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              📋 Detail
            </button>
          )}

          {project.repo_url && (
            <a
              href={project.repo_url}
              target="_blank"
              rel="noopener noreferrer"
              data-hover
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                padding: '0.45rem 1rem',
                background: 'transparent', border: '1px solid rgba(59,130,246,0.2)',
                borderRadius: 8, color: 'var(--text-secondary)',
                textDecoration: 'none', fontSize: '0.82rem', fontWeight: 500,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(59,130,246,0.5)';
                e.currentTarget.style.color = 'var(--blue-light)';
                e.currentTarget.style.background = 'rgba(59,130,246,0.08)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(59,130,246,0.2)';
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              ⌨ Code
            </a>
          )}
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              data-hover
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                padding: '0.45rem 1rem',
                background: 'linear-gradient(135deg, rgba(37,99,235,0.3), rgba(6,182,212,0.2))',
                border: '1px solid rgba(59,130,246,0.35)',
                borderRadius: 8, color: 'var(--blue-light)',
                textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(37,99,235,0.5), rgba(6,182,212,0.35))';
                e.currentTarget.style.boxShadow = 'var(--glow-blue)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(37,99,235,0.3), rgba(6,182,212,0.2))';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              ↗ Live Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Projects Section ─────────────────────────────────────────────────────────
const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [detailProject, setDetailProject] = useState(null);

  useEffect(() => {
    projectsAPI.getPublished()
      .then(setProjects)
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [projects]);

  const allTechs = ['All', ...new Set(
    projects.flatMap(p => Array.isArray(p.tech_stack_tags) ? p.tech_stack_tags : [])
  )].slice(0, 8);

  const filtered = filter === 'All'
    ? projects
    : projects.filter(p => {
        const tags = Array.isArray(p.tech_stack_tags) ? p.tech_stack_tags : [];
        return tags.includes(filter);
      });

  const handleDetail = useCallback((project) => setDetailProject(project), []);
  const handleCloseDetail = useCallback(() => setDetailProject(null), []);

  return (
    <>
      <section id="projects" className="section" style={{
        background: 'linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-deepest) 100%)',
        position: 'relative',
      }}>
        {/* Background accent */}
        <div style={{
          position: 'absolute',
          top: '10%',
          right: '-10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(30,58,138,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="container">
          <div className="section-header reveal">
            <div className="section-tag">Portfolio</div>
            <h2 className="section-title">
              Featured <span className="gradient-text">Projects</span>
            </h2>
            <div className="glow-divider" />
            <p className="section-desc">
              Kumpulan karya yang dibangun dengan dedikasi dan passion — dari sistem informasi kompleks hingga aplikasi machine learning.
            </p>
          </div>

          {/* Filter tabs */}
          {!loading && allTechs.length > 1 && (
            <div className="reveal" style={{
              display: 'flex',
              gap: '0.5rem',
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginBottom: '3rem',
            }}>
              {allTechs.map(tech => (
                <button
                  key={tech}
                  onClick={() => setFilter(tech)}
                  data-hover
                  style={{
                    padding: '0.4rem 1rem',
                    borderRadius: 100,
                    border: `1px solid ${filter === tech ? 'rgba(59,130,246,0.6)' : 'rgba(59,130,246,0.15)'}`,
                    background: filter === tech ? 'rgba(59,130,246,0.15)' : 'transparent',
                    color: filter === tech ? 'var(--blue-light)' : 'var(--text-muted)',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {tech}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.5rem',
            }}>
              {[1, 2, 3].map(i => (
                <div key={i} className="skeleton" style={{ height: 420, borderRadius: 20 }} />
              ))}
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.5rem',
            }}>
              {filtered.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} onDetail={handleDetail} />
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
              No projects found for this filter.
            </div>
          )}
        </div>
      </section>

      {/* Detail Modal — rendered outside section to avoid overflow clipping */}
      {detailProject && (
        <ProjectDetailModal project={detailProject} onClose={handleCloseDetail} />
      )}
    </>
  );
};

export default Projects;
