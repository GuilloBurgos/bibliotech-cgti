import React, { useState } from 'react';
import { Libro, Usuario, TopLibroReporte } from '../types';
import { TOP_LIBROS_REPORTES } from '../data/initialData';
import Swal from 'sweetalert2';

interface AdminGovernanceViewProps {
  libros: Libro[];
  usuarios: Usuario[];
  onOpenNewBookModal: () => void;
  onOpenNewLibrarianModal: () => void;
  onDeleteBook: (id: string, titulo: string, codigo: string) => void;
  onToggleUserStatus: (userId: string, newStatus: 'ACTIVO' | 'INACTIVO' | 'SANCIONADO') => void;
  onEditBook: (libro: Libro) => void;
  onOpenSupabaseModal?: () => void;
}

export const AdminGovernanceView: React.FC<AdminGovernanceViewProps> = ({
  libros,
  usuarios,
  onOpenNewBookModal,
  onOpenNewLibrarianModal,
  onDeleteBook,
  onToggleUserStatus,
  onEditBook,
  onOpenSupabaseModal,
}) => {
  const [period, setPeriod] = useState<'30d' | 'quarter' | 'year'>('30d');
  
  // Book filters
  const [bookSearch, setBookSearch] = useState('');
  const [bookStatusFilter, setBookStatusFilter] = useState('ALL');
  const [bookCatFilter, setBookCatFilter] = useState('ALL');

  // User filters
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Active subtab view for sidebar-less or stacked view
  const [activeAdminTab, setActiveAdminTab] = useState<'dashboard' | 'libros' | 'top10' | 'personal'>('dashboard');

  const top10List = TOP_LIBROS_REPORTES[period];

  const handleExportCA08 = () => {
    Swal.fire({
      icon: 'success',
      title: 'Reporte Normativo CA-08 Generado',
      html: `
        <p class="text-xs text-slate-600 mb-2">
          Se ha compilado el informe oficial de circulación y morosidad para el periodo: 
          <strong>${period === '30d' ? 'Últimos 30 días' : period === 'quarter' ? 'Trimestre Q4' : 'Año Fiscal'}</strong>.
        </p>
        <div class="bg-[#f5faff] p-3 rounded-lg text-xs font-mono text-slate-700 border">
          ✓ Exportación CSV: <code>reporte_ca08_circulacion.csv</code><br/>
          ✓ Hash SHA-256 verificado en cluster.
        </div>
      `,
      confirmButtonText: 'Descargar CSV',
      confirmButtonColor: '#012535'
    });
  };

  const handleBajaUsuario = (user: Usuario) => {
    Swal.fire({
      title: `¿Revocar acceso a ${user.nombre}?`,
      text: `Esta acción dará de baja al ${user.rol.toLowerCase()} y revocará sus credenciales activas.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ba1a1a',
      cancelButtonColor: '#72787c',
      confirmButtonText: 'Sí, revocar acceso',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        onToggleUserStatus(user.id, 'INACTIVO');
        Swal.fire({
          icon: 'success',
          title: 'Acceso Revocado',
          text: `Las credenciales de ${user.nombre} fueron dadas de baja.`,
          confirmButtonColor: '#012535'
        });
      }
    });
  };

  const handleLevantarSancion = (user: Usuario) => {
    Swal.fire({
      title: `¿Levantar sanción a ${user.nombre}?`,
      text: 'Se restituirá de inmediato su cupo de préstamos en el catálogo institucional.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#006875',
      confirmButtonText: 'Sí, reactivar lector',
      cancelButtonText: 'Cancelar'
    }).then((res) => {
      if (res.isConfirmed) {
        onToggleUserStatus(user.id, 'ACTIVO');
        Swal.fire({
          icon: 'success',
          title: 'Sanción Levantada',
          text: `${user.nombre} ahora puede solicitar préstamos normalmente.`,
          confirmButtonColor: '#012535'
        });
      }
    });
  };

  // Filter books
  const filteredLibros = libros.filter((b) => {
    const matchSearch =
      !bookSearch.trim() ||
      b.titulo.toLowerCase().includes(bookSearch.toLowerCase().trim()) ||
      b.autor.toLowerCase().includes(bookSearch.toLowerCase().trim()) ||
      b.codigo.toLowerCase().includes(bookSearch.toLowerCase().trim()) ||
      (b.prestadoA && b.prestadoA.toLowerCase().includes(bookSearch.toLowerCase().trim()));

    const matchStatus = bookStatusFilter === 'ALL' || b.estado === bookStatusFilter;
    const matchCat = bookCatFilter === 'ALL' || b.categoria.includes(bookCatFilter);

    return matchSearch && matchStatus && matchCat;
  });

  // Filter users
  const filteredUsuarios = usuarios.filter((u) => {
    if (roleFilter === 'BIBLIOTECARIO') return u.rol === 'BIBLIOTECARIO';
    if (roleFilter === 'CLIENTE') return u.rol === 'CLIENTE';
    if (roleFilter === 'ADMIN') return u.rol === 'ADMINISTRADOR';
    return true;
  });

  return (
    <div className="flex flex-col w-full text-left">
      
      {/* Top Command & RBAC Scope Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#ffddb4] text-[#633f00]">
              <span className="material-symbols-outlined text-[14px] mr-1">security</span>
              ACCESO NIVEL 3 · ADMINISTRADOR GLOBAL
            </span>
            <span className="text-xs text-[#42474b] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#006875] inline-block animate-pulse"></span>
              Cluster Sincronizado (ACID Validated)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#012535] tracking-tight">
            Panel Ejecutivo &amp; Gobernanza RBAC
          </h1>
          <p className="text-xs sm:text-sm text-[#42474b] mt-0.5">
            Auditoría en tiempo real, rendimiento del inventario físico y emisión de reportes normativos CA-08.
          </p>
        </div>

        {/* Date selector & export trigger */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-white p-1 rounded-xl shadow-xs border border-[#d6e4f0] flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPeriod('30d')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                period === '30d' ? 'bg-[#1b3b4b] text-white shadow-xs' : 'text-[#42474b] hover:text-[#012535]'
              }`}
            >
              Últimos 30 días
            </button>
            <button
              type="button"
              onClick={() => setPeriod('quarter')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                period === 'quarter' ? 'bg-[#1b3b4b] text-white shadow-xs' : 'text-[#42474b] hover:text-[#012535]'
              }`}
            >
              Trimestre
            </button>
            <button
              type="button"
              onClick={() => setPeriod('year')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                period === 'year' ? 'bg-[#1b3b4b] text-white shadow-xs' : 'text-[#42474b] hover:text-[#012535]'
              }`}
            >
              Año Fiscal
            </button>
          </div>

          <button
            type="button"
            onClick={onOpenSupabaseModal}
            className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all cursor-pointer"
            title="Configurar y sincronizar base de datos Supabase"
          >
            <span className="material-symbols-outlined text-[18px]">database</span>
            <span>BD Supabase</span>
          </button>

          <button
            type="button"
            onClick={handleExportCA08}
            className="flex items-center gap-1.5 bg-[#006875] hover:bg-[#012535] text-white px-3.5 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Generar Reporte CA-08</span>
          </button>

          <button
            type="button"
            onClick={onOpenNewLibrarianModal}
            className="flex items-center gap-1.5 bg-[#012535] hover:bg-[#1b3b4b] text-white px-3.5 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            <span>Alta Bibliotecario</span>
          </button>
        </div>
      </section>

      {/* Bento Grid Level 1: Global KPI Cards (3 Cards) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        
        {/* Card 1: Usuarios Registrados & Segmentación RBAC */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#d6e4f0] flex flex-col justify-between hover:shadow-md transition-all">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#42474b] tracking-wider uppercase">
                Usuarios Registrados
              </span>
              <div className="w-9 h-9 rounded-xl bg-[#e1f0fb] flex items-center justify-center text-[#012535]">
                <span className="material-symbols-outlined text-[20px]">group</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#012535] font-mono">1,284</span>
              <span className="text-xs font-bold text-[#006875] bg-[#e1f0fb] px-2 py-0.5 rounded-full">
                +4.8% mes
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 bg-[#f5faff] rounded-xl p-3 border border-[#e1f0fb]">
            <div className="flex items-center justify-between text-xs mb-1.5 text-[#0f1d25]">
              <span>Clientes: <strong>1,240</strong></span>
              <span className="text-[#006875] font-bold">Staff: <strong>44</strong></span>
            </div>
            <div className="w-full bg-[#d6e4f0] h-2 rounded-full overflow-hidden flex">
              <div className="bg-[#012535] h-full" style={{ width: '96.5%' }} title="Clientes"></div>
              <div className="bg-[#006875] h-full" style={{ width: '3.0%' }} title="Bibliotecarios"></div>
              <div className="bg-[#d69328] h-full" style={{ width: '0.5%' }} title="Admins"></div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#42474b] mt-2">
              <span>38 Bibliotecarios</span>
              <span className="font-semibold text-[#012535]">6 Administradores</span>
            </div>
          </div>
        </div>

        {/* Card 2: Catálogo & Stock Físico */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#d6e4f0] flex flex-col justify-between hover:shadow-md transition-all">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#42474b] tracking-wider uppercase">
                Acervo &amp; Ejemplares
              </span>
              <div className="w-9 h-9 rounded-xl bg-[#e1f0fb] flex items-center justify-center text-[#006875]">
                <span className="material-symbols-outlined text-[20px]">auto_stories</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#012535] font-mono">5,420</span>
              <span className="text-xs text-[#42474b]">títulos activos</span>
            </div>
          </div>

          <div className="mt-4 pt-3 bg-[#f5faff] rounded-xl p-3 border border-[#e1f0fb] flex items-center justify-between">
            <div>
              <span className="text-[11px] text-[#42474b] block">Stock Físico Custodiado</span>
              <span className="text-xl font-bold text-[#006875] font-mono">18,350</span>
              <span className="text-[11px] text-[#42474b] block">ejemplares catalogados</span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-[#e1f0fb] flex items-center justify-center text-[#006875]">
              <span className="material-symbols-outlined text-[22px]">inventory_2</span>
            </div>
          </div>
        </div>

        {/* Card 3: Devoluciones a Tiempo */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#d6e4f0] flex flex-col justify-between hover:shadow-md transition-all">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#42474b] tracking-wider uppercase">
                Devoluciones a Tiempo
              </span>
              <div className="w-9 h-9 rounded-xl bg-[#e1f0fb] flex items-center justify-center text-[#006875]">
                <span className="material-symbols-outlined text-[20px]">schedule</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#012535] font-mono">94.2%</span>
              <span className="text-xs font-bold text-[#006875] bg-[#e1f0fb] px-2 py-0.5 rounded-full">
                Meta &gt;90%
              </span>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between text-xs mb-1 text-[#42474b]">
              <span>Índice cumplimiento de préstamo</span>
              <span className="text-[#012535] font-bold font-mono">1,824 / 1,936 dev.</span>
            </div>
            <div className="w-full bg-[#d6e4f0] h-2 rounded-full overflow-hidden">
              <div className="bg-[#006875] h-full rounded-full" style={{ width: '94.2%' }}></div>
            </div>
            <p className="text-[11px] text-[#42474b] mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-[#006875]">check_circle</span>
              Cumplimiento SLA Préstamos PRD
            </p>
          </div>
        </div>

      </section>

      {/* Nav Sub-Tabs for Admin Sections */}
      <div className="flex items-center gap-2 mb-6 border-b border-[#d6e4f0] pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveAdminTab('dashboard')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeAdminTab === 'dashboard'
              ? 'bg-[#012535] text-white shadow-xs'
              : 'text-[#42474b] hover:bg-[#e1f0fb]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">dashboard</span>
          <span>Panel Completo</span>
        </button>
        <button
          onClick={() => setActiveAdminTab('libros')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeAdminTab === 'libros'
              ? 'bg-[#012535] text-white shadow-xs'
              : 'text-[#42474b] hover:bg-[#e1f0fb]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">library_books</span>
          <span>Gestión y Listado de Libros</span>
        </button>
        <button
          onClick={() => setActiveAdminTab('top10')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeAdminTab === 'top10'
              ? 'bg-[#012535] text-white shadow-xs'
              : 'text-[#42474b] hover:bg-[#e1f0fb]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">leaderboard</span>
          <span>Reporte TOP 10 (CA-08)</span>
        </button>
        <button
          onClick={() => setActiveAdminTab('personal')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeAdminTab === 'personal'
              ? 'bg-[#012535] text-white shadow-xs'
              : 'text-[#42474b] hover:bg-[#e1f0fb]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">manage_accounts</span>
          <span>Matriz de Personal RBAC</span>
        </button>
      </div>

      {/* SECTION 1: TOP 10 Libros Más Prestados (CA-08 PRD) */}
      {(activeAdminTab === 'dashboard' || activeAdminTab === 'top10') && (
        <section className="w-full mb-8">
          <div className="w-full bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#d6e4f0] flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#006875] text-[24px]">leaderboard</span>
                    <h2 className="text-xl font-bold text-[#012535]">Reporte TOP 10 Libros Más Prestados (CA-08)</h2>
                  </div>
                  <p className="text-xs text-[#42474b] mt-0.5">
                    Conteo total de salidas de sala y domicilio en el periodo seleccionado.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#42474b] bg-[#e1f0fb] px-3 py-1 rounded-lg border border-[#d6e4f0]">
                    Total Circulante: <strong>3,412 volúmenes</strong>
                  </span>
                </div>
              </div>

              {/* Progress Ranking List */}
              <div className="flex flex-col gap-2.5 mt-4">
                {top10List.map((item) => (
                  <div key={item.rank} className="p-2 hover:bg-[#f5faff] rounded-xl transition-all border border-transparent hover:border-[#e1f0fb]">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${
                            item.rank === 1
                              ? 'bg-[#012535] text-white'
                              : item.rank <= 3
                              ? 'bg-[#006875] text-white'
                              : 'bg-[#e1f0fb] text-[#012535]'
                          }`}
                        >
                          {item.rank}
                        </span>
                        <div className="min-w-0 truncate">
                          <span className="font-bold text-xs sm:text-sm text-[#012535] block truncate">
                            {item.titulo}
                          </span>
                          <span className="text-[11px] text-[#42474b]">
                            {item.autor} · ISBN {item.isbn}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0 pl-3">
                        <span className="font-bold text-xs sm:text-sm text-[#012535] font-mono">
                          {item.prestamos} préstamos
                        </span>
                        <span className="text-[11px] text-[#006875] block font-semibold">
                          {item.porcentaje}% del total
                        </span>
                      </div>
                    </div>

                    <div className="w-full bg-[#d6e4f0] h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#006875] h-full rounded-full transition-all duration-700"
                        style={{ width: `${(item.porcentaje / top10List[0].porcentaje) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-3 flex items-center justify-between bg-[#f5faff] p-3 rounded-xl border border-[#d6e4f0] text-xs">
              <span className="text-[#42474b]">
                Los 10 volúmenes concentran el <strong>68.0%</strong> de la demanda circulante global.
              </span>
              <button
                type="button"
                onClick={handleExportCA08}
                className="text-[#006875] hover:text-[#012535] flex items-center gap-1 font-bold cursor-pointer"
              >
                <span>Descargar desglose CSV</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 2: Gestión y Listado de Libros (as shown in Screenshot Image 8/17) */}
      {(activeAdminTab === 'dashboard' || activeAdminTab === 'libros') && (
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-[#d6e4f0] mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 gap-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006875] text-[24px]">menu_book</span>
                <h2 className="text-xl font-bold text-[#012535]">Gestión y Listado de Libros</h2>
              </div>
              <p className="text-xs text-[#42474b] mt-0.5">
                Control integral de acervo bibliográfico, disponibilidad en sala y préstamo domiciliario.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={onOpenNewBookModal}
                className="flex items-center gap-1.5 bg-[#012535] hover:bg-[#1b3b4b] text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                <span>Nuevo Libro</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 my-4 bg-[#f5faff] p-3 rounded-xl border border-[#d6e4f0]">
            <div className="flex items-center bg-white px-3.5 py-2 rounded-xl gap-2 w-full sm:w-96 shadow-xs border border-[#c2c7cc]">
              <span className="material-symbols-outlined text-slate-400 text-[18px]">search</span>
              <input
                type="text"
                value={bookSearch}
                onChange={(e) => setBookSearch(e.target.value)}
                placeholder="Buscar libro por código, título, autor, prestamista..."
                className="bg-transparent w-full outline-none text-xs text-[#0f1d25] placeholder:text-slate-400"
              />
              {bookSearch && (
                <button type="button" onClick={() => setBookSearch('')} className="text-slate-400 hover:text-slate-700">
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap sm:flex-nowrap">
              <div className="flex items-center bg-white px-3 py-2 rounded-xl gap-2 shadow-xs border border-[#c2c7cc]">
                <span className="material-symbols-outlined text-[18px] text-slate-400">filter_alt</span>
                <select
                  value={bookStatusFilter}
                  onChange={(e) => setBookStatusFilter(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-[#0f1d25] outline-none cursor-pointer"
                >
                  <option value="ALL">Todos los Estados</option>
                  <option value="DISPONIBLE">Disponibles</option>
                  <option value="PRESTADO">Prestados</option>
                  <option value="MANTENIMIENTO">En Mantenimiento</option>
                  <option value="AGOTADO">Agotados</option>
                </select>
              </div>

              <div className="flex items-center bg-white px-3 py-2 rounded-xl gap-2 shadow-xs border border-[#c2c7cc]">
                <span className="material-symbols-outlined text-[18px] text-slate-400">category</span>
                <select
                  value={bookCatFilter}
                  onChange={(e) => setBookCatFilter(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-[#0f1d25] outline-none cursor-pointer"
                >
                  <option value="ALL">Todas las Categorías</option>
                  <option value="Ingeniería">Ingeniería de Software</option>
                  <option value="Literatura">Literatura Universal</option>
                  <option value="Inteligencia Artificial">Inteligencia Artificial</option>
                  <option value="Bases de Datos">Bases de Datos &amp; Sistemas</option>
                  <option value="Redes">Redes y Telecomunicaciones</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#f5faff] text-[#42474b] uppercase font-bold tracking-wider text-[11px] border-b border-[#d6e4f0]">
                  <th className="py-3 px-4 rounded-l-lg">Código</th>
                  <th className="py-3 px-4">Nombre del Libro / Detalles</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4">Usuario que lo Prestó</th>
                  <th className="py-3 px-4">Categoría</th>
                  <th className="py-3 px-4 text-right rounded-r-lg">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLibros.map((b) => (
                  <tr key={b.id} className="hover:bg-[#f5faff] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#012535]">
                      <span className="bg-[#e1f0fb] px-2 py-0.5 rounded text-[11px]">
                        {b.codigo}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-10 rounded bg-[#012535] text-white flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[16px]">menu_book</span>
                        </div>
                        <div>
                          <span className="font-bold text-xs text-[#012535] block">{b.titulo}</span>
                          <span className="text-[11px] text-[#42474b]">{b.autor} · ISBN: {b.isbn}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {b.estado === 'DISPONIBLE' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-bold bg-[#e8f6f4] text-[#1d6e7b]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#1d6e7b]"></span>
                          Disponible
                        </span>
                      ) : b.estado === 'PRESTADO' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-bold bg-[#1b3b4b] text-white">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#95edfd]"></span>
                          Prestado
                        </span>
                      ) : b.estado === 'MANTENIMIENTO' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-bold bg-[#d6e4f0] text-[#012535]">
                          <span className="material-symbols-outlined text-[12px]">build</span>
                          En Mantenimiento
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-bold bg-[#ffdad6] text-[#ba1a1a]">
                          <span className="material-symbols-outlined text-[12px]">error</span>
                          Agotado
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {b.prestadoA ? (
                        <div className="flex flex-col">
                          <span className="font-bold text-[#012535]">{b.prestadoA}</span>
                          <span className="text-[10px] text-slate-500">{b.usuarioEmail}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">— En sala</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#e1f0fb] text-[#012535]">
                        {b.categoria}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onEditBook(b)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#e1f0fb] hover:bg-[#d6e4f0] text-[#012535] font-semibold text-xs transition-colors cursor-pointer"
                          title="Actualizar Ejemplar"
                        >
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                          <span>Actualizar</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteBook(b.id, b.titulo, b.codigo)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#ffdad6]/40 hover:bg-[#ffdad6] text-[#ba1a1a] font-semibold text-xs transition-colors cursor-pointer"
                          title="Dar de baja libro"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                          <span>Dar de baja</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between pt-4 mt-2 gap-3 text-xs text-[#42474b]">
            <span>
              Mostrando <strong>{filteredLibros.length}</strong> de <strong>5,420</strong> títulos catalogados
            </span>
            <div className="flex items-center gap-1">
              <button className="px-3 py-1 rounded bg-white border border-[#c2c7cc] disabled:opacity-40" disabled>
                Anterior
              </button>
              <button className="px-3 py-1 rounded bg-[#012535] text-white font-bold">1</button>
              <button className="px-3 py-1 rounded bg-white border border-[#c2c7cc] hover:bg-slate-50">2</button>
              <button className="px-3 py-1 rounded bg-white border border-[#c2c7cc] hover:bg-slate-50">3</button>
              <span className="px-1 text-slate-400">...</span>
              <button className="px-3 py-1 rounded bg-white border border-[#c2c7cc] hover:bg-slate-50">542</button>
              <button className="px-3 py-1 rounded bg-white border border-[#c2c7cc] hover:bg-slate-50">Siguiente</button>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 3: Matriz de Personal y Control de Roles RBAC */}
      {(activeAdminTab === 'dashboard' || activeAdminTab === 'personal') && (
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-[#d6e4f0]">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 gap-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#012535] text-[24px]">manage_accounts</span>
                <h2 className="text-xl font-bold text-[#012535]">Matriz de Personal y Control de Roles RBAC</h2>
              </div>
              <p className="text-xs text-[#42474b] mt-0.5">
                Alta y Baja de Bibliotecarios (Exclusivo Administrador según PRD). Supervisión de clientes y estado de moras.
              </p>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center bg-[#f5faff] px-3 py-1.5 rounded-xl border border-[#c2c7cc] gap-2">
                <span className="material-symbols-outlined text-[18px] text-slate-400">filter_list</span>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-[#0f1d25] outline-none cursor-pointer"
                >
                  <option value="ALL">Todos los Roles</option>
                  <option value="BIBLIOTECARIO">Solo Bibliotecarios (38)</option>
                  <option value="CLIENTE">Solo Clientes (1,240)</option>
                  <option value="ADMIN">Administradores (6)</option>
                </select>
              </div>

              <button
                type="button"
                onClick={onOpenNewLibrarianModal}
                className="bg-[#012535] hover:bg-[#1b3b4b] text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1 shadow-sm transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                <span>Nuevo Bibliotecario</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#f5faff] text-[#42474b] uppercase font-bold tracking-wider text-[11px] border-b border-[#d6e4f0]">
                  <th className="py-3 px-4 rounded-l-lg">Usuario &amp; Credenciales</th>
                  <th className="py-3 px-4">Rol RBAC</th>
                  <th className="py-3 px-4">Permisos Asignados</th>
                  <th className="py-3 px-4">Estado del Usuario</th>
                  <th className="py-3 px-4">Último Acceso</th>
                  <th className="py-3 px-4 text-right rounded-r-lg">Acciones Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsuarios.map((u) => {
                  const isSancionado = u.estado === 'SANCIONADO';
                  const isInactivo = u.estado === 'INACTIVO';

                  return (
                    <tr
                      key={u.id}
                      className={`hover:bg-[#f5faff] transition-colors ${
                        isInactivo ? 'opacity-65' : isSancionado ? 'bg-[#ffdad6]/10' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                              u.rol === 'ADMINISTRADOR'
                                ? 'bg-[#ffddb4] text-[#633f00]'
                                : u.rol === 'BIBLIOTECARIO'
                                ? 'bg-[#006875] text-white'
                                : 'bg-[#e1f0fb] text-[#012535]'
                            }`}
                          >
                            {u.nombre.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className={`font-bold text-xs text-[#012535] block ${isInactivo ? 'line-through' : ''}`}>
                              {u.nombre}
                            </span>
                            <span className="text-[11px] text-[#42474b]">{u.email}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                            u.rol === 'ADMINISTRADOR'
                              ? 'bg-[#ffddb4] text-[#633f00]'
                              : u.rol === 'BIBLIOTECARIO'
                              ? 'bg-[#1b3b4b] text-white'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {u.rol === 'ADMINISTRADOR' ? 'Administrador' : u.rol === 'BIBLIOTECARIO' ? 'Bibliotecario' : 'Cliente Lector'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 flex-wrap">
                          {u.permisos.map((p, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#e1f0fb] text-[#012535]"
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {u.estado === 'ACTIVO' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold bg-[#e8f6f4] text-[#1d6e7b]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#1d6e7b]"></span>
                            Activo
                          </span>
                        ) : isSancionado ? (
                          <div className="flex flex-col">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold bg-[#ffdad6] text-[#ba1a1a] w-fit">
                              <span className="material-symbols-outlined text-[14px]">warning</span>
                              Sancionado (Mora)
                            </span>
                            {u.fechaSancionFin && (
                              <span className="text-[10px] text-slate-500 mt-0.5">
                                Término: {u.fechaSancionFin}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold bg-slate-200 text-slate-600">
                            Inactivo / Baja
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-[#42474b]">{u.ultimoAcceso}</td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {u.rol === 'ADMINISTRADOR' ? (
                            <span className="text-[11px] text-slate-400 italic">Protegido</span>
                          ) : isSancionado ? (
                            <button
                              type="button"
                              onClick={() => handleLevantarSancion(u)}
                              className="px-2.5 py-1 bg-[#e8f6f4] text-[#1d6e7b] hover:bg-[#d6e4f0] rounded font-bold text-xs transition-colors cursor-pointer"
                            >
                              Levantar
                            </button>
                          ) : isInactivo ? (
                            <button
                              type="button"
                              onClick={() => {
                                onToggleUserStatus(u.id, 'ACTIVO');
                                Swal.fire({
                                  icon: 'success',
                                  title: 'Cuenta Reactivada',
                                  text: `Se restablecieron los permisos de sala para ${u.nombre}.`,
                                  confirmButtonColor: '#012535'
                                });
                              }}
                              className="text-xs font-bold text-[#006875] hover:underline cursor-pointer"
                            >
                              Reactivar
                            </button>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  Swal.fire({
                                    title: `Permisos de ${u.nombre}`,
                                    text: `Permisos asignados: ${u.permisos.join(', ')}`,
                                    icon: 'info',
                                    confirmButtonColor: '#012535'
                                  });
                                }}
                                className="p-1 rounded text-slate-500 hover:text-[#012535] hover:bg-slate-100 cursor-pointer"
                                title="Editar Permisos"
                              >
                                <span className="material-symbols-outlined text-[18px]">edit</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleBajaUsuario(u)}
                                className="p-1 rounded text-[#ba1a1a] hover:bg-[#ffdad6] transition-colors cursor-pointer"
                                title="Dar de Baja"
                              >
                                <span className="material-symbols-outlined text-[18px]">person_remove</span>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

    </div>
  );
};
