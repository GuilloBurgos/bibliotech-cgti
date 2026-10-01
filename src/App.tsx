/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Libro, Prestamo, Usuario, RolUsuario } from './types';
import { LIBROS_INICIALES, PRESTAMOS_INICIALES, USUARIOS_INICIALES } from './data/initialData';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { PublicCatalogView } from './components/PublicCatalogView';
import { ReaderDashboardView } from './components/ReaderDashboardView';
import { LibrarianCirculationView } from './components/LibrarianCirculationView';
import { AdminGovernanceView } from './components/AdminGovernanceView';
import { MarketingKitView } from './components/MarketingKitView';
import { BookDetailModal } from './components/BookDetailModal';
import { AuthModal } from './components/AuthModal';
import { NewBookModal } from './components/NewBookModal';
import { NewLibrarianModal } from './components/NewLibrarianModal';
import { SupabaseGuideModal } from './components/SupabaseGuideModal';
import { supabaseService } from './services/supabaseService';
import { alertPrestamoExitoso } from './utils/alerts';
import Swal from 'sweetalert2';

export default function App() {
  // Main Data States
  const [libros, setLibros] = useState<Libro[]>(LIBROS_INICIALES);
  const [prestamos, setPrestamos] = useState<Prestamo[]>(PRESTAMOS_INICIALES);
  const [usuarios, setUsuarios] = useState<Usuario[]>(USUARIOS_INICIALES);

  // App Navigation & Role Mode State
  // Allowed active roles: 'PUBLICO' | 'CLIENTE' | 'BIBLIOTECARIO' | 'ADMINISTRADOR' | 'MARKETING'
  const [activeRole, setActiveRole] = useState<RolUsuario | 'PUBLICO' | 'MARKETING'>('PUBLICO');
  const [currentView, setCurrentView] = useState<string>('catalogo-publico');

  // Modals States
  const [selectedBook, setSelectedBook] = useState<Libro | null>(null);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'registro'>('login');

  const [isNewBookModalOpen, setIsNewBookModalOpen] = useState(false);
  const [isNewLibrarianModalOpen, setIsNewLibrarianModalOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);

  // Load from Supabase on mount if configured
  const loadDatabaseData = async () => {
    if (supabaseService.isConfigured()) {
      try {
        const [librosDb, prestamosDb, usuariosDb] = await Promise.all([
          supabaseService.fetchLibros(),
          supabaseService.fetchPrestamos(),
          supabaseService.fetchUsuarios()
        ]);
        if (librosDb && librosDb.length > 0) setLibros(librosDb);
        if (prestamosDb && prestamosDb.length > 0) setPrestamos(prestamosDb);
        if (usuariosDb && usuariosDb.length > 0) setUsuarios(usuariosDb);
      } catch (err) {
        console.warn('Error loading initial data from Supabase:', err);
      }
    }
  };

  useEffect(() => {
    loadDatabaseData();
  }, []);

  // Quick book detail trigger
  const handleVerDetalle = (libro: Libro) => {
    setSelectedBook(libro);
    setIsBookModalOpen(true);
  };

  // Loan reservation handler
  const handleReservar = (libro: Libro) => {
    if (activeRole === 'PUBLICO') {
      Swal.fire({
        title: 'Acceso Institucional Requerido',
        text: 'Inicia sesión con tu credencial o correo institucional para reservar este ejemplar.',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Iniciar Sesión',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#012535'
      }).then((res) => {
        if (res.isConfirmed) {
          setAuthModalTab('login');
          setIsAuthModalOpen(true);
        }
      });
      return;
    }

    if (libro.stockDisponible <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Sin Ejemplares Disponibles',
        text: 'Todos los ejemplares físicos de este volumen se encuentran en préstamo o sala.',
        confirmButtonColor: '#012535'
      });
      return;
    }

    // Decrement stock in state
    setLibros((prev) =>
      prev.map((b) =>
        b.id === libro.id
          ? {
              ...b,
              stockDisponible: Math.max(0, b.stockDisponible - 1),
              estado: b.stockDisponible - 1 <= 0 ? 'AGOTADO' : b.estado,
              badge: b.stockDisponible - 1 <= 0 ? 'Agotado en sala' : `Disponible: ${b.stockDisponible - 1} ejs.`
            }
          : b
      )
    );

    // Create loan record
    const newPrestamo: Prestamo = {
      id: `PR-2025-${Math.floor(100 + Math.random() * 900)}`,
      libroId: libro.id,
      libroTitulo: libro.titulo,
      isbn: libro.codigo,
      ejemplar: `#0${Math.floor(1 + Math.random() * 5)}`,
      usuarioNombre: activeRole === 'ADMINISTRADOR' ? 'Carlos De La Maza' : 'Sofia Alarcón',
      usuarioEmail: activeRole === 'ADMINISTRADOR' ? 'carlos.director@bibliotech.edu' : 'sofia.alarcon@bibliotech.edu',
      usuarioDni: '20.341.982-1',
      fechaPrestamo: 'Hoy',
      fechaLimite: 'En 15 días',
      estado: 'A_TIEMPO',
      diasRestantes: 15
    };

    setPrestamos((prev) => [newPrestamo, ...prev]);

    if (isBookModalOpen) {
      setIsBookModalOpen(false);
    }

    alertPrestamoExitoso(libro.titulo, 48);
  };

  // Return processed handler
  const handleDevolucionSuccess = (prestamoId: string, hasMora: boolean) => {
    const prestamo = prestamos.find((p) => p.id === prestamoId);

    setPrestamos((prev) =>
      prev.map((p) =>
        p.id === prestamoId
          ? {
              ...p,
              estado: 'DEVUELTO',
              fechaDevolucion: 'Hoy'
            }
          : p
      )
    );

    // Increment stock of related book
    if (prestamo) {
      setLibros((prev) =>
        prev.map((b) =>
          b.titulo.toLowerCase().includes(prestamo.libroTitulo.toLowerCase().slice(0, 10))
            ? {
                ...b,
                stockDisponible: b.stockDisponible + 1,
                estado: 'DISPONIBLE',
                badge: `Disponible: ${b.stockDisponible + 1} ejs.`
              }
            : b
        )
      );
    }
  };

  // Delete book handler
  const handleDeleteBook = (id: string, titulo: string, codigo: string) => {
    Swal.fire({
      title: '¿Confirmar Baja de Libro?',
      html: `
        <p class="text-sm text-slate-600 mb-2">
          ¿Está seguro de que desea dar de baja <strong>${codigo} - ${titulo}</strong>?
        </p>
        <p class="text-xs text-slate-500">
          Esta acción removerá el ejemplar del inventario activo y pasará a la bitácora de descartes.
        </p>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ba1a1a',
      cancelButtonColor: '#72787c',
      confirmButtonText: 'Confirmar Baja',
      cancelButtonText: 'Cancelar'
    }).then((res) => {
      if (res.isConfirmed) {
        setLibros((prev) => prev.filter((b) => b.id !== id));
        Swal.fire({
          icon: 'success',
          title: 'Libro Dado de Baja',
          text: `El registro ${codigo} fue retirado del catálogo activo.`,
          confirmButtonColor: '#012535'
        });
      }
    });
  };

  // Edit / Update book handler
  const handleEditBook = (libro: Libro) => {
    Swal.fire({
      title: `Actualizar Datos: ${libro.codigo}`,
      html: `
        <div class="space-y-3 text-left text-xs">
          <div>
            <label class="block font-bold text-slate-700 mb-1">Título</label>
            <input id="swal-input-title" class="w-full p-2 border rounded text-xs" value="${libro.titulo}">
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">Autor</label>
            <input id="swal-input-author" class="w-full p-2 border rounded text-xs" value="${libro.autor}">
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">Ubicación Física</label>
            <input id="swal-input-shelf" class="w-full p-2 border rounded text-xs" value="${libro.ubicacion}">
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Guardar Cambios',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#012535',
      preConfirm: () => {
        const title = (document.getElementById('swal-input-title') as HTMLInputElement).value;
        const author = (document.getElementById('swal-input-author') as HTMLInputElement).value;
        const shelf = (document.getElementById('swal-input-shelf') as HTMLInputElement).value;
        if (!title || !author) {
          Swal.showValidationMessage('Título y autor son obligatorios');
        }
        return { title, author, shelf };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        setLibros((prev) =>
          prev.map((b) =>
            b.id === libro.id
              ? {
                  ...b,
                  titulo: result.value.title,
                  autor: result.value.author,
                  ubicacion: result.value.shelf
                }
              : b
          )
        );
        Swal.fire({
          icon: 'success',
          title: 'Datos Actualizados',
          text: `Se guardaron los cambios para ${libro.codigo}.`,
          confirmButtonColor: '#012535'
        });
      }
    });
  };

  // Toggle user status
  const handleToggleUserStatus = (userId: string, newStatus: 'ACTIVO' | 'INACTIVO' | 'SANCIONADO') => {
    setUsuarios((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, estado: newStatus } : u))
    );
  };

  // Save new book
  const handleSaveBook = (newBookData: Partial<Libro>) => {
    setLibros((prev) => [newBookData as Libro, ...prev]);
  };

  // Save new librarian
  const handleSaveLibrarian = (newLibrarian: Usuario) => {
    setUsuarios((prev) => [newLibrarian, ...prev]);
  };

  // Switch roles and default view
  const handleSelectRole = (role: RolUsuario | 'PUBLICO' | 'MARKETING') => {
    setActiveRole(role);
    if (role === 'PUBLICO') setCurrentView('catalogo-publico');
    else if (role === 'CLIENTE') setCurrentView('dashboard-lector');
    else if (role === 'BIBLIOTECARIO') setCurrentView('operaciones-circulacion');
    else if (role === 'ADMINISTRADOR') setCurrentView('panel-admin');
    else if (role === 'MARKETING') setCurrentView('marketing-kit');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f5faff] font-['Plus_Jakarta_Sans',sans-serif] text-[#0f1d25] antialiased">
      
      {/* Top Header with Navigation & Role Switcher */}
      <Navbar
        currentView={currentView}
        onSelectView={setCurrentView}
        activeRole={activeRole}
        onSelectRole={handleSelectRole}
        onOpenAuth={(tab) => {
          setAuthModalTab(tab);
          setIsAuthModalOpen(true);
        }}
        userLoansCount={2}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full pt-16 md:pt-20">
        {/* VIEW 1: Portal Público / Catálogo CGTI (Screenshots: Image 1, 15, 23) */}
        {currentView === 'catalogo-publico' && (
          <PublicCatalogView
            libros={libros}
            onVerDetalle={handleVerDetalle}
            onReservar={handleReservar}
          />
        )}

        {/* VIEW 2: Dashboard Lector / Cliente Autenticado (Screenshots: Image 4, 19) */}
        {currentView === 'dashboard-lector' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
            <ReaderDashboardView
              libros={libros}
              onVerDetalle={handleVerDetalle}
              onReservar={handleReservar}
            />
          </div>
        )}

        {/* VIEW 3: Terminal de Operaciones & Circulación Bibliotecario (Screenshot: Image 6) */}
        {currentView === 'operaciones-circulacion' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
            <LibrarianCirculationView
              prestamos={prestamos}
              onDevolucionSuccess={handleDevolucionSuccess}
              libros={libros}
            />
          </div>
        )}

        {/* VIEW 4: Panel Ejecutivo & Gobernanza RBAC Admin (Screenshots: Image 8, 11, 17, 21) */}
        {currentView === 'panel-admin' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
            <AdminGovernanceView
              libros={libros}
              usuarios={usuarios}
              onOpenNewBookModal={() => setIsNewBookModalOpen(true)}
              onOpenNewLibrarianModal={() => setIsNewLibrarianModalOpen(true)}
              onDeleteBook={handleDeleteBook}
              onToggleUserStatus={handleToggleUserStatus}
              onEditBook={handleEditBook}
              onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
            />
          </div>
        )}

        {/* VIEW 5: Kit de Lanzamiento & Marketing 2025 (Screenshot: Image 13) */}
        {currentView === 'marketing-kit' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
            <MarketingKitView onGoToApp={() => handleSelectRole('PUBLICO')} />
          </div>
        )}
      </main>

      {/* Global Footer (Matching BibliotecaCGTI) */}
      <Footer />

      {/* MODAL 1: Ficha Técnica & Detalle (#modalDetalleLibro) */}
      <BookDetailModal
        libro={selectedBook}
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        onReservar={handleReservar}
        userActiveLoansCount={2}
      />

      {/* MODAL 2: Autenticación Unificada (Iniciar Sesión / Crear Cuenta) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialTab={authModalTab}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(name, email, role) => {
          handleSelectRole(role || 'CLIENTE');
        }}
      />

      {/* MODAL 3: Catalogar Nuevo Libro */}
      <NewBookModal
        isOpen={isNewBookModalOpen}
        onClose={() => setIsNewBookModalOpen(false)}
        onSaveBook={handleSaveBook}
      />

      {/* MODAL 4: Alta de Nuevo Bibliotecario RBAC */}
      <NewLibrarianModal
        isOpen={isNewLibrarianModalOpen}
        onClose={() => setIsNewLibrarianModalOpen(false)}
        onSaveLibrarian={handleSaveLibrarian}
      />

      {/* MODAL 5: Guía y Estado de Supabase */}
      <SupabaseGuideModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        onRefreshData={loadDatabaseData}
      />

    </div>
  );
}
