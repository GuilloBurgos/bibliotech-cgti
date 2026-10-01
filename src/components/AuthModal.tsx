import React, { useState } from 'react';
import Swal from 'sweetalert2';

interface AuthModalProps {
  isOpen: boolean;
  initialTab?: 'login' | 'registro';
  onClose: () => void;
  onLoginSuccess: (name: string, email: string, role?: 'CLIENTE' | 'BIBLIOTECARIO' | 'ADMINISTRADOR') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialTab = 'login',
  onClose,
  onLoginSuccess,
}) => {
  const [tab, setTab] = useState<'login' | 'registro'>(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Sync tab with initialTab when opening
  React.useEffect(() => {
    setTab(initialTab);
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) return;

    let role: 'CLIENTE' | 'BIBLIOTECARIO' | 'ADMINISTRADOR' = 'CLIENTE';
    let userName = 'Lector Institucional';

    if (loginEmail.includes('admin') || loginEmail.includes('director')) {
      role = 'ADMINISTRADOR';
      userName = 'Carlos De La Maza';
    } else if (loginEmail.includes('bibliotech') || loginEmail.includes('staff') || loginEmail.includes('sofia')) {
      role = 'BIBLIOTECARIO';
      userName = 'Sofia Alarcón';
    } else {
      userName = loginEmail.split('@')[0];
    }

    Swal.fire({
      icon: 'success',
      title: '¡Sesión Iniciada!',
      text: `Bienvenido al catálogo institucional, ${userName}.`,
      timer: 1800,
      showConfirmButton: false,
      timerProgressBar: true
    });

    onLoginSuccess(userName, loginEmail, role);
    onClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      Swal.fire({
        icon: 'warning',
        title: 'Términos Requeridos',
        text: 'Debes aceptar el reglamento de préstamos para continuar.',
        confirmButtonColor: '#012535'
      });
      return;
    }

    Swal.fire({
      icon: 'success',
      title: '¡Cuenta Creada Exitosamente!',
      text: `Bienvenido a BibliotecaCGTI, ${regName}. Tu credencial digital ha sido activada.`,
      confirmButtonColor: '#012535',
      confirmButtonText: 'Acceder a mi panel'
    });

    onLoginSuccess(regName, regEmail, 'CLIENTE');
    onClose();
  };

  return (
    <div
      id="modalAuth"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-[#012535]/50 transition-opacity animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-[#d6e4f0] transform scale-100 transition-transform">
        
        {/* Header with Branding & Close Button */}
        <div className="p-6 pb-4 bg-[#e9f5ff]/70 border-b border-[#d6e4f0] relative text-left">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full hover:bg-[#d6e4f0] text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Cerrar ventana"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>

          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="w-7 h-7 rounded bg-[#012535] text-white flex items-center justify-center font-bold text-xs">
              <span className="material-symbols-outlined text-[16px]">local_library</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-[#012535] leading-none">BibliotecaCGTI</span>
              <span className="text-[10px] text-[#006875] uppercase font-bold tracking-widest mt-0.5">Portal Institucional</span>
            </div>
          </div>

          <p className="text-xs text-[#42474b] mt-1">
            {tab === 'login'
              ? 'Accede a tu cuenta institucional para reservar libros, renovar préstamos y gestionar colecciones.'
              : 'Completa tus datos para activar tu credencial digital y solicitar préstamos en sala y domicilio.'}
          </p>

          {/* Segmented Tab Switcher */}
          <div className="mt-4 grid grid-cols-2 p-1 bg-[#e1f0fb] rounded-xl gap-1">
            <button
              type="button"
              onClick={() => setTab('login')}
              className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                tab === 'login'
                  ? 'bg-white text-[#012535] shadow-xs'
                  : 'text-[#42474b] hover:text-[#012535]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">login</span>
              <span>Iniciar Sesión</span>
            </button>
            <button
              type="button"
              onClick={() => setTab('registro')}
              className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                tab === 'registro'
                  ? 'bg-white text-[#012535] shadow-xs'
                  : 'text-[#42474b] hover:text-[#012535]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">person_add</span>
              <span>Crear Cuenta</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[75vh]">
          {tab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4 text-left">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#e9f5ff] text-[#006875] text-xs font-semibold">
                <span className="material-symbols-outlined text-[16px]">verified_user</span>
                <span>Acceso unificado: Estudiantes, Docentes, Bibliotecarios y Administradores</span>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#012535] block" htmlFor="loginEmail">
                  Email Institucional / Correo electrónico
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-slate-400 text-[18px]">mail</span>
                  <input
                    id="loginEmail"
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="usuario@cgti.edu / admin@bibliotech.edu"
                    className="w-full h-11 pl-10 pr-3 rounded-lg bg-[#f5faff] border border-[#c2c7cc] focus:border-[#006875] focus:ring-1 focus:ring-[#006875] text-xs text-[#0f1d25] outline-none transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#012535]" htmlFor="loginPassword">
                    Contraseña
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      Swal.fire({
                        icon: 'info',
                        title: 'Recuperación de Contraseña',
                        text: 'Se ha enviado un enlace seguro de restablecimiento a tu correo institucional.',
                        confirmButtonColor: '#012535'
                      });
                    }}
                    className="text-[11px] text-[#006875] hover:underline"
                  >
                    ¿Olvidé mi contraseña?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-slate-400 text-[18px]">lock</span>
                  <input
                    id="loginPassword"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-11 pl-10 pr-10 rounded-lg bg-[#f5faff] border border-[#c2c7cc] focus:border-[#006875] focus:ring-1 focus:ring-[#006875] text-xs text-[#0f1d25] outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-400 hover:text-[#012535] cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Fast Account Selector Shortcut for Testing */}
              <div className="bg-[#f5faff] p-2.5 rounded-lg border border-slate-200">
                <span className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">
                  Atajos rápidos de prueba:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginEmail('esteban.pizarro@alumnos.edu');
                      setLoginPassword('Pass#2025');
                    }}
                    className="px-2 py-1 rounded bg-white hover:bg-slate-100 border text-[11px] font-semibold text-slate-700"
                  >
                    Estudiante Lector
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginEmail('sofia.alarcon@bibliotech.edu');
                      setLoginPassword('Pass#2025');
                    }}
                    className="px-2 py-1 rounded bg-white hover:bg-slate-100 border text-[11px] font-semibold text-slate-700"
                  >
                    Bibliotecario
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginEmail('carlos.director@bibliotech.edu');
                      setLoginPassword('Pass#2025');
                    }}
                    className="px-2 py-1 rounded bg-white hover:bg-slate-100 border text-[11px] font-semibold text-slate-700"
                  >
                    Administrador
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full h-11 rounded-lg bg-[#1b3b4b] hover:bg-[#012535] text-white font-bold text-sm transition-all shadow-sm active:scale-[0.99] flex items-center justify-center gap-2 mt-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">login</span>
                <span>Iniciar Sesión</span>
              </button>

              <p className="text-center text-xs text-[#42474b]">
                ¿Aún no tienes cuenta?{' '}
                <button
                  type="button"
                  onClick={() => setTab('registro')}
                  className="text-[#006875] font-bold hover:underline cursor-pointer"
                >
                  Regístrate gratis
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4 text-left">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#e9f5ff] text-[#006875] text-xs font-semibold">
                <span className="material-symbols-outlined text-[16px]">app_registration</span>
                <span>Crea tu perfil de lector institucional en menos de 1 minuto</span>
              </div>

              {/* Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#012535] block" htmlFor="regName">
                  Nombre Completo
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-slate-400 text-[18px]">person</span>
                  <input
                    id="regName"
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Ej. Sofía Alarcón"
                    className="w-full h-11 pl-10 pr-3 rounded-lg bg-[#f5faff] border border-[#c2c7cc] focus:border-[#006875] focus:ring-1 focus:ring-[#006875] text-xs text-[#0f1d25] outline-none transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#012535] block" htmlFor="regEmail">
                  Correo Electrónico Institucional
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-slate-400 text-[18px]">mail</span>
                  <input
                    id="regEmail"
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="correo@institucional.edu"
                    className="w-full h-11 pl-10 pr-3 rounded-lg bg-[#f5faff] border border-[#c2c7cc] focus:border-[#006875] focus:ring-1 focus:ring-[#006875] text-xs text-[#0f1d25] outline-none transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#012535]" htmlFor="regPassword">
                    Contraseña
                  </label>
                  <span className="text-[11px] text-slate-500">Mínimo 8 caracteres</span>
                </div>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-slate-400 text-[18px]">lock</span>
                  <input
                    id="regPassword"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-11 pl-10 pr-10 rounded-lg bg-[#f5faff] border border-[#c2c7cc] focus:border-[#006875] focus:ring-1 focus:ring-[#006875] text-xs text-[#0f1d25] outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-400 hover:text-[#012535] cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2 pt-1">
                <input
                  id="aceptoTerminos"
                  type="checkbox"
                  required
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-[#006875] border-[#c2c7cc] focus:ring-[#006875] cursor-pointer shrink-0"
                />
                <label htmlFor="aceptoTerminos" className="text-xs text-[#42474b] cursor-pointer select-none">
                  Acepto el{' '}
                  <span className="text-[#006875] font-semibold underline">
                    Reglamento y Políticas de Préstamo (CA-05)
                  </span>{' '}
                  de BibliotecaCGTI
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full h-11 rounded-lg bg-[#006875] hover:bg-[#012535] text-white font-bold text-sm transition-all shadow-[0_2px_8px_rgba(0,104,117,0.25)] active:scale-[0.99] flex items-center justify-center gap-2 mt-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                <span>Crear Cuenta de Lector</span>
              </button>

              <p className="text-center text-xs text-[#42474b]">
                ¿Ya tienes cuenta?{' '}
                <button
                  type="button"
                  onClick={() => setTab('login')}
                  className="text-[#006875] font-bold hover:underline cursor-pointer"
                >
                  Inicia sesión aquí
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
