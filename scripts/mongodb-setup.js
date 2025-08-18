// Script para configurar la base de datos MongoDB

import clientPromise from "../lib/mongodb.js"

async function setupDatabase() {
  try {
    const client = await clientPromise
    const db = client.db("barberia_app")

    // Crear colecciones con validación
    await db.createCollection("barberias")
    await db.createCollection("barberos")
    await db.createCollection("servicios")
    await db.createCollection("clientes")
    await db.createCollection("reservas")
    await db.createCollection("notificaciones")
    await db.createCollection("configuracion")

    // Crear índices para optimizar consultas
    await db.collection("barberos").createIndex({ barberia_id: 1, activo: 1 })
    await db.collection("servicios").createIndex({ barberia_id: 1, activo: 1 })
    await db.collection("clientes").createIndex({ barberia_id: 1, email: 1 })
    await db.collection("reservas").createIndex({ barberia_id: 1, fecha: 1, barbero_id: 1 })
    await db.collection("notificaciones").createIndex({ destinatario_id: 1, leida: 1 })

    console.log("Base de datos configurada exitosamente")
  } catch (error) {
    console.error("Error configurando la base de datos:", error)
  }
}

setupDatabase()
