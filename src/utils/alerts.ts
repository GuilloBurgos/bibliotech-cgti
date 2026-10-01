import Swal from 'sweetalert2';

export const alertPrestamoExitoso = (libroTitulo: string, plazoHoras: number = 48) => {
  return Swal.fire({
    title: '¡Reserva Exitosa!',
    html: `
      <p class="text-slate-600 mb-3 text-sm">
        El ejemplar <strong class="text-slate-900 font-bold">${libroTitulo}</strong> ha sido apartado a tu nombre.
      </p>
      <div class="bg-[#e9f5ff] p-4 rounded-xl text-left text-xs space-y-2 border border-[#95edfd]/50">
        <div class="flex items-center gap-1.5 text-[#006875] font-semibold text-sm">
          <span>⏱️ Plazo máximo de retiro: <strong>${plazoHoras} horas</strong></span>
        </div>
        <p class="text-slate-600 leading-relaxed">
          Presenta tu carnet digital o código QR institucional en el mesón de entrega en Planta Baja. Tras ${plazoHoras} horas el ejemplar se liberará al catálogo.
        </p>
      </div>
    `,
    icon: 'success',
    confirmButtonText: 'Entendido, volver al catálogo',
    confirmButtonColor: '#012535',
    customClass: {
      popup: 'rounded-2xl font-sans p-6',
      title: 'text-[#012535] text-xl font-bold',
      confirmButton: 'rounded-xl px-5 py-2.5 font-semibold text-sm shadow-md'
    }
  });
};

export const alertDevolucionConMora = (
  prestamoId: string,
  libroTitulo: string,
  usuarioNombre: string,
  diasMora: number,
  diasSuspension: number
) => {
  return Swal.fire({
    title: `Devolución con ${diasMora} Días de Mora`,
    html: `
      <div class="space-y-3 text-left">
        <p class="text-slate-600 text-sm">
          El préstamo <strong class="text-slate-900">${prestamoId}</strong> (<em>${usuarioNombre}</em>) para el libro <strong>${libroTitulo}</strong> ha superado la fecha pactada.
        </p>
        <div class="bg-[#ffdad6]/40 p-4 rounded-xl space-y-2 border border-[#ffdad6] text-xs">
          <div class="flex justify-between items-center text-slate-800">
            <span>Fórmula de Penalización (CA-05):</span>
            <span class="font-mono font-bold text-[#012535]">Días Mora (${diasMora}) × 2</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-slate-700">Suspensión de Préstamos:</span>
            <span class="font-bold text-[#ba1a1a] bg-[#ffdad6] px-2 py-0.5 rounded">
              ${diasSuspension} Días sin servicio
            </span>
          </div>
          <div class="flex justify-between items-center pt-2 border-t border-slate-200">
            <span class="text-slate-700">Actualización ACID de Stock:</span>
            <span class="font-bold text-[#006875] flex items-center gap-1">
              ✓ Inventario +1 Inmediato
            </span>
          </div>
        </div>
      </div>
    `,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Confirmar y Aplicar Sanción',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#012535',
    cancelButtonColor: '#72787c',
    customClass: {
      popup: 'rounded-2xl font-sans p-6',
      title: 'text-[#ba1a1a] text-lg font-bold',
      confirmButton: 'rounded-xl px-4 py-2.5 font-semibold text-sm shadow-md',
      cancelButton: 'rounded-xl px-4 py-2.5 font-semibold text-sm'
    }
  });
};

export const alertDevolucionRegular = (libroTitulo: string, prestamoId: string) => {
  return Swal.fire({
    title: 'Devolución Procesada Exitosamente',
    html: `
      <p class="text-slate-600 text-sm mb-3">
        El préstamo <strong>${prestamoId}</strong> (<em>${libroTitulo}</em>) fue devuelto en tiempo y forma sin mora.
      </p>
      <div class="bg-[#e9f5ff] p-3 rounded-lg text-xs text-[#006875] font-semibold text-center border border-[#95edfd]/60">
        ✓ Stock reincorporado al catálogo (+1 disponible en sala)
      </div>
    `,
    icon: 'success',
    confirmButtonText: 'Aceptar',
    confirmButtonColor: '#012535',
    customClass: {
      popup: 'rounded-2xl font-sans p-6',
      title: 'text-[#012535] text-lg font-bold',
      confirmButton: 'rounded-xl px-5 py-2.5 font-semibold text-sm shadow-md'
    }
  });
};

export const alertConfirmarCerrarSesion = () => {
  return Swal.fire({
    title: '¿Cerrar Sesión?',
    text: '¿Estás seguro de que deseas salir del sistema BibliotecaCGTI?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, cerrar sesión',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#012535',
    cancelButtonColor: '#72787c',
    customClass: {
      popup: 'rounded-2xl font-sans p-6',
      title: 'text-[#012535] text-xl font-bold',
      confirmButton: 'rounded-xl px-4 py-2.5 font-semibold text-sm shadow-md',
      cancelButton: 'rounded-xl px-4 py-2.5 font-semibold text-sm'
    }
  });
};

export const alertError = (titulo: string, mensaje: string) => {
  return Swal.fire({
    title: titulo,
    text: mensaje,
    icon: 'error',
    confirmButtonText: 'Aceptar',
    confirmButtonColor: '#012535',
    customClass: {
      popup: 'rounded-2xl font-sans p-6',
      title: 'text-[#ba1a1a] text-lg font-bold',
      confirmButton: 'rounded-xl px-5 py-2.5 font-semibold text-sm shadow-md'
    }
  });
};
