// Esquemas de MongoDB para la aplicación de barbería

export const BarberiaSchema = {
  _id: "ObjectId",
  nombre: "String",
  direccion: "String",
  telefono: "String",
  email: "String",
  logo: "String",
  horarios: {
    lunes: { inicio: "String", fin: "String", activo: "Boolean" },
    martes: { inicio: "String", fin: "String", activo: "Boolean" },
    miercoles: { inicio: "String", fin: "String", activo: "Boolean" },
    jueves: { inicio: "String", fin: "String", activo: "Boolean" },
    viernes: { inicio: "String", fin: "String", activo: "Boolean" },
    sabado: { inicio: "String", fin: "String", activo: "Boolean" },
    domingo: { inicio: "String", fin: "String", activo: "Boolean" },
  },
  configuracion: {
    moneda: "String",
    idioma: "String",
    zona_horaria: "String",
  },
  createdAt: "Date",
  updatedAt: "Date",
}

export const BarberoSchema = {
  _id: "ObjectId",
  barberia_id: "ObjectId",
  nombre: "String",
  apellido: "String",
  email: "String",
  telefono: "String",
  whatsapp: "String",
  direccion: "String",
  fecha_nacimiento: "Date",
  fecha_contratacion: "Date",
  salario: "Number",
  comision: "Number",
  especialidades: ["String"],
  foto: "String",
  activo: "Boolean",
  horarios: {
    lunes: { inicio: "String", fin: "String", activo: "Boolean" },
    martes: { inicio: "String", fin: "String", activo: "Boolean" },
    miercoles: { inicio: "String", fin: "String", activo: "Boolean" },
    jueves: { inicio: "String", fin: "String", activo: "Boolean" },
    viernes: { inicio: "String", fin: "String", activo: "Boolean" },
    sabado: { inicio: "String", fin: "String", activo: "Boolean" },
    domingo: { inicio: "String", fin: "String", activo: "Boolean" },
  },
  estadisticas: {
    citas_completadas: "Number",
    citas_canceladas: "Number",
    rating_promedio: "Number",
    ingresos_mes: "Number",
  },
  createdAt: "Date",
  updatedAt: "Date",
}

export const ServicioSchema = {
  _id: "ObjectId",
  barberia_id: "ObjectId",
  nombre: "String",
  descripcion: "String",
  precio: "Number",
  duracion: "Number", // en minutos
  categoria: "String", // "corte", "barba", "tratamiento", "combo"
  genero: "String", // "masculino", "femenino", "unisex"
  imagen: "String",
  activo: "Boolean",
  popularidad: "Number",
  opciones_extras: [
    {
      nombre: "String",
      precio_adicional: "Number",
      descripcion: "String",
    },
  ],
  createdAt: "Date",
  updatedAt: "Date",
}

export const ClienteSchema = {
  _id: "ObjectId",
  barberia_id: "ObjectId",
  nombre: "String",
  apellido: "String",
  email: "String",
  telefono: "String",
  whatsapp: "String",
  fecha_nacimiento: "Date",
  genero: "String",
  direccion: "String",
  preferencias: {
    barbero_favorito: "ObjectId",
    servicios_favoritos: ["ObjectId"],
    notas_especiales: "String",
  },
  historial: [
    {
      fecha: "Date",
      servicio_id: "ObjectId",
      barbero_id: "ObjectId",
      precio_pagado: "Number",
      rating: "Number",
      comentario: "String",
    },
  ],
  puntos_fidelidad: "Number",
  activo: "Boolean",
  createdAt: "Date",
  updatedAt: "Date",
}

export const ReservaSchema = {
  _id: "ObjectId",
  barberia_id: "ObjectId",
  cliente_id: "ObjectId",
  barbero_id: "ObjectId",
  servicio_id: "ObjectId",
  fecha: "Date",
  hora_inicio: "String",
  hora_fin: "String",
  estado: "String", // "pendiente", "confirmada", "en_proceso", "completada", "cancelada"
  precio_total: "Number",
  servicios_extras: [
    {
      servicio_id: "ObjectId",
      precio: "Number",
    },
  ],
  notas_cliente: "String",
  notas_barbero: "String",
  metodo_pago: "String",
  confirmada_por_barbero: "Boolean",
  confirmada_por_cliente: "Boolean",
  recordatorios_enviados: [
    {
      tipo: "String", // "whatsapp", "email", "sms"
      fecha_envio: "Date",
      enviado: "Boolean",
    },
  ],
  createdAt: "Date",
  updatedAt: "Date",
}

export const NotificacionSchema = {
  _id: "ObjectId",
  barberia_id: "ObjectId",
  destinatario_id: "ObjectId", // cliente_id o barbero_id
  tipo_destinatario: "String", // "cliente" o "barbero"
  tipo_notificacion: "String", // "nueva_reserva", "confirmacion", "recordatorio", "cancelacion"
  titulo: "String",
  mensaje: "String",
  leida: "Boolean",
  reserva_id: "ObjectId",
  createdAt: "Date",
}

export const ConfiguracionSchema = {
  _id: "ObjectId",
  barberia_id: "ObjectId",
  notificaciones: {
    whatsapp_activo: "Boolean",
    email_activo: "Boolean",
    recordatorio_24h: "Boolean",
    recordatorio_2h: "Boolean",
  },
  horarios_trabajo: {
    apertura_general: "String",
    cierre_general: "String",
    dias_laborales: ["String"],
  },
  politicas: {
    tiempo_cancelacion: "Number", // horas
    deposito_requerido: "Boolean",
    porcentaje_deposito: "Number",
  },
  integraciones: {
    whatsapp_token: "String",
    email_config: {
      smtp_host: "String",
      smtp_port: "Number",
      email_usuario: "String",
      email_password: "String",
    },
  },
  updatedAt: "Date",
}
