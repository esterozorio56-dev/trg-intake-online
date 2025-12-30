(function () {
  const form = document.getElementById('form');
  const statusEl = document.getElementById('status');
  const btn = document.getElementById('btnSubmit');

  // pega o token da URL: /intake/:token
  const parts = location.pathname.split('/');
  const token = (parts[2] || '').trim();

  function bindRange(name, outId) {
    const el = form.elements[name];
    const out = document.getElementById(outId);
    const update = () => out.textContent = el.value;
    el.addEventListener('input', update);
    update();
  }

  bindRange('intensidade', 'v_intensidade');
  bindRange('ansiedade', 'v_ansiedade');
  bindRange('somatico', 'v_somatico');

  async function loadStatus() {
    try {
      const r = await fetch(`/api/intake/${encodeURIComponent(token)}/status`);
      const j = await r.json();
      if (!j.ok) throw new Error('status');

      if
