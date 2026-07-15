// ════════════════════════════════════════════════════════
// api-config.js
// Include this BEFORE any other script in every page that
// talks to the backend (admin-login, admin-panel,
// student-login, admission.html).
//
// ⚠️ IMPORTANT: After you deploy the backend to Vercel,
// replace the URL below with your real backend URL,
// e.g. "https://sshs-backend.vercel.app"
// ════════════════════════════════════════════════════════

window.API_BASE = "http://localhost:5000"; // ← change this after deploying backend

// Small helper used by every page — wraps fetch with auth header + JSON handling
window.apiFetch = async function (path, options = {}) {
  const token = localStorage.getItem('sshs_token');
  const headers = Object.assign(
    { 'Content-Type': 'application/json' },
    token ? { Authorization: 'Bearer ' + token } : {},
    options.headers || {}
  );
  const res = await fetch(window.API_BASE + path, { ...options, headers });
  let data;
  try {
    data = await res.json();
  } catch (e) {
    data = {};
  }
  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong');
  }
  return data;
};
