import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { projectsAPI, skillsAPI, messagesAPI, profileAPI } from '../services/api';

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const Sidebar = ({ activeTab, setActiveTab, onLogout }) => {
  const tabs = [
    { id: 'overview', icon: '📊', label: 'Overview' },
    { id: 'profile', icon: '👤', label: 'Profile' },
    { id: 'projects', icon: '🚀', label: 'Projects' },
    { id: 'skills', icon: '🛠', label: 'Skills' },
    { id: 'messages', icon: '💬', label: 'Messages' },
  ];

  return (
    <aside style={{
      width: 240,
      minHeight: '100vh',
      background: 'rgba(7,13,31,0.95)',
      backdropFilter: 'blur(20px)',
      borderRight: '1px solid rgba(59,130,246,0.12)',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem 0',
      position: 'sticky',
      top: 0,
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '0 1.5rem 1.5rem', borderBottom: '1px solid rgba(59,130,246,0.1)' }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: 34, height: 34,
            background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
            borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.85rem', color: 'white',
            boxShadow: '0 0 14px rgba(59,130,246,0.4)',
          }}>RF</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Admin Panel</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>MyRFWeb CMS</div>
          </div>
        </Link>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            data-hover
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.65rem 0.9rem',
              borderRadius: 9,
              border: 'none',
              background: activeTab === tab.id
                ? 'linear-gradient(135deg, rgba(37,99,235,0.25), rgba(6,182,212,0.15))'
                : 'transparent',
              color: activeTab === tab.id ? 'var(--blue-light)' : 'var(--text-secondary)',
              fontWeight: activeTab === tab.id ? 600 : 400,
              fontSize: '0.875rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease',
              borderLeft: activeTab === tab.id
                ? '2px solid var(--blue-main)'
                : '2px solid transparent',
            }}
            onMouseEnter={e => { if (activeTab !== tab.id) e.currentTarget.style.background = 'rgba(59,130,246,0.07)'; }}
            onMouseLeave={e => { if (activeTab !== tab.id) e.currentTarget.style.background = 'transparent'; }}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid rgba(59,130,246,0.1)' }}>
        <button
          onClick={onLogout}
          data-hover
          style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            width: '100%', padding: '0.65rem 0.9rem',
            borderRadius: 9, border: 'none',
            background: 'transparent',
            color: '#f87171', fontSize: '0.875rem', cursor: 'pointer',
            transition: 'background 0.2s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
};

// ─── Overview Tab ─────────────────────────────────────────────────────────────
const StatBox = ({ value, label, icon, color }) => (
  <div style={{
    background: 'rgba(13,26,51,0.7)',
    border: `1px solid ${color}30`,
    borderRadius: 'var(--radius-md)',
    padding: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  }}>
    <div style={{
      width: 48, height: 48,
      background: `${color}18`,
      border: `1px solid ${color}35`,
      borderRadius: 10,
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem',
    }}>{icon}</div>
    <div>
      <div style={{ fontSize: '1.75rem', fontWeight: 800, color, fontFamily: 'var(--font-mono)' }}>{value}</div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{label}</div>
    </div>
  </div>
);

const OverviewTab = ({ stats }) => (
  <div>
    <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>Dashboard Overview</h2>
    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
      Selamat datang di admin panel, Rifaildy 👋
    </p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
      <StatBox value={stats.projects} label="Total Projects" icon="🚀" color="#3b82f6" />
      <StatBox value={stats.published} label="Published" icon="✅" color="#10b981" />
      <StatBox value={stats.skills} label="Skills Listed" icon="🛠" color="#a78bfa" />
      <StatBox value={stats.unread} label="Unread Messages" icon="💬" color="#f59e0b" />
    </div>
    <div style={{
      padding: '1.5rem',
      background: 'rgba(7,13,31,0.8)',
      border: '1px solid rgba(59,130,246,0.12)',
      borderRadius: 'var(--radius-md)',
      fontFamily: 'var(--font-mono)',
      fontSize: '0.82rem',
    }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>~/admin $ sys_info</div>
      <div style={{ color: '#34d399' }}>✓ API connection: online</div>
      <div style={{ color: '#34d399' }}>✓ Database: Supabase PostgreSQL</div>
      <div style={{ color: 'var(--cyan)' }}>↗ Frontend: http://localhost:5173</div>
      <div style={{ color: 'var(--cyan)' }}>↗ Backend API: http://localhost:3001</div>
    </div>
  </div>
);

// ─── Profile Tab ──────────────────────────────────────────────────────────────
const ProfileTab = () => {
  const [profile, setProfile] = useState({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    profileAPI.get().then(setProfile).catch(() => {});
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await profileAPI.update(profile);
      setMsg('✅ Profile updated!');
    } catch (err) {
      setMsg(`❌ Error: ${err.message}`);
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(''), 3000);
    }
  };

  const fields = [
    { key: 'full_name', label: 'Full Name', type: 'text' },
    { key: 'profession', label: 'Profession', type: 'text' },
    { key: 'bio', label: 'Bio', type: 'textarea' },
    { key: 'phone_number', label: 'Phone/WhatsApp', type: 'text' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'linkedin_url', label: 'LinkedIn URL', type: 'url' },
    { key: 'github_url', label: 'GitHub URL', type: 'url' },
    { key: 'instagram_url', label: 'Instagram URL', type: 'url' },
    { key: 'cv_url', label: 'CV URL', type: 'url' },
  ];

  return (
    <div>
      <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>Profile & Settings</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.875rem' }}>
        Kelola informasi pribadi yang tampil di website publik.
      </p>
      <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', maxWidth: 800 }}>
        {fields.map(field => (
          <div key={field.key} style={{ gridColumn: field.type === 'textarea' ? '1 / -1' : 'auto' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontFamily: 'var(--font-mono)' }}>
              {field.label.toUpperCase()}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                className="input-field"
                rows={4}
                value={profile[field.key] || ''}
                onChange={e => setProfile(p => ({ ...p, [field.key]: e.target.value }))}
              />
            ) : (
              <input
                type={field.type}
                className="input-field"
                value={profile[field.key] || ''}
                onChange={e => setProfile(p => ({ ...p, [field.key]: e.target.value }))}
              />
            )}
          </div>
        ))}
        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button type="submit" disabled={saving} className="btn-primary" data-hover>
            <span>{saving ? '⏳ Saving...' : '💾 Save Changes'}</span>
          </button>
          {msg && <span style={{ fontSize: '0.875rem', color: msg.startsWith('✅') ? '#34d399' : '#f87171' }}>{msg}</span>}
        </div>
      </form>
    </div>
  );
};

// ─── Projects Tab ─────────────────────────────────────────────────────────────
const EMPTY_FORM = {
  title: '', slug: '', description: '', tech_stack_tags: '',
  repo_url: '', live_url: '', image_url: '',
  is_published: false,
  detail_content: '',
  // detail images: [{ url, caption, uploading }]
};

const ProjectsTab = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  // detail images state: array of { url, caption, uploading }
  const [detailImages, setDetailImages] = useState([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [reordering, setReordering] = useState(false);
  const [thumbnailUploading, setThumbnailUploading] = useState(false);
  const dragItem = { current: null };
  const dragOver = { current: null };

  const load = () => {
    setLoading(true);
    projectsAPI.getAll().then(setProjects).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openForm = (project = null) => {
    if (project) {
      setEditing(project.id);
      setForm({
        ...project,
        tech_stack_tags: Array.isArray(project.tech_stack_tags) ? project.tech_stack_tags.join(', ') : project.tech_stack_tags || '',
        detail_content: project.detail_content || '',
      });
      // Reconstruct detailImages from parallel arrays
      const imgs   = Array.isArray(project.detail_images)   ? project.detail_images   : [];
      const caps   = Array.isArray(project.detail_captions) ? project.detail_captions : [];
      setDetailImages(imgs.map((url, i) => ({ url: url || '', caption: caps[i] || '', uploading: false })));
    } else {
      setEditing(null);
      setForm(EMPTY_FORM);
      setDetailImages([]);
    }
    setShowForm(true);
  };

  // ── Detail image helpers ───────────────────────────────────
  const addImageRow = () => setDetailImages(prev => [...prev, { url: '', caption: '', uploading: false }]);

  const removeImageRow = (i) => setDetailImages(prev => prev.filter((_, idx) => idx !== i));

  const updateImageRow = (i, field, value) =>
    setDetailImages(prev => prev.map((row, idx) => idx === i ? { ...row, [field]: value } : row));

  const handleImageUpload = async (i, file) => {
    if (!file) return;
    updateImageRow(i, 'uploading', true);
    try {
      const res = await projectsAPI.uploadImage(file);
      updateImageRow(i, 'url', res.url);
    } catch (err) {
      setMsg(`❌ Upload gagal: ${err.message}`);
      setTimeout(() => setMsg(''), 3000);
    } finally {
      updateImageRow(i, 'uploading', false);
    }
  };

  const handleThumbnailUpload = async (file) => {
    if (!file) return;
    setThumbnailUploading(true);
    try {
      const res = await projectsAPI.uploadThumbnail(file);
      setForm(p => ({ ...p, image_url: res.url }));
      setMsg('✅ Thumbnail uploaded!');
      setTimeout(() => setMsg(''), 2500);
    } catch (err) {
      setMsg(`❌ Upload thumbnail gagal: ${err.message}`);
      setTimeout(() => setMsg(''), 3000);
    } finally {
      setThumbnailUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Parallel arrays — filter out completely empty rows
      const validImages = detailImages.filter(row => row.url.trim());
      const data = {
        ...form,
        tech_stack_tags: form.tech_stack_tags.split(',').map(s => s.trim()).filter(Boolean),
        slug: form.slug || form.title.toLowerCase().replace(/\s+/g, '-'),
        detail_images:   validImages.map(r => r.url.trim()),
        detail_captions: validImages.map(r => r.caption.trim() || null),
        detail_content:  form.detail_content.trim() || null,
      };
      if (editing) await projectsAPI.update(editing, data);
      else await projectsAPI.create(data);
      setMsg('✅ Project saved!');
      load();
      setShowForm(false);
    } catch (err) {
      setMsg(`❌ ${err.message}`);
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(''), 3000);
    }
  };

  const handleToggle = async (id, current) => {
    try {
      await projectsAPI.toggle(id, !current);
      load();
    } catch {}
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await projectsAPI.delete(id);
      load();
    } catch {}
  };

  // ── Drag & Drop handlers ──────────────────────────────────────────────────
  const handleDragStart = (e, idx) => {
    dragItem.current = idx;
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnter = (e, idx) => {
    dragOver.current = idx;
    e.currentTarget.style.borderTop = '2px solid var(--blue-main)';
  };

  const handleDragLeave = (e) => {
    e.currentTarget.style.borderTop = '';
  };

  const handleDrop = async (e, idx) => {
    e.currentTarget.style.borderTop = '';
    if (dragItem.current === null || dragItem.current === idx) return;

    const reordered = [...projects];
    const [moved] = reordered.splice(dragItem.current, 1);
    reordered.splice(idx, 0, moved);

    const withOrder = reordered.map((p, i) => ({ ...p, sort_order: i }));
    setProjects(withOrder);
    dragItem.current = null;
    dragOver.current = null;

    setReordering(true);
    try {
      await projectsAPI.reorder(withOrder.map((p, i) => ({ id: p.id, sort_order: i })));
      setMsg('✅ Urutan tersimpan!');
    } catch {
      setMsg('❌ Gagal menyimpan urutan.');
      load(); // revert
    } finally {
      setReordering(false);
      setTimeout(() => setMsg(''), 2500);
    }
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
    // clear any leftover border
    document.querySelectorAll('tr[draggable]').forEach(tr => { tr.style.borderTop = ''; });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.25rem' }}>Projects Management</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Kelola proyek — seret <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--blue-light)' }}>⠿</span> untuk mengatur urutan
          </p>
        </div>
        <button onClick={() => openForm()} className="btn-primary" data-hover>
          <span>+ New Project</span>
        </button>
      </div>

      {msg && <div style={{ marginBottom: '1rem', padding: '0.6rem 1rem', background: msg.startsWith('✅') ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${msg.startsWith('✅') ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`, borderRadius: 8, color: msg.startsWith('✅') ? '#34d399' : '#f87171', fontSize: '0.875rem' }}>{msg}</div>}

      {/* Modal Form */}
      {showForm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
          zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem',
        }}>
          <div style={{
            background: 'var(--bg-secondary)', border: '1px solid rgba(59,130,246,0.2)',
            borderRadius: 'var(--radius-xl)', padding: '2rem', width: '100%', maxWidth: 720,
            maxHeight: '92vh', overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{editing ? '✏️ Edit Project' : '➕ New Project'}</h3>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

              {/* ── Basic Info ── */}
              {[
                { key: 'title', label: 'Title', type: 'text', placeholder: 'Project Title' },
                { key: 'slug', label: 'Slug', type: 'text', placeholder: 'project-slug (auto-generated)' },
                { key: 'description', label: 'Short Description', type: 'textarea', placeholder: 'Deskripsi singkat proyek...' },
                { key: 'tech_stack_tags', label: 'Tech Stack (comma separated)', type: 'text', placeholder: 'React.js, Node.js, PostgreSQL' },
                { key: 'repo_url', label: 'Repository URL', type: 'url', placeholder: 'https://github.com/...' },
                { key: 'live_url', label: 'Live Demo URL', type: 'url', placeholder: 'https://...' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem', fontFamily: 'var(--font-mono)' }}>{f.label.toUpperCase()}</label>
                  {f.type === 'textarea' ? (
                    <textarea className="input-field" rows={3} placeholder={f.placeholder} value={form[f.key] || ''} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
                  ) : (
                    <input type={f.type} className="input-field" placeholder={f.placeholder} value={form[f.key] || ''} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
                  )}
                </div>
              ))}

              {/* ── Thumbnail Image Upload ── */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontFamily: 'var(--font-mono)' }}>THUMBNAIL IMAGE</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <input
                      type="url"
                      className="input-field"
                      placeholder="https://... (paste URL atau upload file)"
                      value={form.image_url || ''}
                      onChange={e => setForm(p => ({ ...p, image_url: e.target.value }))}
                    />
                    <label style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                      padding: '0.3rem 0.85rem', cursor: thumbnailUploading ? 'wait' : 'pointer',
                      background: thumbnailUploading ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.08)',
                      border: `1px solid ${thumbnailUploading ? 'rgba(245,158,11,0.3)' : 'rgba(16,185,129,0.25)'}`,
                      borderRadius: 6,
                      color: thumbnailUploading ? '#fbbf24' : '#34d399',
                      fontSize: '0.75rem', width: 'fit-content',
                    }}>
                      {thumbnailUploading ? '⏳ Uploading...' : '📤 Upload Thumbnail'}
                      <input
                        type="file" accept="image/*" style={{ display: 'none' }}
                        disabled={thumbnailUploading}
                        onChange={e => handleThumbnailUpload(e.target.files[0])}
                      />
                    </label>
                  </div>
                  {/* Thumbnail preview */}
                  {form.image_url && (
                    <div style={{
                      width: 80, height: 56, flexShrink: 0,
                      borderRadius: 8, overflow: 'hidden',
                      border: '1px solid rgba(59,130,246,0.25)',
                      background: 'rgba(13,26,51,0.5)',
                    }}>
                      <img
                        src={form.image_url}
                        alt="thumbnail preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        onError={e => { e.currentTarget.style.display = 'none'; }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* ── Separator ── */}
              <div style={{ borderTop: '1px solid rgba(59,130,246,0.15)', margin: '0.5rem 0' }} />
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--blue-light)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                📋 Detail Proyek (opsional)
              </div>

              {/* ── Detail Content ── */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem', fontFamily: 'var(--font-mono)' }}>DETAIL CONTENT (PENJELASAN UMUM)</label>
                <textarea
                  className="input-field"
                  rows={5}
                  placeholder={'Jelaskan proyek secara lengkap...\n\nFitur utama, tantangan, pendekatan teknis, hasil, dll.'}
                  value={form.detail_content || ''}
                  onChange={e => setForm(p => ({ ...p, detail_content: e.target.value }))}
                />
              </div>

              {/* ── Detail Images ── */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>DETAIL IMAGES ({detailImages.length})</label>
                  <button
                    type="button"
                    onClick={addImageRow}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.3rem',
                      padding: '0.3rem 0.75rem', background: 'rgba(59,130,246,0.1)',
                      border: '1px solid rgba(59,130,246,0.25)', borderRadius: 6,
                      color: 'var(--blue-light)', fontSize: '0.78rem', cursor: 'pointer',
                    }}
                  >+ Tambah Gambar</button>
                </div>

                {detailImages.length === 0 && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', padding: '0.75rem 1rem', background: 'rgba(13,26,51,0.5)', borderRadius: 8, border: '1px dashed rgba(59,130,246,0.15)' }}>
                    Belum ada gambar detail. Klik "+ Tambah Gambar" untuk menambahkan screenshot atau demo.
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {detailImages.map((row, i) => (
                    <div key={i} style={{
                      padding: '0.9rem', background: 'rgba(13,26,51,0.6)',
                      border: '1px solid rgba(59,130,246,0.12)', borderRadius: 10,
                      display: 'flex', flexDirection: 'column', gap: '0.5rem',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.72rem', color: 'rgba(59,130,246,0.7)', fontFamily: 'var(--font-mono)' }}>GAMBAR #{i + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeImageRow(i)}
                          style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '0.9rem', padding: '0 0.2rem' }}
                        >✕</button>
                      </div>

                      {/* URL + preview */}
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <div style={{ flex: 1 }}>
                          <input
                            type="url"
                            className="input-field"
                            placeholder="URL gambar atau upload di bawah"
                            value={row.url}
                            onChange={e => updateImageRow(i, 'url', e.target.value)}
                            style={{ fontSize: '0.8rem' }}
                          />
                        </div>
                        {/* Thumbnail preview */}
                        {row.url && (
                          <div style={{
                            width: 44, height: 44, flexShrink: 0,
                            borderRadius: 6, overflow: 'hidden',
                            border: '1px solid rgba(59,130,246,0.2)',
                          }}>
                            <img src={row.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={e => { e.currentTarget.style.display = 'none'; }} />
                          </div>
                        )}
                      </div>

                      {/* Upload button */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <label style={{
                          display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                          padding: '0.3rem 0.75rem',
                          background: row.uploading ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.08)',
                          border: `1px solid ${row.uploading ? 'rgba(245,158,11,0.3)' : 'rgba(16,185,129,0.25)'}`,
                          borderRadius: 6,
                          color: row.uploading ? '#fbbf24' : '#34d399',
                          fontSize: '0.75rem', cursor: row.uploading ? 'wait' : 'pointer',
                          whiteSpace: 'nowrap',
                        }}>
                          {row.uploading ? '⏳ Uploading...' : '📤 Upload File'}
                          <input
                            type="file" accept="image/*" style={{ display: 'none' }}
                            disabled={row.uploading}
                            onChange={e => handleImageUpload(i, e.target.files[0])}
                          />
                        </label>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>atau paste URL di atas</span>
                      </div>

                      {/* Caption */}
                      <input
                        type="text"
                        className="input-field"
                        placeholder="Caption gambar (opsional)"
                        value={row.caption}
                        onChange={e => updateImageRow(i, 'caption', e.target.value)}
                        style={{ fontSize: '0.8rem', fontStyle: row.caption ? 'normal' : 'italic' }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Published checkbox */}
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <input type="checkbox" checked={form.is_published} onChange={e => setForm(p => ({ ...p, is_published: e.target.checked }))} />
                Published (visible on portfolio)
              </label>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="submit" disabled={saving} className="btn-primary" data-hover><span>{saving ? '⏳ Saving...' : '💾 Save'}</span></button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline" data-hover>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(59,130,246,0.15)' }}>
                {['', 'Title', 'Tech Stack', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.78rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projects.map((p, idx) => (
                <tr
                  key={p.id}
                  draggable
                  onDragStart={(e) => { handleDragStart(e, idx); e.currentTarget.style.opacity = '0.5'; }}
                  onDragEnter={(e) => handleDragEnter(e, idx)}
                  onDragLeave={handleDragLeave}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, idx)}
                  onDragEnd={handleDragEnd}
                  style={{ borderBottom: '1px solid rgba(59,130,246,0.07)', transition: 'background 0.15s, opacity 0.2s', cursor: 'grab' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.05)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {/* Drag handle */}
                  <td style={{ padding: '1rem 0.5rem 1rem 1rem', color: 'var(--text-muted)', fontSize: '1.1rem', letterSpacing: '-1px', userSelect: 'none' }}>
                    ⠿
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {p.title}
                    {p.image_url && <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem', fontFamily: 'var(--font-mono)' }}>{p.slug}</div>}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                      {(Array.isArray(p.tech_stack_tags) ? p.tech_stack_tags : []).slice(0, 3).map(t => (
                        <span key={t} style={{ padding: '0.1rem 0.5rem', background: 'rgba(59,130,246,0.1)', color: 'var(--blue-light)', borderRadius: 100, fontSize: '0.7rem', fontFamily: 'var(--font-mono)' }}>{t}</span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: 100,
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      background: p.is_published ? 'rgba(16,185,129,0.12)' : 'rgba(100,116,139,0.12)',
                      color: p.is_published ? '#34d399' : 'var(--text-muted)',
                      border: `1px solid ${p.is_published ? 'rgba(16,185,129,0.25)' : 'rgba(100,116,139,0.2)'}`,
                    }}>
                      {p.is_published ? '● Published' : '○ Draft'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => openForm(p)} data-hover style={{ padding: '0.35rem 0.75rem', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 6, color: 'var(--blue-light)', fontSize: '0.78rem', cursor: 'pointer' }}>Edit</button>
                      <button onClick={() => handleToggle(p.id, p.is_published)} data-hover style={{ padding: '0.35rem 0.75rem', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 6, color: '#fbbf24', fontSize: '0.78rem', cursor: 'pointer' }}>
                        {p.is_published ? 'Unpublish' : 'Publish'}
                      </button>
                      <button onClick={() => handleDelete(p.id)} data-hover style={{ padding: '0.35rem 0.75rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6, color: '#f87171', fontSize: '0.78rem', cursor: 'pointer' }}>Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {reordering && (
            <div style={{ padding: '0.5rem 1rem', color: 'var(--cyan)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', marginTop: '0.5rem' }}>
              ⏳ Menyimpan urutan...
            </div>
          )}
          {projects.length === 0 && <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No projects yet. Create your first one!</div>}
        </div>
      )}
    </div>
  );
};

// ─── Skills Tab ───────────────────────────────────────────────────────────────
const SkillsTab = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', category: 'Frontend', icon_url: '' });
  const [msg, setMsg] = useState('');
  const [reordering, setReordering] = useState(false);

  const CATS = ['Frontend', 'Backend', 'Database', 'Tools'];

  // Per-category drag state
  const dragItem = { current: null };   // { cat, idx }
  const dragOver = { current: null };

  const load = () => { skillsAPI.getAll().then(setSkills).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await skillsAPI.add(form);
      setMsg('✅ Skill added!');
      setForm({ name: '', category: 'Frontend', icon_url: '' });
      load();
    } catch (err) {
      setMsg(`❌ ${err.message}`);
    }
    setTimeout(() => setMsg(''), 3000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this skill?')) return;
    try { await skillsAPI.delete(id); load(); } catch {}
  };

  // ── Drag & Drop handlers ──────────────────────────────────────────────────
  const handleSkillDragStart = (e, cat, idx) => {
    dragItem.current = { cat, idx };
    e.dataTransfer.effectAllowed = 'move';
    e.currentTarget.style.opacity = '0.45';
  };

  const handleSkillDragEnter = (e, cat, idx) => {
    if (!dragItem.current || dragItem.current.cat !== cat) return;
    dragOver.current = { cat, idx };
    e.currentTarget.style.outline = '2px solid var(--blue-main)';
    e.currentTarget.style.outlineOffset = '2px';
  };

  const handleSkillDragLeave = (e) => {
    e.currentTarget.style.outline = '';
    e.currentTarget.style.outlineOffset = '';
  };

  const handleSkillDrop = async (e, cat, idx) => {
    e.currentTarget.style.outline = '';
    e.currentTarget.style.outlineOffset = '';

    if (!dragItem.current || dragItem.current.cat !== cat) return;
    if (dragItem.current.idx === idx) return;

    // Reorder within the category
    const grouped = skills.reduce((acc, s) => {
      if (!acc[s.category]) acc[s.category] = [];
      acc[s.category].push(s);
      return acc;
    }, {});

    const catSkills = [...(grouped[cat] || [])];
    const [moved] = catSkills.splice(dragItem.current.idx, 1);
    catSkills.splice(idx, 0, moved);

    // Rebuild full skills array preserving other categories
    const newSkills = skills.map(s => {
      if (s.category !== cat) return s;
      const newIdx = catSkills.findIndex(cs => cs.id === s.id);
      return newIdx >= 0 ? { ...s, sort_order: catSkills.findIndex(cs => cs.id === s.id) } : s;
    });

    // Apply the new ordering for this category
    const reorderedCat = catSkills.map((s, i) => ({ ...s, sort_order: i }));
    const updatedSkills = skills.map(s => {
      if (s.category !== cat) return s;
      return reorderedCat.find(r => r.id === s.id) || s;
    });

    setSkills(updatedSkills);
    dragItem.current = null;

    setReordering(true);
    try {
      await skillsAPI.reorder(reorderedCat.map((s, i) => ({ id: s.id, sort_order: i })));
      setMsg('✅ Urutan tersimpan!');
    } catch {
      setMsg('❌ Gagal menyimpan urutan.');
      load();
    } finally {
      setReordering(false);
      setTimeout(() => setMsg(''), 2500);
    }
  };

  const handleSkillDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
    document.querySelectorAll('[data-skill-chip]').forEach(el => {
      el.style.outline = '';
      el.style.outlineOffset = '';
    });
  };

  const grouped = skills.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  return (
    <div>
      <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.5rem' }}>Skills Manager</h2>

      {/* Add form */}
      <div style={{ background: 'rgba(13,26,51,0.6)', border: '1px solid rgba(59,130,246,0.12)', borderRadius: 'var(--radius-md)', padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-secondary)' }}>Add New Skill</h3>
        {msg && <div style={{ marginBottom: '1rem', padding: '0.6rem 1rem', background: msg.startsWith('✅') ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', borderRadius: 8, color: msg.startsWith('✅') ? '#34d399' : '#f87171', fontSize: '0.875rem' }}>{msg}</div>}
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: '1 1 150px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem', fontFamily: 'var(--font-mono)' }}>NAME</label>
            <input type="text" className="input-field" placeholder="e.g. Vue.js" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
          </div>
          <div style={{ flex: '0 0 140px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem', fontFamily: 'var(--font-mono)' }}>CATEGORY</label>
            <select className="input-field" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
              {CATS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ flex: '2 1 240px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem', fontFamily: 'var(--font-mono)' }}>ICON URL</label>
            <input type="url" className="input-field" placeholder="https://cdn.../icon.svg" value={form.icon_url} onChange={e => setForm(p => ({ ...p, icon_url: e.target.value }))} />
          </div>
          <button type="submit" className="btn-primary" data-hover><span>+ Add</span></button>
        </form>
      </div>

      {/* Grid by category */}
      {loading ? <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>Loading...</div> : (
        <div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '1.25rem', fontFamily: 'var(--font-mono)' }}>
            💡 Seret chip skill untuk mengubah urutan dalam kategori
          </p>
          {CATS.map(cat => grouped[cat] && (
            <div key={cat} style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.75rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{cat}</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {grouped[cat].map((skill, idx) => (
                  <div
                    key={skill.id}
                    data-skill-chip
                    draggable
                    onDragStart={(e) => handleSkillDragStart(e, cat, idx)}
                    onDragEnter={(e) => handleSkillDragEnter(e, cat, idx)}
                    onDragLeave={handleSkillDragLeave}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleSkillDrop(e, cat, idx)}
                    onDragEnd={handleSkillDragEnd}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.4rem',
                      padding: '0.4rem 0.75rem',
                      background: 'rgba(13,26,51,0.7)', border: '1px solid rgba(59,130,246,0.15)',
                      borderRadius: 8, fontSize: '0.82rem', color: 'var(--text-secondary)',
                      cursor: 'grab', userSelect: 'none', transition: 'opacity 0.2s',
                    }}
                  >
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', letterSpacing: '-1px' }}>⠿</span>
                    {skill.icon_url && <img src={skill.icon_url} alt={skill.name} style={{ width: 16, height: 16, objectFit: 'contain' }} />}
                    {skill.name}
                    <button onClick={() => handleDelete(skill.id)} style={{
                      background: 'transparent', border: 'none', color: '#f87171',
                      cursor: 'pointer', fontSize: '0.85rem', padding: '0 0.1rem',
                    }}>✕</button>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {reordering && (
            <div style={{ color: 'var(--cyan)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', marginTop: '0.5rem' }}>
              ⏳ Menyimpan urutan...
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Messages Tab ─────────────────────────────────────────────────────────────
const MessagesTab = ({ onUnreadCount }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const load = () => {
    messagesAPI.getAll()
      .then(data => {
        setMessages(data);
        onUnreadCount(data.filter(m => !m.is_read).length);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleRead = async (msg) => {
    setSelected(msg);
    if (!msg.is_read) {
      await messagesAPI.markRead(msg.id);
      load();
    }
  };

  const handleDelete = async (id) => {
    await messagesAPI.delete(id);
    setSelected(null);
    load();
  };

  const fmt = (dateStr) => new Date(dateStr).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' });

  return (
    <div>
      <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>Message Inbox</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
        {messages.filter(m => !m.is_read).length} unread messages
      </p>

      {loading ? (
        <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '3rem' }}>Loading messages...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: '1rem' }}>
          {/* List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {messages.length === 0 && <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '3rem' }}>No messages yet.</div>}
            {messages.map(m => (
              <div
                key={m.id}
                onClick={() => handleRead(m)}
                data-hover
                style={{
                  padding: '1rem',
                  background: selected?.id === m.id ? 'rgba(59,130,246,0.1)' : 'rgba(13,26,51,0.6)',
                  border: `1px solid ${selected?.id === m.id ? 'rgba(59,130,246,0.4)' : !m.is_read ? 'rgba(59,130,246,0.2)' : 'rgba(59,130,246,0.08)'}`,
                  borderRadius: 10, cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => { if (selected?.id !== m.id) e.currentTarget.style.background = 'rgba(59,130,246,0.06)'; }}
                onMouseLeave={e => { if (selected?.id !== m.id) e.currentTarget.style.background = 'rgba(13,26,51,0.6)'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                  <span style={{ fontWeight: m.is_read ? 400 : 700, color: m.is_read ? 'var(--text-secondary)' : 'var(--text-primary)', fontSize: '0.9rem' }}>
                    {!m.is_read && <span style={{ width: 6, height: 6, background: 'var(--blue-main)', borderRadius: '50%', display: 'inline-block', marginRight: '0.4rem', verticalAlign: 'middle' }} />}
                    {m.sender_name}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{fmt(m.created_at)}</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {m.message_content}
                </p>
              </div>
            ))}
          </div>

          {/* Detail */}
          {selected && (
            <div style={{
              padding: '1.5rem',
              background: 'rgba(10,20,40,0.8)',
              border: '1px solid rgba(59,130,246,0.15)',
              borderRadius: 12,
              position: 'sticky',
              top: '1rem',
              alignSelf: 'start',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>{selected.sender_name}</h3>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>✕</button>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '1rem', fontFamily: 'var(--font-mono)' }}>
                {selected.sender_email && <div>📧 {selected.sender_email}</div>}
                {selected.sender_phone && <div>📱 {selected.sender_phone}</div>}
                <div>🕐 {fmt(selected.created_at)}</div>
              </div>
              <div style={{ padding: '1rem', background: 'rgba(7,13,31,0.6)', borderRadius: 8, fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                {selected.message_content}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {selected.sender_phone && (
                  <a href={`https://wa.me/${selected.sender_phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ fontSize: '0.82rem', padding: '0.4rem 0.9rem' }} data-hover>
                    <span>WhatsApp Reply</span>
                  </a>
                )}
                {selected.sender_email && (
                  <a href={`mailto:${selected.sender_email}`} className="btn-outline" style={{ fontSize: '0.82rem', padding: '0.4rem 0.9rem' }} data-hover>Email Reply</a>
                )}
                <button onClick={() => handleDelete(selected.id)} data-hover style={{ padding: '0.4rem 0.9rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8, color: '#f87171', fontSize: '0.82rem', cursor: 'pointer' }}>Delete</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ projects: 0, published: 0, skills: 0, unread: 0 });
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Load stats for overview
    Promise.all([
      projectsAPI.getAll().catch(() => []),
      skillsAPI.getAll().catch(() => []),
      messagesAPI.getAll().catch(() => []),
    ]).then(([projs, skls, msgs]) => {
      setStats({
        projects: projs.length,
        published: projs.filter(p => p.is_published).length,
        skills: skls.length,
        unread: msgs.filter(m => !m.is_read).length,
      });
    });
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin-login');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-deepest)',
      display: 'flex',
    }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />

      {/* Main content */}
      <main style={{
        flex: 1,
        padding: '2rem 2.5rem',
        overflowY: 'auto',
        minWidth: 0,
      }}>
        {/* Header bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid rgba(59,130,246,0.1)',
        }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            ~/admin/{activeTab} <span style={{ color: 'var(--cyan)', animation: 'blink 1s step-end infinite' }}>|</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <span className="status-dot online" />
            {user?.username || 'Admin'}
          </div>
        </div>

        {/* Tab content */}
        {activeTab === 'overview' && <OverviewTab stats={stats} />}
        {activeTab === 'profile' && <ProfileTab />}
        {activeTab === 'projects' && <ProjectsTab />}
        {activeTab === 'skills' && <SkillsTab />}
        {activeTab === 'messages' && (
          <MessagesTab onUnreadCount={count => setStats(s => ({ ...s, unread: count }))} />
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
