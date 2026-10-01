import React, { useState, useMemo } from 'react';
import { Libro } from '../types';

interface PublicCatalogViewProps {
  libros: Libro[];
  onVerDetalle: (libro: Libro) => void;
  onReservar: (libro: Libro) => void;
}

export const PublicCatalogView: React.FC<PublicCatalogViewProps> = ({
  libros,
  onVerDetalle,
  onReservar,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCriteria, setSearchCriteria] = useState<'todos' | 'titulo' | 'autor' | 'isbn'>('todos');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Todas' },
    { id: 'Ingeniería de Software', label: 'Ingeniería & Software' },
    { id: 'Inteligencia Artificial', label: 'Inteligencia Artificial' },
    { id: 'Redes y Telecomunicaciones', label: 'Redes & Ciberseguridad' },
    { id: 'Ciencias Computacionales', label: 'Ciencias Computacionales' },
    { id: 'Literatura Universal', label: 'Literatura & Ensayo' },
  ];

  // Filtering logic
  const filteredLibros = useMemo(() => {
    return libros.filter((libro) => {
      // Category match
      const matchesCat =
        selectedCategory === 'all' ||
        libro.categoria.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        (selectedCategory === 'Literatura Universal' && libro.categoria.includes('Literatura')) ||
        (selectedCategory === 'Redes y Telecomunicaciones' && (libro.categoria.includes('Redes') || libro.categoria.includes('Telecomunicaciones'))) ||
        (selectedCategory === 'Ingeniería de Software' && (libro.categoria.includes('Software') || libro.categoria.includes('Ingeniería')));

      // Text match
      if (!searchQuery.trim()) return matchesCat;

      const q = searchQuery.toLowerCase().trim();
      const tituloMatch = libro.titulo.toLowerCase().includes(q);
      const autorMatch = libro.autor.toLowerCase().includes(q);
      const isbnMatch = libro.isbn.toLowerCase().includes(q) || libro.codigo.toLowerCase().includes(q);

      let textMatch = false;
      if (searchCriteria === 'titulo') textMatch = tituloMatch;
      else if (searchCriteria === 'autor') textMatch = autorMatch;
      else if (searchCriteria === 'isbn') textMatch = isbnMatch;
      else textMatch = tituloMatch || autorMatch || isbnMatch;

      return matchesCat && textMatch;
    });
  }, [libros, searchQuery, searchCriteria, selectedCategory]);

  return (
    <div className="flex flex-col w-full">
      {/* Top Ambient Banner & Search Module (Bento Hero Zone) */}
      <section className="relative w-full px-4 sm:px-8 py-10 lg:py-14 overflow-hidden bg-[#e9f5ff]/60 border-b border-[#d6e4f0]">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#9af0ff]/30 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-20 w-80 h-80 rounded-full bg-[#abcbdf]/30 blur-2xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto flex flex-col gap-6 relative z-10 text-left">
          
          {/* Header Title with Live Indicator */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d6e4f0] text-[#006875] text-xs font-bold mb-3 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#006875] animate-pulse"></span>
                CATÁLOGO GENERAL ACTUALIZADO · CICLO 2025
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#012535] tracking-tight leading-tight">
                Descubre, consulta y reserva el conocimiento institucional.
              </h1>
              <p className="text-sm sm:text-base text-[#42474b] mt-3 leading-relaxed">
                Acceso simultáneo a bibliografía técnica, computacional, ingeniería y literatura universal. Retiro en sala o descarga documental instantánea.
              </p>
            </div>

            {/* Quick Live Indicator Bento pill */}
            <div className="flex items-center gap-3 bg-white p-3.5 rounded-xl shadow-sm border border-[#d6e4f0] self-start md:self-auto shrink-0">
              <div className="w-11 h-11 rounded-lg bg-[#e1f0fb] flex items-center justify-center text-[#006875]">
                <span className="material-symbols-outlined text-[24px]">book</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-[#42474b]">Disponibilidad en Sala</span>
                <span className="text-lg font-bold text-[#012535]">94.8% en Tiempo Real</span>
              </div>
            </div>
          </div>

          {/* Multidimensional Interactive Search Bento Box */}
          <div className="w-full bg-white rounded-2xl p-4 sm:p-6 shadow-md border border-[#d6e4f0]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
              className="flex flex-col gap-4"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
                {/* Search Type Criteria Dropdown */}
                <div className="lg:col-span-3 relative">
                  <div className="flex items-center h-12 px-3 rounded-xl bg-[#e9f5ff] text-[#012535] border border-[#d6e4f0]">
                    <span className="material-symbols-outlined text-[#006875] mr-2 text-[20px]">filter_list</span>
                    <select
                      value={searchCriteria}
                      onChange={(e) => setSearchCriteria(e.target.value as any)}
                      className="w-full bg-transparent font-semibold text-xs text-[#012535] focus:outline-none cursor-pointer"
                    >
                      <option value="todos">Todos los campos</option>
                      <option value="titulo">Título del libro</option>
                      <option value="autor">Autor / Investigador</option>
                      <option value="isbn">ISBN / Signatura</option>
                    </select>
                  </div>
                </div>

                {/* Query Input */}
                <div className="lg:col-span-6 relative">
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3.5 text-slate-400 text-[20px]">search</span>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Ej. 'Clean Code', 'Algoritmos', 'García Márquez'..."
                      className="w-full h-12 pl-11 pr-10 rounded-xl bg-[#f5faff] text-xs text-[#0f1d25] placeholder:text-slate-400 focus:outline-none focus:bg-white border border-[#c2c7cc] focus:border-[#006875] transition-all"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 text-slate-400 hover:text-[#012535]"
                      >
                        <span className="material-symbols-outlined text-[18px]">close</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <div className="lg:col-span-3">
                  <button
                    type="submit"
                    className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-[#1b3b4b] hover:bg-[#012535] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm active:scale-[0.99] cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">manage_search</span>
                    <span>Buscar Libros</span>
                  </button>
                </div>
              </div>

              {/* Category Chips / Segmented Filter Tabs */}
              <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Temáticas:</span>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-[#012535] text-white shadow-xs'
                        : 'bg-[#e1f0fb] text-[#42474b] hover:bg-[#d6e4f0]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Main Bento Content Section: Books Grid + Operational Info */}
      <section className="w-full px-4 sm:px-8 py-12 max-w-7xl mx-auto">
        <div className="flex flex-col gap-8 text-left">
          
          {/* Section Title & Status Filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#006875]"></span>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#012535] tracking-tight">
                  Acervo Bibliográfico Destacado
                </h2>
              </div>
              <p className="text-xs text-[#42474b] mt-1">
                Explora ejemplares impresos y accesos directos al repositorio digital CGTI.
              </p>
            </div>
            <div className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-[#e1f0fb] text-[#006875] border border-[#d6e4f0]">
              Mostrando {filteredLibros.length} de {libros.length} ejemplares
            </div>
          </div>

          {/* Dynamic Book Grid */}
          {filteredLibros.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-[#d6e4f0] space-y-3">
              <span className="material-symbols-outlined text-4xl text-slate-300">search_off</span>
              <h3 className="text-lg font-bold text-slate-700">No se encontraron libros que coincidan con la búsqueda</h3>
              <p className="text-xs text-slate-500">Prueba con otro título, autor, o restablece las temáticas seleccionadas.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-4 py-2 bg-[#012535] text-white rounded-lg text-xs font-semibold"
              >
                Restablecer Filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredLibros.map((book) => {
                const isAvail = book.stockDisponible > 0;
                return (
                  <article
                    key={book.id}
                    className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 group border border-[#d6e4f0]"
                  >
                    <div className="relative h-60 w-full bg-[#e1f0fb] overflow-hidden">
                      <img
                        src={book.portadaUrl}
                        alt={book.titulo}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-white/95 text-[#006875] backdrop-blur-md shadow-xs">
                          {book.categoria.split(' ')[0]}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span
                          className={`px-2.5 py-0.5 rounded text-[11px] font-bold shadow-xs ${
                            isAvail
                              ? 'bg-[#95edfd] text-[#006d7a]'
                              : 'bg-[#ffdad6] text-[#93000a]'
                          }`}
                        >
                          {book.badge || (isAvail ? `Disponible: ${book.stockDisponible} ejs.` : 'Agotado en sala')}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 flex flex-col flex-1 justify-between gap-3 text-left">
                      <div>
                        <span className="text-[10px] font-mono text-[#72787c] uppercase tracking-wider block mb-1">
                          SIGN: {book.codigo}
                        </span>
                        <h3
                          className="font-bold text-sm text-[#012535] line-clamp-1 group-hover:text-[#006875] transition-colors"
                          title={book.titulo}
                        >
                          {book.titulo}
                        </h3>
                        <p className="text-xs text-[#42474b] mt-0.5 truncate">{book.autor}</p>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => onVerDetalle(book)}
                          className="flex-1 h-9 rounded-lg bg-[#e1f0fb] hover:bg-[#d6e4f0] text-[#012535] font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">visibility</span>
                          <span>Ver Detalles</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onReservar(book)}
                          disabled={!isAvail}
                          className={`h-9 px-3.5 rounded-lg text-white font-bold text-xs flex items-center justify-center gap-1 transition-colors shadow-xs cursor-pointer ${
                            isAvail
                              ? 'bg-[#006875] hover:bg-[#012535]'
                              : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[16px]">bookmark_add</span>
                          <span>Reservar</span>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Bento Informative Row: Workflow & Library Policies */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4">
            
            {/* Bento Tile 1: 3-Step Borrowing Workflow (8 cols) */}
            <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#d6e4f0] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#e1f0fb] text-[#006875] text-xs font-bold">
                    <span className="material-symbols-outlined text-[16px]">touch_app</span>
                    GUÍA PARA EL LECTOR
                  </div>
                  <span className="text-xs text-[#72787c]">Proceso 100% digitalizado</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#012535] tracking-tight">
                  ¿Cómo solicitar y retirar tu bibliografía en 3 pasos?
                </h3>
                <p className="text-xs sm:text-sm text-[#42474b] mt-1">
                  Optimizado para la comunidad de la Coordinación General de Tecnologías de Información y facultades asociadas.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                {/* Step 1 */}
                <div className="bg-[#f5faff] p-4 rounded-xl border border-[#d6e4f0] flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#012535] text-white flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <h4 className="font-bold text-xs text-[#012535]">Localiza el Ejemplar</h4>
                  <p className="text-xs text-[#42474b] leading-relaxed">
                    Usa el buscador por título, autor o signatura y revisa la disponibilidad física en sala.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="bg-[#f5faff] p-4 rounded-xl border border-[#d6e4f0] flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#006875] text-white flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <h4 className="font-bold text-xs text-[#012535]">Reserva con 1 Clic</h4>
                  <p className="text-xs text-[#42474b] leading-relaxed">
                    Pulsa "Reservar". Tu código digital se sincroniza de inmediato con el catálogo CGTI.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="bg-[#f5faff] p-4 rounded-xl border border-[#d6e4f0] flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#1b3b4b] text-white flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <h4 className="font-bold text-xs text-[#012535]">Retira en Ventanilla</h4>
                  <p className="text-xs text-[#42474b] leading-relaxed">
                    Acércate al módulo central con tu credencial o QR móvil en menos de 24 horas.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                <span className="inline-flex items-center gap-1.5 text-xs text-[#006875] font-semibold">
                  <span className="material-symbols-outlined text-[18px]">lock_clock</span>
                  El material reservado permanece apartado hasta por 24 horas hábiles.
                </span>
                <span className="text-xs font-bold text-[#012535] hover:text-[#006875] cursor-pointer">
                  Ver todos los servicios bibliotecarios →
                </span>
              </div>
            </div>

            {/* Bento Tile 2: Normativa Vigente (4 cols) */}
            <div className="lg:col-span-4 bg-[#012535] text-white rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded text-xs font-bold bg-[#1b3b4b] text-[#9af0ff]">
                  <span className="material-symbols-outlined text-[14px]">policy</span>
                  NORMATIVA VIGENTE
                </div>
                <h3 className="text-xl font-bold text-white mt-3">
                  Condiciones de Préstamo y Circulación
                </h3>

                <ul className="mt-4 space-y-3 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[#9af0ff] text-[18px] shrink-0 mt-0.5">event</span>
                    <span>
                      <strong className="text-white">Préstamo ordinario:</strong> 15 días continuos para estudiantes e investigadores con opción a 2 renovaciones en línea.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[#ffb953] text-[18px] shrink-0 mt-0.5">warning</span>
                    <span>
                      <strong className="text-white">Sanción por mora:</strong> Suspensión proporcional de 2 días en sistema por cada jornada de retraso (Días Mora × 2).
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[#9af0ff] text-[18px] shrink-0 mt-0.5">menu_book</span>
                    <span>
                      <strong className="text-white">Colección de Reserva:</strong> Consulta exclusiva en sala de lectura CGTI con credencial activa.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="pt-6">
                <button
                  type="button"
                  onClick={() => {
                    // Quick modal showing the complete regulation
                    onVerDetalle(libros[0]);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-white text-[#012535] hover:bg-slate-100 text-center font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">description</span>
                  <span>Consultar Reglamento Completo</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bento Bottom Spotlight: Campus Central CGTI Facilities */}
          <div className="w-full bg-[#e9f5ff] rounded-2xl p-6 sm:p-8 shadow-xs border border-[#d6e4f0] flex flex-col md:flex-row items-center gap-6">
            <div className="w-full md:w-1/3 h-52 rounded-xl overflow-hidden bg-[#e1f0fb] shrink-0 shadow-sm border border-slate-200">
              <img
                src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80"
                alt="Instalaciones de Biblioteca Central CGTI"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded text-[11px] font-bold bg-[#d6e4f0] text-[#012535] mb-2">
                CAMPUS CENTRAL CGTI · SALA DE INFORMÁTICA Y REDES
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#012535]">
                Instalaciones conectadas para la investigación y el desarrollo
              </h3>
              <p className="text-xs sm:text-sm text-[#42474b] mt-2 leading-relaxed">
                Nuestras salas disponen de conexión de alta velocidad dedicada por fibra óptica, terminales de acceso a bases de datos indexadas (IEEE, ACM, Springer), cubículos de trabajo colaborativo insonorizados y asistencia presencial de bibliotecarios especializados en TIC.
              </p>
              <div className="mt-4 flex flex-wrap gap-4 text-xs font-semibold text-[#012535]">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#006875] text-[18px]">wifi</span>
                  Red Wi-Fi 6 de Acceso Libre
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#006875] text-[18px]">print</span>
                  Estación de Digitalización
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#006875] text-[18px]">schedule</span>
                  Lun a Vie: 07:00 a 21:00 hrs
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};
