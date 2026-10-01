import React from 'react';
import Swal from 'sweetalert2';

interface MarketingKitViewProps {
  onGoToApp: () => void;
}

export const MarketingKitView: React.FC<MarketingKitViewProps> = ({ onGoToApp }) => {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    Swal.fire({
      icon: 'success',
      title: '¡Copiado al Portapapeles!',
      text: `El texto promocional para "${label}" fue copiado listo para publicar.`,
      timer: 1600,
      showConfirmButton: false
    });
  };

  const socialPost = `📚 ¿Aún gestionando préstamos de libros con hojas de cálculo? Es momento de modernizar tu biblioteca universitaria o escolar. Con BiblioTech, las devoluciones toman menos de 30 segundos, el inventario se actualiza en tiempo real y el cálculo de mora es completamente transparente para los estudiantes. ✨ Descubre el poder de la interfaz Bento UI aplicada a la gestión de fondos bibliográficos.\n\n#BiblioTech #EdTech #GestionBibliotecaria #BentoUI #UXDesign #Productividad`;

  const emailSubject = `Dile adiós a las pérdidas de libros: conoce BiblioTech 📖`;
  const emailBody = `Estimado equipo directivo y bibliotecario,\n\nMantener al día miles de ejemplares, coordinar préstamos de alta demanda y controlar devoluciones sin demoras ya no tiene por qué ser un reto manual. BiblioTech transforma el mostrador de circulación con alertas preventivas, búsqueda interactiva y trazabilidad de extremo a extremo.\n\nEmpieza hoy a brindar una experiencia universitaria de primer nivel a tus lectores e investigadores.`;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden text-left my-4">
      {/* Hero / Email Header Banner */}
      <div className="relative w-full overflow-hidden bg-[#1b3b4b] h-64 sm:h-80">
        <img
          src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80"
          alt="BiblioTech Hero Marketing"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#012535] via-[#012535]/50 to-transparent flex flex-col justify-end p-6 sm:p-10 text-white">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-sm">
              📚
            </span>
            <span className="text-sm font-extrabold tracking-wider uppercase text-[#9af0ff]">BiblioTech</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            El Futuro de la Gestión Bibliotecaria
          </h2>
        </div>
      </div>

      {/* Main Copy Body */}
      <div className="p-6 sm:p-10 space-y-8">
        
        {/* Headline & Subheadline */}
        <div className="space-y-3 border-b border-slate-100 pb-6">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-[#e9f5ff] text-[#006875]">
            🚀 Kit de Lanzamiento &amp; Marketing 2025
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#012535] tracking-tight leading-tight">
            La gestión bibliotecaria evolucionó.<br />
            <span className="text-[#006875]">Cero fricción, 100% trazabilidad.</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
            Sustituye las hojas de cálculo y los registros obsoletos por un entorno Bento interactivo con cálculo automático de mora, devoluciones en menos de 30 segundos y control de inventario en tiempo real.
          </p>
        </div>

        {/* Value Propositions (Bento Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-[#f5faff] border border-[#d6e4f0] p-5 rounded-2xl space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#006875] text-white flex items-center justify-center font-bold text-base shadow-sm">
              ⚡
            </div>
            <h3 className="font-bold text-sm text-[#012535]">Devolución Exprés &lt; 30s</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Escaneo instantáneo, reincorporación automática a catálogo físico (+1 stock) y cierre de préstamos sin esperas en mostrador.
            </p>
          </div>

          <div className="bg-[#f5faff] border border-[#d6e4f0] p-5 rounded-2xl space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#d69328] text-white flex items-center justify-center font-bold text-base shadow-sm">
              ⏱️
            </div>
            <h3 className="font-bold text-sm text-[#012535]">Mora &amp; Sanción Algorítmica</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Regla transparente e infalible: días de suspensión proporcionales automáticos sin multas económicas ni discrepancias humanas.
            </p>
          </div>

          <div className="bg-[#f5faff] border border-[#d6e4f0] p-5 rounded-2xl space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#012535] text-white flex items-center justify-center font-bold text-base shadow-sm">
              🛡️
            </div>
            <h3 className="font-bold text-sm text-[#012535]">0% Discrepancia de Stock</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Aislamiento transaccional pesimista para evitar colisiones de préstamos concurrentes y reportes normativos TOP 10 al instante.
            </p>
          </div>
        </div>

        {/* Ready-to-Use Copy Channels */}
        <div className="space-y-5 pt-2">
          <h2 className="text-xl font-bold text-[#012535]">Textos promocionales listos para publicar</h2>

          {/* Social Media Copy */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs uppercase tracking-wider text-[#006875]">
                Social Media (LinkedIn / Twitter / Instagram)
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(socialPost, 'Social Media')}
                className="text-xs font-semibold text-[#006875] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">content_copy</span>
                <span>Copiar</span>
              </button>
            </div>
            <p className="text-xs text-slate-800 leading-relaxed font-medium whitespace-pre-line">
              {socialPost}
            </p>
          </div>

          {/* Email Campaign Copy */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs uppercase tracking-wider text-[#d69328]">
                Campaña de Email Marketing / Newsletter
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(`Asunto: ${emailSubject}\n\n${emailBody}`, 'Email')}
                className="text-xs font-semibold text-[#006875] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">content_copy</span>
                <span>Copiar</span>
              </button>
            </div>
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              Asunto: {emailSubject}
            </p>
            <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
              {emailBody}
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={onGoToApp}
                className="inline-block px-5 py-2.5 bg-[#012535] hover:bg-[#1b3b4b] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
              >
                Solicitar Demostración en Vivo →
              </button>
            </div>
          </div>

          {/* Ad Banner Slogans */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2">
            <span className="font-bold text-xs uppercase tracking-wider text-[#012535] block">
              Display Ads &amp; Taglines (Titulares cortos)
            </span>
            <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
              <li><strong>Opción 1:</strong> "Tu biblioteca en orden. Tus lectores al día. Préstamos en menos de 30 segundos."</li>
              <li><strong>Opción 2:</strong> "0% discrepancias de inventario. 100% control transaccional con BiblioTech."</li>
              <li><strong>Opción 3:</strong> "El sistema de gestión de bibliotecas que tu comunidad académica merece."</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};
