/* ============================================================
   Equilibra · Cuenta y perfil de salud (RF1)
   ============================================================ */
(function () {
  'use strict';
  const EQ = window.EQ;
  const { CATS, OBJ, OBJ_IC, DIETAS, state, currentUser, ic, esc, errorSummary } = EQ;
  const V = EQ.VIEWS;

  V.cuenta = () => {
    const u = currentUser();
    const tab = state.params.tab || state.ui.accountTab || 'datos';
    const nav = [['datos', 'Datos personales', 'user'], ['salud', 'Perfil de salud', 'target'], ['privacidad', 'Privacidad y seguridad', 'shield']];
    let body = '';

    if (tab === 'datos') {
      body = `<div class="panel" style="padding:28px"><h2>Datos personales</h2>
        <form data-form="datos" style="display:grid;gap:15px;max-width:540px">
          <div class="field"><label for="dNom">Nombre completo</label><input class="input" id="dNom" name="nombre" value="${esc(u.nombre)}" autocomplete="name"></div>
          <div class="field"><label for="dCor">Correo electrónico</label><input class="input" id="dCor" value="${esc(state.session)}" disabled><span class="hint">El correo identifica tu cuenta y no se puede cambiar en este prototipo.</span></div>
          <div><button class="btn btn-primary" type="submit">Guardar cambios</button></div>
        </form></div>
        <div class="panel" style="padding:28px"><h2>Contraseña</h2><p class="muted">Se guarda como hash SHA-256 con una sal única; nunca en texto plano.</p><div><button class="btn btn-ghost" data-act="pwchange">${ic('lock')}Cambiar contraseña</button></div></div>
        <div class="panel" style="padding:28px"><h2>Sesión</h2><p class="muted">Sesión iniciada como ${esc(state.session)}.</p><div><button class="btn btn-ghost" data-act="logout">${ic('logout')}Cerrar sesión</button></div></div>`;
    }

    if (tab === 'salud') {
      body = `<div class="panel" style="padding:28px">
        <div class="section-head"><h2>Perfil de salud</h2>${u.perfil ? `<button class="btn btn-ghost btn-sm" data-go="perfil-salud">${ic('edit')}Editar</button>` : ''}</div>
        ${u.perfil && u.consent ? `<dl class="kv">
          <dt>Objetivos</dt><dd>${u.perfil.obj.map((x) => OBJ[x]).join(', ')}</dd>
          <dt>Nivel de actividad</dt><dd>${{ sedentario: 'Poco activo', moderado: 'Moderado', activo: 'Activo' }[u.perfil.actividad] || '—'}</dd>
          <dt>Horas de sueño</dt><dd>${u.perfil.sueno} h</dd>
          <dt>Alimentación</dt><dd>${u.perfil.dietas.map((x) => DIETAS[x]).join(', ') || 'Sin restricciones'}</dd>
          <dt>Intereses</dt><dd>${u.perfil.intereses.map((x) => CATS[x].nombre).join(', ') || '—'}</dd>
        </dl>
        <div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn btn-ghost btn-sm" data-act="delprofile">${ic('trash')}Borrar mi perfil de salud</button></div>
        <p class="hint">${ic('lock')}Estos datos solo se usan para ordenar tus recomendaciones. No se comparten con terceros.</p>`
        : `<p class="muted">No tienes un perfil de salud guardado.</p><div><button class="btn btn-primary" data-go="perfil-salud">Crear perfil</button></div>`}
      </div>`;
    }

    if (tab === 'privacidad') {
      body = `<div class="panel" style="padding:28px"><h2>Privacidad</h2>
        ${[
          ['personalizar', 'Usar mis datos de salud para personalizar', 'Si lo desactivas, verás recomendaciones generales. Tu perfil se conserva hasta que lo borres.'],
          ['recordatorios', 'Recordatorios de hábitos', 'Un aviso diario con los hábitos pendientes (simulado en este prototipo).']
        ].map(([k, t, s]) => `<div class="toggle-row"><div><b>${t}</b><p class="muted" style="font-size:14px">${s}</p></div><label class="switch"><input type="checkbox" data-pref="${k}" ${u.prefs[k] ? 'checked' : ''} aria-label="${t}"><span></span></label></div>`).join('')}
        <div class="toggle-row"><div><b>Descargar mis datos</b><p class="muted" style="font-size:14px">Genera un archivo JSON con tu perfil, favoritos y registros de hábitos.</p></div><button class="btn btn-ghost btn-sm" data-act="export">${ic('download')}Descargar</button></div>
      </div>
      <div class="panel" style="padding:28px"><h2>Seguridad</h2>
        <div class="toggle-row"><div><b>Contraseñas protegidas</b><p class="muted" style="font-size:14px">Hash SHA-256 con sal. En producción se usaría Argon2id en el servidor.</p></div><span class="badge-ok">${ic('check')}Activo</span></div>
        <div class="toggle-row"><div><b>Datos de salud con consentimiento</b><p class="muted" style="font-size:14px">Solo se usan si autorizaste su tratamiento (Ley 1581 de 2012).</p></div><span class="badge-ok">${ic('check')}${u.consent ? 'Autorizado' : 'No autorizado'}</span></div>
        <div class="toggle-row"><div><b style="color:var(--err)">Eliminar mi cuenta</b><p class="muted" style="font-size:14px">Borra de forma permanente tu cuenta, perfil, favoritos y hábitos.</p></div><button class="btn btn-ghost btn-sm" data-act="delaccount" style="color:var(--err)">${ic('trash')}Eliminar</button></div>
      </div>`;
    }

    return `<h1 style="font-size:clamp(28px,3.4vw,38px);margin-bottom:24px">Mi cuenta</h1>
      <div class="account">
        <nav class="side-nav" aria-label="Secciones de la cuenta">${nav.map(([k, l, i]) => `<button class="${tab === k ? 'on' : ''}" data-go="cuenta" data-tab="${k}" ${tab === k ? 'aria-current="page"' : ''}>${ic(i)}${l}</button>`).join('')}</nav>
        <div style="display:grid;gap:18px;min-width:0">${body}</div>
      </div>`;
  };

  V['perfil-salud'] = () => {
    const u = currentUser();
    if (!u.consent) {
      return `<div class="onb"><div class="panel" style="gap:15px">
        ${ic('shield')}
        <h2>Antes de crear tu perfil de salud</h2>
        <p class="muted">Para personalizar las recomendaciones necesitamos tu autorización para tratar datos de salud. Son datos sensibles: solo se usan para elegir qué contenido mostrarte y no se comparten con terceros.</p>
        <label class="check"><input type="checkbox" id="cAut"><span>Autorizo el uso de mis datos de salud para personalizar mis recomendaciones (Ley 1581 de 2012).</span></label>
        <div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn btn-primary" data-act="consent">Continuar</button><button class="btn btn-ghost" data-go="inicio">Ahora no</button></div>
      </div></div>`;
    }

    if (!state.onb) {
      state.onb = {
        step: 1,
        data: JSON.parse(JSON.stringify(u.perfil || { obj: [], actividad: '', sueno: 7, dietas: [], intereses: [] }))
      };
      state.onb.data.obj = state.onb.data.obj || [];
      state.onb.data.dietas = state.onb.data.dietas || [];
      state.onb.data.intereses = state.onb.data.intereses || [];
    }
    const o = state.onb;
    const d = o.data;
    const st = o.step;
    const labels = ['Objetivos', 'Tus hábitos', 'Intereses y resumen'];
    let body = '';

    if (st === 1) {
      body = `<h2>¿Qué quieres mejorar?</h2><p class="muted">Elige uno o varios. Esto define qué recomendaciones verás primero.</p>
        <div class="opts">${Object.entries(OBJ).map(([k, t]) => `<button type="button" class="opt-card ${d.obj.includes(k) ? 'on' : ''}" data-onb="obj" data-v="${k}" aria-pressed="${d.obj.includes(k)}">${ic(OBJ_IC[k])}<span><b>${t}</b></span></button>`).join('')}</div>
        ${state.errors.obj ? `<p class="err">${ic('info')}${esc(state.errors.obj)}</p>` : ''}`;
    }
    if (st === 2) {
      body = `<h2>Cuéntanos de tus hábitos</h2>
        <div class="field"><label>¿Qué tan activo eres hoy?</label><div class="opts">
          ${[['sedentario', 'Poco activo', 'Casi todo el día sentado'], ['moderado', 'Moderado', 'Camino o hago ejercicio a veces'], ['activo', 'Activo', 'Ejercicio 3 o más veces por semana']].map(([k, t, s]) => `<button type="button" class="opt-card ${d.actividad === k ? 'on' : ''}" data-onb="actividad" data-v="${k}" aria-pressed="${d.actividad === k}">${ic('ac')}<span><b>${t}</b><small>${s}</small></span></button>`).join('')}
        </div></div>
        ${state.errors.actividad ? `<p class="err">${ic('info')}${esc(state.errors.actividad)}</p>` : ''}
        <div class="field"><label for="slp">¿Cuántas horas duermes normalmente? <b id="slpv">${d.sueno} h</b></label><input type="range" min="3" max="11" step="0.5" id="slp" value="${d.sueno}" data-onb-range="sueno"></div>
        <div class="field"><label>Alimentación (opcional)</label><div class="chips">${Object.entries(DIETAS).map(([k, t]) => `<button type="button" class="chip ${d.dietas.includes(k) ? 'on' : ''}" data-onb="dietas" data-v="${k}" aria-pressed="${d.dietas.includes(k)}">${t}</button>`).join('')}</div><p class="hint">Si marcas alguna, ocultaremos las recetas que no cumplan.</p></div>`;
    }
    if (st === 3) {
      body = `<h2>¿Qué temas te interesan más?</h2>
        <div class="opts">${Object.entries(CATS).map(([k, c]) => `<button type="button" class="opt-card ${d.intereses.includes(k) ? 'on' : ''}" data-onb="intereses" data-v="${k}" aria-pressed="${d.intereses.includes(k)}">${ic(c.icon)}<span><b>${c.nombre}</b><small>${c.desc}</small></span></button>`).join('')}</div>
        <div class="panel"><h3>Resumen de tu perfil</h3><dl class="kv">
          <dt>Objetivos</dt><dd>${d.obj.map((x) => OBJ[x]).join(', ') || '—'}</dd>
          <dt>Nivel de actividad</dt><dd>${{ sedentario: 'Poco activo', moderado: 'Moderado', activo: 'Activo' }[d.actividad] || '—'}</dd>
          <dt>Horas de sueño</dt><dd>${d.sueno} h</dd>
          <dt>Alimentación</dt><dd>${d.dietas.map((x) => DIETAS[x]).join(', ') || 'Sin restricciones'}</dd>
        </dl>
        <p class="muted" style="font-size:13.5px;display:flex;gap:8px">${ic('lock')}Solo tú ves estos datos. Puedes editarlos o borrarlos desde Mi cuenta.</p></div>`;
    }

    return `<div class="onb">
      <div><p class="eyebrow">Perfil de salud · Paso ${st} de 3</p>
        <div class="stepper" style="margin-top:10px">${labels.map((l, i) => `<div class="${i < st ? 'on' : ''}"><i></i>${l}</div>`).join('')}</div>
        <span class="annot">1 · Asistente de perfil en tres pasos</span>
      </div>
      <div class="panel" style="padding:30px;gap:19px">${body}</div>
      <div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap">
        ${st > 1 ? `<button class="btn btn-ghost" data-act="onbprev">${ic('back')}Atrás</button>` : `<button class="btn btn-ghost" data-go="inicio">Omitir por ahora</button>`}
        <button class="btn btn-primary" data-act="onbnext">${st < 3 ? `Siguiente ${ic('chev')}` : `${ic('check')}Guardar perfil`}</button>
      </div>
    </div>`;
  };
})();
