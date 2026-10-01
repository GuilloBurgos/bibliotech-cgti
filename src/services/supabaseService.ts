import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Libro, Prestamo, Usuario, TopLibroReporte } from '../types';
import { LIBROS_INICIALES, PRESTAMOS_INICIALES, USUARIOS_INICIALES, TOP_LIBROS_REPORTES } from '../data/initialData';

export const supabaseService = {
  // Check if live connection is active
  isConfigured(): boolean {
    return isSupabaseConfigured();
  },

  // 1. Libros (Catalog & Inventory)
  async fetchLibros(): Promise<Libro[]> {
    if (!supabase) return LIBROS_INICIALES;
    try {
      const { data, error } = await supabase
        .from('libros')
        .select('*')
        .order('codigo', { ascending: true });

      if (error || !data || data.length === 0) {
        console.warn('Supabase fetchLibros falling back to initial data:', error);
        return LIBROS_INICIALES;
      }

      return data.map((item: any) => ({
        id: item.id,
        codigo: item.codigo,
        titulo: item.titulo,
        autor: item.autor,
        isbn: item.isbn,
        categoria: item.categoria,
        sinopsis: item.sinopsis || `Ficha bibliográfica oficial para ${item.titulo}. Ejemplar catalogado bajo norma ISBD y Dewey.`,
        ubicacion: item.ubicacion,
        stockTotal: item.stock_total ?? 1,
        stockDisponible: item.stock_disponible ?? 1,
        estado: item.estado || 'DISPONIBLE',
        badge: item.badge,
        portadaUrl: item.portada_url || 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&q=80&w=400'
      }));
    } catch (e) {
      console.error('Error fetching libros from Supabase:', e);
      return LIBROS_INICIALES;
    }
  },

  async insertLibro(libro: Partial<Libro>): Promise<Libro | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('libros')
        .insert([
          {
            codigo: libro.codigo,
            titulo: libro.titulo,
            autor: libro.autor,
            isbn: libro.isbn,
            categoria: libro.categoria,
            sinopsis: libro.sinopsis || '',
            ubicacion: libro.ubicacion,
            stock_total: libro.stockTotal || 1,
            stock_disponible: libro.stockDisponible || 1,
            estado: libro.estado || 'DISPONIBLE',
            badge: libro.badge || `Disponible: ${libro.stockDisponible || 1} ejs.`,
            portada_url: libro.portadaUrl
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return {
        id: data.id,
        codigo: data.codigo,
        titulo: data.titulo,
        autor: data.autor,
        isbn: data.isbn,
        categoria: data.categoria,
        sinopsis: data.sinopsis || '',
        ubicacion: data.ubicacion,
        stockTotal: data.stock_total,
        stockDisponible: data.stock_disponible,
        estado: data.estado,
        badge: data.badge,
        portadaUrl: data.portada_url
      };
    } catch (e) {
      console.error('Error inserting libro to Supabase:', e);
      return null;
    }
  },

  async updateLibro(id: string, updates: Partial<Libro>): Promise<boolean> {
    if (!supabase) return false;
    try {
      const payload: any = {};
      if (updates.titulo) payload.titulo = updates.titulo;
      if (updates.autor) payload.autor = updates.autor;
      if (updates.ubicacion) payload.ubicacion = updates.ubicacion;
      if (updates.stockDisponible !== undefined) payload.stock_disponible = updates.stockDisponible;
      if (updates.estado) payload.estado = updates.estado;
      if (updates.badge) payload.badge = updates.badge;

      const { error } = await supabase.from('libros').update(payload).eq('id', id);
      return !error;
    } catch (e) {
      console.error('Error updating libro in Supabase:', e);
      return false;
    }
  },

  async deleteLibro(id: string): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('libros').delete().eq('id', id);
      return !error;
    } catch (e) {
      console.error('Error deleting libro from Supabase:', e);
      return false;
    }
  },

  // 2. Prestamos (Loans & Circulation)
  async fetchPrestamos(): Promise<Prestamo[]> {
    if (!supabase) return PRESTAMOS_INICIALES;
    try {
      const { data, error } = await supabase
        .from('prestamos')
        .select('*')
        .order('creado_en', { ascending: false });

      if (error || !data || data.length === 0) {
        console.warn('Supabase fetchPrestamos falling back to initial data:', error);
        return PRESTAMOS_INICIALES;
      }

      return data.map((item: any) => ({
        id: item.id,
        libroId: item.libro_id,
        libroTitulo: item.libro_titulo,
        isbn: item.isbn,
        ejemplar: item.ejemplar,
        usuarioNombre: item.usuario_nombre,
        usuarioEmail: item.usuario_email,
        usuarioDni: item.usuario_dni,
        fechaPrestamo: item.fecha_prestamo,
        fechaLimite: item.fecha_limite,
        fechaDevolucion: item.fecha_devolucion,
        estado: item.estado,
        diasRestantes: item.dias_restantes
      }));
    } catch (e) {
      console.error('Error fetching prestamos from Supabase:', e);
      return PRESTAMOS_INICIALES;
    }
  },

  async createPrestamo(prestamo: Prestamo): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('prestamos').insert([
        {
          id: prestamo.id,
          libro_id: prestamo.libroId,
          libro_titulo: prestamo.libroTitulo,
          isbn: prestamo.isbn,
          ejemplar: prestamo.ejemplar,
          usuario_nombre: prestamo.usuarioNombre,
          usuario_email: prestamo.usuarioEmail,
          usuario_dni: prestamo.usuarioDni,
          fecha_prestamo: new Date().toISOString().split('T')[0],
          fecha_limite: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
          estado: 'A_TIEMPO',
          dias_restantes: 15
        }
      ]);
      return !error;
    } catch (e) {
      console.error('Error creating prestamo in Supabase:', e);
      return false;
    }
  },

  async returnPrestamo(prestamoId: string): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase
        .from('prestamos')
        .update({
          estado: 'DEVUELTO',
          fecha_devolucion: new Date().toISOString().split('T')[0],
          dias_restantes: 0
        })
        .eq('id', prestamoId);
      return !error;
    } catch (e) {
      console.error('Error updating return in Supabase:', e);
      return false;
    }
  },

  // 3. Usuarios (Users & RBAC)
  async fetchUsuarios(): Promise<Usuario[]> {
    if (!supabase) return USUARIOS_INICIALES;
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .order('creado_en', { ascending: true });

      if (error || !data || data.length === 0) {
        return USUARIOS_INICIALES;
      }

      return data.map((u: any) => ({
        id: u.id,
        nombre: u.nombre,
        email: u.email,
        dni: u.dni || '19.458.291-K',
        rol: u.rol,
        estado: u.estado,
        prestamosActivos: u.prestamos_activos ?? 1,
        maxPrestamos: u.max_prestamos ?? 3,
        ultimoAcceso: u.ultimo_acceso || 'Hoy',
        permisos: u.permisos || []
      }));
    } catch (e) {
      console.error('Error fetching usuarios from Supabase:', e);
      return USUARIOS_INICIALES;
    }
  },

  async insertUsuario(usuario: Usuario): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('usuarios').insert([
        {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          dni: usuario.dni,
          rol: usuario.rol,
          estado: usuario.estado,
          prestamos_activos: usuario.prestamosActivos,
          max_prestamos: usuario.maxPrestamos,
          permisos: usuario.permisos
        }
      ]);
      return !error;
    } catch (e) {
      console.error('Error inserting usuario to Supabase:', e);
      return false;
    }
  },

  async updateUsuarioStatus(userId: string, newStatus: string): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase
        .from('usuarios')
        .update({ estado: newStatus })
        .eq('id', userId);
      return !error;
    } catch (e) {
      console.error('Error updating usuario status in Supabase:', e);
      return false;
    }
  },

  // 4. Report CA-08
  getTopLibrosReporte(period: '30d' | 'quarter' | 'year' = '30d'): TopLibroReporte[] {
    return TOP_LIBROS_REPORTES[period];
  }
};
