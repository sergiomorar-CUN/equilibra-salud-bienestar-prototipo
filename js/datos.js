/* ============================================================
   Equilibra · Capa de datos
   Contenido editorial de la ACA (18 recomendaciones publicadas).
   En producción esta capa se reemplazaría por una API REST.
   ============================================================ */
const CATS={
 al:{nombre:'Alimentación',icon:'al',col:'#2D6E30',soft:'#E2F0E0',desc:'Comer mejor sin dietas extremas'},
 ac:{nombre:'Actividad física',icon:'ac',col:'#9E4418',soft:'#FBE6DA',desc:'Moverte más, a tu ritmo'},
 de:{nombre:'Descanso',icon:'de',col:'#3F52A0',soft:'#E2E6F6',desc:'Dormir y recuperarte mejor'},
 bi:{nombre:'Bienestar',icon:'bi',col:'#8E3F77',soft:'#F3E2EE',desc:'Manejar el estrés y conectar'}
};
const OBJ={peso:'Controlar mi peso',energia:'Tener más energía',sueno:'Dormir mejor',estres:'Reducir el estrés',condicion:'Mejorar mi condición física'};
const OBJ_IC={peso:'target',energia:'sun',sueno:'de',estres:'bi',condicion:'ac'};
const DIETAS={veg:'Vegetariana',lac:'Sin lactosa',glu:'Sin gluten'};
const NIVELES=['Básico','Intermedio','Avanzado'];
const REV={al:'Nutricionista del equipo de contenidos',ac:'Profesional en ciencias del deporte',de:'Médico general asesor',bi:'Psicóloga asesora'};

const RECS=[
 {id:'a1',cat:'al',img:'plato',titulo:'Arma un plato equilibrado',resumen:'Divide el plato: la mitad en verduras, un cuarto en proteína y un cuarto en cereales integrales o tubérculos.',dur:10,nivel:'Básico',obj:['peso','energia'],dietas:['veg','lac','glu'],
  porque:'Repartir el plato de esta forma ayuda a controlar las porciones sin contar calorías. Las verduras aportan fibra y dan saciedad, y la proteína ayuda a que la energía dure hasta la siguiente comida.',
  pasos:['Sirve primero las verduras o la ensalada hasta cubrir la mitad del plato.','Agrega una porción de proteína del tamaño de la palma de tu mano: pollo, pescado, huevo, fríjol o lenteja.','Completa el último cuarto con arroz, papa, yuca, plátano o arepa, preferiblemente integrales.','Acompaña con agua en lugar de jugo con azúcar.'],
  fuente:'Guías Alimentarias Basadas en Alimentos para la población colombiana (ICBF)',fecha:'2026-09-30',estado:'Publicado'},
 {id:'a2',cat:'al',img:'agua',titulo:'Cambia la gaseosa por agua',resumen:'Reemplaza una bebida azucarada al día por agua. Lleva un termo para tenerla siempre a mano.',dur:5,nivel:'Básico',obj:['peso','energia'],dietas:['veg','lac','glu'],
  porque:'Las bebidas azucaradas suman azúcar sin dar saciedad. La OMS recomienda que los azúcares libres sean menos del 10 % de la energía diaria.',
  pasos:['Identifica en qué momento del día tomas gaseosa o jugo de caja.','Cámbiala por agua, agua con limón o aromática sin azúcar.','Llena un termo por la mañana y procura terminarlo antes de la tarde.'],
  fuente:'Organización Mundial de la Salud, recomendaciones sobre ingesta de azúcares',fecha:'2026-09-28',estado:'Publicado'},
 {id:'a3',cat:'al',img:'fruta',titulo:'Desayuno con fruta entera',resumen:'Incluye una fruta entera en el desayuno: guayaba, papaya, mango o banano. Mejor entera que en jugo.',dur:10,nivel:'Básico',obj:['energia','peso'],dietas:['veg','lac','glu'],
  porque:'La fruta entera conserva la fibra, que se pierde en buena parte al licuarla y colarla. Así llenas más con menos azúcar.',
  pasos:['Elige una fruta de temporada que tengas en casa.','Pártela y sírvela junto al desayuno, no después.','Si preparas jugo, no lo cueles y no le agregues azúcar.'],
  fuente:'Guías Alimentarias Basadas en Alimentos para la población colombiana (ICBF)',fecha:'2026-09-20',estado:'Publicado'},
 {id:'a4',cat:'al',img:'plato',titulo:'Almuerzo colombiano más liviano',resumen:'Mantén los sabores de siempre con pequeños ajustes: menos arroz, más ensalada y fritos solo de vez en cuando.',dur:15,nivel:'Intermedio',obj:['peso'],dietas:['lac','glu'],
  porque:'No hace falta cambiar de comida para comer mejor. Ajustar las porciones del corrientazo reduce calorías y mantiene la costumbre.',
  pasos:['Pide media porción de arroz y una porción doble de ensalada.','Prefiere fríjoles, lentejas o garbanzos como acompañante.','Cambia la tajada frita por plátano cocido o asado algunos días.','Deja los fritos para una o dos veces por semana.'],
  fuente:'Guías Alimentarias Basadas en Alimentos para la población colombiana (ICBF)',fecha:'2026-09-15',estado:'Publicado'},
 {id:'a5',cat:'al',img:'fruta',titulo:'Prepara tus meriendas del día',resumen:'Deja listas por la mañana dos meriendas sencillas para no recurrir al paquete de la tienda.',dur:15,nivel:'Intermedio',obj:['energia','peso'],dietas:['veg','glu'],
  porque:'Cuando el hambre llega sin un plan, se compra lo que esté más cerca. Tener la merienda lista facilita elegir bien.',
  pasos:['Escoge una opción con proteína: yogur sin azúcar, huevo cocido o un puñado de maní.','Escoge una fruta o verdura para picar: zanahoria, pepino o mandarina.','Guárdalas en recipientes pequeños junto a tus llaves.'],
  fuente:'Guías Alimentarias Basadas en Alimentos para la población colombiana (ICBF)',fecha:'2026-09-10',estado:'Publicado'},
 {id:'c1',cat:'ac',img:'camino',titulo:'Caminata rápida de 30 minutos',resumen:'Camina a un ritmo en el que puedas hablar, pero no cantar. Cinco días así suman 150 minutos a la semana.',dur:30,nivel:'Básico',obj:['peso','condicion','estres'],dietas:[],
  porque:'La OMS recomienda a los adultos entre 150 y 300 minutos semanales de actividad aeróbica moderada. Caminar rápido es la forma más fácil de empezar.',
  pasos:['Usa zapatos cómodos y lleva agua.','Camina 5 minutos suave para calentar.','Sube el ritmo durante 20 minutos.','Termina con 5 minutos suaves y estira las piernas.'],
  fuente:'Directrices de la OMS sobre actividad física y hábitos sedentarios (2020)',fecha:'2026-10-02',estado:'Publicado'},
 {id:'c2',cat:'ac',img:'estira',titulo:'Pausa activa de 5 minutos',resumen:'Si trabajas sentado, levántate cada hora y mueve cuello, hombros, muñecas y espalda.',dur:5,nivel:'Básico',obj:['estres','energia'],dietas:[],
  porque:'Pasar muchas horas sentado se asocia con más riesgo para la salud. Interrumpir ese tiempo con movimientos cortos reduce la rigidez y ayuda a concentrarse.',
  pasos:['Ponte de pie y gira los hombros hacia atrás 10 veces.','Inclina la cabeza a cada lado y sostén 15 segundos.','Entrelaza los dedos y estira los brazos hacia arriba.','Camina un minuto, por ejemplo hasta el filtro de agua.'],
  fuente:'Directrices de la OMS sobre actividad física y hábitos sedentarios (2020)',fecha:'2026-10-05',estado:'Publicado'},
 {id:'c3',cat:'ac',img:'pesa',titulo:'Rutina de fuerza en casa',resumen:'Tres ejercicios con el peso de tu cuerpo, dos veces por semana. No necesitas gimnasio.',dur:20,nivel:'Intermedio',obj:['condicion','peso'],dietas:[],
  porque:'Además de la actividad aeróbica, la OMS recomienda fortalecer los músculos al menos dos días por semana.',
  pasos:['Haz 3 series de 12 sentadillas apoyándote en una silla si lo necesitas.','Haz 3 series de 8 flexiones apoyando las manos en la pared o la mesa.','Haz 3 series de 12 puentes de glúteo acostado boca arriba.','Descansa un minuto entre series.'],
  fuente:'Directrices de la OMS sobre actividad física y hábitos sedentarios (2020)',fecha:'2026-09-25',estado:'Publicado'},
 {id:'c4',cat:'ac',img:'camino',titulo:'Usa las escaleras',resumen:'Cuando sean tres pisos o menos, sube por las escaleras en lugar de usar el ascensor.',dur:5,nivel:'Básico',obj:['condicion','energia'],dietas:[],
  porque:'Son minutos de actividad que caben en el día sin apartar tiempo. Sumados en la semana, cuentan.',
  pasos:['Empieza subiendo un piso y toma el ascensor el resto.','Agrega un piso cada semana.','Sube a tu ritmo y apóyate en la baranda.'],
  fuente:'Directrices de la OMS sobre actividad física y hábitos sedentarios (2020)',fecha:'2026-09-18',estado:'Publicado'},
 {id:'c5',cat:'ac',img:'camino',titulo:'Intervalos en bicicleta',resumen:'Alterna dos minutos de pedaleo fuerte con dos suaves. Para quien ya hace ejercicio con regularidad.',dur:25,nivel:'Avanzado',obj:['condicion'],dietas:[],
  porque:'Los intervalos combinan esfuerzo alto con recuperación y permiten trabajar la capacidad cardiovascular en menos tiempo.',
  pasos:['Calienta 5 minutos a ritmo suave.','Pedalea fuerte 2 minutos y suave 2 minutos; repite 4 veces.','Termina con 4 minutos suaves.','Si tienes alguna condición cardiaca, consulta antes con tu médico.'],
  fuente:'Directrices de la OMS sobre actividad física y hábitos sedentarios (2020)',fecha:'2026-09-12',estado:'Publicado'},
 {id:'d1',cat:'de',img:'luna',titulo:'Horario fijo para dormir',resumen:'Acuéstate y levántate a la misma hora todos los días, también el fin de semana. Apunta a 7 horas o más.',dur:5,nivel:'Básico',obj:['sueno','energia'],dietas:[],
  porque:'Un horario regular ayuda a que el reloj biológico se ajuste. La Academia Americana de Medicina del Sueño recomienda 7 horas o más para los adultos.',
  pasos:['Calcula tu hora de acostarte restando 7,5 horas a la hora en que debes levantarte.','Programa una alarma 30 minutos antes para empezar a prepararte.','Mantén el horario el fin de semana, con máximo una hora de diferencia.'],
  fuente:'Watson et al. (2015), consenso AASM y SRS sobre horas de sueño en adultos',fecha:'2026-10-06',estado:'Publicado'},
 {id:'d2',cat:'de',img:'pantalla',titulo:'Apaga las pantallas antes de dormir',resumen:'Deja el celular fuera de la cama 30 minutos antes de dormir y cambia el video por lectura o música suave.',dur:30,nivel:'Básico',obj:['sueno','estres'],dietas:[],
  porque:'Las notificaciones y el contenido que engancha retrasan la hora de dormir. Separar el celular de la cama reduce la tentación.',
  pasos:['Activa el modo No molestar a una hora fija.','Carga el celular fuera de la habitación o lejos de la cama.','Usa esos 30 minutos para leer, orar, conversar o preparar el día siguiente.'],
  fuente:'Recomendaciones de higiene del sueño, equipo de contenidos',fecha:'2026-10-01',estado:'Publicado'},
 {id:'d3',cat:'de',img:'cama',titulo:'Siesta corta de 20 minutos',resumen:'Si duermes siesta, que sea corta y antes de las 3 p. m. para no afectar el sueño de la noche.',dur:20,nivel:'Básico',obj:['energia'],dietas:[],
  porque:'Una siesta corta puede devolver la atención en la tarde. Las siestas largas o tardías dificultan dormirse en la noche.',
  pasos:['Pon una alarma de 20 minutos.','Recuéstate en un lugar tranquilo, aunque no te duermas del todo.','Al levantarte, toma agua y muévete un par de minutos.'],
  fuente:'Recomendaciones de higiene del sueño, equipo de contenidos',fecha:'2026-09-22',estado:'Publicado'},
 {id:'d4',cat:'de',img:'cama',titulo:'Prepara tu habitación para dormir',resumen:'Oscura, fresca y silenciosa. Pequeños cambios en el cuarto hacen más fácil conciliar el sueño.',dur:15,nivel:'Básico',obj:['sueno'],dietas:[],
  porque:'La luz y el ruido interrumpen el sueño aunque no te despiertes del todo. En clima cálido, un ambiente fresco ayuda a dormir de corrido.',
  pasos:['Tapa las luces de aparatos con cinta o cúbrelos.','Usa cortinas gruesas o un antifaz.','Ventila el cuarto antes de dormir o usa ventilador.','Si hay ruido de la calle, prueba tapones o ruido blanco.'],
  fuente:'Recomendaciones de higiene del sueño, equipo de contenidos',fecha:'2026-09-08',estado:'Publicado'},
 {id:'b1',cat:'bi',img:'respira',titulo:'Respiración diafragmática',resumen:'Cinco minutos de respiración lenta con el abdomen para bajar la tensión del día.',dur:5,nivel:'Básico',obj:['estres','sueno'],dietas:[],
  porque:'Respirar lento y profundo activa la respuesta de relajación del cuerpo. Es una técnica que puedes usar en cualquier lugar.',
  pasos:['Siéntate derecho y pon una mano en el pecho y otra en el abdomen.','Inhala por la nariz en 4 tiempos, sintiendo que sube la mano del abdomen.','Exhala por la boca en 6 tiempos.','Repite durante 5 minutos.'],
  fuente:'Material de apoyo de la psicóloga asesora del equipo',fecha:'2026-10-04',estado:'Publicado'},
 {id:'b2',cat:'bi',img:'taza',titulo:'Escribe tres cosas buenas del día',resumen:'Antes de dormir, anota tres cosas que salieron bien hoy, por pequeñas que sean.',dur:10,nivel:'Básico',obj:['estres','sueno'],dietas:[],
  porque:'Registrar lo positivo ayuda a cerrar el día con otra perspectiva y a no quedarse solo con lo que salió mal.',
  pasos:['Ten una libreta en la mesa de noche.','Escribe tres cosas concretas que salieron bien y por qué.','Léelas de nuevo el domingo.'],
  fuente:'Material de apoyo de la psicóloga asesora del equipo',fecha:'2026-09-27',estado:'Publicado'},
 {id:'b3',cat:'bi',img:'sol',titulo:'Sal a tomar aire 15 minutos',resumen:'Un paseo corto al aire libre en la mañana ayuda a despejarte y a regular el ciclo de sueño.',dur:15,nivel:'Básico',obj:['estres','energia','sueno'],dietas:[],
  porque:'La luz de la mañana ayuda a sincronizar el reloj biológico. Salir de la casa o la oficina también corta la rutina.',
  pasos:['Elige un momento antes de las 10 a. m.','Sal sin audífonos y fíjate en lo que te rodea.','Usa protector solar si el sol está fuerte.'],
  fuente:'Recomendaciones de higiene del sueño, equipo de contenidos',fecha:'2026-09-14',estado:'Publicado'},
 {id:'b4',cat:'bi',img:'sol',titulo:'Llama a alguien que aprecias',resumen:'Dedica diez minutos a una llamada con un familiar o amigo, sin otra cosa abierta.',dur:10,nivel:'Básico',obj:['estres'],dietas:[],
  porque:'Las relaciones cercanas son una de las fuentes más estables de bienestar. Una llamada corta mantiene el vínculo.',
  pasos:['Elige a una persona con la que no hables hace tiempo.','Llama en lugar de escribir.','Pregunta cómo está y escucha sin afán.'],
  fuente:'Material de apoyo de la psicóloga asesora del equipo',fecha:'2026-09-05',estado:'Publicado'}
];

/* Exponer la capa de datos para el resto de módulos. */
window.EquilibraData = Object.freeze({ CATS, OBJ, OBJ_IC, DIETAS, NIVELES, REV, RECS });
