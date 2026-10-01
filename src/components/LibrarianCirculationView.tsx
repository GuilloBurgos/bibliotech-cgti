import React, { useState } from 'react';
import { Prestamo, Libro } from '../types';
import { alertDevolucionConMora, alertDevolucionRegular } from '../utils/alerts';
import Swal from 'sweetalert2';

interface LibrarianCirculationViewProps {
  prestamos: Prestamo[];
  onDevolucionSuccess: (prestamoId: string, hasMora: boolean) => void;
  libros: Libro[];
  onUpdateLibroEstado?: (libroId: string, nuevoEstado: any) => void;
}

export const LibrarianCirculationView: React.FC<LibrarianCirculationViewProps> = ({
  prestamos,
  onDevolucionSuccess,
  libros,
  onUpdateLibroEstado,
}) => {
  const [expressInput, setExpressInput] = useState('PR-2024-884');
  const [filterState, setFilterState] = useState<string>('todos');

  // Handle express scan / return
  const handleExpressReturn = async (idToReturn?: string) => {
    const targetId = idToReturn || expressInput.trim();
    const prestamo = prestamos.find((p) => p.id.toLowerCase() === targetId.toLowerCase());

    if (!prestamo) {
      Swal.fire({
        icon: 'error',
        title: 'Préstamo No Encontrado',
        text: `No existe un registro activo con el identificador "${targetId}".`,
        confirmButtonColor: '#012535'
      });
      return;
    }

    if (prestamo.estado === 'CON_MORA') {
      const diasMora = prestamo.diasMora || 3;
      const suspension = diasMora * 2;
      const res = await alertDevolucionConMora(
        prestamo.id,
        prestamo.libroTitulo,
        prestamo.usuarioNombre,
        diasMora,
        suspension
      );

      if (res.isConfirmed) {
        onDevolucionSuccess(prestamo.id, true);
        Swal.fire({
          icon: 'success',
          title: 'Devolución Procesada con Éxito',
          text: `Se aplicó suspensión de ${suspension} días al socio y se restableció el stock (+1).`,
          confirmButtonColor: '#012535'
        });
      }
    } else {
      await alertDevolucionRegular(prestamo.libroTitulo, prestamo.id);
      onDevolucionSuccess(prestamo.id, false);
    }
  };

  // Filtered loans list
  const filteredPrestamos = prestamos.filter((p) => {
    if (filterState === 'mora') return p.estado === 'CON_MORA';
    if (filterState === 'hoy') return p.estado === 'POR_VENCER';
    if (filterState === 'atiempo') return p.estado === 'A_TIEMPO';
    return true;
  });

  return (
    <div className="flex flex-col w-full text-left">
      
      {/* Operational Header Bento */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-[#42474b] text-xs font-bold uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-[#006875] animate-pulse"></span>
            <span>Terminal Activa • Mostrador Central de Circulación</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#012535] tracking-tight">
            Operaciones de Préstamo y Retorno
          </h1>
          <p className="text-xs sm:text-sm text-[#42474b] mt-0.5">
            Ejecución inmediata de flujo ACID: devolución física, saneamiento de stock (+1) y cálculo algorítmico de mora.
          </p>
        </div>

        {/* Sync Mode Badge */}
        <div className="flex items-center gap-2.5 bg-white px-4 py-2 rounded-xl shadow-xs border border-[#d6e4f0] shrink-0">
          <span className="material-symbols-outlined text-[#006875] text-[20px] animate-spin">sync</span>
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-[#012535] leading-tight">Sincronización Inventario</span>
            <span className="text-[10px] text-[#006875] font-semibold leading-tight">Base de datos en tiempo real</span>
          </div>
        </div>
      </div>

      {/* Bento Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Stat 1 */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#d6e4f0] relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#42474b]">Préstamos Activos Hoy</span>
            <div className="w-8 h-8 rounded-lg bg-[#e1f0fb] flex items-center justify-center text-[#012535]">
              <span className="material-symbols-outlined text-[18px]">auto_stories</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#012535] font-mono">42</span>
            <span className="text-xs font-bold text-[#006875]">+4 esta mañana</span>
          </div>
          <div className="mt-3 w-full bg-[#dceaf6] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#012535] h-full rounded-full" style={{ width: '72%' }}></div>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#d6e4f0] relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#42474b]">Devoluciones Pendientes</span>
            <div className="w-8 h-8 rounded-lg bg-[#e1f0fb] flex items-center justify-center text-[#006875]">
              <span className="material-symbols-outlined text-[18px]">schedule</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#012535] font-mono">15</span>
            <span className="text-xs text-[#42474b]">esperadas hoy</span>
          </div>
          <div className="mt-3 w-full bg-[#dceaf6] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#006875] h-full rounded-full" style={{ width: '48%' }}></div>
          </div>
        </div>

        {/* Stat 3: Mora highlight */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#ffdad6] relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#ba1a1a]"></div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#ba1a1a]">Libros en Mora / Retraso</span>
            <div className="w-8 h-8 rounded-lg bg-[#ffdad6] flex items-center justify-center text-[#ba1a1a]">
              <span className="material-symbols-outlined text-[18px]">error</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#ba1a1a] font-mono">3</span>
            <span className="text-xs font-bold text-[#ba1a1a]">Sanción reglamentaria</span>
          </div>
          <div className="mt-3 w-full bg-[#ffdad6] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#ba1a1a] h-full rounded-full" style={{ width: '25%' }}></div>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#d6e4f0] relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#42474b]">En Mantenimiento</span>
            <div className="w-8 h-8 rounded-lg bg-[#e1f0fb] flex items-center justify-center text-[#d69328]">
              <span className="material-symbols-outlined text-[18px]">build_circle</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#012535] font-mono">6</span>
            <span className="text-xs text-[#42474b]">revisión física</span>
          </div>
          <div className="mt-3 w-full bg-[#dceaf6] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#d69328] h-full rounded-full" style={{ width: '14%' }}></div>
          </div>
        </div>
      </div>

      {/* Main Bento Grid Architecture */}
      <div className="grid grid-cols-12 gap-6 mb-6">
        
        {/* Quick Return Window (CA-04: Sub-30s Operation) - 8 Col Desktop */}
        <div className="col-span-12 xl:col-span-8 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-[#d6e4f0] flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1b3b4b] text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">barcode_scanner</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#006875] uppercase tracking-wider block">
                    Flujo Rápido en Ventanilla
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-[#012535]">Devolución Exprés &lt; 30 seg</h2>
                </div>
              </div>

              <div className="flex items-center gap-1.5 bg-[#e1f0fb] px-3 py-1 rounded-lg text-xs font-bold text-[#006875]">
                <span className="material-symbols-outlined text-[16px]">flash_on</span>
                <span>ACID Lock: Auto-Stock +1</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#42474b] mb-4 leading-relaxed">
              Escanee el código de barras o digite el identificador de usuario. El sistema verificará de inmediato la fecha pactada, ejecutando la reincorporación de inventario y formulando la suspensión si existiese mora.
            </p>

            {/* Fast Scan Input Container */}
            <div className="bg-[#f5faff] p-4 rounded-xl border border-[#d6e4f0] mb-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <span className="material-symbols-outlined absolute left-3 top-3 text-slate-400 text-[20px]">
                    qr_code_scanner
                  </span>
                  <input
                    type="text"
                    value={expressInput}
                    onChange={(e) => setExpressInput(e.target.value)}
                    placeholder="ID Préstamo (ej. PR-2024-884) o Código Barras / DNI..."
                    className="w-full h-11 pl-10 pr-4 bg-white rounded-xl text-xs font-mono font-bold text-[#0f1d25] border border-[#c2c7cc] focus:border-[#006875] outline-none transition-all"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleExpressReturn()}
                  className="h-11 px-6 bg-[#012535] hover:bg-[#1b3b4b] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
                >
                  <span className="material-symbols-outlined text-[18px]">assignment_turned_in</span>
                  <span>Registrar Devolución Física</span>
                </button>
              </div>

              {/* Quick Context Details under input */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 pt-3 bg-white/90 p-3 rounded-lg border border-[#e1f0fb] text-xs">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-slate-400 text-[18px]">menu_book</span>
                  <div className="truncate">
                    <span className="block text-[10px] text-slate-500 uppercase">Libro Detectado</span>
                    <span className="font-bold text-[#012535] truncate block">Estructura de Datos en Java</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-slate-400 text-[18px]">person</span>
                  <div className="truncate">
                    <span className="block text-[10px] text-slate-500 uppercase">Socio Asignado</span>
                    <span className="font-bold text-[#012535] truncate block">Marcos Villanueva (70481234)</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#ba1a1a] text-[18px]">timer_off</span>
                  <div className="truncate">
                    <span className="block text-[10px] text-[#ba1a1a] font-bold uppercase">Estado Temporal</span>
                    <span className="font-bold text-[#ba1a1a] truncate block">3 días de mora (Calculando)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 text-xs text-[#42474b]">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="material-symbols-outlined text-[16px] text-[#006875]">verified_user</span>
              Auditoría de retorno: Registrado por Bibliotecario (Sofia Alarcón)
            </span>
            <span className="text-[#006875] font-bold hover:underline cursor-pointer flex items-center gap-1">
              <span>Manual de contingencia</span>
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
            </span>
          </div>
        </div>

        {/* Live Acid Business Rule / SweetAlert2 Showcase Widget - 4 Col Desktop */}
        <div className="col-span-12 xl:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-[#d6e4f0] flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#d69328]"></div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#ffddb4] text-[#633f00] px-2.5 py-0.5 rounded">
                Regla de Negocio CA-05
              </span>
              <span className="material-symbols-outlined text-[#d69328] text-[24px]">gavel</span>
            </div>

            <h3 className="font-bold text-base text-[#012535] mb-1">
              Notificación de Devolución con Mora
            </h3>
            <p className="text-xs text-[#42474b] mb-3 leading-relaxed">
              Previsualización viva del diálogo SweetAlert2 reglamentario activado al detectar entrega fuera de plazo:
            </p>

            {/* Simulated SweetAlert Modal Body */}
            <div className="bg-[#f5faff] p-4 rounded-xl border border-[#d6e4f0] space-y-2 text-xs">
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[16px]">warning</span>
                </div>
                <div>
                  <span className="font-bold text-[#012535] block">Devolución con Retraso Detectada</span>
                  <p className="text-slate-600 mt-0.5 leading-snug">
                    El ejemplar tiene <span className="font-bold text-[#ba1a1a]">3 días de mora</span> acumulada.
                  </p>
                </div>
              </div>

              <div className="p-2.5 bg-white rounded-lg space-y-1 border border-slate-100 font-mono text-[11px]">
                <div className="flex justify-between items-center text-slate-700">
                  <span>Fórmula Sanción:</span>
                  <span className="font-bold text-[#012535]">Días Mora × 2</span>
                </div>
                <div className="flex justify-between items-center text-slate-700">
                  <span>Suspensión:</span>
                  <span className="font-bold text-[#ba1a1a] bg-[#ffdad6] px-1.5 py-0.2 rounded">
                    6 Días sin servicio
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-700 pt-1 border-t border-slate-100">
                  <span>Stock en Catálogo:</span>
                  <span className="font-bold text-[#006875] flex items-center gap-1">
                    +1 Disponible
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <button
              type="button"
              onClick={() => handleExpressReturn('PR-2024-884')}
              className="w-full h-10 bg-[#012535] hover:bg-[#1b3b4b] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">notifications_active</span>
              <span>Confirmar y Notificar Usuario</span>
            </button>
            <button
              type="button"
              onClick={() => {
                Swal.fire({
                  title: 'Historial Sancionatorio',
                  text: 'Marcos Villanueva no registra sanciones previas en el ciclo 2025.',
                  icon: 'info',
                  confirmButtonColor: '#012535'
                });
              }}
              className="w-full h-8 text-[#012535] hover:bg-[#e1f0fb] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Revisar Historial Sancionatorio
            </button>
          </div>
        </div>

      </div>

      {/* Middle Bento Layer: Inventory Stock Controller & Fast Metrics */}
      <div className="grid grid-cols-12 gap-6 mb-6">
        
        {/* Fast Stock & Inventory State Control */}
        <div className="col-span-12 lg:col-span-7 bg-white p-6 rounded-2xl shadow-sm border border-[#d6e4f0]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#e1f0fb] flex items-center justify-center text-[#006875]">
                <span className="material-symbols-outlined text-[20px]">inventory_2</span>
              </div>
              <div>
                <h3 className="font-bold text-base text-[#012535]">Control Rápido de Stock e Inventario</h3>
                <span className="text-xs text-[#42474b]">Cambio de estado inmediato con persistencia directa</span>
              </div>
            </div>
            <span className="text-xs font-bold text-[#006875] hover:underline cursor-pointer flex items-center gap-1">
              <span>Ver catálogo completo</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </span>
          </div>

          <div className="space-y-3">
            {/* Item 1 */}
            <div className="p-3 bg-[#f5faff] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[#d6e4f0]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-12 rounded bg-[#012535] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  <span className="material-symbols-outlined text-[16px]">code</span>
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-[#012535] block truncate">
                    Estructura de Datos en Java (3ª Ed.)
                  </span>
                  <span className="text-[11px] text-[#42474b] block">
                    ISBN: 978-84-481-9844-4 • Ejemplar #04
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#e8f6f4] text-[#1d6e7b]">
                  Disponible
                </span>
                <button
                  type="button"
                  onClick={() => {
                    Swal.fire({
                      title: 'Mover a Mantenimiento',
                      text: '¿Deseas enviar el ejemplar #04 a taller de restauración?',
                      icon: 'question',
                      showCancelButton: true,
                      confirmButtonColor: '#012535',
                      confirmButtonText: 'Sí, mover'
                    });
                  }}
                  className="p-1 rounded hover:bg-slate-200 text-slate-500 cursor-pointer"
                  title="Mover a Mantenimiento"
                >
                  <span className="material-symbols-outlined text-[18px]">build</span>
                </button>
              </div>
            </div>

            {/* Item 2 */}
            <div className="p-3 bg-[#f5faff] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[#d6e4f0]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-12 rounded bg-[#006875] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  <span className="material-symbols-outlined text-[16px]">architecture</span>
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-[#012535] block truncate">
                    Arquitectura Limpia &amp; Principios SOLID
                  </span>
                  <span className="text-[11px] text-[#42474b] block">
                    ISBN: 978-01-344-9416-6 • Ejemplar #02
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#fff5e5] text-[#b87314]">
                  En Préstamo
                </span>
                <button
                  type="button"
                  onClick={() => handleExpressReturn('PR-2024-890')}
                  className="p-1 rounded hover:bg-slate-200 text-slate-500 cursor-pointer"
                  title="Forzar Retorno Manual"
                >
                  <span className="material-symbols-outlined text-[18px]">keyboard_return</span>
                </button>
              </div>
            </div>

            {/* Item 3 */}
            <div className="p-3 bg-[#f5faff] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[#d6e4f0]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-12 rounded bg-[#d69328] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  <span className="material-symbols-outlined text-[16px]">psychology</span>
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-[#012535] block truncate">
                    Deep Learning: Enfoque Práctico
                  </span>
                  <span className="text-[11px] text-[#42474b] block">
                    ISBN: 978-02-620-3561-3 • Ejemplar #01
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#d6e4f0] text-[#012535]">
                  Mantenimiento
                </span>
                <button
                  type="button"
                  onClick={() => {
                    Swal.fire({
                      icon: 'success',
                      title: 'Ejemplar Reingresado',
                      text: 'Deep Learning #01 ha sido restablecido a disponibilidad en sala.',
                      confirmButtonColor: '#012535'
                    });
                  }}
                  className="px-2.5 py-0.5 rounded bg-[#e8f6f4] text-[#1d6e7b] text-xs font-bold hover:opacity-90 cursor-pointer"
                >
                  Reingresar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Efficiency Bento */}
        <div className="col-span-12 lg:col-span-5 bg-[#1b3b4b] text-white p-6 rounded-2xl shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#006875] px-2.5 py-1 rounded text-white">
                Eficiencia Operativa
              </span>
              <span className="text-2xl font-extrabold text-[#9af0ff] font-mono">98.4%</span>
            </div>

            <h3 className="text-lg font-bold text-white mb-1">
              Cumplimiento de Plazos &amp; Tiempos
            </h3>
            <p className="text-xs text-[#86a5b8] mb-4 leading-relaxed">
              El 92% de las devoluciones de la semana se completaron en ventanilla en menos de 22 segundos, cumpliendo con la meta de servicio.
            </p>

            <div className="bg-[#012535] p-4 rounded-xl space-y-3 mb-2 border border-white/10 text-xs">
              <div>
                <div className="flex justify-between items-center text-slate-300 mb-1">
                  <span>Retornos en plazo</span>
                  <span className="text-white font-bold">39 libros (92.8%)</span>
                </div>
                <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#9af0ff] h-full rounded-full" style={{ width: '92.8%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-slate-300 mb-1">
                  <span>Retornos con retraso</span>
                  <span className="text-[#ffb953] font-bold">3 libros (7.2%)</span>
                </div>
                <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#ffb953] h-full rounded-full" style={{ width: '7.2%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[#86a5b8]">
            <span>Norma institucional: 15 días máx. préstamo ordinario</span>
            <span className="material-symbols-outlined text-[18px] text-[#9af0ff]">verified</span>
          </div>
        </div>

      </div>

      {/* Interactive Bento Table of Active Loans (CA-04 & CA-05) */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#d6e4f0] overflow-hidden">
        
        {/* Table Header Controls */}
        <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#d6e4f0]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#012535]">Préstamos Activos y Seguimiento</h2>
              <span className="bg-[#e1f0fb] text-[#006875] text-xs font-bold px-2.5 py-0.5 rounded-full">
                {prestamos.length} registrados
              </span>
            </div>
            <p className="text-xs text-[#42474b] mt-0.5">
              Lista viva de préstamos con cálculo automatizado de días restantes y detección de mora.
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <div className="flex items-center bg-[#f5faff] px-3 py-1.5 rounded-xl border border-[#c2c7cc] gap-2">
              <span className="material-symbols-outlined text-slate-400 text-[18px]">filter_list</span>
              <select
                value={filterState}
                onChange={(e) => setFilterState(e.target.value)}
                className="bg-transparent text-xs font-semibold text-[#0f1d25] outline-none cursor-pointer"
              >
                <option value="todos">Todos los estados</option>
                <option value="atiempo">A tiempo</option>
                <option value="hoy">Por vencer hoy</option>
                <option value="mora">Con Mora</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => {
                Swal.fire({
                  icon: 'success',
                  title: 'Acta de Préstamos Generada',
                  text: 'Se descargó el documento oficial de control de circulación diaria.',
                  confirmButtonColor: '#012535'
                });
              }}
              className="h-9 px-3.5 bg-[#e1f0fb] hover:bg-[#d6e4f0] text-[#012535] text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">file_download</span>
              <span>Exportar Acta</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#f5faff] text-[#42474b] uppercase font-bold tracking-wider text-[11px] border-b border-[#d6e4f0]">
                <th className="py-3 px-4">ID Préstamo</th>
                <th className="py-3 px-4">Libro &amp; Ejemplar</th>
                <th className="py-3 px-4">Usuario Socio</th>
                <th className="py-3 px-4">Fecha Préstamo</th>
                <th className="py-3 px-4">Fecha Límite</th>
                <th className="py-3 px-4">Estado / Días</th>
                <th className="py-3 px-4 text-right">Acción Operativa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPrestamos.map((p) => {
                const isMora = p.estado === 'CON_MORA';
                const isToday = p.estado === 'POR_VENCER';
                return (
                  <tr
                    key={p.id}
                    className={`hover:bg-[#f5faff] transition-colors ${isMora ? 'bg-[#ffdad6]/20' : ''}`}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-[#012535]">
                      {p.id}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#012535]">{p.libroTitulo}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {p.isbn} • Ej. {p.ejemplar}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#0f1d25]">{p.usuarioNombre}</div>
                      <div className="text-[11px] text-slate-500">
                        {p.usuarioEmail} • DNI {p.usuarioDni}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">{p.fechaPrestamo}</td>

                    <td className="py-3.5 px-4 font-bold">
                      <span className={isMora ? 'text-[#ba1a1a]' : isToday ? 'text-[#d69328]' : 'text-slate-700'}>
                        {p.fechaLimite} {isToday ? '(Hoy)' : ''}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {isMora ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold bg-[#ffdad6] text-[#ba1a1a]">
                          <span className="material-symbols-outlined text-[14px]">warning</span>
                          Con Mora ({p.diasMora} días)
                        </span>
                      ) : isToday ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold bg-[#fff5e5] text-[#b87314]">
                          <span className="material-symbols-outlined text-[14px]">schedule</span>
                          Por vencer hoy
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold bg-[#e8f6f4] text-[#1d6e7b]">
                          <span className="material-symbols-outlined text-[14px]">check_circle</span>
                          A tiempo ({p.diasRestantes} días rest.)
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleExpressReturn(p.id)}
                          className="h-8 px-3 bg-[#012535] hover:bg-[#1b3b4b] text-white rounded-lg font-bold flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">check_circle</span>
                          <span>Registrar Devolución</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            Swal.fire({
                              title: `Ficha de ${p.usuarioNombre}`,
                              html: `
                                <p class="text-sm">Email: ${p.usuarioEmail}</p>
                                <p class="text-sm">DNI: ${p.usuarioDni}</p>
                                <p class="text-sm">Historial: 14 préstamos completados satisfactoriamente.</p>
                              `,
                              icon: 'info',
                              confirmButtonColor: '#012535'
                            });
                          }}
                          className="p-1.5 rounded hover:bg-slate-200 text-slate-500 cursor-pointer"
                          title="Ver Ficha de Usuario"
                        >
                          <span className="material-symbols-outlined text-[18px]">account_circle</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        <div className="p-4 bg-[#f5faff] border-t border-[#d6e4f0] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#42474b]">
          <span>
            Mostrando <strong>{filteredPrestamos.length}</strong> de <strong>42</strong> préstamos en circulación
          </span>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1 rounded bg-white border border-[#c2c7cc] text-slate-500 disabled:opacity-40" disabled>
              Anterior
            </button>
            <button className="px-3 py-1 rounded bg-[#012535] text-white font-bold">1</button>
            <button className="px-3 py-1 rounded bg-white border border-[#c2c7cc] hover:bg-slate-50">2</button>
            <button className="px-3 py-1 rounded bg-white border border-[#c2c7cc] hover:bg-slate-50">Siguiente</button>
          </div>
        </div>

      </div>

    </div>
  );
};
