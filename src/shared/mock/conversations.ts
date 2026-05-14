import type { Conversation } from './types'

export const CONVERSATIONS: Conversation[] = [
  {
    id: 'conv01',
    leadName: 'Antonella Reyes',
    leadPhone: '+1 (801) 555-2201',
    topic: 'Pregunta por balayage',
    avatarHue: 340,
    lastMessagePreview: 'Perfecto, te confirmo el sábado a las 10:30 ✨',
    unread: 0,
    closed: true,
    closedDeal: 'Balayage · $220',
    script: [
      { role: 'lead', content: 'Hola! Vi tu Instagram. ¿Cuánto cuesta un balayage?', delay: 600 },
      {
        role: 'bot',
        content: '¡Hola Antonella! 💕 Qué bueno que escribes. Nuestro balayage tiene un valor de $220 e incluye:\n\n· Pintado a mano por Lissy\n· Hidratación profunda\n· Brushing final\n\nDura unas 3 horas en sala. ¿Querías agendar?',
        delay: 1400,
      },
      { role: 'lead', content: 'Sí porfa. Tienes disponibilidad este sábado?', delay: 700 },
      {
        role: 'bot',
        content: 'Sí 🌸 Tengo dos opciones este sábado:\n\n· 10:30 AM\n· 2:00 PM\n\n¿Cuál te acomoda mejor?',
        delay: 1100,
      },
      { role: 'lead', content: 'La de las 10:30 está perfecta', delay: 600 },
      {
        role: 'bot',
        content: 'Genial 💖 ¿Me confirmas tu nombre completo y un correo para mandarte el comprobante?',
        delay: 900,
      },
      { role: 'lead', content: 'Antonella Reyes — anto.reyes@gmail.com', delay: 700 },
      {
        role: 'bot',
        content: '¡Listo Antonella! 🎉 Tu cita queda confirmada para el sábado a las 10:30 AM. Te llegará un recordatorio el día antes. Cualquier cosa me avisas por aquí 💕',
        delay: 1100,
      },
      { role: 'lead', content: 'Perfecto, te confirmo el sábado a las 10:30 ✨', delay: 700 },
    ],
  },
  {
    id: 'conv02',
    leadName: 'Valentina Salinas',
    leadPhone: '+1 (801) 555-0167',
    topic: 'Agenda sesión 5 masaje',
    avatarHue: 25,
    lastMessagePreview: 'Genial, nos vemos el lunes 💖',
    unread: 0,
    closed: true,
    closedDeal: 'Sesión 5 · masaje reductivo',
    script: [
      { role: 'lead', content: 'Hola Lissy! Cuándo me toca la quinta sesión?', delay: 600 },
      {
        role: 'bot',
        content: '¡Hola Valentina! 💕 Te queda muy poquito 🙌 La 4 fue la semana pasada, así que la 5 toca esta semana. Tengo:\n\n· Lunes 11:00 AM\n· Miércoles 4:00 PM\n· Sábado 12:00 PM',
        delay: 1300,
      },
      { role: 'lead', content: 'El lunes a las 11 me queda bien', delay: 600 },
      {
        role: 'bot',
        content: 'Anotado 🌸 Lunes 11:00 AM, sesión 5 de 10. Recuerda venir hidratada y con ropa cómoda 💕',
        delay: 1000,
      },
      { role: 'lead', content: 'Genial, nos vemos el lunes 💖', delay: 600 },
    ],
  },
  {
    id: 'conv03',
    leadName: 'Daniela Cortés',
    leadPhone: '+1 (801) 555-0245',
    topic: 'Info paquete 10 sesiones',
    avatarHue: 350,
    lastMessagePreview: 'Quiero agendar la evaluación gratuita',
    unread: 1,
    closed: false,
    script: [
      {
        role: 'lead',
        content: 'Hola! Vi en tu Instagram el paquete de masaje reductivo. Cuánto cuesta y qué incluye?',
        delay: 600,
      },
      {
        role: 'bot',
        content:
          '¡Hola Daniela! 💕 El paquete es de 10 sesiones por $850. Incluye en cada sesión:\n\n✨ Ultrasonido\n✨ Cavitación\n✨ Vacuum\n✨ Radiofrecuencia\n✨ Lipoláser\n✨ Maniobras manuales\n✨ Drenaje linfático\n✨ Criogel\n\nResultados visibles desde la sesión 3-4. ¿Quieres una evaluación gratuita conmigo para ver tu caso?',
        delay: 1600,
      },
      { role: 'lead', content: 'Wow sí, súper completo. La evaluación es presencial?', delay: 700 },
      {
        role: 'bot',
        content:
          'Sí, presencial 🌸 Dura 20 min, te explico el plan personalizado y aclaramos dudas. Sin costo y sin compromiso. Tengo cupos jueves o viernes esta semana.',
        delay: 1200,
      },
      { role: 'lead', content: 'Quiero agendar la evaluación gratuita', delay: 700 },
    ],
  },
  {
    id: 'conv04',
    leadName: 'Sofía Martínez',
    leadPhone: '+1 (801) 555-0189',
    topic: 'Recordatorio cita',
    avatarHue: 220,
    lastMessagePreview: 'Confirmadísimo 🙌',
    unread: 0,
    closed: true,
    closedDeal: 'Corte y peinado confirmado',
    script: [
      {
        role: 'bot',
        content:
          '¡Hola Sofía! 💕 Te recordamos tu cita de mañana:\n\n📅 Martes 10:00 AM\n💇‍♀️ Corte y peinado\n📍 Lissy Stetic — Lehi\n\n¿Confirmas tu asistencia?',
        delay: 700,
      },
      { role: 'lead', content: 'Confirmadísimo 🙌', delay: 500 },
      {
        role: 'bot',
        content: '¡Perfecto! Nos vemos mañana 🌸 Cualquier cambio me avisas con tiempo 💕',
        delay: 900,
      },
    ],
  },
]
