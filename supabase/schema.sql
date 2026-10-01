-- ==============================================================================
-- BiblioTech · BibliotecaCGTI - Script de Base de Datos para Supabase (PostgreSQL)
-- ==============================================================================
-- Este script crea las tablas, relaciones, políticas RLS, índices, funciones
-- y datos iniciales para el Sistema de Gestión de Préstamos e Inventario.
-- ==============================================================================

-- 1. Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Eliminar tablas si existen (para reinicialización limpia)
DROP TABLE IF EXISTS auditoria_circulacion CASCADE;
DROP TABLE IF EXISTS prestamos CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS libros CASCADE;

-- ------------------------------------------------------------------------------
-- 3. Tabla: LIBROS (Catálogo General e Inventario)
-- ------------------------------------------------------------------------------
CREATE TABLE libros (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    codigo VARCHAR(50) UNIQUE NOT NULL, -- ej: LIB-0104
    titulo VARCHAR(255) NOT NULL,
    autor VARCHAR(255) NOT NULL,
    isbn VARCHAR(50) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    ubicacion VARCHAR(100) NOT NULL,    -- ej: Estante 4B - Ing. Software
    stock_total INTEGER NOT NULL DEFAULT 1,
    stock_disponible INTEGER NOT NULL DEFAULT 1,
    estado VARCHAR(50) NOT NULL DEFAULT 'DISPONIBLE', -- DISPONIBLE, PRESTADO, MANTENIMIENTO, AGOTADO
    badge VARCHAR(100),
    portada_url TEXT,
    editorial VARCHAR(150),
    anio_publicacion INTEGER,
    edicion VARCHAR(50),
    condicion VARCHAR(100) DEFAULT 'Excelente (Original)',
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para búsqueda rápida
CREATE INDEX idx_libros_codigo ON libros(codigo);
CREATE INDEX idx_libros_categoria ON libros(categoria);
CREATE INDEX idx_libros_estado ON libros(estado);

-- ------------------------------------------------------------------------------
-- 4. Tabla: USUARIOS (Lectores, Bibliotecarios y Administradores)
-- ------------------------------------------------------------------------------
CREATE TABLE usuarios (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    codigo_matricula VARCHAR(50) UNIQUE NOT NULL, -- ej: LIB-89, BIB-04
    nombre VARCHAR(200) NOT NULL,
    email VARCHAR(200) UNIQUE NOT NULL,
    rol VARCHAR(50) NOT NULL DEFAULT 'CLIENTE', -- CLIENTE, BIBLIOTECARIO, ADMINISTRADOR
    estado VARCHAR(50) NOT NULL DEFAULT 'ACTIVO', -- ACTIVO, SANCIONADO, INACTIVO
    terminal_asignada VARCHAR(100),
    permisos TEXT[], -- Array de permisos
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_rol ON usuarios(rol);

-- ------------------------------------------------------------------------------
-- 5. Tabla: PRESTAMOS (Circulación y Trazabilidad)
-- ------------------------------------------------------------------------------
CREATE TABLE prestamos (
    id TEXT PRIMARY KEY DEFAULT ('PR-' || to_char(NOW(), 'YYYY') || '-' || floor(random() * 899 + 100)::text),
    libro_id TEXT REFERENCES libros(id) ON DELETE SET NULL,
    libro_titulo VARCHAR(255) NOT NULL,
    isbn VARCHAR(50) NOT NULL,
    ejemplar VARCHAR(50) DEFAULT '#01',
    usuario_id TEXT REFERENCES usuarios(id) ON DELETE SET NULL,
    usuario_nombre VARCHAR(200) NOT NULL,
    usuario_email VARCHAR(200) NOT NULL,
    usuario_dni VARCHAR(50),
    fecha_prestamo DATE NOT NULL DEFAULT CURRENT_DATE,
    fecha_limite DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '15 days'),
    fecha_devolucion DATE,
    estado VARCHAR(50) NOT NULL DEFAULT 'A_TIEMPO', -- A_TIEMPO, VENCIDO, DEVUELTO, CON_MORA
    dias_restantes INTEGER DEFAULT 15,
    renovado BOOLEAN DEFAULT FALSE,
    mora_acumulada NUMERIC(10,2) DEFAULT 0.00,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_prestamos_estado ON prestamos(estado);
CREATE INDEX idx_prestamos_usuario ON prestamos(usuario_id);
CREATE INDEX idx_prestamos_libro ON prestamos(libro_id);

-- ------------------------------------------------------------------------------
-- 6. Tabla: AUDITORIA_CIRCULACION (Gobernanza y Bitácora ACID)
-- ------------------------------------------------------------------------------
CREATE TABLE auditoria_circulacion (
    id SERIAL PRIMARY KEY,
    operacion VARCHAR(100) NOT NULL, -- PRESTAMO_CREADO, DEVOLUCION_EXPRES, SANCION_APLICADA
    prestamo_id TEXT,
    usuario_operador VARCHAR(200) NOT NULL,
    detalles JSONB,
    fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 7. TRIGGER: Automatización de Stock en Préstamo y Devolución
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION actualizar_stock_libro()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Descontar stock al crear préstamo
        UPDATE libros
        SET stock_disponible = GREATEST(0, stock_disponible - 1),
            estado = CASE WHEN stock_disponible - 1 <= 0 THEN 'AGOTADO' ELSE 'DISPONIBLE' END,
            badge = CASE WHEN stock_disponible - 1 <= 0 THEN 'Agotado en sala' ELSE 'Disponible: ' || (stock_disponible - 1) || ' ejs.' END
        WHERE id = NEW.libro_id;
    ELSIF TG_OP = 'UPDATE' AND OLD.estado != 'DEVUELTO' AND NEW.estado = 'DEVUELTO' THEN
        -- Reponer stock al marcar devuelto
        UPDATE libros
        SET stock_disponible = LEAST(stock_total, stock_disponible + 1),
            estado = 'DISPONIBLE',
            badge = 'Disponible: ' || (stock_disponible + 1) || ' ejs.'
        WHERE id = NEW.libro_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_actualizar_stock
AFTER INSERT OR UPDATE ON prestamos
FOR EACH ROW
EXECUTE FUNCTION actualizar_stock_libro();

-- ------------------------------------------------------------------------------
-- 8. Seguridad: Configuración de Row Level Security (RLS) en Supabase
-- ------------------------------------------------------------------------------
ALTER TABLE libros ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE prestamos ENABLE ROW LEVEL SECURITY;
ALTER TABLE auditoria_circulacion ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura pública para el catálogo
CREATE POLICY "Permitir lectura publica de libros" 
ON libros FOR SELECT 
USING (true);

-- Políticas de escritura para clientes y terminal de biblioteca
CREATE POLICY "Permitir insercion y actualizacion de libros" 
ON libros FOR ALL 
USING (true)
WITH CHECK (true);

CREATE POLICY "Permitir lectura y gestion de prestamos" 
ON prestamos FOR ALL 
USING (true)
WITH CHECK (true);

CREATE POLICY "Permitir lectura y gestion de usuarios" 
ON usuarios FOR ALL 
USING (true)
WITH CHECK (true);

CREATE POLICY "Permitir registro de auditoria" 
ON auditoria_circulacion FOR ALL 
USING (true)
WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 9. Datos Iniciales (Seed Data)
-- ------------------------------------------------------------------------------
INSERT INTO libros (id, codigo, titulo, autor, isbn, categoria, ubicacion, stock_total, stock_disponible, estado, badge, editorial, anio_publicacion, edicion, condicion, portada_url) VALUES
('1', 'LIB-0104', 'Clean Code: Manual de desarrollo ágil', 'Robert C. Martin (Uncle Bob)', '978-0132350884', 'Ingeniería de Software', 'Estante 4B - Ing. Software', 5, 3, 'DISPONIBLE', 'Disponible: 3 ejs.', 'Prentice Hall', 2008, '1ra Edición', 'Excelente (Original)', 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&q=80&w=400'),
('2', 'LIB-0211', 'Designing Data-Intensive Applications', 'Martin Kleppmann', '978-1449373320', 'Bases de Datos', 'Estante 2A - Sistemas Distribuidos', 4, 1, 'DISPONIBLE', 'Último ejemplar', 'O''Reilly Media', 2017, '1ra Edición', 'Muy Bueno', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400'),
('3', 'LIB-0389', 'The Pragmatic Programmer: Your Journey to Mastery', 'David Thomas, Andrew Hunt', '978-0135957059', 'Ingeniería de Software', 'Estante 4B - Ing. Software', 6, 4, 'DISPONIBLE', 'Disponible: 4 ejs.', 'Addison-Wesley Professional', 2019, '20th Anniversary Edition', 'Excelente', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400'),
('4', 'LIB-0412', 'Introduction to Algorithms (CLRS)', 'Thomas H. Cormen, Charles E. Leiserson', '978-0262033848', 'Algoritmos y Estructuras', 'Estante 1A - Algoritmos Fundamentales', 3, 0, 'AGOTADO', 'Agotado en sala', 'MIT Press', 2009, '3ra Edición', 'Regular (Uso intensivo)', 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=400'),
('5', 'LIB-0520', 'Artificial Intelligence: A Modern Approach', 'Stuart Russell, Peter Norvig', '978-0136042594', 'Inteligencia Artificial', 'Estante 3C - IA & Machine Learning', 5, 2, 'DISPONIBLE', 'Disponible: 2 ejs.', 'Pearson', 2020, '4ta Edición', 'Excelente', 'https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&q=80&w=400'),
('6', 'LIB-0615', 'Computer Networking: A Top-Down Approach', 'James Kurose, Keith Ross', '978-0133594140', 'Redes y Telecomunicaciones', 'Estante 5A - Telecomunicaciones', 4, 3, 'DISPONIBLE', 'Disponible: 3 ejs.', 'Pearson', 2021, '8va Edición', 'Muy Bueno', 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=400');

INSERT INTO usuarios (id, codigo_matricula, nombre, email, rol, estado, terminal_asignada, permisos) VALUES
('u1', 'LIB-89', 'Sofia Alarcón', 'sofia.alarcon@bibliotech.edu', 'CLIENTE', 'ACTIVO', NULL, ARRAY['RESERVAR_LIBROS', 'VER_HISTORIAL']),
('u2', 'ADM-01', 'Carlos De La Maza', 'carlos.director@bibliotech.edu', 'ADMINISTRADOR', 'ACTIVO', 'Terminal Central 01', ARRAY['ADMIN_GLOBAL', 'AUDITORIA_ACID', 'GESTION_PERSONAL']),
('u3', 'BIB-04', 'Dra. Elena Vasquez', 'elena.vasquez@bibliotech.edu', 'BIBLIOTECARIO', 'ACTIVO', 'Terminal Mostrador Central #01', ARRAY['CIRCULACION_PRESTAMOS', 'DEVOLUCION_EXPRES', 'SANCION_USUARIOS']),
('u4', 'BIB-09', 'Lic. Roberto Gómez', 'roberto.gomez@bibliotech.edu', 'BIBLIOTECARIO', 'ACTIVO', 'Terminal Sala Lectura Norte', ARRAY['CIRCULACION_PRESTAMOS', 'DEVOLUCION_EXPRES']),
('u5', 'BIB-12', 'Mtro. Fernando Soto', 'fernando.soto@bibliotech.edu', 'BIBLIOTECARIO', 'INACTIVO', 'Sin Terminal Activa', ARRAY['SOLO_CONSULTA']);

INSERT INTO prestamos (id, libro_id, libro_titulo, isbn, ejemplar, usuario_id, usuario_nombre, usuario_email, usuario_dni, fecha_prestamo, fecha_limite, fecha_devolucion, estado, dias_restantes, renovado, mora_acumulada) VALUES
('PR-2025-089', '1', 'Clean Code: Manual de desarrollo ágil', '978-0132350884', '#02', 'u1', 'Sofia Alarcón', 'sofia.alarcon@bibliotech.edu', '20.341.982-1', CURRENT_DATE - 5, CURRENT_DATE + 10, NULL, 'A_TIEMPO', 10, false, 0.00),
('PR-2025-045', '2', 'Designing Data-Intensive Applications', '978-1449373320', '#01', 'u1', 'Sofia Alarcón', 'sofia.alarcon@bibliotech.edu', '20.341.982-1', CURRENT_DATE - 12, CURRENT_DATE + 3, NULL, 'A_TIEMPO', 3, true, 0.00),
('PR-2025-012', '4', 'Introduction to Algorithms (CLRS)', '978-0262033848', '#03', 'u1', 'Sofia Alarcón', 'sofia.alarcon@bibliotech.edu', '20.341.982-1', CURRENT_DATE - 20, CURRENT_DATE - 5, NULL, 'VENCIDO', -5, false, 25.00);

-- ==============================================================================
-- FIN DEL SCRIPT
-- ==============================================================================
