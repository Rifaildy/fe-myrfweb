import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { projectsAPI } from '../services/api';

const TECH_COLORS = {
  'React.js': '#61dafb', 'Node.js': '#68a063', 'PostgreSQL': '#336791',
  'Express.js': '#999', 'Tailwind CSS': '#38bdf8', 'Python': '#ffd43b',
  'Flask': '#fff', 'Supabase': '#3ecf8e', 'JWT': '#d63aff',
  'Google Maps API': '#4285f4', 'Chart.js': '#ff6384', 'TypeScript': '#3178c6',
  'TensorFlow': '#ff6f00', 'Scikit-learn': '#f7931e',
};

// ─── Hero Thumbnail ──────────────────────────────────────────────────────────
const HeroImage = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div style={{
      width: '100%',
      aspectRatio: '16/9',
      maxHeight: '70vh',
      overflow: 'hidden',
      position: 'relative',
      background: 'linear-gradient(135deg, #0d1b3e, #070d1f)',
    }}>
      {!loaded && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, rgba(13,26,51,0.4) 25%, rgba(30,58,138,0.2) 50%, rgba(13,26,51,0.4) 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
        }} />
      )}
      {src ? (
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover',
            display: 'block',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.4s ease',
            filter: 'brightness(0.85)',
          }}
        />
      ) : (
        <div style={{
          width: '100%', height: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '6rem', opacity: 0.3,
        }}>🚀</div>
      )}
      {/* Bottom gradient overlay */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: '40%',
        background: 'linear-gradient(to top, var(--bg-deepest), transparent)',
        pointerEvents: 'none',
      }} />
    </div>
  );
};

// ─── Gallery Image ───────────────────────────────────────────────────────────
const GalleryImage = ({ src, alt, caption, index }) => {
  const [loaded, setLoaded] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), index * 80);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div style={{
      marginBottom: '4rem',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(32px)',
      transition: 'opacity 0.7s ease, transform 0.7s ease',
    }}>
      {/* Caption above image */}
      {caption && (
        <div style={{
          marginBottom: '1rem',
          display: 'flex', alignItems: 'center', gap: '0.75rem',
        }}>
          <div style={{
            width: 28, height: 28, flexShrink: 0,
            background: 'linear-gradient(135deg, rgba(37,99,235,0.3), rgba(6,182,212,0.2))',
            border: '1px solid rgba(59,130,246,0.35)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
            color: 'var(--blue-light)', fontWeight: 700,
          }}>
            {String(index + 1).padStart(2, '0')}
          </div>
          <span style={{
            fontSize: '1rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            letterSpacing: '-0.01em',
          }}>{caption}</span>
        </div>
      )}

      {/* Image */}
      <div style={{
        position: 'relative',
        borderRadius: 16,
        overflow: 'hidden',
        border: '1px solid rgba(59,130,246,0.12)',
        background: 'rgba(13,26,51,0.6)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
      }}>
        {!loaded && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, rgba(13,26,51,0.6) 25%, rgba(30,58,138,0.15) 50%, rgba(13,26,51,0.6) 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            minHeight: 200,
          }} />
        )}
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          style={{
            width: '100%',
            display: 'block',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        />
      </div>
    </div>
  );
};

// ─── Main Page ───────────────────────────────────────────────────────────────
const ProjectDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    // Try fetching by slug — backend currently supports /id, we search from published list
    projectsAPI.getPublished()
      .then(projects => {
        const found = projects.find(p => p.slug === slug);
        if (!found) { setNotFound(true); return; }
        setProject(found);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  // Scroll to top on mount
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);

  const images   = project && Array.isArray(project.detail_images)   ? project.detail_images.filter(Boolean)   : [];
  const captions = project && Array.isArray(project.detail_captions) ? project.detail_captions : [];
  const tags     = project
    ? (Array.isArray(project.tech_stack_tags) ? project.tech_stack_tags : (project.tech_stack_tags?.split(',') || []))
    : [];

  if (loading) return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-deepest)',
    }}>
      <div style={{
        width: 44, height: 44,
        border: '3px solid rgba(59,130,246,0.15)',
        borderTop: '3px solid var(--blue-main)',
        borderRadius: '50%',
        animation: 'spin-slow 0.8s linear infinite',
      }} />
    </div>
  );

  if (notFound) return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-deepest)', gap: '1.5rem',
      textAlign: 'center', padding: '2rem',
    }}>
      <div style={{ fontSize: '4rem' }}>🔍</div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>Project Not Found</h1>
      <p style={{ color: 'var(--text-muted)', maxWidth: 400 }}>
        Proyek yang kamu cari tidak ditemukan atau belum dipublikasikan.
      </p>
      <Link to="/#projects" style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
        padding: '0.6rem 1.4rem',
        background: 'linear-gradient(135deg, rgba(37,99,235,0.25), rgba(6,182,212,0.15))',
        border: '1px solid rgba(59,130,246,0.35)',
        borderRadius: 10, color: 'var(--blue-light)',
        textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem',
      }}>← Kembali ke Portfolio</Link>
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -1000px 0; }
          100% { background-position:  1000px 0; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .pd-back-btn:hover {
          background: rgba(59,130,246,0.12) !important;
          border-color: rgba(59,130,246,0.4) !important;
          color: var(--blue-light) !important;
        }
        .pd-link-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        }
        .pd-tag { transition: all 0.2s ease; }
        .pd-tag:hover { transform: translateY(-1px); }
      `}</style>

      <div style={{ background: 'var(--bg-deepest)', minHeight: '100vh' }}>

        {/* ── Sticky top nav bar ── */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 50,
          background: 'rgba(3,6,15,0.85)', backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(59,130,246,0.1)',
          padding: '0.9rem 1.5rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '1rem',
        }}>
          {/* Back button */}
          <button
            className="pd-back-btn"
            onClick={() => navigate(-1)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
              padding: '0.45rem 1rem',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8, color: 'var(--text-secondary)',
              fontSize: '0.85rem', fontWeight: 500,
              cursor: 'pointer', transition: 'all 0.2s ease',
            }}
          >
            ← Back
          </button>

          {/* Action links */}
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {project.repo_url && (
              <a href={project.repo_url} target="_blank" rel="noopener noreferrer"
                className="pd-link-btn"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                  padding: '0.45rem 1rem',
                  background: 'transparent',
                  border: '1px solid rgba(59,130,246,0.25)',
                  borderRadius: 8, color: 'var(--text-secondary)',
                  textDecoration: 'none', fontSize: '0.82rem', fontWeight: 500,
                  transition: 'all 0.2s ease',
                }}
              >⌨ Code</a>
            )}
            {project.live_url && (
              <a href={project.live_url} target="_blank" rel="noopener noreferrer"
                className="pd-link-btn"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                  padding: '0.45rem 1.1rem',
                  background: 'linear-gradient(135deg, rgba(37,99,235,0.35), rgba(6,182,212,0.25))',
                  border: '1px solid rgba(59,130,246,0.45)',
                  borderRadius: 8, color: 'var(--blue-light)',
                  textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600,
                  transition: 'all 0.2s ease',
                }}
              >↗ Live Demo</a>
            )}
          </div>
        </div>

        {/* ── Hero Thumbnail ── */}
        <HeroImage src={project.image_url} alt={project.title} />

        {/* ── Main Content ── */}
        <div style={{
          maxWidth: 860,
          margin: '0 auto',
          padding: '3rem 1.5rem 6rem',
          animation: 'fadeInUp 0.5s ease 0.1s both',
        }}>

          {/* Title + Tags */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h1 style={{
              fontSize: 'clamp(1.75rem, 5vw, 3rem)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              marginBottom: '1rem',
              background: 'var(--gradient-text)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>{project.title}</h1>

            {project.description && (
              <p style={{
                fontSize: '1.05rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
                marginBottom: '1.25rem',
                maxWidth: 680,
              }}>{project.description}</p>
            )}

            {/* Tech tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {tags.map(tag => (
                <span key={tag} className="pd-tag" style={{
                  padding: '0.25rem 0.7rem', borderRadius: 100,
                  fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 500,
                  background: `${TECH_COLORS[tag.trim()] || '#3b82f6'}18`,
                  color: TECH_COLORS[tag.trim()] || 'var(--blue-light)',
                  border: `1px solid ${TECH_COLORS[tag.trim()] || '#3b82f6'}35`,
                }}>{tag.trim()}</span>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div style={{
            height: 1,
            background: 'linear-gradient(90deg, rgba(59,130,246,0.3), transparent)',
            marginBottom: '2.5rem',
          }} />

          {/* ── Detail Content ── */}
          {project.detail_content && (
            <div style={{ marginBottom: '3.5rem' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.6rem',
                marginBottom: '1.25rem',
              }}>
                <div style={{
                  width: 32, height: 32,
                  background: 'linear-gradient(135deg, rgba(37,99,235,0.25), rgba(6,182,212,0.15))',
                  border: '1px solid rgba(59,130,246,0.3)',
                  borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.85rem',
                }}>📋</div>
                <h2 style={{
                  fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase',
                  letterSpacing: '0.12em', color: 'var(--blue-light)',
                  fontFamily: 'var(--font-mono)',
                }}>Detail Proyek</h2>
              </div>

              <div style={{
                fontSize: '0.95rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.85,
                whiteSpace: 'pre-wrap',
                padding: '1.5rem',
                background: 'rgba(13,26,51,0.45)',
                border: '1px solid rgba(59,130,246,0.1)',
                borderLeft: '3px solid rgba(59,130,246,0.4)',
                borderRadius: '0 12px 12px 0',
              }}>
                {project.detail_content}
              </div>
            </div>
          )}

          {/* ── Gallery Section ── */}
          {images.length > 0 && (
            <div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.6rem',
                marginBottom: '2.5rem',
              }}>
                <div style={{
                  width: 32, height: 32,
                  background: 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(59,130,246,0.15))',
                  border: '1px solid rgba(124,58,237,0.3)',
                  borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.85rem',
                }}>🖼</div>
                <h2 style={{
                  fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase',
                  letterSpacing: '0.12em', color: '#a78bfa',
                  fontFamily: 'var(--font-mono)',
                }}>Gallery — {images.length} Screenshot{images.length > 1 ? 's' : ''}</h2>
              </div>

              {images.map((url, i) => (
                <GalleryImage
                  key={i}
                  index={i}
                  src={url}
                  alt={`${project.title} — screenshot ${i + 1}`}
                  caption={captions[i] || null}
                />
              ))}
            </div>
          )}

          {/* ── Footer links ── */}
          <div style={{
            display: 'flex', gap: '0.75rem', flexWrap: 'wrap',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(59,130,246,0.1)',
          }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.55rem 1.2rem',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 8, color: 'var(--text-muted)',
                fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.4)'; e.currentTarget.style.color = 'var(--blue-light)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
            >← Kembali</button>

            {project.repo_url && (
              <a href={project.repo_url} target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.55rem 1.2rem',
                  background: 'transparent',
                  border: '1px solid rgba(59,130,246,0.25)',
                  borderRadius: 8, color: 'var(--text-secondary)',
                  textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.5)'; e.currentTarget.style.color = 'var(--blue-light)'; e.currentTarget.style.background = 'rgba(59,130,246,0.06)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.25)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent'; }}
              >⌨ View Code</a>
            )}
            {project.live_url && (
              <a href={project.live_url} target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.55rem 1.2rem',
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
    </>
  );
};

export default ProjectDetail;
