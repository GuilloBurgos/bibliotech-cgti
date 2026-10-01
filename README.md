# BiblioTech · Sistema de Gestión de Bibliotecas CGTI

Sistema integral de gestión bibliográfica, terminal de circulación y gobernanza RBAC para bibliotecas universitarias e institucionales, desarrollado con **React**, **TypeScript**, **Tailwind CSS** y **Supabase (PostgreSQL)**.

---

## 🌟 Características Principales

- **Catálogo General Público**:
  - Explorador y buscador facetado de libros por título, autor, ISBN y categoría.
  - Disponibilidad de ejemplares en sala y reserva anticipada.
  - Ficha técnica detallada por volumen (Dewey, año, editorial, estado de conservación).

- **Terminal de Circulación para Bibliotecarios**:
  - Mostrador central de préstamos rápidos.
  - **Devolución Exprés (< 30 segundos)** con detección de morosidad y cálculo automático de sanciones.
  - Registro de préstamos con control estricto de cupo (máximo 3 libros simultáneos por usuario).

- **Dashboard del Lector**:
  - Estado del usuario y libros en préstamo.
  - Contador regresivo de días restantes con alertas cromáticas.
  - Renovación de préstamos en línea.

- **Panel Ejecutivo y Gobernanza RBAC (Administrador)**:
  - Reporte normativo **CA-08** (TOP 10 libros más solicitados) con exportación a CSV.
  - Matriz de inventario bibliográfico (altas, bajas y modificaciones).
  - Gestión de personal bibliotecario y asignación de terminales.
  - Verificador de estado y sincronización ACID con **Supabase PostgreSQL**.

---

## 🛠️ Tecnologías

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Material Symbols, SweetAlert2.
- **Base de Datos**: Supabase (PostgreSQL) con Row Level Security (RLS) y Triggers automáticos para control de stock.
- **Build Tool**: Vite.

---

## ⚙️ Configuración y Puesta en Marcha

### 1. Clonar el repositorio e instalar dependencias
```bash
git clone https://github.com/TU_USUARIO/TU_REPOSITORIO.git
cd TU_REPOSITORIO
npm install
```

### 2. Configurar Base de Datos en Supabase
1. Crea un proyecto en [Supabase](https://supabase.com).
2. Ve al **SQL Editor** y ejecuta el script contenido en `supabase/schema.sql`.
3. Crea un archivo `.env` en la raíz con las credenciales de tu proyecto:
```env
VITE_SUPABASE_URL="https://tu-proyecto.supabase.co"
VITE_SUPABASE_ANON_KEY="tu-anon-public-key"
```

### 3. Iniciar en Modo Desarrollo
```bash
npm run dev
```

### 4. Compilar para Producción
```bash
npm run build
```

---

## 📄 Licencia

Este proyecto se distribuye bajo la licencia Apache-2.0.
