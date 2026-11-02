/* ============================================================
   Equilibra · Vistas privadas (RF4 y RF5)
   Para ti, favoritos y seguimiento de hábitos.
   ============================================================ */
(function () {
  'use strict';
  const EQ = window.EQ;
  const { CATS, OBJ, OBJ_IC, DIETAS, state, currentUser, byId, published, card, emptyState, personal, ic, esc } = EQ;
  const V = EQ.VIEWS;

  /* ---------- Para ti ---------- */
  V['para-ti'] = () => {
    const u = currentUser();
    if (!u.consent || !u.perfil || !u.prefs.personalizar) {
      return `<h1 style="font-size:clamp(28px,3.4vw,38px)">Para ti</h1>
        <div class="banner" style="margin-top:18px">
          <span style="display:flex;gap:11px;align-items:center">${ic('sparkle')}<span>Completa tu perfil de salud para ver recomendaciones ajustadas a tus objetivos. Mientras tanto, estas son las más populares.</span></span>
          <button class="btn btn-primary btn-sm" data-go="perfil-salud">Completar perfil</button>
        </div>
        <div class="grid" style="margin-top:24px">${['a1', 'c1', 'd1', 'b1', 'c2', 'a2'].map((id) => card(byId(id))).join('')}</div>`;
    }

    const list = personal();
    const top = list.filter((x) => x.score >= 3);
    const rest = list.filter((x) => x.score < 3);

    if (!list.length) {
      return `<h1 style="font-size:clamp(28px,3.4vw,38px)">Para ti</h1>
        ${emptyState('filter', 'Tu perfil es muy restrictivo', 'Con las restricciones actuales no encontramos contenido compatible. Ajusta tu perfil para ver recomendaciones.', '<button class="btn btn-primary" data-go="perfil-salud">Editar perfil de salud</button>')}`;
    }

    return `<div class="section-head">
      <div><p class="eyebrow">Hola, ${esc(u.nombre.split(' ')[0])}</p><h1 style="font-size:clamp(28px,3.4vw,38px);margin-top:6px">Recomendaciones para ti</h1></div>
      <button class="btn btn-ghost btn-sm" data-go="perfil-salud">${ic('edit')}Editar perfil de salud</button>
    </div>
    <div class="chips" style="margin:16px 0 4px">
      ${u.perfil.obj.map((o) => `<span class="pill pill-plain" style="font-size:13.5px;padding:6px 12px">${ic(OBJ_IC[o])}${OBJ[o]}</span>`).join('')}
      ${u.perfil.dietas.map((d) => `<span class="pill pill-plain" style="font-size:13.5px;padding:6px 12px">${DIETAS[d]}</span>`).join('')}
    </div>
    <p class="muted" style="font-size:14.5px">Ordenamos el contenido según tus objetivos, tu nivel de actividad y tus intereses. Cada tarjeta explica por qué aparece.</p>
    <section class="section" style="margin-top:26px"><div class="section-head"><h2>Para tus objetivos</h2></div><div class="grid">${top.map((x) => card(x.r, { reason: x.reason })).join('')}</div></section>
    ${rest.length ? `<section class="section"><div class="section-head"><h2>Para variar</h2><p class="muted">Opciones que complementan tu perfil sin repetir lo de siempre.</p></div><div class="grid">${rest.slice(0, 6).map((x) => card(x.r, { reason: x.reason })).join('')}</div></section>` : ''}`;
  };

  /* ---------- Favoritos ---------- */
  V.favoritos = () => {
    const u = currentUser();
    const tab = state.params.tab || 'todas';
    const all = u.favs.map(byId).filter((r) => r && r.estado === 'Publicado');
    const fav = tab === 'todas' ? all : all.filter((r) => r.cat === tab);
    return `<h1 style="font-size:clamp(28px,3.4vw,38px)">Favoritos</h1>
      <p class="muted" style="margin-top:6px">${all.length} ${all.length === 1 ? 'recomendación guardada' : 'recomendaciones guardadas'}. Se conservan en este navegador.</p>
      <div class="chips" style="margin:18px 0 24px" role="tablist" aria-label="Filtrar favoritos por categoría">
        <button class="chip ${tab === 'todas' ? 'on' : ''}" data-go="favoritos">Todas</button>
        ${Object.entries(CATS).map(([k, c]) => `<button class="chip ${tab === k ? 'on' : ''}" data-go="favoritos" data-tab="${k}">${c.nombre}</button>`).join('')}
      </div>
      ${fav.length
        ? `<div class="grid">${fav.map((r) => card(r)).join('')}</div>`
        : emptyState('heart', tab === 'todas' ? 'Aún no tienes favoritos' : 'No tienes favoritos en esta categoría', 'Toca el corazón de cualquier recomendación para guardarla aquí.', '<button class="btn btn-primary" data-go="explorar">Explorar recomendaciones</button>')}`;
  };

  /* ---------- Hábitos ---------- */
  function dayLabels() {
    const names = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
    const out = [];
    const t = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(t);
      d.setDate(t.getDate() - i);
      out.push({ l: names[d.getDay()], d: d.getDate() });
    }
    return out;
  }
  function streak(h) {
    let s = 0;
    let i = h.days[6] ? 6 : 5;
    for (; i >= 0 && h.days[i]; i--) s++;
    return s;
  }

  V.habitos = () => {
    const u = currentUser();
    const H = u.habitos;
    if (!H.length) {
      return `<h1 style="font-size:clamp(28px,3.4vw,38px)">Mis hábitos</h1>
        ${emptyState('cal', 'Todavía no sigues ningún hábito', 'Abre una recomendación y toca “Agregar a mis hábitos” para empezar.', '<button class="btn btn-primary" data-go="explorar">Buscar recomendaciones</button>')}`;
    }
    const done = H.filter((h) => h.days[6]).length;
    const tot = H.length;
    const week = H.reduce((a, h) => a + h.days.reduce((x, y) => x + y, 0), 0);
    const pct = Math.round((week / (tot * 7)) * 100);
    const best = Math.max(...H.map(streak));
    const days = dayLabels();
    const perDay = days.map((_, i) => H.filter((h) => h.days[i]).length);

    return `<div class="section-head">
      <div><h1 style="font-size:clamp(28px,3.4vw,38px)">Mis hábitos</h1><p class="muted" style="margin-top:6px">Marca lo que cumpliste hoy. Tu avance se guarda automáticamente.</p></div>
      <button class="btn btn-primary btn-sm" data-go="explorar">${ic('plus')}Agregar hábito</button>
    </div>
    <div class="stats" style="margin-top:22px">
      <div class="card stat"><span class="muted" style="display:flex;gap:8px;align-items:center">${ic('check')}Hoy</span><b>${done}/${tot}</b><div class="bar"><i style="width:${Math.round((done / tot) * 100)}%"></i></div></div>
      <div class="card stat"><span class="muted" style="display:flex;gap:8px;align-items:center">${ic('flame')}Mejor racha actual</span><b>${best} ${best === 1 ? 'día' : 'días'}</b><small class="muted">Sin fallar un día</small></div>
      <div class="card stat"><span class="muted" style="display:flex;gap:8px;align-items:center">${ic('chart')}Cumplimiento semanal</span><b>${pct}%</b><small class="muted">${week} de ${tot * 7} registros</small></div>
    </div>
    <section class="section" style="margin-top:30px"><div class="section-head"><h2>Hoy</h2></div><div class="card">
      ${H.map((h) => {
        const r = byId(h.id);
        if (!r) return '';
        return `<div class="habit-row ${h.days[6] ? 'done' : ''}">
          <button class="tick ${h.days[6] ? 'on' : ''}" data-tick="${h.id}" aria-pressed="${!!h.days[6]}" aria-label="${h.days[6] ? 'Desmarcar' : 'Marcar como cumplido'}: ${esc(r.titulo)}">${ic('check')}</button>
          <div class="t"><b>${esc(r.titulo)}</b><span class="meta"><span class="pill pill-${r.cat}">${CATS[r.cat].nombre}</span>${h.freq} · ${ic('flame')}${streak(h)} días</span></div>
          <button class="iconbtn" data-go="recomendacion" data-id="${r.id}" aria-label="Ver recomendación: ${esc(r.titulo)}">${ic('eye')}</button>
          <button class="iconbtn" data-rmhabit="${h.id}" aria-label="Dejar de seguir: ${esc(r.titulo)}">${ic('trash')}</button>
        </div>`;
      }).join('')}
    </div></section>
    <section class="section"><div class="section-head"><h2>Últimos 7 días</h2><p class="muted">Cada punto representa un día cumplido.</p></div>
      <div class="card week"><table>
        <caption class="sr">Registro de cumplimiento de hábitos en los últimos siete días</caption>
        <thead><tr><th scope="col">Hábito</th>${days.map((d) => `<th scope="col">${d.l}<br><span class="muted" style="font-weight:400">${d.d}</span></th>`).join('')}</tr></thead>
        <tbody>
          ${H.map((h) => `<tr><th scope="row" style="text-align:left;font-weight:400">${esc(byId(h.id)?.titulo || '')}</th>${h.days.map((v, i) => `<td><span class="dot ${v ? 'on' : ''} ${i === 6 ? 'today' : ''}" role="img" aria-label="${v ? 'Cumplido' : 'No cumplido'}"></span></td>`).join('')}</tr>`).join('')}
          <tr><th scope="row" style="text-align:left">Total del día</th>${perDay.map((n) => `<td><b style="font-variant-numeric:tabular-nums">${n}/${tot}</b></td>`).join('')}</tr>
        </tbody>
      </table></div>
    </section>`;
  };
})();
