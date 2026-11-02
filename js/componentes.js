/* ============================================================
   Equilibra · Componentes reutilizables
   Tarjetas, estados vacíos y ayudas de formulario.
   ============================================================ */
(function () {
  'use strict';
  const EQ = window.EQ;
  const { CATS, OBJ, ic, illus, esc, state, isFav } = EQ;

  function card(r, opts = {}) {
    const c = CATS[r.cat];
    const f = isFav(r.id);
    return `<article class="card rec">
      <button class="media" data-go="recomendacion" data-id="${r.id}" aria-label="${esc(c.nombre)}: ver ${esc(r.titulo)}">
        ${illus(r.img, r.cat)}
        <span class="pill pill-${r.cat} on-media">${ic(c.icon)}${c.nombre}</span>
      </button>
      <button class="fav-btn ${f ? 'on' : ''}" data-fav="${r.id}" aria-pressed="${f}" aria-label="${f ? 'Quitar de favoritos' : 'Guardar en favoritos'}: ${esc(r.titulo)}">${ic('heart', f ? 'fill' : '')}</button>
      <div class="card-body">
        ${opts.reason ? `<p class="reason">${ic('sparkle')}${esc(opts.reason)}</p>` : ''}
        <h3><a href="#/recomendacion/${r.id}" data-go="recomendacion" data-id="${r.id}">${esc(r.titulo)}</a></h3>
        <p class="sum">${esc(r.resumen)}</p>
        <p class="meta">${ic('clock')}${r.dur} min <span aria-hidden="true">·</span> ${ic('level')}${r.nivel} <span aria-hidden="true">·</span> ${ic('shield')}Revisado</p>
      </div>
    </article>`;
  }

  function emptyState(icon, title, text, action) {
    return `<div class="empty">${ic(icon)}<h3>${esc(title)}</h3><p class="muted">${esc(text)}</p>${action || ''}</div>`;
  }

  function fieldError(key) {
    return state.errors[key]
      ? `<p class="err" id="e-${key}">${ic('info')}${esc(state.errors[key])}</p>`
      : '';
  }
  function inputClass(key) {
    return `input${state.errors[key] ? ' bad' : ''}`;
  }
  function ariaInvalid(key) {
    return state.errors[key] ? `aria-invalid="true" aria-describedby="e-${key}"` : '';
  }
  function errorSummary() {
    const keys = Object.keys(state.errors);
    if (!keys.length) return '';
    return `<div class="form-error-summary" id="error-summary" role="alert" tabindex="-1">
      <b>Revisa ${keys.length === 1 ? 'este campo' : `estos ${keys.length} campos`}:</b>
      <ul>${keys.map((k) => `<li>${esc(state.errors[k])}</li>`).join('')}</ul>
    </div>`;
  }

  function pwScore(p) {
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
    if (/\d/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  }
  function reqsHTML(p) {
    return [
      ['8 caracteres o más', p.length >= 8],
      ['Mayúscula y minúscula', /[A-Z]/.test(p) && /[a-z]/.test(p)],
      ['Al menos un número', /\d/.test(p)],
      ['Un símbolo (! * # …)', /[^A-Za-z0-9]/.test(p)]
    ].map(([t, ok]) => `<li class="${ok ? 'ok' : ''}">${t}</li>`).join('');
  }

  function activeFiltersHTML() {
    const f = state.filters;
    const items = [
      ...f.cats.map((c) => ['cats', c, CATS[c].nombre]),
      ...(f.dur ? [['dur', f.dur, { corto: 'Hasta 10 min', medio: '11 a 20 min', largo: 'Más de 20 min' }[f.dur]]] : []),
      ...f.nivel.map((n) => ['nivel', n, n]),
      ...f.obj.map((o) => ['obj', o, OBJ[o]]),
      ...f.dietas.map((d) => ['dietas', d, { veg: 'Vegetariana', lac: 'Sin lactosa', glu: 'Sin gluten' }[d]])
    ];
    if (!items.length) return '';
    return `<div class="active-f" id="active-filters">
      ${items.map(([k, v, t]) => `<button class="chip on" data-rmf="${k}" data-v="${esc(v)}" aria-label="Quitar filtro ${esc(t)}">${esc(t)} ${ic('x')}</button>`).join('')}
      <button class="linkbtn" data-act="clearf">Limpiar todo</button>
    </div>`;
  }

  function trustStrip() {
    return `<div class="trust">
      <span>${ic('al')}<b>Nutrición</b> · nutricionista</span>
      <span>${ic('ac')}<b>Movimiento</b> · ciencias del deporte</span>
      <span>${ic('de')}<b>Descanso</b> · médico general</span>
      <span>${ic('bi')}<b>Bienestar</b> · psicología</span>
      <span style="margin-left:auto">${ic('shield')}18 recomendaciones revisadas</span>
    </div>`;
  }

  Object.assign(EQ, { card, emptyState, fieldError, inputClass, ariaInvalid, errorSummary, pwScore, reqsHTML, activeFiltersHTML, trustStrip });
})();
