import React, { useState } from 'react';
import { isSupabaseConfigured } from '../lib/supabase';
import Swal from 'sweetalert2';

interface SupabaseGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshData?: () => void;
}

export const SupabaseGuideModal: React.FC<SupabaseGuideModalProps> = ({
  isOpen,
  onClose,
  onRefreshData
}) => {
  const [copied, setCopied] = useState(false);
  const isConnected = isSupabaseConfigured();

  if (!isOpen) return null;

  const copySqlToClipboard = async () => {
    try {
      const response = await fetch('/supabase/schema.sql');
      let sql = '';
      if (response.ok) {
        sql = await response.text();
      } else {
        sql = `-- Script disponible en el archivo /supabase/schema.sql de este repositorio`;
      }
      navigator.clipboard.writeText(sql);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
      Swal.fire({
        icon: 'success',
        title: '¡Script SQL Copiado!',
        text: 'Pégalo en el SQL Editor de tu proyecto en Supabase para crear las tablas y datos iniciales.',
        timer: 2500,
        showConfirmButton: false
      });
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleTestConnection = () => {
    if (isConnected) {
      Swal.fire({
        icon: 'success',
        title: 'Conexión a Supabase Activa',
        text: 'Las variables VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY están configuradas correctamente.',
        confirmButtonColor: '#012535'
      });
      if (onRefreshData) onRefreshData();
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Modo Local / Sin Conexión a Supabase',
        html: `
          <div class="text-left text-xs space-y-2 text-slate-700">
            <p>La aplicación está corriendo en <strong>modo local resiliente</strong> (usando los datos precargados del catálogo y préstamos).</p>
            <p>Para activar Supabase en vivo, añade tus credenciales en el archivo <code>.env</code>:</p>
            <pre class="bg-slate-100 p-2 rounded text-[11px] overflow-x-auto text-slate-900">
VITE_SUPABASE_URL="https://tu-proyecto.supabase.co"
VITE_SUPABASE_ANON_KEY="tu-anon-public-key"
            </pre>
          </div>
        `,
        confirmButtonColor: '#012535'
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="bg-[#012535] px-6 py-5 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <span className="material-symbols-outlined text-2xl">database</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-white">Configuración de Base de Datos Supabase</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isConnected 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}>
                  {isConnected ? '● CONECTADO' : '○ MODO LOCAL / PENDIENTE'}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Guía técnica paso a paso para vincular PostgreSQL y Supabase con BiblioTech
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Status Alert Banner */}
          <div className={`p-4 rounded-xl border flex items-start gap-3 ${
            isConnected
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            <span className="material-symbols-outlined text-2xl mt-0.5">
              {isConnected ? 'verified' : 'info'}
            </span>
            <div className="text-xs leading-relaxed">
              <p className="font-bold text-sm mb-1">
                {isConnected
                  ? 'Base de datos Supabase conectada exitosamente'
                  : 'Estado Actual: Modo Memoria / Datos Precargados'}
              </p>
              <p>
                {isConnected
                  ? 'La aplicación lee y persiste libros, usuarios y préstamos directamente en tu instancia de Supabase PostgreSQL.'
                  : 'El frontend está completamente operativo con datos precargados. Sigue los 4 pasos siguientes para conectar tu base de datos Supabase.'}
              </p>
            </div>
          </div>

          {/* Step by step */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base text-[#006875]">format_list_numbered</span>
              Paso a Paso de Instalación y Conexión
            </h4>

            {/* Step 1 */}
            <div className="flex gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="w-8 h-8 rounded-full bg-[#012535] text-white flex items-center justify-center font-bold text-sm shrink-0">
                1
              </div>
              <div className="space-y-1 text-xs">
                <h5 className="font-bold text-slate-800 text-sm">Crear proyecto en Supabase</h5>
                <p className="text-slate-600">
                  Ingresa a <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-[#006875] font-semibold underline">supabase.com</a>, inicia sesión o regístrate gratis, y haz clic en <strong>"New Project"</strong>. Asigna un nombre al proyecto (ej. <code>bibliotech-cgti</code>) y una contraseña segura para la base de datos.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="w-8 h-8 rounded-full bg-[#012535] text-white flex items-center justify-center font-bold text-sm shrink-0">
                2
              </div>
              <div className="space-y-2 text-xs flex-1">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-slate-800 text-sm">Ejecutar el Script SQL en Supabase</h5>
                  <button
                    onClick={copySqlToClipboard}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-semibold text-[11px] shadow-xs transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">content_copy</span>
                    {copied ? '¡Copiado!' : 'Copiar Script SQL'}
                  </button>
                </div>
                <p className="text-slate-600">
                  En el menú lateral izquierdo de tu proyecto en Supabase, ve a <strong>SQL Editor</strong> &gt; <strong>"New query"</strong>. Pega el script SQL completo que hemos generado en el archivo <code>/supabase/schema.sql</code> y haz clic en <strong>"Run"</strong>.
                </p>
                <div className="bg-slate-900 text-slate-300 p-2.5 rounded-lg text-[11px] font-mono border border-slate-800">
                  <p className="text-emerald-400 font-semibold mb-1">✓ Incluye automáticamente:</p>
                  <p>• Tablas: <code>libros</code>, <code>usuarios</code>, <code>prestamos</code>, <code>auditoria_circulacion</code></p>
                  <p>• Triggers ACID para actualización automática de stock al prestar/devolver</p>
                  <p>• Políticas Row Level Security (RLS) permisivas</p>
                  <p>• Seed data con todos los libros y usuarios del sistema</p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="w-8 h-8 rounded-full bg-[#012535] text-white flex items-center justify-center font-bold text-sm shrink-0">
                3
              </div>
              <div className="space-y-1 text-xs">
                <h5 className="font-bold text-slate-800 text-sm">Obtener las Credenciales API</h5>
                <p className="text-slate-600">
                  En Supabase, dirígete a <strong>Project Settings</strong> (icono de engranaje) &gt; <strong>API</strong>. Copia los dos valores principales:
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-700 mt-1 pl-1">
                  <li><strong>Project URL</strong> (ejemplo: <code>https://abcdefghijklm.supabase.co</code>)</li>
                  <li><strong>Project API Key (anon / public)</strong> (clave que empieza por <code>eyJ...</code>)</li>
                </ul>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="w-8 h-8 rounded-full bg-[#012535] text-white flex items-center justify-center font-bold text-sm shrink-0">
                4
              </div>
              <div className="space-y-2 text-xs flex-1">
                <h5 className="font-bold text-slate-800 text-sm">Configurar las Variables de Entorno</h5>
                <p className="text-slate-600">
                  Crea o edita el archivo <code>.env</code> en la raíz del proyecto y añade tus dos credenciales:
                </p>
                <div className="bg-slate-900 text-emerald-400 p-3 rounded-lg font-mono text-xs border border-slate-800">
                  VITE_SUPABASE_URL="https://tu-proyecto-id.supabase.co"<br />
                  VITE_SUPABASE_ANON_KEY="tu-anon-public-key-aqui"
                </div>
                <p className="text-slate-500 text-[11px]">
                  El cliente <code>@supabase/supabase-js</code> ya se encuentra instalado y configurado en <code>src/lib/supabase.ts</code> y <code>src/services/supabaseService.ts</code>.
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handleTestConnection}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors"
          >
            <span className="material-symbols-outlined text-sm">sensors</span>
            Verificar Estado de Conexión
          </button>
          
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#012535] hover:bg-[#1b3b4b] text-white text-xs font-bold transition-colors"
          >
            Entendido / Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
