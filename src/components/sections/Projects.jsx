import { useState, useEffect, useRef } from 'react';
import { projectsAPI } from '../../services/api';

const TECH_COLORS = {
  'React.js': '#61dafb', 'Node.js': '#68a063', 'PostgreSQL': '#336791',
  'Express.js': '#999', 'Tailwind CSS': '#38bdf8', 'Python': '#ffd43b',
  'Flask': '#fff', 'Supabase': '#3ecf8e', 'JWT': '#d63aff',
  'Google Maps API': '#4285f4', 'Chart.js': '#ff6384', 'TypeScript': '#3178c6',
  'TensorFlow': '#ff6f00', 'Scikit-learn': '#f7931e',
};

const ProjectCard = ({ project, index }) => {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef(null);
  const tags = Array.isArray(project.tech_stack_tags)
    ? project.tech_stack_tags
    : (project.tech_stack_tags?.split(',') || []);

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
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {project.repo_url && (
            <a
              href={project.repo_url}
              target="_blank"
              rel="noopener noreferrer"
              data-hover
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.45rem 1rem',
                background: 'transparent',
                border: '1px solid rgba(59,130,246,0.2)',
                borderRadius: 8,
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                fontSize: '0.82rem',
                fontWeight: 500,
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
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.45rem 1rem',
                background: 'linear-gradient(135deg, rgba(37,99,235,0.3), rgba(6,182,212,0.2))',
                border: '1px solid rgba(59,130,246,0.35)',
                borderRadius: 8,
                color: 'var(--blue-light)',
                textDecoration: 'none',
                fontSize: '0.82rem',
                fontWeight: 600,
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

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

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

  return (
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
              <ProjectCard key={project.id} project={project} index={i} />
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
  );
};

export default Projects;
