import React, { useState } from 'react';
import { RolUsuario } from '../types';
import { alertConfirmarCerrarSesion } from '../utils/alerts';

interface NavbarProps {
  currentView: string;
  onSelectView: (view: string) => void;
  activeRole: RolUsuario | 'PUBLICO' | 'MARKETING';
  onSelectRole: (role: RolUsuario | 'PUBLICO' | 'MARKETING') => void;
  onOpenAuth: (tab: 'login' | 'registro') => void;
  userLoansCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onSelectView,
  activeRole,
  onSelectRole,
  onOpenAuth,
  userLoansCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    const res = await alertConfirmarCerrarSesion();
    if (res.isConfirmed) {
      onSelectRole('PUBLICO');
      onSelectView('catalogo-publico');
    }
  };

  const isPublic = activeRole === 'PUBLICO';
  const isMarketing = activeRole === 'MARKETING';
  const isReader = activeRole === 'CLIENTE';
  const isLibrarian = activeRole === 'BIBLIOTECARIO';
  const isAdmin = activeRole === 'ADMINISTRADOR';

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#f5faff]/90 backdrop-blur-xl border-b border-[#d6e4f0] shadow-[0_1px_8px_rgba(27,59,75,0.06)]">
      <div className="h-16 md:h-20 w-full px-4 lg:px-8 flex items-center justify-between gap-4">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => {
              if (isPublic || isMarketing) onSelectView('catalogo-publico');
              else if (isReader) onSelectView('dashboard-lector');
              else if (isLibrarian) onSelectView('operaciones-circulacion');
              else if (isAdmin) onSelectView('panel-admin');
            }}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className="w-9 h-9 rounded-lg bg-[#012535] text-white flex items-center justify-center font-extrabold text-base shadow-sm">
              <span className="material-symbols-outlined text-[20px]">local_library</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-[#012535] tracking-tight leading-none">
                {isPublic ? 'BibliotecaCGTI' : 'BiblioTech'}
              </span>
              <span className="text-[10px] text-[#006875] uppercase font-bold tracking-widest leading-tight mt-0.5">
                {isPublic ? 'Portal Institucional' : 'Sistema Bibliotecario'}
              </span>
            </div>
          </div>
        </div>

        {/* Center / Navigation Links for Public View */}
        {isPublic && (
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-[#42474b]">
            <button
              onClick={() => onSelectView('catalogo-publico')}
              className={`hover:text-[#012535] transition-colors py-1 cursor-pointer ${
                currentView === 'catalogo-publico' ? 'text-[#012535] border-b-2 border-[#006875]' : ''
              }`}
            >
              Catálogo
            </button>
            <button
              onClick={() => onSelectView('catalogo-publico')}
              className="hover:text-[#012535] transition-colors py-1 cursor-pointer"
            >
              Colecciones
            </button>
            <button
              onClick={() => onSelectView('catalogo-publico')}
              className="hover:text-[#012535] transition-colors py-1 cursor-pointer"
            >
              Acerca de Nosotros
            </button>
            <button
              onClick={() => onSelectView('catalogo-publico')}
              className="hover:text-[#012535] transition-colors py-1 cursor-pointer"
            >
              Servicios
            </button>
            <button
              onClick={() => onSelectView('catalogo-publico')}
              className="hover:text-[#012535] transition-colors py-1 cursor-pointer"
            >
              Preguntas Frecuentes
            </button>
          </nav>
        )}

        {/* Global Screen / Role Switcher (Allows testing all uploaded screens effortlessly!) */}
        <div className="hidden md:flex items-center bg-[#e1f0fb] p-1 rounded-xl text-xs font-semibold text-[#42474b] shadow-inner">
          <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Pantalla:</span>
          <button
            onClick={() => {
              onSelectRole('PUBLICO');
              onSelectView('catalogo-publico');
            }}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              activeRole === 'PUBLICO'
                ? 'bg-white text-[#012535] font-bold shadow-xs'
                : 'hover:text-[#012535]'
            }`}
          >
            Público
          </button>
          <button
            onClick={() => {
              onSelectRole('CLIENTE');
              onSelectView('dashboard-lector');
            }}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              activeRole === 'CLIENTE'
                ? 'bg-white text-[#012535] font-bold shadow-xs'
                : 'hover:text-[#012535]'
            }`}
          >
            Lector
          </button>
          <button
            onClick={() => {
              onSelectRole('BIBLIOTECARIO');
              onSelectView('operaciones-circulacion');
            }}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              activeRole === 'BIBLIOTECARIO'
                ? 'bg-white text-[#012535] font-bold shadow-xs'
                : 'hover:text-[#012535]'
            }`}
          >
            Bibliotecario
          </button>
          <button
            onClick={() => {
              onSelectRole('ADMINISTRADOR');
              onSelectView('panel-admin');
            }}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              activeRole === 'ADMINISTRADOR'
                ? 'bg-white text-[#012535] font-bold shadow-xs'
                : 'hover:text-[#012535]'
            }`}
          >
            Admin
          </button>
          <button
            onClick={() => {
              onSelectRole('MARKETING');
              onSelectView('marketing-kit');
            }}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              activeRole === 'MARKETING'
                ? 'bg-white text-[#006875] font-bold shadow-xs'
                : 'hover:text-[#012535]'
            }`}
          >
            Marketing
          </button>
        </div>

        {/* Right Action Cluster */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isPublic ? (
            <>
              <button
                onClick={() => onOpenAuth('login')}
                className="px-3 sm:px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm text-[#012535] hover:bg-[#dceaf6] transition-colors cursor-pointer"
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => onOpenAuth('registro')}
                className="px-3 sm:px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm bg-[#006875] hover:bg-[#012535] text-white transition-all shadow-[0_2px_8px_rgba(0,104,117,0.25)] cursor-pointer"
              >
                Crear Cuenta
              </button>
              <button
                onClick={() => onOpenAuth('login')}
                className="w-8 h-8 rounded-full bg-[#012535] flex items-center justify-center text-white hover:bg-[#1b3b4b] transition-colors cursor-pointer"
                title="Mi Cuenta"
              >
                <span className="material-symbols-outlined text-[18px]">person</span>
              </button>
            </>
          ) : isMarketing ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-[#e9f5ff] text-[#006875]">
                Kit de Prensa & Lanzamiento
              </span>
              <button
                onClick={() => onSelectRole('PUBLICO')}
                className="px-3.5 py-1.5 rounded-lg bg-[#012535] text-white text-xs font-semibold hover:bg-[#1b3b4b]"
              >
                Ir a Biblioteca
              </button>
            </div>
          ) : (
            <>
              {/* Notifications */}
              <button
                aria-label="Notificaciones"
                className="relative p-2 text-[#42474b] hover:text-[#012535] transition-colors cursor-pointer"
                onClick={() => {}}
                title="2 alertas pendientes"
              >
                <span className="material-symbols-outlined text-[22px]">notifications</span>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#d69328] animate-pulse"></span>
              </button>

              <div className="h-6 w-px bg-[#c2c7cc] hidden sm:block"></div>

              {/* Profile Card */}
              <div className="flex items-center gap-2 pl-1">
                <div className="w-8 h-8 rounded-full bg-[#006875] text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                  {isAdmin ? 'CD' : 'SA'}
                </div>
                <div className="hidden xl:flex flex-col text-left">
                  <span className="text-xs font-bold text-[#0f1d25] leading-none">
                    {isAdmin ? 'Carlos De La Maza' : 'Sofia Alarcón'}
                  </span>
                  <span className="text-[11px] text-[#42474b] leading-none mt-1">
                    {isAdmin ? 'Administrador General' : isLibrarian ? 'Gestión de Sala' : `${userLoansCount}/3 préstamos`}
                  </span>
                </div>
              </div>

              {/* Cerrar Sesión */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#d6e4f0] bg-white text-[#012535] hover:bg-[#ffdad6] hover:text-[#ba1a1a] transition-all text-xs font-semibold cursor-pointer shadow-xs"
                title="Cerrar Sesión"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
                <span className="hidden sm:inline">Cerrar Sesión</span>
              </button>
            </>
          )}

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg md:hidden text-[#012535] hover:bg-[#e1f0fb]"
            aria-label="Menú móvil"
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#d6e4f0] bg-[#f5faff] px-4 py-3 flex flex-col gap-2">
          <div className="text-[11px] font-bold text-[#72787c] uppercase mb-1">Cambiar Pantalla / Rol:</div>
          <div className="grid grid-cols-2 gap-1.5 mb-2">
            <button
              onClick={() => {
                onSelectRole('PUBLICO');
                onSelectView('catalogo-publico');
                setMobileMenuOpen(false);
              }}
              className={`p-2 text-xs font-semibold rounded-lg text-left ${activeRole === 'PUBLICO' ? 'bg-[#012535] text-white' : 'bg-white text-slate-700'}`}
            >
              1. Catálogo Público
            </button>
            <button
              onClick={() => {
                onSelectRole('CLIENTE');
                onSelectView('dashboard-lector');
                setMobileMenuOpen(false);
              }}
              className={`p-2 text-xs font-semibold rounded-lg text-left ${activeRole === 'CLIENTE' ? 'bg-[#012535] text-white' : 'bg-white text-slate-700'}`}
            >
              2. Dashboard Lector
            </button>
            <button
              onClick={() => {
                onSelectRole('BIBLIOTECARIO');
                onSelectView('operaciones-circulacion');
                setMobileMenuOpen(false);
              }}
              className={`p-2 text-xs font-semibold rounded-lg text-left ${activeRole === 'BIBLIOTECARIO' ? 'bg-[#012535] text-white' : 'bg-white text-slate-700'}`}
            >
              3. Circulación & Retorno
            </button>
            <button
              onClick={() => {
                onSelectRole('ADMINISTRADOR');
                onSelectView('panel-admin');
                setMobileMenuOpen(false);
              }}
              className={`p-2 text-xs font-semibold rounded-lg text-left ${activeRole === 'ADMINISTRADOR' ? 'bg-[#012535] text-white' : 'bg-white text-slate-700'}`}
            >
              4. Admin & TOP 10
            </button>
            <button
              onClick={() => {
                onSelectRole('MARKETING');
                onSelectView('marketing-kit');
                setMobileMenuOpen(false);
              }}
              className={`col-span-2 p-2 text-xs font-semibold rounded-lg text-left ${activeRole === 'MARKETING' ? 'bg-[#006875] text-white' : 'bg-white text-slate-700'}`}
            >
              5. Kit de Lanzamiento & Marketing
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
