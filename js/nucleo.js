/* ============================================================
   Equilibra · Núcleo
   Utilidades, cifrado, estado, persistencia, router y armazón.
   ============================================================ */
(function () {
  'use strict';

  const { CATS, OBJ, OBJ_IC, DIETAS, NIVELES, REV, RECS } = window.EquilibraData;
  const illus = window.illus;
  const ic = window.ic;

  /* ---------- 1. Utilidades ---------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const norm = (s) => String(s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const todayISO = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };
  const fmtDate = (iso) => {
    const m = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    const [y, mo, da] = String(iso).split('-');
    return `${Number(da)} ${m[Number(mo) - 1]} ${y}`;
  };
  const daysBetween = (a, b) => {
    const [ay, am, ad] = a.split('-').map(Number);
    const [by, bm, bd] = b.split('-').map(Number);
    return Math.round((Date.UTC(by, bm - 1, bd) - Date.UTC(ay, am - 1, ad)) / 86400000);
  };
  const initials = (n) => String(n || '?').trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();

  const LOGO = `<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="16" fill="var(--pine)"/><path d="M8.5 18.5C8.5 12 13.5 8.6 23.5 8.2c-.6 9.6-4.6 14.3-10.4 14.3-2.4 0-3.8-1.3-4.6-4z" fill="var(--sun)"/><path d="M10.5 22.5c2.8-4.3 6-7.4 10.2-10" stroke="var(--pine)" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>`;

  /* ---------- 2. Cifrado de contraseñas (SHA-256 + sal) ---------- */
  /* Implementación didáctica: en producción el hash se calcula en el servidor
     con Argon2id o bcrypt. Aquí evita guardar contraseñas en texto plano. */
  function sha256(message) {
    const bytes = new TextEncoder().encode(String(message));
    let ascii = '';
    for (let i = 0; i < bytes.length; i++) ascii += String.fromCharCode(bytes[i]);

    const rightRotate = (value, amount) => (value >>> amount) | (value << (32 - amount));
    const mathPow = Math.pow;
    const maxWord = mathPow(2, 32);
    let result = '';
    const words = [];
    const asciiBitLength = ascii.length * 8;
    let hash = sha256.h = sha256.h || [];
    const k = sha256.k = sha256.k || [];
    let primeCounter = k.length;
    const isComposite = {};

    for (let candidate = 2; primeCounter < 64; candidate++) {
      if (!isComposite[candidate]) {
        for (let i = 0; i < 313; i += candidate) isComposite[i] = candidate;
        hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
        k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
      }
    }

    ascii += '\x80';
    while (ascii.length % 64 - 56) ascii += '\x00';
    for (let i = 0; i < ascii.length; i++) {
      const j = ascii.charCodeAt(i);
      if (j >> 8) return '';
      words[i >> 2] |= j << (((3 - i) % 4) * 8);
    }
    words[words.length] = (asciiBitLength / maxWord) | 0;
    words[words.length] = asciiBitLength;

    for (let j = 0; j < words.length;) {
      const w = words.slice(j, (j += 16));
      const oldHash = hash;
      hash = hash.slice(0, 8);
      for (let i = 0; i < 64; i++) {
        const w15 = w[i - 15];
        const w2 = w[i - 2];
        const a = hash[0];
        const e = hash[4];
        const temp1 = hash[7]
          + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25))
          + ((e & hash[5]) ^ (~e & hash[6]))
          + k[i]
          + (w[i] = i < 16 ? w[i] : (
            w[i - 16]
            + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3))
            + w[i - 7]
            + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))
          ) | 0);
        const temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22))
          + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
        hash = [(temp1 + temp2) | 0].concat(hash);
        hash[4] = (hash[4] + temp1) | 0;
      }
      for (let i = 0; i < 8; i++) hash[i] = (hash[i] + oldHash[i]) | 0;
    }

    for (let i = 0; i < 8; i++) {
      for (let j = 3; j + 1; j--) {
        const b = (hash[i] >> (j * 8)) & 255;
        result += (b < 16 ? '0' : '') + b.toString(16);
      }
    }
    return result;
  }

  function randomSalt() {
    const a = new Uint8Array(16);
    if (window.crypto && window.crypto.getRandomValues) window.crypto.getRandomValues(a);
    else for (let i = 0; i < a.length; i++) a[i] = Math.floor(Math.random() * 256);
    return Array.from(a).map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  const hashPass = (pass, salt) => sha256(`${salt}|${pass}`);

  /* ---------- 3. Estado y persistencia ---------- */
  const STORE_KEY = 'equilibra-aca-v1';
  const SESSION_KEY = 'equilibra-aca-session';
  const WF_KEY = 'equilibra-aca-wf';

  const state = {
    users: {},
    session: null,
    remember: true,
    route: 'inicio',
    params: {},
    filters: { q: '', cats: [], dur: '', nivel: [], obj: [], dietas: [], sort: 'rel' },
    ui: { menu: false, filtersOpen: false, wf: false, annot: false, shown: 6, accountTab: 'datos' },
    form: {},
    errors: {},
    attempts: 0,
    onb: null,
    undo: null
  };

  function saveUsers() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({ version: 1, users: state.users }));
    } catch (e) { /* almacenamiento no disponible */ }
  }
  function loadUsers() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (data && data.users) state.users = data.users;
      }
    } catch (e) { state.users = {}; }
    if (!Object.keys(state.users).length) seedDemo();
  }
  function seedDemo() {
    const demo = {
      nombre: 'Daniela Ríos',
      rol: 'usuario',
      consent: true,
      perfil: { obj: ['sueno', 'estres'], actividad: 'moderado', sueno: 6, dietas: [], intereses: ['de', 'bi', 'ac'] },
      favs: ['d1', 'c2', 'b1', 'a1'],
      habitos: [
        { id: 'c2', freq: 'Diario', days: [1, 1, 0, 1, 1, 1, 0] },
        { id: 'd1', freq: 'Diario', days: [1, 1, 1, 1, 1, 1, 1] },
        { id: 'a2', freq: 'Diario', days: [0, 1, 1, 0, 1, 1, 0] },
        { id: 'b1', freq: 'Diario', days: [1, 0, 1, 1, 0, 1, 0] }
      ],
      prefs: { personalizar: true, recordatorios: true },
      createdAt: '2026-10-01'
    };
    demo.salt = randomSalt();
    demo.passHash = hashPass('Demo2026*', demo.salt);
    demo.habitos.forEach((h) => { h.lastShift = todayISO(); });
    state.users['daniela@correo.com'] = demo;
    saveUsers();
  }

  function saveSession() {
    try {
      localStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(SESSION_KEY);
      if (state.session) {
        (state.remember ? localStorage : sessionStorage).setItem(SESSION_KEY, state.session);
      }
    } catch (e) { /* sin persistencia */ }
  }
  function loadSession() {
    let email = null;
    let remembered = false;
    try {
      email = localStorage.getItem(SESSION_KEY);
      remembered = !!email;
      if (!email) email = sessionStorage.getItem(SESSION_KEY);
    } catch (e) { email = null; }
    if (email && state.users[email]) {
      state.session = email;
      state.remember = remembered;
    }
  }

  function rollHabits(user) {
    if (!user || !Array.isArray(user.habitos)) return;
    const today = todayISO();
    user.habitos.forEach((h) => {
      if (!Array.isArray(h.days)) h.days = [0, 0, 0, 0, 0, 0, 0];
      if (!h.lastShift) { h.lastShift = today; return; }
      if (h.lastShift !== today) {
        const diff = Math.min(7, Math.max(1, daysBetween(h.lastShift, today)));
        h.days = h.days.slice(diff).concat(Array(diff).fill(0)).slice(-7);
        h.lastShift = today;
      }
    });
  }

  const currentUser = () => (state.session ? state.users[state.session] || null : null);
  const save = () => { saveUsers(); if (state.session) saveSession(); };
  const published = () => RECS.filter((r) => r.estado === 'Publicado');
  const byId = (id) => RECS.find((r) => r.id === id);
  const isFav = (id) => { const u = currentUser(); return !!(u && u.favs.includes(id)); };
  const hasHabit = (id) => { const u = currentUser(); return !!(u && u.habitos.some((h) => h.id === id)); };

  /* ---------- 4. Router por hash ---------- */
  const VIEWS = {};
  const TITLES = {
    inicio: 'Inicio', explorar: 'Explorar', recomendacion: 'Recomendación',
    ingresar: 'Iniciar sesión', registro: 'Crear cuenta', recuperar: 'Recuperar contraseña',
    'para-ti': 'Para ti', favoritos: 'Favoritos', habitos: 'Mis hábitos', cuenta: 'Mi cuenta',
    'perfil-salud': 'Perfil de salud', privacidad: 'Privacidad', accesibilidad: 'Accesibilidad',
    cobertura: 'Guía de evaluación'
  };
  const PROTECTED = ['para-ti', 'favoritos', 'habitos', 'cuenta', 'perfil-salud'];

  function buildHash(route, params = {}) {
    let h = '#/' + route;
    if (params.id) h += '/' + encodeURIComponent(params.id);
    const q = new URLSearchParams();
    Object.keys(params).forEach((k) => {
      if (k !== 'id' && params[k] !== undefined && params[k] !== null && params[k] !== '') q.set(k, params[k]);
    });
    const qs = q.toString();
    return qs ? `${h}?${qs}` : h;
  }

  function parseHash() {
    const raw = (location.hash || '').replace(/^#\/?/, '');
    const [pathPart, queryPart] = raw.split('?');
    const segs = pathPart.split('/').filter(Boolean);
    const params = {};
    new URLSearchParams(queryPart || '').forEach((v, k) => { params[k] = v; });
    if (segs[1]) params.id = decodeURIComponent(segs[1]);
    let route = segs[0] || 'inicio';
    if (!VIEWS[route]) route = 'inicio';
    return { route, params };
  }

  function applyExploreParams(p) {
    if (!p.cat && !p.q && !p.diet && !p.obj) return;
    state.filters = {
      q: p.q || '',
      cats: p.cat ? [p.cat] : [],
      dur: '',
      nivel: [],
      obj: p.obj ? [p.obj] : [],
      dietas: p.diet ? [p.diet] : [],
      sort: 'rel'
    };
  }

  function onRoute() {
    let { route, params } = parseHash();
    if (PROTECTED.includes(route) && !currentUser()) {
      const next = buildHash(route, params).slice(1);
      history.replaceState(null, '', `#/ingresar?next=${encodeURIComponent(next)}`);
      route = 'ingresar';
      params = { next };
    }
    if (route === 'explorar') applyExploreParams(params);
    if (route === 'cuenta' && params.tab) state.ui.accountTab = params.tab;
    state.route = route;
    state.params = params;
    state.errors = {};
    state.form = {};
    render(true);
  }

  function go(route, params = {}, opts = {}) {
    const h = buildHash(route, params);
    state.ui.menu = false;
    state.ui.filtersOpen = false;
    document.body.classList.remove('filters-open');
    if (location.hash === h) { onRoute(); return; }
    if (opts.replace) { history.replaceState(null, '', h); onRoute(); }
    else location.hash = h;
  }

  function navigateToPath(path) {
    if (!path) return false;
    const clean = decodeURIComponent(path).replace(/^#?\/?/, '');
    const [p, q] = clean.split('?');
    const segs = p.split('/').filter(Boolean);
    const route = segs[0];
    if (!VIEWS[route]) return false;
    const params = {};
    new URLSearchParams(q || '').forEach((v, k) => { params[k] = v; });
    if (segs[1]) params.id = segs[1];
    go(route, params);
    return true;
  }

  /* ---------- 5. Armazón: header, tabbar, footer, wireframe ---------- */
  function renderHeader() {
    const u = currentUser();
    const nav = [
      ['inicio', 'Inicio', 'home'], ['explorar', 'Explorar', 'search'],
      ['para-ti', 'Para ti', 'sparkle'], ['habitos', 'Hábitos', 'chart'],
      ['favoritos', 'Favoritos', 'heart']
    ];
    const on = (k) => (state.route === k || (k === 'explorar' && state.route === 'recomendacion') ? 'on' : '');
    document.getElementById('top').innerHTML = `<div class="wrap">
      <button class="brand" data-go="inicio" aria-label="Equilibra, ir al inicio">${LOGO}<span>Equilibra</span></button>
      <nav class="nav" aria-label="Navegación principal">
        ${nav.map(([k, t, i]) => `<button class="${on(k)}" data-go="${k}" ${on(k) ? 'aria-current="page"' : ''}>${ic(i)}${t}</button>`).join('')}
      </nav>
      <div class="top-actions">
        <button class="icon-btn" data-act="wf" aria-pressed="${state.ui.wf}" aria-label="${state.ui.wf ? 'Ver el mockup a color' : 'Ver la vista de wireframe'}" title="${state.ui.wf ? 'Volver al mockup' : 'Modo wireframe'}">${ic(state.ui.wf ? 'eye' : 'grid')}</button>
        ${u ? `<div style="position:relative">
          <button class="avatar" id="avatarBtn" data-act="menu" aria-haspopup="true" aria-expanded="${state.ui.menu}" aria-label="${initials(u.nombre)} · Menú de ${esc(u.nombre)}">${initials(u.nombre)}</button>
          ${state.ui.menu ? `<div class="menu" role="menu">
            <div class="who"><b>${esc(u.nombre)}</b><small>${esc(state.session)}</small></div>
            <button data-go="cuenta" role="menuitem">${ic('user')}Mi cuenta</button>
            <button data-go="perfil-salud" role="menuitem">${ic('target')}Perfil de salud</button>
            <button data-go="favoritos" role="menuitem">${ic('heart')}Mis favoritos</button>
            <button data-act="logout" role="menuitem">${ic('logout')}Cerrar sesión</button>
          </div>` : ''}
        </div>` : `<button class="btn btn-ghost btn-sm hide-m" data-go="ingresar">Iniciar sesión</button><button class="btn btn-primary btn-sm" data-go="registro">Crear cuenta</button>`}
      </div>
    </div>`;
  }

  function renderTabbar() {
    const u = currentUser();
    const tabs = [
      ['inicio', 'Inicio', 'home'], ['explorar', 'Explorar', 'search'],
      ['para-ti', 'Para ti', 'sparkle'], ['habitos', 'Hábitos', 'chart'],
      [u ? 'favoritos' : 'ingresar', u ? 'Favoritos' : 'Ingresar', u ? 'heart' : 'user']
    ];
    const on = (k) => (state.route === k ? 'on' : '');
    document.getElementById('tabbar').innerHTML = tabs.map(([k, t, i]) =>
      `<button class="${on(k)}" data-go="${k}" ${on(k) ? 'aria-current="page"' : ''}>${ic(i)}<span>${t}</span></button>`
    ).join('');
  }

  function renderFooter() {
    document.getElementById('foot').innerHTML = `<div class="wrap">
      <div class="foot-brand">${LOGO}<div><b>Equilibra</b><p class="muted">Información general de bienestar. No reemplaza la consulta con un profesional de la salud.</p></div></div>
      <div class="links">
        <button data-go="privacidad">Privacidad</button>
        <button data-go="accesibilidad">Accesibilidad</button>
        <button data-go="cobertura">Guía de evaluación</button>
        <button data-act="reset">Restablecer demo</button>
      </div>
      <p class="muted foot-legal">© 2026 Equilibra · Prototipo académico · ACA Ingeniería Web · CUN</p>
    </div>`;
  }

  function renderWfBar() {
    let bar = document.getElementById('wfbar');
    if (!state.ui.wf) { if (bar) bar.remove(); return; }
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'wfbar';
      bar.className = 'wf-bar';
      document.body.appendChild(bar);
    }
    bar.innerHTML = `<span>Wireframe</span><span class="sep"></span>
      <button data-act="annot" aria-pressed="${state.ui.annot}">${state.ui.annot ? 'Ocultar anotaciones' : 'Ver anotaciones'}</button>
      <span class="sep"></span><button data-act="wf">Volver al mockup</button>`;
  }

  function render(focus) {
    renderHeader();
    renderTabbar();
    const app = document.getElementById('contenido');
    const view = VIEWS[state.route] || VIEWS.inicio;
    app.innerHTML = view();
    renderFooter();
    renderWfBar();
    document.title = TITLES[state.route] ? `${TITLES[state.route]} · Equilibra` : 'Equilibra · Recomendaciones saludables';
    if (focus) {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      if (!document.body.classList.contains('cap')) {
        const h1 = app.querySelector('h1') || app;
        h1.setAttribute('tabindex', '-1');
        h1.focus({ preventScroll: true });
      }
    }
  }

  /* ---------- 6. Modal y avisos ---------- */
  let modalLastFocus = null;
  function openModal(html) {
    modalLastFocus = document.activeElement;
    document.getElementById('layer').innerHTML = `<div class="scrim" data-act="closemodal">
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" tabindex="-1">${html}</div>
    </div>`;
    const modal = $('.modal');
    const first = modal.querySelector('button, [href], input, select, textarea');
    (first || modal).focus();
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    const layer = document.getElementById('layer');
    if (!layer.innerHTML) return;
    layer.innerHTML = '';
    document.body.style.overflow = '';
    if (modalLastFocus && document.contains(modalLastFocus)) modalLastFocus.focus();
  }

  let toastTimer;
  function toast(msg, undo) {
    clearTimeout(toastTimer);
    let el = $('.toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'toast';
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      document.body.appendChild(el);
    }
    el.innerHTML = `${ic('check')}<span>${esc(msg)}</span>${undo ? '<button type="button" data-act="undo">Deshacer</button>' : ''}`;
    state.undo = undo || null;
    toastTimer = setTimeout(() => { el.remove(); state.undo = null; }, 4200);
  }

  /* ---------- 7. Búsqueda y personalización ---------- */
  function filtered() {
    const f = state.filters;
    const q = norm(f.q).trim();
    const list = published().filter((r) => {
      if (f.cats.length && !f.cats.includes(r.cat)) return false;
      if (f.dur === 'corto' && r.dur > 10) return false;
      if (f.dur === 'medio' && (r.dur <= 10 || r.dur > 20)) return false;
      if (f.dur === 'largo' && r.dur <= 20) return false;
      if (f.nivel.length && !f.nivel.includes(r.nivel)) return false;
      if (f.obj.length && !f.obj.some((o) => r.obj.includes(o))) return false;
      if (f.dietas.length && (r.cat !== 'al' || !f.dietas.every((d) => r.dietas.includes(d)))) return false;
      if (q) {
        const hay = norm([
          r.titulo, r.resumen, r.porque, CATS[r.cat].nombre, r.nivel, r.fuente,
          r.obj.map((o) => OBJ[o]).join(' '), r.pasos.join(' ')
        ].join(' '));
        return q.split(/\s+/).every((w) => hay.includes(w));
      }
      return true;
    });
    if (f.sort === 'new') list.sort((a, b) => b.fecha.localeCompare(a.fecha));
    else if (f.sort === 'short') list.sort((a, b) => a.dur - b.dur);
    else if (q) list.sort((a, b) => (norm(b.titulo).includes(q) ? 1 : 0) - (norm(a.titulo).includes(q) ? 1 : 0));
    return list;
  }

  function personal() {
    const u = currentUser();
    if (!u || !u.perfil) return published().map((r) => ({ r, reason: '', score: 0 }));
    const p = u.perfil;
    const levels = { sedentario: ['Básico'], moderado: ['Básico', 'Intermedio'], activo: NIVELES }[p.actividad] || NIVELES;
    return published()
      .filter((r) => !(r.cat === 'al' && p.dietas.length && !p.dietas.every((d) => r.dietas.includes(d))))
      .filter((r) => levels.includes(r.nivel))
      .map((r) => {
        const goals = r.obj.filter((o) => p.obj.includes(o));
        let score = goals.length * 3 + (p.intereses.includes(r.cat) ? 1 : 0);
        if (p.sueno < 7 && r.obj.includes('sueno')) score += 1;
        const reason = goals.length
          ? `Porque quieres ${OBJ[goals[0]].toLowerCase()}`
          : (p.intereses.includes(r.cat) ? `Te interesa ${CATS[r.cat].nombre.toLowerCase()}` : 'Para variar tu rutina');
        return { r, reason, score };
      })
      .sort((a, b) => b.score - a.score || a.r.dur - b.r.dur);
  }

  /* ---------- 8. API interna ---------- */
  window.EQ = {
    CATS, OBJ, OBJ_IC, DIETAS, NIVELES, REV, RECS, illus, ic,
    $, $$, esc, norm, todayISO, fmtDate, daysBetween, initials, LOGO,
    sha256, hashPass, randomSalt,
    STORE_KEY, SESSION_KEY, WF_KEY,
    state, currentUser, save, saveUsers, loadUsers, saveSession, loadSession, rollHabits,
    published, byId, isFav, hasHabit,
    VIEWS, TITLES, PROTECTED, buildHash, parseHash, onRoute, go, navigateToPath,
    render, renderHeader, renderTabbar, renderFooter, renderWfBar,
    openModal, closeModal, toast, filtered, personal
  };
})();
