const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const getToken = () => localStorage.getItem('myrfweb_token');

const headers = (isAuth = false, isMultipart = false) => {
  const h = {};
  if (!isMultipart) h['Content-Type'] = 'application/json';
  if (isAuth) h['Authorization'] = `Bearer ${getToken()}`;
  return h;
};

const handleRes = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP error ${res.status}`);
  return data;
};

// ── Auth ──────────────────────────────────────────────
export const authAPI = {
  login: (username, password) =>
    fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ username, password }),
    }).then(handleRes),

  verify: () =>
    fetch(`${API_BASE}/auth/verify`, {
      method: 'POST',
      headers: headers(true),
    }).then(handleRes),
};

// ── Profile ───────────────────────────────────────────
export const profileAPI = {
  get: () => fetch(`${API_BASE}/profile`, { headers: headers() }).then(handleRes),
  update: (data) =>
    fetch(`${API_BASE}/profile`, {
      method: 'PUT',
      headers: headers(true),
      body: JSON.stringify(data),
    }).then(handleRes),
};

// ── Projects ──────────────────────────────────────────
export const projectsAPI = {
  getPublished: () => fetch(`${API_BASE}/projects`, { headers: headers() }).then(handleRes),
  getAll: () => fetch(`${API_BASE}/projects/all`, { headers: headers(true) }).then(handleRes),
  getById: (id) => fetch(`${API_BASE}/projects/${id}`, { headers: headers() }).then(handleRes),
  create: (data) =>
    fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: headers(true),
      body: JSON.stringify(data),
    }).then(handleRes),
  update: (id, data) =>
    fetch(`${API_BASE}/projects/${id}`, {
      method: 'PUT',
      headers: headers(true),
      body: JSON.stringify(data),
    }).then(handleRes),
  toggle: (id, is_published) =>
    fetch(`${API_BASE}/projects/${id}/toggle`, {
      method: 'PATCH',
      headers: headers(true),
      body: JSON.stringify({ is_published }),
    }).then(handleRes),
  reorder: (items) =>
    fetch(`${API_BASE}/projects/reorder`, {
      method: 'PUT',
      headers: headers(true),
      body: JSON.stringify({ items }),
    }).then(handleRes),
  delete: (id) =>
    fetch(`${API_BASE}/projects/${id}`, {
      method: 'DELETE',
      headers: headers(true),
    }).then(handleRes),
  /** Upload a detail image file → returns { url, fileName } */
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return fetch(`${API_BASE}/projects/upload-image`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData,
    }).then(handleRes);
  },
  /** Upload a thumbnail image file → returns { url, fileName } */
  uploadThumbnail: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return fetch(`${API_BASE}/projects/upload-thumbnail`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData,
    }).then(handleRes);
  },
};

// ── Skills ────────────────────────────────────────────
export const skillsAPI = {
  getAll: () => fetch(`${API_BASE}/skills`, { headers: headers() }).then(handleRes),
  add: (data) =>
    fetch(`${API_BASE}/skills`, {
      method: 'POST',
      headers: headers(true),
      body: JSON.stringify(data),
    }).then(handleRes),
  update: (id, data) =>
    fetch(`${API_BASE}/skills/${id}`, {
      method: 'PUT',
      headers: headers(true),
      body: JSON.stringify(data),
    }).then(handleRes),
  reorder: (items) =>
    fetch(`${API_BASE}/skills/reorder`, {
      method: 'PUT',
      headers: headers(true),
      body: JSON.stringify({ items }),
    }).then(handleRes),
  delete: (id) =>
    fetch(`${API_BASE}/skills/${id}`, {
      method: 'DELETE',
      headers: headers(true),
    }).then(handleRes),
};

// ── Skill Categories ──────────────────────────────────
export const skillCategoriesAPI = {
  getAll: () => fetch(`${API_BASE}/skill-categories`, { headers: headers() }).then(handleRes),
  add: (name) =>
    fetch(`${API_BASE}/skill-categories`, {
      method: 'POST',
      headers: headers(true),
      body: JSON.stringify({ name }),
    }).then(handleRes),
  reorder: (items) =>
    fetch(`${API_BASE}/skill-categories/reorder`, {
      method: 'PUT',
      headers: headers(true),
      body: JSON.stringify({ items }),
    }).then(handleRes),
  delete: (id) =>
    fetch(`${API_BASE}/skill-categories/${id}`, {
      method: 'DELETE',
      headers: headers(true),
    }).then(handleRes),
};

// ── Messages ──────────────────────────────────────────
export const messagesAPI = {
  send: (data) =>
    fetch(`${API_BASE}/messages`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data),
    }).then(handleRes),
  getAll: () => fetch(`${API_BASE}/messages`, { headers: headers(true) }).then(handleRes),
  markRead: (id) =>
    fetch(`${API_BASE}/messages/${id}/read`, {
      method: 'PATCH',
      headers: headers(true),
    }).then(handleRes),
  delete: (id) =>
    fetch(`${API_BASE}/messages/${id}`, {
      method: 'DELETE',
      headers: headers(true),
    }).then(handleRes),
};
