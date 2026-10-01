export type RolUsuario = 'CLIENTE' | 'BIBLIOTECARIO' | 'ADMINISTRADOR';
export type EstadoUsuario = 'ACTIVO' | 'SANCIONADO' | 'INACTIVO';
export type EstadoLibro = 'DISPONIBLE' | 'PRESTADO' | 'MANTENIMIENTO' | 'AGOTADO';
export type EstadoPrestamo = 'A_TIEMPO' | 'POR_VENCER' | 'CON_MORA' | 'DEVUELTO';

export interface Libro {
  id: string;
  codigo: string;
  titulo: string;
  autor: string;
  isbn: string;
  categoria: string;
  sinopsis: string;
  ubicacion: string;
  portadaUrl: string;
  stockTotal: number;
  stockDisponible: number;
  estado: EstadoLibro;
  prestadoA?: string;
  usuarioEmail?: string;
  fechaVencimiento?: string;
  badge?: string;
}

export interface Prestamo {
  id: string;
  libroId: string;
  libroTitulo: string;
  isbn: string;
  ejemplar: string;
  usuarioNombre: string;
  usuarioEmail: string;
  usuarioDni: string;
  fechaPrestamo: string;
  fechaLimite: string;
  fechaDevolucion?: string;
  diasMora?: number;
  estado: EstadoPrestamo;
  diasRestantes?: number;
  diasSuspension?: number;
}

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  dni: string;
  rol: RolUsuario;
  estado: EstadoUsuario;
  prestamosActivos: number;
  maxPrestamos: number;
  permisos: string[];
  ultimoAcceso: string;
  carreraOCargo?: string;
  fechaSancionFin?: string;
  avatarUrl?: string;
}

export interface TopLibroReporte {
  rank: number;
  titulo: string;
  autor: string;
  isbn: string;
  prestamos: number;
  porcentaje: number;
}
