// Datos de ejemplo para MongoDB

import clientPromise from "../lib/mongodb.js"

async function insertSampleData() {
  try {
    const client = await clientPromise
    const db = client.db("barberia_app")

    // Insertar barbería principal
    const barberia = await db.collection("barberias").insertOne({
      nombre: "Barbería Elegante",
      direccion: "Calle 123 #45-67, Bogotá",
      telefono: "+57 301 234 5678",
      email: "info@barberiaelegante.com",
      logo: "/logo-barberia.png",
      horarios: {
        lunes: { inicio: "09:00", fin: "18:00", activo: true },
        martes: { inicio: "09:00", fin: "18:00", activo: true },
        miercoles: { inicio: "09:00", fin: "18:00", activo: true },
        jueves: { inicio: "09:00", fin: "18:00", activo: true },
        viernes: { inicio: "09:00", fin: "19:00", activo: true },
        sabado: { inicio: "08:00", fin: "17:00", activo: true },
        domingo: { inicio: "10:00", fin: "15:00", activo: false },
      },
      configuracion: {
        moneda: "COP",
        idioma: "es",
        zona_horaria: "America/Bogota",
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const barberia_id = barberia.insertedId

    // Insertar barberos
    const barberos = await db.collection("barberos").insertMany([
      {
        barberia_id: barberia_id,
        nombre: "Carlos",
        apellido: "Rodríguez",
        email: "carlos@barberiaelegante.com",
        telefono: "+57 301 111 2222",
        whatsapp: "+57 301 111 2222",
        direccion: "Carrera 15 #32-45",
        fecha_nacimiento: new Date("1985-03-15"),
        fecha_contratacion: new Date("2020-01-15"),
        salario: 2500000,
        comision: 15,
        especialidades: ["Cortes Clásicos", "Barba", "Bigote"],
        foto: "/barbero-carlos.jpg",
        activo: true,
        horarios: {
          lunes: { inicio: "09:00", fin: "18:00", activo: true },
          martes: { inicio: "09:00", fin: "18:00", activo: true },
          miercoles: { inicio: "09:00", fin: "18:00", activo: true },
          jueves: { inicio: "09:00", fin: "18:00", activo: true },
          viernes: { inicio: "09:00", fin: "19:00", activo: true },
          sabado: { inicio: "08:00", fin: "17:00", activo: true },
          domingo: { inicio: "10:00", fin: "15:00", activo: false },
        },
        estadisticas: {
          citas_completadas: 245,
          citas_canceladas: 12,
          rating_promedio: 4.8,
          ingresos_mes: 3200000,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        barberia_id: barberia_id,
        nombre: "Miguel",
        apellido: "Torres",
        email: "miguel@barberiaelegante.com",
        telefono: "+57 302 333 4444",
        whatsapp: "+57 302 333 4444",
        direccion: "Calle 20 #15-30",
        fecha_nacimiento: new Date("1990-07-22"),
        fecha_contratacion: new Date("2021-06-01"),
        salario: 2200000,
        comision: 12,
        especialidades: ["Cortes Modernos", "Fade", "Diseños"],
        foto: "/barbero-miguel.jpg",
        activo: true,
        horarios: {
          lunes: { inicio: "10:00", fin: "19:00", activo: true },
          martes: { inicio: "10:00", fin: "19:00", activo: true },
          miercoles: { inicio: "10:00", fin: "19:00", activo: true },
          jueves: { inicio: "10:00", fin: "19:00", activo: true },
          viernes: { inicio: "10:00", fin: "20:00", activo: true },
          sabado: { inicio: "09:00", fin: "18:00", activo: true },
          domingo: { inicio: "11:00", fin: "16:00", activo: false },
        },
        estadisticas: {
          citas_completadas: 189,
          citas_canceladas: 8,
          rating_promedio: 4.6,
          ingresos_mes: 2800000,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])

    // Insertar servicios
    const servicios = await db.collection("servicios").insertMany([
      {
        barberia_id: barberia_id,
        nombre: "Corte Clásico Caballero",
        descripcion: "Corte tradicional con tijera y máquina",
        precio: 25000,
        duracion: 30,
        categoria: "corte",
        genero: "masculino",
        imagen: "/servicio-corte-clasico.jpg",
        activo: true,
        popularidad: 95,
        opciones_extras: [
          { nombre: "Lavado", precio_adicional: 8000, descripcion: "Lavado con champú premium" },
          { nombre: "Masaje", precio_adicional: 12000, descripcion: "Masaje relajante en cuero cabelludo" },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        barberia_id: barberia_id,
        nombre: "Corte Moderno + Fade",
        descripcion: "Corte contemporáneo con degradado",
        precio: 35000,
        duracion: 45,
        categoria: "corte",
        genero: "masculino",
        imagen: "/servicio-fade.jpg",
        activo: true,
        popularidad: 88,
        opciones_extras: [
          { nombre: "Diseño", precio_adicional: 15000, descripcion: "Diseño personalizado en el cabello" },
          { nombre: "Cera", precio_adicional: 5000, descripcion: "Aplicación de cera para peinado" },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        barberia_id: barberia_id,
        nombre: "Arreglo de Barba",
        descripcion: "Perfilado y arreglo completo de barba",
        precio: 20000,
        duracion: 25,
        categoria: "barba",
        genero: "masculino",
        imagen: "/servicio-barba.jpg",
        activo: true,
        popularidad: 76,
        opciones_extras: [
          { nombre: "Aceite", precio_adicional: 8000, descripcion: "Aceite nutritivo para barba" },
          { nombre: "Cera para bigote", precio_adicional: 6000, descripcion: "Cera modeladora para bigote" },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        barberia_id: barberia_id,
        nombre: "Corte Cabello Dama",
        descripcion: "Corte y peinado para damas",
        precio: 45000,
        duracion: 60,
        categoria: "corte",
        genero: "femenino",
        imagen: "/servicio-dama.jpg",
        activo: true,
        popularidad: 65,
        opciones_extras: [
          { nombre: "Brushing", precio_adicional: 15000, descripcion: "Peinado con brushing profesional" },
          { nombre: "Tratamiento", precio_adicional: 20000, descripcion: "Tratamiento hidratante" },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])

    // Insertar clientes de ejemplo
    const clientes = await db.collection("clientes").insertMany([
      {
        barberia_id: barberia_id,
        nombre: "Juan",
        apellido: "Pérez",
        email: "juan.perez@email.com",
        telefono: "+57 300 123 4567",
        whatsapp: "+57 300 123 4567",
        fecha_nacimiento: new Date("1988-05-12"),
        genero: "masculino",
        direccion: "Calle 50 #25-30",
        preferencias: {
          barbero_favorito: barberos.insertedIds[0],
          servicios_favoritos: [servicios.insertedIds[0]],
          notas_especiales: "Prefiere cortes conservadores",
        },
        historial: [],
        puntos_fidelidad: 150,
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        barberia_id: barberia_id,
        nombre: "María",
        apellido: "González",
        email: "maria.gonzalez@email.com",
        telefono: "+57 301 987 6543",
        whatsapp: "+57 301 987 6543",
        fecha_nacimiento: new Date("1992-11-08"),
        genero: "femenino",
        direccion: "Carrera 30 #40-15",
        preferencias: {
          barbero_favorito: barberos.insertedIds[1],
          servicios_favoritos: [servicios.insertedIds[3]],
          notas_especiales: "Le gusta probar estilos nuevos",
        },
        historial: [],
        puntos_fidelidad: 75,
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])

    // Insertar configuración
    await db.collection("configuracion").insertOne({
      barberia_id: barberia_id,
      notificaciones: {
        whatsapp_activo: true,
        email_activo: true,
        recordatorio_24h: true,
        recordatorio_2h: true,
      },
      horarios_trabajo: {
        apertura_general: "09:00",
        cierre_general: "18:00",
        dias_laborales: ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado"],
      },
      politicas: {
        tiempo_cancelacion: 24,
        deposito_requerido: false,
        porcentaje_deposito: 0,
      },
      integraciones: {
        whatsapp_token: "",
        email_config: {
          smtp_host: "",
          smtp_port: 587,
          email_usuario: "",
          email_password: "",
        },
      },
      updatedAt: new Date(),
    })

    console.log("Datos de ejemplo insertados exitosamente")
    console.log("Barbería ID:", barberia_id)
    console.log("Barberos insertados:", barberos.insertedCount)
    console.log("Servicios insertados:", servicios.insertedCount)
    console.log("Clientes insertados:", clientes.insertedCount)
  } catch (error) {
    console.error("Error insertando datos:", error)
  }
}

insertSampleData()
