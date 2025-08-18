-- Políticas de seguridad para Row Level Security (RLS)

-- Habilitar RLS en todas las tablas
ALTER TABLE barberias ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE barberos ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicios ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservas ENABLE ROW LEVEL SECURITY;
ALTER TABLE reserva_servicios ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE mensajes ENABLE ROW LEVEL SECURITY;

-- Políticas para usuarios autenticados
CREATE POLICY "Los usuarios pueden ver sus propios datos" ON usuarios
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Los usuarios pueden actualizar sus propios datos" ON usuarios
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Políticas para barberos
CREATE POLICY "Los barberos pueden ver datos de su barbería" ON barberos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM usuarios 
      WHERE usuarios.id = auth.uid()::uuid 
      AND (usuarios.rol = 'admin' OR usuarios.barberia_id = barberos.barberia_id)
    )
  );

-- Políticas para servicios
CREATE POLICY "Todos pueden ver servicios activos" ON servicios
  FOR SELECT USING (activo = true);

CREATE POLICY "Solo admins pueden modificar servicios" ON servicios
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM usuarios 
      WHERE usuarios.id = auth.uid()::uuid 
      AND usuarios.rol = 'admin'
      AND usuarios.barberia_id = servicios.barberia_id
    )
  );

-- Políticas para reservas
CREATE POLICY "Los usuarios pueden ver sus propias reservas" ON reservas
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM usuarios u
      LEFT JOIN clientes c ON u.id = c.usuario_id
      LEFT JOIN barberos b ON u.id = b.usuario_id
      WHERE u.id = auth.uid()::uuid
      AND (c.id = reservas.cliente_id OR b.id = reservas.barbero_id OR u.rol = 'admin')
    )
  );

-- Políticas para notificaciones
CREATE POLICY "Los usuarios pueden ver sus propias notificaciones" ON notificaciones
  FOR SELECT USING (auth.uid()::text = usuario_id::text);
