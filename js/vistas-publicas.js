/* ============================================================
   Equilibra · Vistas públicas
   Inicio, catálogo con búsqueda/filtros y detalle.
   ============================================================ */
(function () {
  'use strict';
  const EQ = window.EQ;
  const {
    CATS, OBJ, OBJ_IC, DIETAS, NIVELES, REV, state, currentUser, published, byId,
    ic, illus, esc, card, emptyState, filtered, personal, activeFiltersHTML, trustStrip,
    isFav, hasHabit, fmtDate, go
  } = EQ;
  const V = EQ.VIEWS;

  /* ---------- Inicio ---------- */
  V.inicio = () => {
    const u = currentUser();
    const personalized = !!(u && u.consent && u.perfil && u.prefs.personalizar);
    const featured = personalized
      ? personal().slice(0, 3).map((x) => card(x.r, { reason: x.reason })).join('')
      : ['a1', 'c1', 'd1'].map((id) => card(byId(id))).join('');
    const done = u ? u.habitos.filter((h) => h.days[6]).length : 0;
    const tot = u ? u.habitos.length : 0;
    const pct = tot ? Math.round((done / tot) * 100) : 0;

    return `
    <section class="hero">
      <div>
        <p class="eyebrow">${u ? `Hola, ${esc(u.nombre.split(' ')[0])}` : 'Recomendaciones de salud para el día a día'}</p>
        <h1 style="margin-top:8px">Pequeños hábitos, mejor salud</h1>
        <p class="lead">Encuentra recomendaciones de alimentación, actividad física, descanso y bienestar, revisadas por profesionales y ajustadas a tus objetivos.</p>
        <form class="searchbar" data-form="hero-search" role="search">
          ${ic('search')}
          <label class="sr" for="heroQ">Buscar recomendaciones</label>
          <input id="heroQ" name="q" placeholder="Busca: dormir, pausa activa, desayuno…" autocomplete="off">
          <button class="btn btn-primary" type="submit" aria-label="Buscar">${ic('search')}<span>Buscar</span></button>
        </form>
        <div class="chips" aria-label="Búsquedas frecuentes">
          ${['dormir mejor', 'pausa activa', 'desayuno', 'estrés'].map((t) => `<button class="chip" data-go="explorar" data-q="${t}">${t}</button>`).join('')}
        </div>
        <span class="annot">1 · Hero, buscador y accesos rápidos</span>
      </div>
      <div class="hero-art" aria-hidden="true">
        <div class="tile" style="left:9%;top:0;width:58%;aspect-ratio:16/11">${illus('plato', 'al')}</div>
        <div class="tile" style="right:0;top:22%;width:45%;aspect-ratio:1/1.05">${illus('camino', 'ac')}</div>
        <div class="tile" style="left:29%;bottom:0;width:41%;aspect-ratio:16/10">${illus('luna', 'de')}</div>
        <div class="today">
          ${u && tot ? `<b style="font-size:14px">Tus hábitos de hoy</b><div class="bar"><i style="width:${pct}%"></i></div><small class="muted">${done} de ${tot} completados</small>` : `<b style="font-size:14px">18 recomendaciones</b><small class="muted">Revisadas por nutricionista, médico, psicóloga y profesional del deporte</small>`}
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="hCats">
      <div class="section-head"><div><h2 id="hCats">Explora por categoría</h2><span class="annot">2 · Cuatro categorías de contenido</span></div></div>
      <div class="cats">
        ${Object.entries(CATS).map(([k, c]) => `<button class="cat" data-go="explorar" data-cat="${k}">
          <span class="badge" style="background:var(--cat-${k}-soft);color:var(--cat-${k})">${ic(c.icon)}</span>
          <b>${c.nombre}</b><small>${c.desc} · ${published().filter((r) => r.cat === k).length} recomendaciones</small>
        </button>`).join('')}
      </div>
    </section>

    ${u && !personalized ? `<div class="banner" style="margin-top:30px">
      <span style="display:flex;gap:11px;align-items:center">${ic('sparkle')}<span><b>Completa tu perfil de salud</b><br><span class="muted">Así podemos ordenar las recomendaciones según tus objetivos y restricciones.</span></span></span>
      <button class="btn btn-primary btn-sm" data-go="perfil-salud">Completar perfil</button>
    </div>` : ''}

    <section class="section" aria-labelledby="hFeat">
      <div class="section-head">
        <div>
          <h2 id="hFeat">${personalized ? 'Para ti esta semana' : 'Recomendaciones destacadas'}</h2>
          ${personalized ? `<p class="muted">Según tus objetivos: ${u.perfil.obj.map((o) => OBJ[o].toLowerCase()).join(' y ')}.</p>` : `<p class="muted">Una muestra del catálogo completo.</p>`}
          <span class="annot">3 · Grilla de tarjetas con favorito</span>
        </div>
        <button class="btn btn-ghost btn-sm" data-go="${personalized ? 'para-ti' : 'explorar'}">Ver todas ${ic('chev')}</button>
      </div>
      <div class="grid">${featured}</div>
    </section>

    ${u ? '' : `<section class="section" aria-labelledby="hHow">
      <div class="section-head"><div><h2 id="hHow">Cómo funciona</h2><span class="annot">4 · Flujo de registro y personalización</span></div></div>
      <div class="steps">
        <div class="step"><b class="n">1</b><h3>Crea tu cuenta</h3><p class="muted">Solo necesitas nombre, correo y una contraseña segura.</p></div>
        <div class="step"><b class="n">2</b><h3>Completa tu perfil</h3><p class="muted">Cuéntanos tus objetivos. Los datos de salud son opcionales y puedes borrarlos cuando quieras.</p></div>
        <div class="step"><b class="n">3</b><h3>Guarda y sigue tus hábitos</h3><p class="muted">Marca lo que cumples cada día y revisa tu avance semanal.</p></div>
      </div>
      <div><button class="btn btn-primary" data-go="registro">Crear cuenta gratis</button></div>
    </section>`}

    <section class="section" aria-labelledby="hTrust">
      <div class="section-head"><div><h2 id="hTrust">Contenido con respaldo profesional</h2><p class="muted">Cada recomendación indica su fuente y el perfil que la revisó.</p></div></div>
      ${trustStrip()}
    </section>`;
  };

  /* ---------- Explorar ---------- */
  function countHTML(res) {
    return `<b>${res.length}</b> ${res.length === 1 ? 'recomendación' : 'recomendaciones'}${state.filters.q ? ` para “${esc(state.filters.q)}”` : ''}`;
  }

  function resultsBodyHTML(res) {
    if (!res.length) {
      return `<div class="empty">${ic('search')}<h3>No encontramos resultados</h3>
        <p class="muted">Revisa la ortografía o quita algunos filtros. También puedes probar con:</p>
        <div class="chips">${['sueño', 'caminar', 'agua', 'respiración'].map((t) => `<button class="chip" data-go="explorar" data-q="${t}">${t}</button>`).join('')}</div>
        <button class="btn btn-ghost btn-sm" data-act="clearf">Quitar todos los filtros</button></div>`;
    }
    const shown = res.slice(0, state.ui.shown);
    return `<div class="grid">${shown.map((r) => card(r)).join('')}</div>
      ${res.length > shown.length ? `<div style="text-align:center;margin-top:28px"><button class="btn btn-ghost" data-act="more">Mostrar más (${res.length - shown.length})</button></div>` : ''}`;
  }

  function syncFilterInputs() {
    EQ.$$('[data-filter]').forEach((el) => {
      const k = el.dataset.filter;
      if (k === 'sort') el.value = state.filters.sort;
      else if (k === 'dur') el.checked = state.filters.dur === el.value;
      else if (['cats', 'nivel', 'obj', 'dietas'].includes(k)) el.checked = state.filters[k].includes(el.value);
    });
  }

  function refreshResults() {
    const body = document.getElementById('results-body');
    if (!body) return;
    const res = filtered();
    const count = document.getElementById('results-count');
    if (count) count.innerHTML = countHTML(res);
    const af = document.getElementById('active-filters');
    if (af) af.outerHTML = activeFiltersHTML() || '<div id="active-filters"></div>';
    body.innerHTML = resultsBodyHTML(res);
    syncFilterInputs();
  }

  V.explorar = () => {
    const f = state.filters;
    const res = filtered();
    const opt = (type, name, val, label, checked, extra = '') =>
      `<label class="opt"><input type="${type}" name="${name}" value="${esc(val)}" ${checked ? 'checked' : ''} data-filter="${name}">${label}${extra}</label>`;
    const cnt = (k) => published().filter((r) => r.cat === k).length;

    return `
    <div class="crumbs"><button data-go="inicio">Inicio</button>${ic('chev')}<span>Explorar</span></div>
    <h1 style="font-size:clamp(28px,3.4vw,38px)">Explorar recomendaciones</h1>
    <p class="muted" style="margin-top:6px">Busca por palabra clave o combina los filtros de categoría, duración, nivel y alimentación.</p>

    <form class="searchbar" data-form="search" role="search" style="max-width:none;margin:20px 0 24px">
      ${ic('search')}<label class="sr" for="q">Buscar</label>
      <input id="q" name="q" value="${esc(f.q)}" placeholder="Busca por tema, objetivo o palabra clave" autocomplete="off" data-live="q">
      ${f.q ? `<button type="button" class="iconbtn" data-act="clearq" aria-label="Borrar búsqueda">${ic('x')}</button>` : ''}
      <button class="btn btn-primary" type="submit" aria-label="Buscar">${ic('search')}<span>Buscar</span></button>
    </form>

    <div class="explore">
      <aside class="filters ${state.ui.filtersOpen ? 'open' : ''}" aria-label="Filtros de búsqueda">
        <div class="filters-head"><h2>Filtros</h2><button class="iconbtn" data-act="closef" aria-label="Cerrar filtros">${ic('x')}</button></div>
        <div><h3>Categoría</h3>${Object.entries(CATS).map(([k, c]) => opt('checkbox', 'cats', k, c.nombre, f.cats.includes(k), `<small>${cnt(k)}</small>`)).join('')}</div>
        <div><h3>Duración</h3>
          ${opt('radio', 'dur', '', 'Cualquiera', !f.dur)}
          ${opt('radio', 'dur', 'corto', 'Hasta 10 min', f.dur === 'corto')}
          ${opt('radio', 'dur', 'medio', '11 a 20 min', f.dur === 'medio')}
          ${opt('radio', 'dur', 'largo', 'Más de 20 min', f.dur === 'largo')}
        </div>
        <div><h3>Nivel de dificultad</h3>${NIVELES.map((n) => opt('checkbox', 'nivel', n, n, f.nivel.includes(n))).join('')}</div>
        <div><h3>Objetivo</h3>${Object.entries(OBJ).map(([k, t]) => opt('checkbox', 'obj', k, t, f.obj.includes(k))).join('')}</div>
        <div><h3>Alimentación apta para</h3>${Object.entries(DIETAS).map(([k, t]) => opt('checkbox', 'dietas', k, t, f.dietas.includes(k))).join('')}</div>
        <button class="btn btn-ghost btn-sm" data-act="clearf">Limpiar filtros</button>
        <button class="btn btn-primary filter-toggle" data-act="closef">Ver ${res.length} resultados</button>
        <span class="annot">1 · Panel de filtros combinables</span>
      </aside>

      <div style="min-width:0">
        <h2 class="sr">Resultados de la búsqueda</h2>
        <div class="results-head">
          <p id="results-count" role="status" aria-live="polite">${countHTML(res)}</p>
          <div style="display:flex;gap:9px;align-items:center">
            <button class="btn btn-ghost btn-sm filter-toggle" data-act="openf">${ic('sliders')}Filtros</button>
            <label class="sr" for="sort">Ordenar resultados</label>
            <select class="sel" id="sort" data-filter="sort">
              <option value="rel" ${f.sort === 'rel' ? 'selected' : ''}>Más relevantes</option>
              <option value="new" ${f.sort === 'new' ? 'selected' : ''}>Más recientes</option>
              <option value="short" ${f.sort === 'short' ? 'selected' : ''}>Más cortas</option>
            </select>
          </div>
        </div>
        ${activeFiltersHTML() || '<div id="active-filters"></div>'}
        <div id="results-body">${resultsBodyHTML(res)}</div>
        <span class="annot">2 · Resultados y contador accesible</span>
      </div>
    </div>`;
  };

  /* ---------- Detalle ---------- */
  V.recomendacion = () => {
    const r = byId(state.params.id);
    if (!r || r.estado !== 'Publicado') {
      return `<div class="empty">${ic('info')}<h3>Esta recomendación no está disponible</h3><p class="muted">Puede haber cambiado de dirección o ya no estar publicada.</p><button class="btn btn-primary" data-go="explorar">Ir a explorar</button></div>`;
    }
    const c = CATS[r.cat];
    const f = isFav(r.id);
    const h = hasHabit(r.id);
    const rel = published().filter((x) => x.cat === r.cat && x.id !== r.id).slice(0, 3);
    const u = currentUser();

    return `
    <div class="crumbs"><button data-go="inicio">Inicio</button>${ic('chev')}<button data-go="explorar">Explorar</button>${ic('chev')}<button data-go="explorar" data-cat="${r.cat}">${c.nombre}</button></div>
    <div class="detail">
      <article>
        <div style="display:grid;gap:12px">
          <span class="pill pill-${r.cat}" style="justify-self:start">${ic(c.icon)}${c.nombre}</span>
          <h1 style="font-size:clamp(28px,3.6vw,40px)">${esc(r.titulo)}</h1>
          <p class="muted" style="font-size:17.5px;max-width:62ch">${esc(r.resumen)}</p>
          <span class="annot">1 · Encabezado y metadatos</span>
        </div>
        <div class="facts">
          <span class="fact">${ic('clock')}${r.dur} minutos</span>
          <span class="fact">${ic('level')}Nivel ${r.nivel.toLowerCase()}</span>
          ${r.obj.map((o) => `<span class="fact">${ic(OBJ_IC[o])}${OBJ[o]}</span>`).join('')}
        </div>
        <div class="hero-img media" style="cursor:default">${illus(r.img, r.cat)}</div>
        <div class="prose"><h2>Por qué ayuda</h2><p>${esc(r.porque)}</p></div>
        <div class="prose"><h2>Cómo hacerlo</h2><ol class="howto">${r.pasos.map((p) => `<li><span>${esc(p)}</span></li>`).join('')}</ol></div>
        <div class="note">${ic('info')}<span>Esta recomendación es general y no reemplaza la valoración de un profesional de la salud. Si tienes una enfermedad o tomas medicamentos, consulta antes de hacer cambios.</span></div>
      </article>
      <aside class="aside">
        <div class="panel">
          <h3>Guárdala para después</h3>
          <button class="btn ${f ? 'btn-soft' : 'btn-primary'} btn-block" data-fav="${r.id}" aria-pressed="${f}">${ic('heart', f ? 'fill' : '')}${f ? 'Guardada en favoritos' : 'Guardar en favoritos'}</button>
          <button class="btn btn-ghost btn-block" data-habit="${r.id}" aria-pressed="${h}">${ic(h ? 'check' : 'plus')}${h ? 'En tus hábitos' : 'Agregar a mis hábitos'}</button>
          <div class="src"><span><b>Fuente:</b> ${esc(r.fuente)}</span><span><b>Revisado por:</b> ${REV[r.cat]}</span><span><b>Actualizado:</b> ${fmtDate(r.fecha)}</span></div>
          <span class="annot">2 · Acciones y trazabilidad editorial</span>
        </div>
        ${u ? '' : `<div class="panel" style="background:var(--pine-soft);border-color:transparent"><b>¿Quieres recomendaciones a tu medida?</b><p class="muted" style="font-size:14px">Crea una cuenta y completa tu perfil de salud.</p><button class="btn btn-ghost btn-sm" data-go="registro">Crear cuenta</button></div>`}
      </aside>
    </div>
    ${rel.length ? `<section class="section"><div class="section-head"><h2>También en ${c.nombre.toLowerCase()}</h2></div><div class="grid">${rel.map((x) => card(x)).join('')}</div></section>` : ''}`;
  };

  Object.assign(EQ, { refreshResults, syncFilterInputs });
})();
