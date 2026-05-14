# Lissy Stetic — Business Logic (Demo SaaS para Cercai.cl)

## Problema

Lissy (dueña de **Lissy Stetic**, Lehi, Utah) acaba de expandir su negocio a una casa grande con modelo híbrido. Hoy lleva en cabeza, post-its y WhatsApp:
- Historial de cada clienta y en qué sesión de su paquete va.
- Citas propias y choques con horarios de los boxes subarrendados.
- Pagos pendientes de las arrendatarias de cada box.
- Ingresos mezclados (servicios propios + arriendos).
- Mensajes de leads que se pierden a las 11pm cuando ya no contesta.

A medida que crece, esa operación manual la va a quebrar. Pierde upsells (clientas que no vuelven a tiempo), pierde ingresos por boxes mal cobrados, pierde leads que no responde fuera de horario.

## Costo del dolor

- ~5 horas/semana respondiendo WhatsApp manualmente.
- ~10% de clientas no regresan en la ventana ideal (30 días post-balayage, 7 días entre sesiones de masaje) — venta cruzada perdida.
- Cobros de arriendo en planilla manual → retrasos y olvidos.
- Sin visibilidad de ingreso real por categoría → no sabe si conviene más expandir cabello o masajes.

## Solución (en 1 frase)

Un panel centralizado que une CRM de clientas con paquetes, calendario, gestión de boxes subarrendados, finanzas y un asistente IA estilo WhatsApp que conversa con leads 24/7 y sugiere upsells automáticos.

## Usuario

**Lissy** (dueña-operadora). Mujer, latina, en Lehi UT, atiende ella misma servicios de cabello y masajes reductivos, y administra el subarriendo de boxes a otros profesionales independientes (manicuristas, cosmetólogas, etc.).

Público final de Lissy: comunidad latina en USA → la UI va en **español latino**.

## Flujo (happy path de la demo)

1. Lissy abre el panel → ve el Dashboard con ingresos del mes (split servicios vs arriendos), citas del día, y 3-5 alertas IA accionables.
2. Una alerta dice "Camila cumple 30 días desde su balayage — sugerir retoque". Click → ficha de Camila → ve su historial + barra "Sesión 4 de 10 de masaje reductivo".
3. Va al Calendario → revisa la semana.
4. Va a Boxes → ve estado de cada espacio + cobro pendiente de María (manicurista) por el mes.
5. Va a Finanzas → ve el desglose de ingresos.
6. Va al Asistente IA → ve 4 conversaciones del bot con leads cerrando citas a las 11pm.

## Datos (input / output)

**Input** (estado del negocio, hoy mockeado):
- Clientas (~30 con nombres latinos)
- Catálogo de servicios (queratina, balayage, brushing, masaje reductivo en paquete de 10 sesiones a $850)
- Citas
- Boxes + arrendatarias + sus cobros
- Transacciones de caja
- Conversaciones del bot con leads

**Output** (lo que el panel produce):
- KPIs operativos (ingresos, citas, alertas)
- Sugerencias de upsell por clienta
- Estado de cobranza de arriendos
- Cierres automáticos de citas vía bot

## KPI de éxito de la demo

Lissy ve el demo y pregunta "¿cuánto cuesta tenerlo en producción?". Eso = demo cumplió su trabajo.

## Stack técnico (decisiones)

- **Base**: SaaS Factory V4 (Next 16 + React 19 + Tailwind 3.4 + shadcn/ui).
- **Estado**: mock data en TypeScript (sin Supabase en esta versión — la estructura de servicios queda lista para enchufar Supabase si Lissy compra producción).
- **Auth**: bypass total → la home redirige directo al dashboard. El grupo `(auth)/` queda inactivo pero presente.
- **Chat IA**: scripted (sin LLM real) — conversación pregrabada, predecible, cero costo recurrente.
- **Idioma UI**: español latino USA.
- **Design**: paleta rosa pastel + blanco + negro suave, bordes redondeados (`--radius: 1rem`), tipografía elegante sans-serif. Vibe femenino profesional, NO videojuego.
- **Deploy**: Vercel cuando Doryan dé acceso.

## Lo que NO entra en el alcance del demo

- Auth real con OAuth.
- Pagos online (Stripe/Polar).
- Integración real con WhatsApp Business API.
- LLM conectado al chatbot.
- App móvil instalable (PWA).
- Notificaciones SMS/email.
- Multi-tenant (solo cuenta de Lissy).

Estos son **oportunidades de upsell post-demo**, no parte de la entrega.

## Próximos pasos post-aprobación de la demo

1. Lissy aprueba el visual y pide producción → cotización Cercai con desarrollo inicial ($800.000 CLP base + mensualidad).
2. Conectar Supabase real (auth + DB) reemplazando el adaptador mock.
3. Reemplazar chat scripted por LLM real (OpenRouter + Vercel AI SDK) con system prompt entrenado en el catálogo y políticas de Lissy.
4. Integrar WhatsApp Business API (Twilio o Meta directo) para que el bot opere en el WhatsApp real del negocio.
5. Notificaciones automáticas (SMS recordatorio cita, email retoque) — feature de upsell aparte.
