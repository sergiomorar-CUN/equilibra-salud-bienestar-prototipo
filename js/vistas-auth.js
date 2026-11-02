/* ============================================================
   Equilibra · Vistas de autenticación (RF1)
   ============================================================ */
(function () {
  'use strict';
  const EQ = window.EQ;
  const { state, ic, illus, esc, errorSummary, fieldError, inputClass, ariaInvalid, pwScore, reqsHTML } = EQ;
  const V = EQ.VIEWS;

  function authSide() {
    return `<div class="auth-side">
      <p class="eyebrow">Equilibra</p>
      <h2>Tu salud, un hábito a la vez</h2>
      <ul>
        <li>${ic('check')}<span>Recomendaciones ordenadas según tus objetivos y restricciones.</span></li>
        <li>${ic('check')}<span>Favoritos y seguimiento diario de hábitos en un solo lugar.</span></li>
        <li>${ic('lock')}<span>Tus datos de salud son opcionales, privados y puedes borrarlos cuando quieras.</span></li>
      </ul>
      <div class="art">${illus('sol', 'bi')}</div>
    </div>`;
  }

  V.registro = () => {
    const d = state.form.registro || {};
    return `<div class="auth">${authSide()}
      <form data-form="registro" novalidate>
        <div><h1 style="font-size:31px">Crea tu cuenta</h1><p class="muted" style="margin-top:6px">Te toma menos de un minuto.</p></div>
        ${errorSummary()}
        <div class="field">
          <label for="rNombre">Nombre completo</label>
          <input class="${inputClass('nombre')}" id="rNombre" name="nombre" value="${esc(d.nombre || '')}" autocomplete="name" ${ariaInvalid('nombre')}>
          ${fieldError('nombre')}
        </div>
        <div class="field">
          <label for="rCorreo">Correo electrónico</label>
          <input class="${inputClass('correo')}" id="rCorreo" name="correo" type="email" value="${esc(d.correo || '')}" autocomplete="email" ${ariaInvalid('correo')}>
          ${fieldError('correo')}
        </div>
        <div class="field">
          <label for="rPass">Contraseña</label>
          <div class="pw">
            <input class="${inputClass('pass')}" id="rPass" name="pass" type="password" autocomplete="new-password" data-pw value="${esc(d.pass || '')}" ${ariaInvalid('pass')}>
            <button type="button" data-act="showpw" aria-label="Mostrar contraseña">${ic('eye')}</button>
          </div>
          <div class="meter" data-l="${pwScore(d.pass || '')}" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
          <ul class="reqs" id="reqs">${reqsHTML(d.pass || '')}</ul>
          ${fieldError('pass')}
        </div>
        <div class="field">
          <label for="rPass2">Confirma la contraseña</label>
          <input class="${inputClass('pass2')}" id="rPass2" name="pass2" type="password" autocomplete="new-password" value="${esc(d.pass2 || '')}" ${ariaInvalid('pass2')}>
          ${fieldError('pass2')}
        </div>
        <label class="check"><input type="checkbox" name="terminos" id="rTer" ${d.terminos ? 'checked' : ''}><span>Acepto los <a href="#/privacidad" data-go="privacidad">términos de uso</a> y la <a href="#/privacidad" data-go="privacidad">política de privacidad</a>.</span></label>
        ${fieldError('terminos')}
        <div class="consent">
          <label class="check"><input type="checkbox" name="salud" id="rSalud" ${d.salud ? 'checked' : ''}><span><b>Opcional.</b> Autorizo el uso de mis datos de salud (objetivos, nivel de actividad, horas de sueño y restricciones alimentarias) para personalizar mis recomendaciones. Son datos sensibles según la Ley 1581 de 2012 y puedo retirar esta autorización desde Mi cuenta.</span></label>
        </div>
        <button class="btn btn-primary btn-block" type="submit">Crear cuenta</button>
        <p class="muted" style="text-align:center">¿Ya tienes cuenta? <a href="#/ingresar" data-go="ingresar"><b>Inicia sesión</b></a></p>
      </form>
    </div>`;
  };

  V.ingresar = () => {
    const d = state.form.ingresar || {};
    const blocked = state.attempts >= 5;
    return `<div class="auth">${authSide()}
      <form data-form="ingresar" novalidate>
        <div><h1 style="font-size:31px">Inicia sesión</h1><p class="muted" style="margin-top:6px">${state.params.next ? 'Necesitas una cuenta para continuar.' : 'Qué bueno verte de nuevo.'}</p></div>
        ${errorSummary()}
        ${state.params.ok ? `<div class="alert alert-ok" role="status">${ic('check')}${esc(state.params.ok)}</div>` : ''}
        <div class="field">
          <label for="lCorreo">Correo electrónico</label>
          <input class="${inputClass('general')}" id="lCorreo" name="correo" type="email" value="${esc(d.correo || '')}" autocomplete="username" ${ariaInvalid('general')}>
        </div>
        <div class="field">
          <label for="lPass">Contraseña</label>
          <div class="pw">
            <input class="${inputClass('general')}" id="lPass" name="pass" type="password" value="${esc(d.pass || '')}" autocomplete="current-password">
            <button type="button" data-act="showpw" aria-label="Mostrar contraseña">${ic('eye')}</button>
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap">
          <label class="check"><input type="checkbox" id="lRec" ${state.remember ? 'checked' : ''}>Recordarme en este equipo</label>
          <a href="#/recuperar" data-go="recuperar">¿Olvidaste tu contraseña?</a>
        </div>
        <button class="btn btn-primary btn-block" type="submit" ${blocked ? 'disabled' : ''}>Iniciar sesión</button>
        <p class="muted" style="text-align:center">¿No tienes cuenta? <a href="#/registro" data-go="registro"><b>Crea una</b></a></p>
        <div class="demo demo-only">
          <b>Cuenta de prueba del prototipo</b>
          <button type="button" data-demo="daniela@correo.com|Demo2026*">Usar cuenta demo: daniela@correo.com · Demo2026*</button>
          <span>También puedes registrarte con cualquier correo.</span>
        </div>
      </form>
    </div>`;
  };

  V.recuperar = () => `<div class="auth">${authSide()}
    <form data-form="recuperar" novalidate>
      <div><h1 style="font-size:31px">Recupera tu contraseña</h1><p class="muted" style="margin-top:6px">Escribe tu correo y te enviaremos un enlace que vence en 30 minutos.</p></div>
      ${state.params.sent ? `<div class="alert alert-ok" role="status">${ic('mail')}Si el correo está registrado, recibirás el enlace en unos minutos.</div>` : ''}
      <div class="field"><label for="fCorreo">Correo electrónico</label><input class="input" id="fCorreo" name="correo" type="email" autocomplete="email" required></div>
      <button class="btn btn-primary btn-block" type="submit">Enviar enlace</button>
      <button class="btn btn-ghost btn-block" type="button" data-go="ingresar">Volver a iniciar sesión</button>
    </form>
  </div>`;
})();
