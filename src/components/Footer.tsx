import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#e9f5ff] border-t border-[#d6e4f0] shadow-[0_-1px_6px_rgba(27,59,75,0.03)] mt-auto">
      <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#012535] text-white flex items-center justify-center font-bold text-xs">
                <span className="material-symbols-outlined text-[16px]">local_library</span>
              </div>
              <span className="font-bold text-lg text-[#012535]">BibliotecaCGTI</span>
            </div>
            <p className="text-xs text-[#42474b] leading-relaxed">
              Coordinación General de Tecnologías de Información. Sistema de acceso bibliográfico, repositorio documental y servicios digitales de consulta.
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#e1f0fb] text-[#006875]">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                Servicio Institucional Activo
              </span>
            </div>
          </div>

          {/* Column 2: Catálogo y Recursos */}
          <div>
            <h4 className="text-sm font-bold text-[#012535] mb-3">Catálogo y Recursos</h4>
            <ul className="space-y-2 text-xs text-[#42474b]">
              <li>
                <a href="#catalogo" className="hover:text-[#006875] transition-colors">Búsqueda en Catálogo</a>
              </li>
              <li>
                <a href="#colecciones" className="hover:text-[#006875] transition-colors">Colecciones Digitales</a>
              </li>
              <li>
                <a href="#servicios" className="hover:text-[#006875] transition-colors">Préstamo Interbibliotecario</a>
              </li>
              <li>
                <a href="#novedades" className="hover:text-[#006875] transition-colors">Novedades Editoriales</a>
              </li>
            </ul>
          </div>

          {/* Column 3: Normativas y Sala */}
          <div>
            <h4 className="text-sm font-bold text-[#012535] mb-3">Normativas y Sala</h4>
            <ul className="space-y-2 text-xs text-[#42474b]">
              <li>
                <a href="#normativas" className="hover:text-[#006875] transition-colors">Términos y Normativas de Préstamo</a>
              </li>
              <li>
                <a href="#horarios" className="hover:text-[#006875] transition-colors">Horarios de Atención en Sala</a>
              </li>
              <li>
                <a href="#guia" className="hover:text-[#006875] transition-colors">Guía de Usuarios</a>
              </li>
              <li>
                <a href="#cubiculos" className="hover:text-[#006875] transition-colors">Reserva de Cubículos</a>
              </li>
            </ul>
          </div>

          {/* Column 4: Atención y Soporte */}
          <div>
            <h4 className="text-sm font-bold text-[#012535] mb-3">Atención y Soporte</h4>
            <ul className="space-y-2 text-xs text-[#42474b]">
              <li>
                <a href="#soporte" className="hover:text-[#006875] transition-colors">Soporte Técnico CGTI</a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#006875] transition-colors">Preguntas Frecuentes</a>
              </li>
              <li>
                <a href="#directorio" className="hover:text-[#006875] transition-colors">Directorio de Bibliotecarios</a>
              </li>
              <li>
                <span className="text-[11px] text-slate-500 block pt-1">Mesa de ayuda: soporte@cgti.edu</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 border-t border-[#d6e4f0] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#42474b]">
          <p>© {new Date().getFullYear()} BibliotecaCGTI — Coordinación General de Tecnologías de Información. Todos los derechos reservados.</p>
          <div className="flex items-center gap-6">
            <a href="#privacidad" className="hover:text-[#012535] transition-colors">Políticas de Privacidad</a>
            <a href="#contacto" className="hover:text-[#012535] transition-colors">Contacto CGTI</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
