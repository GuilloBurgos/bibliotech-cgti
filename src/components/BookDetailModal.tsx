import React from 'react';
import { Libro } from '../types';

interface BookDetailModalProps {
  libro: Libro | null;
  isOpen: boolean;
  onClose: () => void;
  onReservar: (libro: Libro) => void;
  userActiveLoansCount?: number;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({
  libro,
  isOpen,
  onClose,
  onReservar,
  userActiveLoansCount = 2,
}) => {
  if (!isOpen || !libro) return null;

  const isAvailable = libro.stockDisponible > 0;
  const percentage = libro.stockTotal > 0 ? (libro.stockDisponible / libro.stockTotal) * 100 : 0;

  return (
    <div
      id="modalDetalleLibro"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-[#012535]/50 transition-opacity animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-[#d6e4f0] transform scale-100 transition-all">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-[#e9f5ff] flex items-center justify-between border-b border-[#d6e4f0]">
          <div className="flex items-center gap-2 text-[#006875]">
            <span className="material-symbols-outlined text-[22px]">menu_book</span>
            <span className="font-bold text-sm text-[#012535]">Ficha Técnica &amp; Ubicación Topográfica</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#d6e4f0] text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-left">
          
          {/* Header & Category */}
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-28 sm:w-36 h-40 sm:h-48 rounded-xl overflow-hidden bg-[#e1f0fb] shadow-md shrink-0 border border-slate-200">
              <img
                src={libro.portadaUrl}
                alt={libro.titulo}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';
                }}
              />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#95edfd] text-[#006d7a]">
                  {libro.categoria}
                </span>
                <span className="text-xs text-[#72787c] font-mono">
                  {libro.codigo}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-[#012535] tracking-tight leading-snug">
                {libro.titulo}
              </h3>
              <p className="text-sm font-semibold text-[#006875] mt-1">
                {libro.autor}
              </p>

              {/* Real-time stock capsule */}
              <div className="bg-[#f5faff] p-3 rounded-xl border border-[#d6e4f0] mt-3 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-[#42474b]">Disponibilidad en Sala:</span>
                  <span className={isAvailable ? 'text-[#006875] font-bold' : 'text-[#ba1a1a] font-bold'}>
                    {isAvailable ? `${libro.stockDisponible} de ${libro.stockTotal} ejemplares disponibles` : 'Sin ejemplares en sala (Agotado)'}
                  </span>
                </div>
                <div className="w-full bg-[#dceaf6] h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${isAvailable ? 'bg-[#006875]' : 'bg-[#ba1a1a]'}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Policy note */}
              <div className="flex items-center gap-1.5 text-xs text-[#42474b] mt-2 bg-[#e9f5ff] p-2 rounded-lg">
                <span className="material-symbols-outlined text-[16px] text-[#006875]">info</span>
                <span>
                  Cupo de préstamos: Máximo 3 simultáneos (Actualmente posees {userActiveLoansCount}/3).
                </span>
              </div>
            </div>
          </div>

          {/* Synopsis */}
          <div className="p-4 rounded-xl bg-[#f5faff] border border-[#d6e4f0]">
            <h4 className="text-xs font-bold text-[#72787c] uppercase tracking-wider mb-1.5">
              Sinopsis · Resumen Institucional
            </h4>
            <p className="text-sm text-[#0f1d25] leading-relaxed">
              {libro.sinopsis}
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-[#f5faff] p-3 rounded-lg border border-[#d6e4f0]">
              <span className="block text-[#72787c] font-semibold">ISBN Normalizado:</span>
              <span className="font-mono font-bold text-[#012535] text-sm">{libro.isbn}</span>
            </div>

            <div className="bg-[#f5faff] p-3 rounded-lg border border-[#d6e4f0]">
              <span className="block text-[#72787c] font-semibold">Estado de Circulación:</span>
              <span className="font-bold text-[#006875] text-sm">
                {libro.stockDisponible > 0 ? 'Habilitado para Retiro' : 'Consulta en Sala Solamente'}
              </span>
            </div>

            <div className="sm:col-span-2 bg-[#f5faff] p-3 rounded-lg border border-[#d6e4f0] flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#e1f0fb] flex items-center justify-center text-[#012535] shrink-0">
                <span className="material-symbols-outlined text-[18px]">location_on</span>
              </div>
              <div>
                <span className="block text-[#72787c] font-semibold">Ubicación Física en Sala CGTI:</span>
                <span className="font-bold text-[#012535] text-sm">{libro.ubicacion}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Actions */}
        <div className="px-6 py-4 bg-[#e9f5ff] border-t border-[#d6e4f0] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg text-[#012535] hover:bg-[#d6e4f0] text-xs font-semibold transition-colors cursor-pointer"
          >
            Cerrar Ficha
          </button>

          <button
            onClick={() => onReservar(libro)}
            disabled={!isAvailable}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-lg text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer ${
              isAvailable
                ? 'bg-[#006875] hover:bg-[#012535] active:scale-95'
                : 'bg-slate-400 cursor-not-allowed opacity-60'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">bookmark_added</span>
            <span>{isAvailable ? 'Confirmar Reserva de Ejemplar' : 'Agotado (Sin Stock)'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
