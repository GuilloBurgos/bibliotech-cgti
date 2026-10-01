import React, { useState, useMemo } from 'react';
import { Libro, Prestamo } from '../types';
import Swal from 'sweetalert2';

interface ReaderDashboardViewProps {
  libros: Libro[];
  onVerDetalle: (libro: Libro) => void;
  onReservar: (libro: Libro) => void;
}

export const ReaderDashboardView: React.FC<ReaderDashboardViewProps> = ({
  libros,
  onVerDetalle,
  onReservar,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);

  // User's active loans state (Sofia Alarcón)
  const [userLoans, setUserLoans] = useState([
    {
      id: 'active-1',
      title: 'El Nombre de la Rosa',
      author: 'Umberto Eco',
      status: 'En tiempo regular',
      statusType: 'normal',
      dueDate: '28 Oct 2025',
      daysLeftText: '5 de 14 días',
      progressPercent: 64,
      image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=400&q=80',
      canRenew: false
    },
    {
      id: 'active-2',
      title: '1984',
      author: 'George Orwell',
      status: '¡Vence Mañana!',
      statusType: 'urgent',
      dueDate: 'Mañana, 18:00 hrs',
      daysLeftText: '1 día restante',
      progressPercent: 92,
      image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=400&q=80',
      canRenew: true
    }
  ]);

  const handleRenew = (bookTitle: string) => {
    Swal.fire({
      icon: 'success',
      title: '¡Renovación Exitosa!',
      html: `
        <p class="text-sm text-slate-600 mb-2">
          Tu préstamo para <strong>${bookTitle}</strong> ha sido extendido por <strong>7 días hábiles</strong>.
        </p>
        <div class="bg-[#e9f5ff] p-3 rounded-lg text-xs text-[#006875] font-semibold text-center border border-[#95edfd]">
          Nueva fecha límite: 04 Nov 2025
        </div>
      `,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#012535',
      customClass: {
        popup: 'rounded-2xl font-sans p-6'
      }
    });

    setUserLoans((prev) =>
      prev.map((l) =>
        l.title === bookTitle
          ? {
              ...l,
              status: 'Renovado en línea',
              statusType: 'normal',
              dueDate: '04 Nov 2025',
              daysLeftText: '7 días restantes',
              progressPercent: 40,
              canRenew: false
            }
          : l
      )
    );
  };

  // Filter books
  const filteredLibros = useMemo(() => {
    return libros.filter((book) => {
      const matchQuery =
        !searchQuery.trim() ||
        book.titulo.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        book.autor.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        book.isbn.toLowerCase().includes(searchQuery.toLowerCase().trim());

      const matchCat =
        selectedCategory === 'Todos' ||
        book.categoria.toLowerCase().includes(selectedCategory.toLowerCase());

      const matchAvail = !onlyAvailable || book.stockDisponible > 0;

      return matchQuery && matchCat && matchAvail;
    });
  }, [libros, searchQuery, selectedCategory, onlyAvailable]);

  return (
    <div className="flex flex-col w-full text-left">
      
      {/* Top Ambient Banner Bento Hero */}
      <section className="w-full mb-6">
        <div className="bg-[#1b3b4b] text-white rounded-2xl p-6 lg:p-8 relative overflow-hidden shadow-md">
          {/* Ambient Decorative Geometry */}
          <div className="absolute -right-16 -top-24 w-80 h-80 rounded-full bg-[#006875] opacity-25 blur-3xl pointer-events-none"></div>
          <div className="absolute right-36 bottom-[-20%] w-60 h-60 rounded-full bg-[#d69328] opacity-20 blur-2xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[#c7e7fc] text-xs font-semibold">
                <span className="material-symbols-outlined text-[16px] text-[#ffb953]">verified_user</span>
                <span className="tracking-wide uppercase">Usuario Activo • Matrícula #LIB-8942</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
                Bienvenido de vuelta, Sofía
              </h1>
              <p className="text-sm text-[#86a5b8] leading-relaxed">
                Tus préstamos activos:{' '}
                <span className="text-white font-bold">{userLoans.length} de 3 disponibles</span>. Tienes{' '}
                {3 - userLoans.length} cupo restante para solicitar material bibliográfico físico o reservado en sala.
              </p>
            </div>

            {/* Metric & Quick Action Capsule */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="bg-[#012535]/60 backdrop-blur-md rounded-xl p-4 flex items-center gap-4 border border-white/10 shadow-sm">
                <div className="w-12 h-12 rounded-lg bg-[#006875]/40 flex items-center justify-center text-[#9af0ff]">
                  <span className="material-symbols-outlined text-[28px]">auto_stories</span>
                </div>
                <div>
                  <div className="text-2xl font-black text-white leading-tight font-mono">
                    {userLoans.length}/3
                  </div>
                  <div className="text-xs text-[#86a5b8]">Cupos en posesión</div>
                </div>
              </div>

              <button
                onClick={() => {
                  const input = document.getElementById('catalog-search-input');
                  if (input) input.focus();
                }}
                className="bg-[#d69328] hover:bg-[#ffb953] text-[#012535] font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">search</span>
                <span>Búsqueda Rápida</span>
              </button>
            </div>
          </div>

          {/* Quick Category Pills */}
          <div className="relative z-10 mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-[#86a5b8] uppercase tracking-wider mr-1">Colecciones:</span>
            {['Ficción', 'Ciencia & Tecnología', 'Historia', 'Literatura', 'Filosofía', 'Todos'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#9af0ff] text-[#012535] font-bold shadow-sm'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                {cat === 'Todos' ? 'Ver Todas' : cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Search & Filtering Bar */}
      <section className="w-full mb-6">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#d6e4f0] flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1 min-w-[280px]">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
              search
            </span>
            <input
              id="catalog-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar libro por título, autor o ISBN (ej. García Márquez, 978...)"
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#f5faff] text-xs text-[#0f1d25] border border-[#c2c7cc] focus:border-[#006875] outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Dropdown Filter & Status Toggle */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 bg-[#f5faff] px-3 py-2 rounded-xl border border-[#c2c7cc]">
              <span className="material-symbols-outlined text-slate-400 text-[18px]">category</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-transparent text-xs font-semibold text-[#0f1d25] outline-none cursor-pointer"
              >
                <option value="Todos">Todas las Categorías</option>
                <option value="Ficción">Ficción</option>
                <option value="Ciencia & Tecnología">Ciencia & Tecnología</option>
                <option value="Historia">Historia</option>
                <option value="Literatura">Literatura</option>
                <option value="Filosofía">Filosofía</option>
              </select>
            </div>

            {/* Availability Toggle */}
            <label className="flex items-center gap-2 bg-[#f5faff] px-3.5 py-2 rounded-xl border border-[#c2c7cc] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                className="w-4 h-4 rounded text-[#006875] border-[#c2c7cc] focus:ring-0 cursor-pointer"
              />
              <span className="text-xs font-semibold text-[#0f1d25]">Solo Disponibles</span>
            </label>

            {/* Results counter badge */}
            <div className="bg-[#e1f0fb] px-3.5 py-2 rounded-xl border border-[#d6e4f0]">
              <span className="text-xs font-bold text-[#006875]">
                Mostrando {filteredLibros.length} volumen{filteredLibros.length === 1 ? '' : 'es'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Bento Grid Layout (Catalog 8 Cols + User Active Loans Bento Sidebar 4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start">
        
        {/* Left Column: Books Grid (8 cols) */}
        <main className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#012535]">Catálogo General de Sala y Reserva</h2>
              <p className="text-xs text-[#42474b] mt-0.5">
                Consulta el inventario físico actualizado al instante con control de existencias.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-[#42474b]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#006875]"></span> En estantería
              <span className="w-2.5 h-2.5 rounded-full bg-[#d69328] ml-2"></span> Reserva urgente
            </div>
          </div>

          {/* Book Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredLibros.map((book) => {
              const isAvail = book.stockDisponible > 0;
              return (
                <div
                  key={book.id}
                  className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group border border-[#d6e4f0]"
                >
                  <div>
                    <div className="relative rounded-xl overflow-hidden h-48 bg-[#e1f0fb] mb-3.5">
                      <img
                        src={book.portadaUrl}
                        alt={book.titulo}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                      <div className="absolute top-2.5 right-2.5">
                        <span
                          className={`font-bold text-[11px] px-2.5 py-1 rounded shadow-sm flex items-center gap-1 ${
                            isAvail
                              ? 'bg-[#95edfd] text-[#006d7a]'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isAvail ? 'bg-[#006875]' : 'bg-slate-500'}`}></span>
                          {isAvail ? `Stock: ${book.stockDisponible} disp.` : 'Agotado en sala'}
                        </span>
                      </div>
                      <div className="absolute bottom-2.5 left-2.5">
                        <span className="bg-[#012535]/80 backdrop-blur-md text-white font-bold text-[10px] px-2 py-0.5 rounded">
                          Físico • {book.ubicacion.split('-')[0] || 'Sala'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-[11px] font-bold text-[#006875] uppercase tracking-wider">
                        {book.categoria.split(' ')[0]}
                      </div>
                      <h3
                        className="font-bold text-sm text-[#012535] line-clamp-1 group-hover:text-[#006875] transition-colors"
                        title={book.titulo}
                      >
                        {book.titulo}
                      </h3>
                      <p className="text-xs font-semibold text-[#42474b] truncate">{book.autor}</p>
                      <div className="text-[11px] text-[#72787c] font-mono">ISBN: {book.isbn}</div>
                    </div>
                  </div>

                  <div className="pt-4 mt-2 border-t border-slate-100 flex gap-2">
                    <button
                      type="button"
                      onClick={() => onVerDetalle(book)}
                      className="flex-1 py-2 px-3 rounded-lg bg-[#1b3b4b] hover:bg-[#012535] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">info</span>
                      <span>Ver Detalles</span>
                    </button>
                    <button
                      type="button"
                      disabled={!isAvail}
                      onClick={() => onReservar(book)}
                      className={`py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center transition-all ${
                        isAvail
                          ? 'bg-[#006875] hover:bg-[#012535] text-white shadow-sm cursor-pointer'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                      title={isAvail ? 'Reservar' : 'Sin stock'}
                    >
                      <span className="material-symbols-outlined text-[16px]">bookmark_add</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </main>

        {/* Right Column: User Active Loans Bento Sidebar (4 cols) */}
        <aside className="lg:col-span-4 flex flex-col gap-4">
          
          {/* Bento Tile 1: Loans Header */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#d6e4f0]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006875]">backpack</span>
                <h2 className="font-bold text-base text-[#012535]">Mis Préstamos Actuales</h2>
              </div>
              <span className="bg-[#9af0ff] text-[#012535] text-xs font-bold px-2.5 py-0.5 rounded-full">
                {userLoans.length} Activos
              </span>
            </div>
            <p className="text-xs text-[#42474b] leading-relaxed">
              Supervisa la fecha tope de retorno presencial para mantener tu historial académico sin suspensiones.
            </p>
          </div>

          {/* Active Book Items */}
          {userLoans.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-[#d6e4f0] transition-all hover:shadow-md"
            >
              <div className="flex gap-3 items-start mb-3">
                <div className="w-14 h-20 rounded-lg bg-[#e1f0fb] overflow-hidden shrink-0 shadow-xs border border-slate-200">
                  <img
                    src={item.image}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span
                    className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded mb-1 ${
                      item.statusType === 'urgent'
                        ? 'bg-[#ffddb4] text-[#633f00]'
                        : 'bg-[#95edfd] text-[#006d7a]'
                    }`}
                  >
                    {item.status}
                  </span>
                  <h3 className="font-bold text-sm text-[#012535] truncate">{item.title}</h3>
                  <p className="text-xs text-[#42474b] truncate">{item.author}</p>
                  <div className="text-[11px] text-[#72787c] mt-1">
                    Devolución:{' '}
                    <strong className={item.statusType === 'urgent' ? 'text-[#ba1a1a]' : 'text-slate-800'}>
                      {item.dueDate}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-[#42474b]">Plazo de lectura:</span>
                  <span className={`font-bold ${item.statusType === 'urgent' ? 'text-[#d69328]' : 'text-[#006875]'}`}>
                    {item.daysLeftText}
                  </span>
                </div>
                <div className="w-full bg-[#dceaf6] h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      item.statusType === 'urgent' ? 'bg-[#d69328]' : 'bg-[#006875]'
                    }`}
                    style={{ width: `${item.progressPercent}%` }}
                  ></div>
                </div>
              </div>

              {item.canRenew && (
                <button
                  type="button"
                  onClick={() => handleRenew(item.title)}
                  className="mt-3 w-full py-1.5 px-3 rounded-lg bg-[#e1f0fb] hover:bg-[#d6e4f0] text-[#012535] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#006875]">sync</span>
                  <span>Solicitar Renovación Web (+7 días)</span>
                </button>
              )}
            </div>
          ))}

          {/* Bento Tile 3: Rule of Business Penalty Notice */}
          <div className="bg-[#ffdad6]/40 rounded-2xl p-4 shadow-sm border border-[#ffdad6]">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-[#ba1a1a] text-white shrink-0">
                <span className="material-symbols-outlined text-[20px]">gavel</span>
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-xs text-[#012535]">Reglamento de Sanciones (CA-05)</h3>
                <p className="text-xs text-[#42474b] leading-relaxed">
                  La política de la biblioteca establece que la mora inhabilita el préstamo de nuevos títulos:
                </p>
                <div className="bg-white/90 p-2 rounded-lg text-center text-xs font-mono font-bold text-[#ba1a1a] border border-[#ffdad6]">
                  Días Suspensión = Días Mora × 2
                </div>
                <p className="text-[11px] text-[#42474b] pt-1">
                  Las devoluciones se efectúan en buzón inteligente 24/7 o mostrador central.
                </p>
              </div>
            </div>
          </div>

          {/* Bento Tile 4: Service Hours & Direct Desk Assistance */}
          <div className="bg-[#012535] text-white rounded-2xl p-5 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-[#9af0ff]">schedule</span>
              <h3 className="font-bold text-sm text-white">Horario de Mostrador</h3>
            </div>
            <p className="text-xs text-slate-300 mb-3 leading-relaxed">
              Lunes a Viernes: 08:00 - 20:30 hrs.<br />
              Sábados continuos: 09:00 - 14:00 hrs.
            </p>
            <div className="flex items-center justify-between text-xs text-[#7cd4e3] pt-2 border-t border-white/10">
              <span>Soporte de Sala:</span>
              <span className="font-bold text-white">Anexo 4022</span>
            </div>
          </div>

        </aside>

      </div>
    </div>
  );
};
