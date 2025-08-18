-- Insertar datos de ejemplo para la aplicación de barbería

-- Insertar barberías de ejemplo
INSERT INTO barberias (nombre, direccion, telefono, email) VALUES
('Barbería El Clásico', 'Calle 123 #45-67, Bogotá', '+57 301 234 5678', 'info@elclasico.com'),
('Modern Cuts', 'Carrera 15 #32-18, Medellín', '+57 304 567 8901', 'contacto@moderncuts.com'),
('Estilo Urbano', 'Avenida 68 #25-30, Cali', '+57 315 678 9012', 'hola@estilourbano.com');

-- Insertar usuarios administradores
INSERT INTO usuarios (email, nombre, telefono, rol, barberia_id) VALUES
('admin@elclasico.com', 'Carlos Administrador', '+57 301 111 1111', 'admin', (SELECT id FROM barberias WHERE nombre = 'Barbería El Clásico')),
('admin@moderncuts.com', 'Ana Gerente', '+57 304 222 2222', 'admin', (SELECT id FROM barberias WHERE nombre = 'Modern Cuts'));

-- Insertar usuarios barberos
INSERT INTO usuarios (email, nombre, telefono, rol, barberia_id) VALUES
('miguel@elclasico.com', 'Miguel Rodríguez', '+57 301 333 3333', 'barbero', (SELECT id FROM barberias WHERE nombre = 'Barbería El Clásico')),
('sofia@moderncuts.com', 'Sofía García', '+57 304 444 4444', 'barbero', (SELECT id FROM barberias WHERE nombre = 'Modern Cuts')),
('david@estilourbano.com', 'David López', '+57 315 555 5555', 'barbero', (SELECT id FROM barberias WHERE nombre = 'Estilo Urbano'));

-- Insertar información adicional de barberos
INSERT INTO barberos (usuario_id, barberia_id, especialidades, experiencia, salario, whatsapp) VALUES
((SELECT id FROM usuarios WHERE email = 'miguel@elclasico.com'), 
 (SELECT id FROM barberias WHERE nombre = 'Barbería El Clásico'),
 ARRAY['Cortes clásicos', 'Arreglo de barba'], 8, 2500000, '+57 301 333 3333'),
((SELECT id FROM usuarios WHERE email = 'sofia@moderncuts.com'),
 (SELECT id FROM barberias WHERE nombre = 'Modern Cuts'),
 ARRAY['Cortes modernos', 'Coloración'], 5, 2200000, '+57 304 444 4444'),
((SELECT id FROM usuarios WHERE email = 'david@estilourbano.com'),
 (SELECT id FROM barberias WHERE nombre = 'Estilo Urbano'),
 ARRAY['Cortes urbanos', 'Diseños'], 6, 2300000, '+57 315 555 5555');

-- Insertar servicios
INSERT INTO servicios (barberia_id, nombre, descripcion, precio, duracion, categoria) VALUES
((SELECT id FROM barberias WHERE nombre = 'Barbería El Clásico'), 'Corte Clásico Caballero', 'Corte tradicional con tijera y máquina', 25000, 30, 'Cortes'),
((SELECT id FROM barberias WHERE nombre = 'Barbería El Clásico'), 'Arreglo de Barba', 'Perfilado y arreglo completo de barba', 15000, 20, 'Barba'),
((SELECT id FROM barberias WHERE nombre = 'Modern Cuts'), 'Corte Moderno', 'Cortes actuales y tendencias', 35000, 45, 'Cortes'),
((SELECT id FROM barberias WHERE nombre = 'Modern Cuts'), 'Corte Cabello Dama', 'Corte y peinado para damas', 45000, 60, 'Cortes'),
((SELECT id FROM barberias WHERE nombre = 'Estilo Urbano'), 'Corte + Barba', 'Combo completo corte y barba', 40000, 50, 'Combos');

-- Insertar usuarios clientes
INSERT INTO usuarios (email, nombre, telefono, rol) VALUES
('juan.cliente@email.com', 'Juan Pérez', '+57 300 111 2222', 'cliente'),
('maria.cliente@email.com', 'María González', '+57 301 333 4444', 'cliente'),
('carlos.cliente@email.com', 'Carlos Martínez', '+57 302 555 6666', 'cliente');

-- Insertar información de clientes
INSERT INTO clientes (usuario_id, preferencias, total_visitas) VALUES
((SELECT id FROM usuarios WHERE email = 'juan.cliente@email.com'), 'Prefiere cortes cortos, sin barba', 5),
((SELECT id FROM usuarios WHERE email = 'maria.cliente@email.com'), 'Le gustan los cortes modernos', 3),
((SELECT id FROM usuarios WHERE email = 'carlos.cliente@email.com'), 'Corte y barba siempre', 8);
