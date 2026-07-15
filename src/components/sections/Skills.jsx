import { useState, useEffect } from 'react';
import { skillsAPI } from '../../services/api';

const CATEGORY_COLORS = {
  'Frontend': { bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.3)', text: '#60a5fa', glow: '#3b82f6' },
  'Backend': { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', text: '#34d399', glow: '#10b981' },
  'Database': { bg: 'rgba(124,58,237,0.1)', border: 'rgba(124,58,237,0.3)', text: '#a78bfa', glow: '#7c3aed' },
  'Tools': { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', text: '#fbbf24', glow: '#f59e0b' },
};

const SkillCard = ({ skill, index }) => {
  const [hovered, setHovered] = useState(false);
  const colors = CATEGORY_COLORS[skill.category] || CATEGORY_COLORS['Tools'];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="reveal"
      data-hover
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '1.5rem 1rem',
        background: hovered ? colors.bg : 'rgba(13,26,51,0.5)',
        border: `1px solid ${hovered ? colors.border : 'rgba(59,130,246,0.1)'}`,
        borderRadius: 'var(--radius-md)',
        cursor: 'default',
        transition: 'all 0.3s ease',
        boxShadow: hovered ? `0 8px 32px rgba(0,0,0,0.3), 0 0 20px ${colors.glow}25` : 'none',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        animationDelay: `${index * 0.05}s`,
      }}
    >
      {/* Icon */}
      <div style={{
        width: 52,
        height: 52,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 0.3s ease',
        transform: hovered ? 'scale(1.15) rotate(-5deg)' : 'scale(1)',
        filter: hovered ? `drop-shadow(0 0 10px ${colors.glow}90)` : 'none',
      }}>
        {skill.icon_url ? (
          <img
            src={skill.icon_url}
            alt={skill.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
            onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
          />
        ) : null}
        <span style={{
          display: skill.icon_url ? 'none' : 'flex',
          fontSize: '1.8rem',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
        }}>⚡</span>
      </div>

      {/* Name */}
      <span style={{
        fontSize: '0.82rem',
        fontWeight: 600,
        color: hovered ? colors.text : 'var(--text-secondary)',
        textAlign: 'center',
        fontFamily: 'var(--font-mono)',
        transition: 'color 0.3s ease',
        letterSpacing: '0.02em',
      }}>
        {skill.name}
      </span>
    </div>
  );
};

const CategorySection = ({ category, skills }) => {
  const colors = CATEGORY_COLORS[category] || CATEGORY_COLORS['Tools'];
  return (
    <div className="reveal" style={{ marginBottom: '3rem' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '1.5rem',
      }}>
        <div style={{
          width: 4,
          height: 24,
          background: colors.glow,
          borderRadius: 2,
          boxShadow: `0 0 10px ${colors.glow}`,
        }} />
        <h3 style={{
          fontSize: '1rem',
          fontWeight: 600,
          color: colors.text,
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}>
          {category}
          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginLeft: '0.5rem', fontWeight: 400 }}>
            ({skills.length})
          </span>
        </h3>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
        gap: '0.75rem',
      }}>
        {skills.map((skill, i) => (
          <SkillCard key={skill.id} skill={skill} index={i} />
        ))}
      </div>
    </div>
  );
};

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    skillsAPI.getAll()
      .then(setSkills)
      .catch(() => setSkills([]))
      .finally(() => setLoading(false));
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
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [skills]);

  const grouped = skills.reduce((acc, skill) => {
    const cat = skill.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  const categoryOrder = ['Frontend', 'Backend', 'Database', 'Tools'];
  const sortedCategories = [
    ...categoryOrder.filter(c => grouped[c]),
    ...Object.keys(grouped).filter(c => !categoryOrder.includes(c)),
  ];

  return (
    <section id="skills" className="section" style={{
      background: 'linear-gradient(180deg, var(--bg-deepest) 0%, var(--bg-primary) 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* BG accent */}
      <div style={{
        position: 'absolute',
        bottom: '5%',
        left: '-5%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="container">
        <div className="section-header reveal">
          <div className="section-tag">Expertise</div>
          <h2 className="section-title">
            Tech <span className="gradient-text">Skills</span>
          </h2>
          <div className="glow-divider" />
          <p className="section-desc">
            Tumpukan teknologi yang saya kuasai — dari frontend yang memukau hingga backend yang handal.
          </p>
        </div>

        {loading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
            gap: '0.75rem',
          }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 120, borderRadius: 12 }} />
            ))}
          </div>
        ) : (
          sortedCategories.map(cat => (
            <CategorySection key={cat} category={cat} skills={grouped[cat]} />
          ))
        )}

        {/* Terminal-style stats */}
        {!loading && skills.length > 0 && (
          <div className="reveal" style={{
            marginTop: '2rem',
            padding: '1.5rem 2rem',
            background: 'rgba(7,13,31,0.8)',
            border: '1px solid rgba(59,130,246,0.15)',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
          }}>
            <div style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              {'// skill_summary.js'}
            </div>
            <div style={{ color: 'var(--blue-light)' }}>
              const skills = {'{'}
            </div>
            {sortedCategories.map(cat => (
              <div key={cat} style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)' }}>
                <span style={{ color: CATEGORY_COLORS[cat]?.text || '#fff' }}>{cat.toLowerCase()}</span>
                <span style={{ color: 'var(--text-muted)' }}>: </span>
                <span style={{ color: '#34d399' }}>{grouped[cat]?.length}</span>
                <span style={{ color: 'var(--text-muted)' }}> skills,</span>
              </div>
            ))}
            <div style={{ color: 'var(--blue-light)' }}>{'}'}</div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Skills;
