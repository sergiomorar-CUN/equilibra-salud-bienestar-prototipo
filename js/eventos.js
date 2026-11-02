/* ============================================================
   Equilibra · Eventos e interacciones
   Delegación de eventos, formularios y acciones de estado.
   ============================================================ */
(function () {
  'use strict';
  const EQ = window.EQ;
  const {
    CATS, OBJ, state, currentUser, save, saveUsers, saveSession, rollHabits,
    byId, isFav, hasHabit, ic, esc, todayISO, go, render, renderHeader, renderWfBar,
    openModal, closeModal, toast, refreshResults, pwScore, randomSalt, hashPass,
    STORE_KEY, SESSION_KEY, WF_KEY, navigateToPath, $, $$
  } = EQ;

  let debounce;

  /* ---------- Favoritos ---------- */
  function syncFav(id) {
    const on = isFav(id);
    $$(`[data-fav="${id}"]`).forEach((b) => {
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', String(on));
      b.setAttribute('aria-label', `${on ? 'Quitar de favoritos' : 'Guardar en favoritos'}`);
      if (b.classList.contains('btn')) {
        b.className = `btn ${on ? 'btn-soft' : 'btn-primary'} btn-block`;
        b.innerHTML = `${ic('heart', on ? 'fill' : '')}${on ? 'Guardada en favoritos' : 'Guardar en favoritos'}`;
      } else {
        b.innerHTML = ic('heart', on ? 'fill' : '');
      }
    });
  }

  function toggleFav(id) {
    const u = currentUser();
    if (!u) { needLogin('guardar favoritos'); return; }
    const i = u.favs.indexOf(id);
    if (i >= 0) {
      u.favs.splice(i, 1);
      save();
      syncFav(id);
      if (state.route === 'favoritos') render(false);
      toast('Quitada de favoritos', () => {
        if (!u.favs.includes(id)) u.favs.splice(i, 0, id);
        save();
        syncFav(id);
        if (state.route === 'favoritos') render(false);
      });
    } else {
      u.favs.push(id);
      save();
      syncFav(id);
      toast('Guardada en favoritos');
    }
  }

  /* ---------- Hábitos ---------- */
  function syncHabit(id) {
    const on = hasHabit(id);
    $$(`[data-habit="${id}"]`).forEach((b) => {
      b.setAttribute('aria-pressed', String(on));
      b.innerHTML = `${ic(on ? 'check' : 'plus')}${on ? 'En tus hábitos' : 'Agregar a mis hábitos'}`;
    });
  }

  function addHabit(id) {
    const u = currentUser();
    if (!u) { needLogin('seguir tus hábitos'); return; }
    if (hasHabit(id)) { go('habitos'); return; }
    u.habitos.push({ id, freq: 'Diario', days: [0, 0, 0, 0, 0, 0, 0], lastShift: todayISO() });
    save();
    syncHabit(id);
    if (state.route === 'habitos') render(false);
    toast('Agregada a tus hábitos diarios');
  }

  function toggleTick(id) {
    const u = currentUser();
    const h = u && u.habitos.find((x) => x.id === id);
    if (!h) return;
    h.days[6] = h.days[6] ? 0 : 1;
    h.lastShift = todayISO();
    save();
    render(false);
    const btn = $(`[data-tick="${id}"]`);
    if (btn) btn.focus();
    toast(h.days[6] ? '¡Bien! Hábito cumplido hoy' : 'Hábito desmarcado');
  }

  /* ---------- Utilidades de UI ---------- */
  function needLogin(action) {
    openModal(`<h3 id="modal-title">Inicia sesión para ${esc(action)}</h3>
      <p class="muted">Con una cuenta gratuita puedes guardar favoritos y seguir tus hábitos.</p>
      <div class="btns"><button class="btn btn-ghost" data-act="closemodal">Cancelar</button><button class="btn btn-ghost" data-go="registro">Crear cuenta</button><button class="btn btn-primary" data-go="ingresar">Iniciar sesión</button></div>`);
  }

  function openFilters() {
    state.ui.filtersOpen = true;
    document.body.classList.add('filters-open');
    const aside = $('.filters');
    if (aside) {
      aside.classList.add('open');
      const first = aside.querySelector('input');
      if (first) first.focus();
    }
  }
  function closeFilters() {
    state.ui.filtersOpen = false;
    document.body.classList.remove('filters-open');
    const aside = $('.filters');
    if (aside) aside.classList.remove('open');
  }

  function focusAfterRender() {
    const bad = $('.input.bad');
    if (bad) { bad.focus(); return; }
    const summary = $('#error-summary');
    if (summary) summary.focus();
  }

  /* ---------- Clic ---------- */
  document.addEventListener('click', (ev) => {
    const t = ev.target;

    if (t.classList && t.classList.contains('scrim')) { closeModal(); return; }

    const demo = t.closest('[data-demo]');
    if (demo) {
      const [c, p] = demo.dataset.demo.split('|');
      const correo = $('#lCorreo');
      const pass = $('#lPass');
      if (correo && pass) { correo.value = c; pass.value = p; pass.focus(); }
      return;
    }

    const g = t.closest('[data-go]');
    if (g) {
      ev.preventDefault();
      if ($('.modal')) closeModal();
      const p = {};
      if (g.dataset.id) p.id = g.dataset.id;
      if (g.dataset.cat) p.cat = g.dataset.cat;
      if (g.dataset.q !== undefined) p.q = g.dataset.q;
      if (g.dataset.tab) p.tab = g.dataset.tab;
      if (g.dataset.go === 'perfil-salud') { state.onb = null; state.errors = {}; }
      if (g.dataset.go === 'cuenta' && g.dataset.tab) state.ui.accountTab = g.dataset.tab;
      go(g.dataset.go, p);
      return;
    }

    const fav = t.closest('[data-fav]');
    if (fav) { toggleFav(fav.dataset.fav); return; }

    const habit = t.closest('[data-habit]');
    if (habit) { addHabit(habit.dataset.habit); return; }

    const tick = t.closest('[data-tick]');
    if (tick) { toggleTick(tick.dataset.tick); return; }

    const rmHabit = t.closest('[data-rmhabit]');
    if (rmHabit) {
      const id = rmHabit.dataset.rmhabit;
      openModal(`<h3 id="modal-title">¿Dejar de seguir este hábito?</h3><p class="muted">Se borrará su registro de los últimos siete días. La recomendación seguirá disponible.</p><div class="btns"><button class="btn btn-ghost" data-act="closemodal">Cancelar</button><button class="btn btn-danger" data-confirm-rmhabit="${id}">Dejar de seguir</button></div>`);
      return;
    }
    const confirmRm = t.closest('[data-confirm-rmhabit]');
    if (confirmRm) {
      const u = currentUser();
      u.habitos = u.habitos.filter((h) => h.id !== confirmRm.dataset.confirmRmhabit);
      save(); closeModal(); render(false); toast('Hábito eliminado');
      return;
    }

    const rmf = t.closest('[data-rmf]');
    if (rmf) {
      const k = rmf.dataset.rmf;
      const v = rmf.dataset.v;
      if (k === 'dur') state.filters.dur = '';
      else state.filters[k] = state.filters[k].filter((x) => x !== v);
      state.ui.shown = 6;
      refreshResults();
      return;
    }

    const onb = t.closest('[data-onb]');
    if (onb) {
      const k = onb.dataset.onb;
      const v = onb.dataset.v;
      const d = state.onb.data;
      if (k === 'actividad') d.actividad = v;
      else {
        const a = d[k];
        const i = a.indexOf(v);
        if (i >= 0) a.splice(i, 1); else a.push(v);
      }
      state.errors = {};
      render(false);
      const again = document.querySelector(`[data-onb="${k}"][data-v="${v}"]`);
      if (again) again.focus();
      return;
    }

    const a = t.closest('[data-act]');
    if (!a) {
      if (state.ui.menu && !t.closest('.menu') && !t.closest('[data-act="menu"]')) {
        state.ui.menu = false;
        renderHeader();
      }
      return;
    }
    const act = a.dataset.act;

    if (act === 'closemodal') { closeModal(); return; }

    if (act === 'menu') {
      state.ui.menu = !state.ui.menu;
      renderHeader();
      const b = $('#avatarBtn');
      if (b) b.focus();
      return;
    }

    if (act === 'wf') {
      state.ui.wf = !state.ui.wf;
      document.body.classList.toggle('wf', state.ui.wf);
      try { localStorage.setItem(WF_KEY, state.ui.wf ? '1' : '0'); } catch (e) { /* sin persistencia */ }
      renderHeader();
      renderWfBar();
      const b = $('[data-act="wf"]');
      if (b) b.focus();
      toast(state.ui.wf ? 'Vista wireframe activada' : 'Vista mockup activada');
      return;
    }

    if (act === 'annot') {
      state.ui.annot = !state.ui.annot;
      document.body.classList.toggle('annot-on', state.ui.annot);
      renderWfBar();
      const b = $('[data-act="annot"]');
      if (b) b.focus();
      return;
    }

    if (act === 'logout') {
      state.session = null;
      state.ui.menu = false;
      saveSession();
      go('inicio');
      toast('Cerraste sesión');
      return;
    }

    if (act === 'reset') {
      openModal(`<h3 id="modal-title">¿Restablecer la demo?</h3><p class="muted">Se borrarán las cuentas, favoritos y hábitos guardados en este navegador. La cuenta demo volverá a su estado inicial.</p><div class="btns"><button class="btn btn-ghost" data-act="closemodal">Cancelar</button><button class="btn btn-danger" data-act="resetok">Restablecer</button></div>`);
      return;
    }
    if (act === 'resetok') {
      try {
        localStorage.removeItem(STORE_KEY);
        localStorage.removeItem(SESSION_KEY);
        localStorage.removeItem(WF_KEY);
        sessionStorage.removeItem(SESSION_KEY);
      } catch (e) { /* sin persistencia */ }
      location.hash = '#/inicio';
      location.reload();
      return;
    }

    if (act === 'more') { state.ui.shown += 6; refreshResults(); return; }

    if (act === 'clearf') {
      state.filters = { q: state.filters.q, cats: [], dur: '', nivel: [], obj: [], dietas: [], sort: state.filters.sort };
      state.ui.shown = 6;
      refreshResults();
      return;
    }
    if (act === 'clearq') {
      state.filters.q = '';
      const q = $('#q');
      if (q) q.value = '';
      refreshResults();
      if (q) q.focus();
      return;
    }
    if (act === 'openf') { openFilters(); return; }
    if (act === 'closef') { closeFilters(); return; }

    if (act === 'showpw') {
      const inp = a.parentElement.querySelector('input');
      if (!inp) return;
      const show = inp.type === 'password';
      inp.type = show ? 'text' : 'password';
      a.innerHTML = ic(show ? 'eyeoff' : 'eye');
      a.setAttribute('aria-label', show ? 'Ocultar contraseña' : 'Mostrar contraseña');
      return;
    }

    if (act === 'onbprev') {
      state.onb.step--;
      state.errors = {};
      render(false);
      const h = $('.onb h2');
      if (h) { h.setAttribute('tabindex', '-1'); h.focus(); }
      return;
    }
    if (act === 'onbnext') {
      const o = state.onb;
      state.errors = {};
      if (o.step === 1 && !o.data.obj.length) {
        state.errors.obj = 'Elige al menos un objetivo para continuar.';
        render(false);
        const h = $('.onb h2');
        if (h) { h.setAttribute('tabindex', '-1'); h.focus(); }
        return;
      }
      if (o.step === 2 && !o.data.actividad) {
        state.errors.actividad = 'Elige tu nivel de actividad.';
        render(false);
        const h = $('.onb h2');
        if (h) { h.setAttribute('tabindex', '-1'); h.focus(); }
        return;
      }
      if (o.step < 3) {
        o.step++;
        render(false);
        const h = $('.onb h2');
        if (h) { h.setAttribute('tabindex', '-1'); h.focus(); }
        return;
      }
      const u = currentUser();
      u.perfil = o.data;
      u.consent = true;
      u.prefs.personalizar = true;
      state.onb = null;
      save();
      go('para-ti');
      toast('Perfil de salud guardado');
      return;
    }

    if (act === 'consent') {
      const cb = $('#cAut');
      if (!cb || !cb.checked) { toast('Marca la casilla para continuar'); return; }
      const u = currentUser();
      u.consent = true;
      u.prefs.personalizar = true;
      save();
      state.onb = null;
      render(false);
      toast('Autorización registrada');
      return;
    }

    if (act === 'export') {
      const u = currentUser();
      const data = {
        nombre: u.nombre,
        correo: state.session,
        perfil: u.perfil,
        favoritos: u.favs,
        habitos: u.habitos,
        preferencias: u.prefs,
        creado: u.createdAt
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'equilibra-mis-datos.json';
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast('Descarga generada');
      return;
    }

    if (act === 'pwchange') {
      openModal(`<h3 id="modal-title">Cambiar contraseña</h3>
        <div class="field"><label for="m1">Contraseña actual</label><input class="input" type="password" id="m1" autocomplete="current-password"></div>
        <div class="field"><label for="m2">Nueva contraseña</label><input class="input" type="password" id="m2" autocomplete="new-password"></div>
        <div class="field"><label for="m3">Confirma la nueva contraseña</label><input class="input" type="password" id="m3" autocomplete="new-password"></div>
        <div class="btns"><button class="btn btn-ghost" data-act="closemodal">Cancelar</button><button class="btn btn-primary" data-act="pwsave">Guardar</button></div>`);
      return;
    }
    if (act === 'pwsave') {
      const u = currentUser();
      const cur = $('#m1').value;
      const n1 = $('#m2').value;
      const n2 = $('#m3').value;
      if (u.passHash !== hashPass(cur, u.salt)) { toast('La contraseña actual no es correcta'); return; }
      if (pwScore(n1) < 4) { toast('La nueva contraseña debe cumplir los cuatro requisitos'); return; }
      if (n1 !== n2) { toast('Las contraseñas no coinciden'); return; }
      u.salt = randomSalt();
      u.passHash = hashPass(n1, u.salt);
      save();
      closeModal();
      toast('Contraseña actualizada');
      return;
    }

    if (act === 'delprofile') {
      openModal(`<h3 id="modal-title">¿Borrar tu perfil de salud?</h3><p class="muted">Borraremos tus objetivos, nivel de actividad, horas de sueño y restricciones. Verás recomendaciones generales.</p><div class="btns"><button class="btn btn-ghost" data-act="closemodal">Cancelar</button><button class="btn btn-danger" data-act="delprofileok">Borrar perfil</button></div>`);
      return;
    }
    if (act === 'delprofileok') {
      const u = currentUser();
      u.perfil = null;
      u.consent = false;
      u.prefs.personalizar = false;
      save();
      closeModal();
      render(false);
      toast('Perfil de salud borrado');
      return;
    }

    if (act === 'delaccount') {
      openModal(`<h3 id="modal-title">¿Eliminar tu cuenta?</h3><p class="muted">Se borrarán tu perfil, favoritos y hábitos de forma permanente. Escribe <b>ELIMINAR</b> para confirmar.</p><input class="input" id="delc" aria-label="Escribe ELIMINAR para confirmar"><div class="btns"><button class="btn btn-ghost" data-act="closemodal">Cancelar</button><button class="btn btn-danger" data-act="delaccountok">Eliminar cuenta</button></div>`);
      return;
    }
    if (act === 'delaccountok') {
      const input = $('#delc');
      if (!input || input.value.trim() !== 'ELIMINAR') { toast('Escribe ELIMINAR para confirmar'); return; }
      delete state.users[state.session];
      state.session = null;
      saveSession();
      saveUsers();
      closeModal();
      go('inicio');
      toast('Tu cuenta fue eliminada');
      return;
    }

    if (act === 'undo' && state.undo) {
      state.undo();
      state.undo = null;
      const el = $('.toast');
      if (el) el.remove();
    }
  });

  /* ---------- Cambios en controles ---------- */
  document.addEventListener('change', (ev) => {
    const t = ev.target;
    if (t.dataset && t.dataset.filter) {
      const k = t.dataset.filter;
      if (k === 'sort') state.filters.sort = t.value;
      else if (k === 'dur') state.filters.dur = t.value;
      else {
        const arr = state.filters[k];
        const i = arr.indexOf(t.value);
        if (t.checked && i < 0) arr.push(t.value);
        if (!t.checked && i >= 0) arr.splice(i, 1);
      }
      state.ui.shown = 6;
      refreshResults();
      return;
    }
    if (t.dataset && t.dataset.pref) {
      const u = currentUser();
      u.prefs[t.dataset.pref] = t.checked;
      save();
      toast(t.dataset.pref === 'personalizar'
        ? (t.checked ? 'Personalización activada' : 'Verás recomendaciones generales')
        : 'Preferencia guardada');
      return;
    }
    if (t.id === 'lRec') state.remember = t.checked;
  });

  /* ---------- Entrada de texto ---------- */
  document.addEventListener('input', (ev) => {
    const t = ev.target;

    if (t.id === 'q') {
      state.filters.q = t.value;
      clearTimeout(debounce);
      debounce = setTimeout(() => { state.ui.shown = 6; refreshResults(); }, 260);
      return;
    }

    if (t.dataset && t.dataset.pw !== undefined) {
      const meter = $('.meter');
      const reqs = $('#reqs');
      if (meter) meter.dataset.l = pwScore(t.value);
      if (reqs) reqs.innerHTML = EQ.reqsHTML(t.value);
    }

    if (t.dataset && t.dataset.onbRange) {
      state.onb.data.sueno = Number(t.value);
      const label = $('#slpv');
      if (label) label.textContent = `${t.value} h`;
      return;
    }

    const field = t.closest && t.closest('.field');
    if (field) {
      field.querySelectorAll('.err').forEach((e) => e.remove());
      field.querySelectorAll('.bad').forEach((e) => {
        e.classList.remove('bad');
        e.removeAttribute('aria-invalid');
        e.removeAttribute('aria-describedby');
      });
      if (t.name) delete state.errors[t.name];
      delete state.errors.general;
      const summary = $('#error-summary');
      if (summary) summary.remove();
    }
  });

  /* ---------- Formularios ---------- */
  document.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const f = ev.target;
    const kind = f.dataset.form;
    const val = (n) => (f.elements[n] ? String(f.elements[n].value).trim() : '');

    if (kind === 'hero-search') {
      const q = val('q');
      state.filters = { q, cats: [], dur: '', nivel: [], obj: [], dietas: [], sort: 'rel' };
      go('explorar', { q });
      return;
    }

    if (kind === 'search') {
      state.filters.q = val('q');
      state.ui.shown = 6;
      refreshResults();
      return;
    }

    if (kind === 'registro') {
      const d = {
        nombre: val('nombre'),
        correo: val('correo'),
        pass: f.elements.pass.value,
        pass2: f.elements.pass2.value,
        terminos: f.elements.terminos.checked,
        salud: f.elements.salud.checked
      };
      const e = {};
      if (d.nombre.length < 3) e.nombre = 'Escribe tu nombre completo.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.correo)) e.correo = 'Escribe un correo válido, por ejemplo nombre@correo.com.';
      else if (state.users[d.correo.toLowerCase()]) e.correo = 'Ya existe una cuenta con este correo. Inicia sesión o recupera tu contraseña.';
      if (pwScore(d.pass) < 4) e.pass = 'La contraseña debe cumplir los cuatro requisitos.';
      if (d.pass !== d.pass2 || !d.pass2) e.pass2 = 'Las contraseñas no coinciden.';
      if (!d.terminos) e.terminos = 'Debes aceptar los términos y la política de privacidad.';
      state.form.registro = d;
      state.errors = e;
      if (Object.keys(e).length) { render(false); focusAfterRender(); return; }

      const email = d.correo.toLowerCase();
      const user = {
        nombre: d.nombre,
        consent: d.salud,
        perfil: null,
        favs: [],
        habitos: [],
        prefs: { personalizar: d.salud, recordatorios: true },
        createdAt: todayISO()
      };
      user.salt = randomSalt();
      user.passHash = hashPass(d.pass, user.salt);
      state.users[email] = user;
      state.session = email;
      state.remember = true;
      save();
      state.form = {};
      state.errors = {};
      if (d.salud) { go('perfil-salud'); toast('Cuenta creada. Ahora completa tu perfil.'); }
      else { go('inicio'); toast('Cuenta creada. ¡Bienvenido!'); }
      return;
    }

    if (kind === 'ingresar') {
      const email = val('correo').toLowerCase();
      const pass = f.elements.pass.value;
      const u = state.users[email];
      if (!u || u.passHash !== hashPass(pass, u.salt)) {
        state.attempts++;
        state.errors = {
          general: state.attempts >= 5
            ? 'Demasiados intentos fallidos. Por seguridad, espera 15 minutos o recupera tu contraseña.'
            : `Correo o contraseña incorrectos. Te quedan ${5 - state.attempts} intentos.`
        };
        state.form.ingresar = { correo: email, pass };
        render(false);
        focusAfterRender();
        return;
      }
      state.attempts = 0;
      state.session = email;
      const rec = document.getElementById('lRec');
      state.remember = rec ? rec.checked : true;
      rollHabits(u);
      saveSession();
      saveUsers();
      state.errors = {};
      state.form = {};
      const next = state.params.next;
      if (!navigateToPath(next)) go('inicio');
      toast(`Hola, ${u.nombre.split(' ')[0]}`);
      return;
    }

    if (kind === 'recuperar') { go('recuperar', { sent: 1 }); return; }

    if (kind === 'datos') {
      const u = currentUser();
      const nombre = val('nombre');
      if (nombre.length < 3) {
        state.errors = { nombre: 'Escribe un nombre de al menos 3 caracteres.' };
        render(false);
        focusAfterRender();
        return;
      }
      u.nombre = nombre;
      save();
      render(false);
      toast('Datos actualizados');
    }
  });

  /* ---------- Teclado ---------- */
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') {
      if ($('.modal')) { closeModal(); return; }
      if (state.ui.menu) { state.ui.menu = false; renderHeader(); return; }
      if (state.ui.filtersOpen) { closeFilters(); return; }
    }

    if (ev.key === 'Tab' && $('.modal')) {
      const modal = $('.modal');
      const focusables = $$('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])', modal)
        .filter((el) => !el.disabled && el.offsetParent !== null);
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (ev.shiftKey && document.activeElement === first) { ev.preventDefault(); last.focus(); }
      else if (!ev.shiftKey && document.activeElement === last) { ev.preventDefault(); first.focus(); }
    }

    const tag = (ev.target.tagName || '').toLowerCase();
    if (ev.key === '/' && !['input', 'textarea', 'select'].includes(tag) && !$('.modal')) {
      const search = $('#q') || $('#heroQ');
      if (search) { ev.preventDefault(); search.focus(); }
    }
  });

  window.addEventListener('hashchange', EQ.onRoute);
})();
