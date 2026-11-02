/* ============================================================
   Equilibra · Arranque de la aplicación
   Carga datos y sesión, aplica parámetros de demostración y
   arranca el router por hash.
   ============================================================ */
(function () {
  'use strict';

  const EQ = window.EQ;
  const { state } = EQ;
  const qs = new URLSearchParams(location.search);

  /* 1. Persistencia de usuarios y sesión */
  EQ.loadUsers();
  EQ.loadSession();

  /* 2. Parámetros de demostración y captura
        ?wf=1        vista wireframe
        ?wf=1&annot=1 wireframe con anotaciones
        ?cap=1       oculta ayudas de captura y el botón de wireframe
        ?as=demo     inicia sesión con la cuenta de prueba
        ?as=guest    cierra la sesión actual                        */
  const flag = (name) => {
    const v = qs.get(name);
    if (v === null) return null;
    return !(v === '0' || v === 'false' || v === 'no');
  };

  let wf = flag('wf');
  if (wf === null) {
    try { wf = localStorage.getItem(EQ.WF_KEY) === '1'; } catch (e) { wf = false; }
  }
  state.ui.wf = !!wf;
  state.ui.annot = !!flag('annot');
  document.body.classList.toggle('wf', state.ui.wf);
  document.body.classList.toggle('annot-on', state.ui.annot);
  if (flag('cap')) document.body.classList.add('cap');

  const as = (qs.get('as') || '').toLowerCase();
  if (as === 'demo') {
    state.session = 'daniela@correo.com';
    state.remember = true;
    EQ.saveSession();
  } else if (as === 'guest') {
    state.session = null;
    EQ.saveSession();
  }

  /* 3. Ruta inicial */
  if (!location.hash) history.replaceState(null, '', '#/inicio');

  EQ.onRoute();
})();
