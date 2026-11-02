/* ============================================================
   Equilibra · Páginas de documentación del prototipo
   Privacidad, accesibilidad y guía de evaluación (trazabilidad).
   ============================================================ */
(function () {
  'use strict';
  const EQ = window.EQ;
  const { ic } = EQ;
  const V = EQ.VIEWS;

  V.privacidad = () => `<div class="doc">
    <h1>Política de privacidad</h1>
    <div class="panel prose">
      <p><b>Responsable del tratamiento.</b> Equilibra es un prototipo académico desarrollado para la Actividad de Construcción Aplicada de Ingeniería Web de la CUN. No existe una empresa detrás ni se recaudan datos en un servidor: toda la información se guarda en el almacenamiento local del navegador.</p>
      <h2>Qué datos se tratan</h2>
      <ul>
        <li><b>Datos de cuenta:</b> nombre y correo electrónico. Son necesarios para identificarte.</li>
        <li><b>Datos de salud (opcionales):</b> objetivos, nivel de actividad, horas de sueño y restricciones alimentarias. Solo se solicitan si autorizas su tratamiento.</li>
        <li><b>Actividad en la aplicación:</b> favoritos y registros de hábitos.</li>
      </ul>
      <h2>Para qué se usan</h2>
      <p>Para ordenar las recomendaciones según tu perfil, guardar tus favoritos y mostrar tu progreso. No se usan para publicidad ni se comparten con terceros.</p>
      <h2>Base legal y derechos</h2>
      <p>El tratamiento de datos de salud sigue la Ley 1581 de 2012 y el Decreto 1377 de 2013 de Colombia. Puedes conocer, actualizar, descargar y eliminar tus datos desde <b>Mi cuenta → Privacidad y seguridad</b>, o borrar el perfil de salud sin eliminar la cuenta.</p>
      <h2>Seguridad</h2>
      <p>Las contraseñas se almacenan como hash SHA-256 con una sal única, nunca en texto plano. La aplicación escapa el contenido introducido por el usuario para prevenir inyecciones de HTML. En un despliegue real se exigiría HTTPS, cabeceras de seguridad y un backend con control de acceso.</p>
      <h2>Conservación</h2>
      <p>Los datos permanecen en tu navegador hasta que elimines la cuenta o borres el almacenamiento local. Al restablecer la demo se eliminan por completo.</p>
      <p class="muted" style="font-size:14px">Texto de ejemplo con fines académicos. No constituye asesoría legal.</p>
    </div>
  </div>`;

  V.accesibilidad = () => `<div class="doc">
    <h1>Declaración de accesibilidad</h1>
    <div class="panel prose">
      <p>Equilibra se diseñó tomando como referencia las <b>Pautas de Accesibilidad para el Contenido Web (WCAG) 2.1, nivel AA</b>. Al ser un prototipo académico, no cuenta con una auditoría formal con usuarios ni con tecnologías de asistencia reales; aun así, incorpora las siguientes medidas verificables.</p>
      <h2>Medidas implementadas</h2>
      <ul>
        <li><b>Estructura semántica:</b> un solo <code>h1</code> por pantalla, landmarks <code>header</code>, <code>nav</code>, <code>main</code> y <code>footer</code>, y jerarquía de encabezados coherente.</li>
        <li><b>Navegación por teclado:</b> enlace “Saltar al contenido”, foco visible de 3 px, todos los controles son <code>button</code>, <code>a</code> o campos de formulario, y el menú y los modales se cierran con <code>Escape</code>.</li>
        <li><b>Gestión del foco:</b> al cambiar de pantalla el foco se mueve al título; al abrir un modal se atrapa el foco y al cerrarlo se devuelve al elemento de origen.</li>
        <li><b>Formularios:</b> etiquetas asociadas, mensajes de error con <code>aria-invalid</code> y <code>aria-describedby</code>, resumen de errores y campos obligatorios identificados.</li>
        <li><b>Contraste:</b> todos los pares de texto cumplen AA (4.5:1 o más). Ver tabla inferior.</li>
        <li><b>Contenido no textual:</b> las ilustraciones decorativas usan <code>aria-hidden</code>; las tarjetas incluyen el título en el nombre accesible del botón.</li>
        <li><b>Movimiento:</b> se respeta <code>prefers-reduced-motion</code> y no hay animaciones esenciales.</li>
        <li><b>Responsive y zoom:</b> el diseño se adapta desde 320 px y mantiene el contenido al 200 % de zoom sin pérdida de información.</li>
        <li><b>Mensajes dinámicos:</b> el contador de resultados y los avisos usan <code>aria-live="polite"</code>.</li>
      </ul>
      <h2>Contraste de los pares principales</h2>
    </div>
    <div class="coverage"><table>
      <caption class="sr">Relación de contraste de los colores utilizados</caption>
      <thead><tr><th>Texto</th><th>Fondo</th><th>Ratio</th><th>Cumple</th></tr></thead>
      <tbody>
        <tr><td>#14312A</td><td>#FFFFFF</td><td>13.98:1</td><td><span class="badge-ok">AA / AAA</span></td></tr>
        <tr><td>#4A615A</td><td>#FFFFFF</td><td>6.67:1</td><td><span class="badge-ok">AA / AAA</span></td></tr>
        <tr><td>#11604E</td><td>#FFFFFF</td><td>7.48:1</td><td><span class="badge-ok">AA / AAA</span></td></tr>
        <tr><td>#FFFFFF</td><td>#11604E</td><td>7.48:1</td><td><span class="badge-ok">AA / AAA</span></td></tr>
        <tr><td>#2D6E30</td><td>#E2F0E0</td><td>5.25:1</td><td><span class="badge-ok">AA</span></td></tr>
        <tr><td>#9E4418</td><td>#FBE6DA</td><td>5.29:1</td><td><span class="badge-ok">AA</span></td></tr>
        <tr><td>#3F52A0</td><td>#E2E6F6</td><td>5.77:1</td><td><span class="badge-ok">AA</span></td></tr>
        <tr><td>#8E3F77</td><td>#F3E2EE</td><td>5.41:1</td><td><span class="badge-ok">AA</span></td></tr>
        <tr><td>#6B4A00</td><td>#FDF1D8</td><td>7.20:1</td><td><span class="badge-ok">AA / AAA</span></td></tr>
      </tbody>
    </table></div>
    <div class="panel prose">
      <h2>Cómo comprobarlo</h2>
      <ol>
        <li>Recorre la página solo con <b>Tab</b> y <b>Shift+Tab</b>: el foco debe ser siempre visible y seguir un orden lógico.</li>
        <li>Activa el zoom del navegador al 200 % y verifica que no se corta el contenido.</li>
        <li>Prueba el modo wireframe: la estructura debe seguir siendo comprensible sin color ni imágenes.</li>
        <li>Con un lector de pantalla (NVDA o VoiceOver), comprueba que los formularios anuncian su etiqueta y su error.</li>
      </ol>
      <h2>Limitaciones conocidas</h2>
      <p>El prototipo no sustituye una auditoría WCAG formal. La autenticación y la persistencia son locales, por lo que no hay verificación real de identidad ni cifrado en tránsito. Estas limitaciones se documentan en el informe y se resolverían con un backend, HTTPS y pruebas con usuarios.</p>
    </div>
  </div>`;

  V.cobertura = () => `<div class="doc" style="max-width:1040px">
    <p class="eyebrow">Documentación del prototipo</p>
    <h1>Guía de evaluación y trazabilidad</h1>
    <p class="muted" style="max-width:70ch">Esta página resume dónde se implementa cada requerimiento de la ACA y cómo comprobarlo en menos de cinco minutos. Está pensada para el docente y para el equipo, no forma parte del flujo del usuario final.</p>

    <div class="panel" style="padding:24px">
      <h2 style="margin-bottom:12px">Recursos oficiales del proyecto</h2>
      <p style="margin-bottom:8px"><b>Repositorio en GitHub:</b> <a href="https://github.com/sergiomorar-CUN/equilibra-salud-bienestar-prototipo" target="_blank" rel="noopener">https://github.com/sergiomorar-CUN/equilibra-salud-bienestar-prototipo</a></p>
      <p style="margin-bottom:8px"><b>Prototipo en línea (GitHub Pages):</b> <a href="https://sergiomorar-cun.github.io/equilibra-salud-bienestar-prototipo/" target="_blank" rel="noopener">https://sergiomorar-cun.github.io/equilibra-salud-bienestar-prototipo/</a></p>
      <p style="margin-bottom:6px"><b>Cuenta de prueba:</b> <code>daniela@correo.com</code> · <b>Contraseña:</b> <code>Demo2026*</code></p>
      <p class="muted">También puedes crear una cuenta nueva desde <a href="#/registro" data-go="registro">Crear cuenta</a>. La cuenta demo ya tiene perfil de salud, favoritos y hábitos.</p>
    </div>

    <h2>Requerimientos funcionales</h2>
    <div class="coverage"><table>
      <caption class="sr">Trazabilidad de los requerimientos funcionales</caption>
      <thead><tr><th>RF</th><th>Dónde se ve</th><th>Cómo comprobarlo</th></tr></thead>
      <tbody>
        <tr><td><b>RF1</b><br>Usuarios y perfil de salud</td><td><code>#/registro</code><br><code>#/ingresar</code><br><code>#/perfil-salud</code><br><code>#/cuenta?tab=salud</code></td><td>Crea una cuenta, completa los tres pasos del perfil, edita el nombre y borra el perfil desde Mi cuenta. Cierra sesión y vuelve a entrar.</td></tr>
        <tr><td><b>RF2</b><br>Contenidos saludables</td><td><code>#/inicio</code><br><code>#/explorar</code><br><code>#/recomendacion/a1</code></td><td>Verifica las cuatro categorías (alimentación, actividad física, descanso y bienestar), las 18 tarjetas y el detalle con pasos, fuente y revisor.</td></tr>
        <tr><td><b>RF3</b><br>Búsqueda y filtrado</td><td><code>#/explorar</code></td><td>Busca “dormir”, combina categoría + duración + nivel + dieta. Quita filtros con los chips. Comprueba el contador y el estado vacío.</td></tr>
        <tr><td><b>RF4</b><br>Personalización</td><td><code>#/para-ti</code><br><code>#/inicio</code></td><td>Con la cuenta demo, observa el orden y la razón de cada tarjeta. Cambia el objetivo en el perfil y vuelve a “Para ti”.</td></tr>
        <tr><td><b>RF5</b><br>Favoritos y hábitos</td><td><code>#/favoritos</code><br><code>#/habitos</code></td><td>Marca el corazón de una tarjeta, recarga la página, agrega un hábito desde el detalle y marca el día de hoy. Revisa la tabla semanal.</td></tr>
      </tbody>
    </table></div>

    <h2>Requerimientos no funcionales</h2>
    <div class="coverage"><table>
      <caption class="sr">Trazabilidad de los requerimientos no funcionales</caption>
      <thead><tr><th>RNF</th><th>Evidencia en el prototipo</th><th>Cómo verificarlo</th></tr></thead>
      <tbody>
        <tr><td><b>RNF1</b><br>Rendimiento</td><td>Sin frameworks, sin fuentes ni imágenes externas; SVG en línea y CSS/JS propios. La carga inicial no hace peticiones de red.</td><td>DevTools → Network: solo el documento, el CSS y los JS locales. Lighthouse debe dar rendimiento alto en escritorio.</td></tr>
        <tr><td><b>RNF2</b><br>Escalabilidad</td><td>Separación en capas: <code>datos.js</code>, <code>iconos.js</code>, <code>ilustraciones.js</code>, <code>nucleo.js</code>, <code>componentes.js</code>, vistas y eventos.</td><td>Revisa la carpeta <code>js/</code>. La capa de datos se puede sustituir por una API sin tocar las vistas.</td></tr>
        <tr><td><b>RNF3</b><br>Seguridad y privacidad</td><td>Hash SHA-256 con sal, consentimiento explícito, escape de HTML, descarga y borrado de datos, sesión con vencimiento local.</td><td>Inspecciona <code>localStorage</code>: no hay contraseñas en texto plano. Prueba “Descargar mis datos” y “Eliminar mi cuenta”.</td></tr>
        <tr><td><b>RNF4</b><br>UX y accesibilidad</td><td>Enlace de salto, foco visible, gestión de foco, etiquetas, errores accesibles, contraste AA, <code>prefers-reduced-motion</code> y modo wireframe.</td><td>Recorre con Tab, abre un modal y ciérralo con Escape, revisa la página <a href="#/accesibilidad" data-go="accesibilidad">Accesibilidad</a>.</td></tr>
        <tr><td><b>RNF5</b><br>Compatibilidad</td><td>CSS Grid/Flexbox, navegación inferior en móvil, panel de filtros deslizante y una sola columna por debajo de 780 px.</td><td>DevTools → modo responsive en 320, 768 y 1440 px. Prueba el panel de filtros en móvil.</td></tr>
      </tbody>
    </table></div>

    <div class="panel" style="padding:26px">
      <h2>Capturas sugeridas para el informe</h2>
      <ol class="fig-list">
        <li>Wireframe de inicio con la estructura de hero, categorías y tarjetas.</li>
        <li>Wireframe de explorar con el panel de filtros y la grilla de resultados.</li>
        <li>Wireframe de detalle con el artículo y la barra lateral de acciones.</li>
        <li>Wireframe de perfil de salud con el asistente de tres pasos.</li>
        <li>Mockup de inicio a color.</li>
        <li>Mockup de explorar con filtros activos.</li>
        <li>Mockup de detalle de una recomendación.</li>
        <li>Mockup de “Para ti” con las razones de personalización.</li>
        <li>Mockup de hábitos con estadísticas y tabla semanal.</li>
        <li>Mockup responsive en un viewport móvil de 390 px.</li>
        <li>Pantalla de registro con validación y medidor de contraseña.</li>
        <li>Página de accesibilidad o guía de evaluación como evidencia de RNF.</li>
      </ol>
      <p class="muted" style="font-size:13.5px;margin-top:10px">Para capturas limpias, añade <code>?cap=1</code> a la URL. Para el modo wireframe, <code>?wf=1&amp;cap=1</code>. Para entrar como la cuenta demo, <code>?as=demo</code>.</p>
    </div>
  </div>`;
})();
