import React, { useState } from 'react';
import { Usuario } from '../types';
import Swal from 'sweetalert2';

interface NewLibrarianModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveLibrarian: (newLibrarian: Usuario) => void;
}

export const NewLibrarianModal: React.FC<NewLibrarianModalProps> = ({
  isOpen,
  onClose,
  onSaveLibrarian,
}) => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [permisos, setPermisos] = useState<string[]>([
    'Entrega de Préstamos',
    'Recepción y Devolución',
    'Gestión de Inventario Físico'
  ]);
  const [passwordTemp, setPasswordTemp] = useState('BiblioTech#2025!Temp');

  if (!isOpen) return null;

  const regenerarPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let pass = 'Biblio#';
    for (let i = 0; i < 6; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPasswordTemp(pass);
  };

  const handleTogglePermiso = (permiso: string) => {
    setPermisos((prev) =>
      prev.includes(permiso) ? prev.filter((p) => p !== permiso) : [...prev, permiso]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !correo) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos requeridos',
        text: 'Por favor ingresa nombre y correo institucional.',
        confirmButtonColor: '#012535'
      });
      return;
    }

    const dniGenerated = `${Math.floor(10 + Math.random() * 15)}.${Math.floor(100 + Math.random() * 900)}.${Math.floor(100 + Math.random() * 900)}-K`;
    const newLibrarian: Usuario = {
      id: `u-${Date.now()}`,
      nombre,
      email: correo,
      dni: dniGenerated,
      rol: 'BIBLIOTECARIO',
      estado: 'ACTIVO',
      prestamosActivos: 0,
      maxPrestamos: 3,
      permisos,
      ultimoAcceso: 'Recién registrado',
      carreraOCargo: 'Bibliotecario de Sala'
    };

    onSaveLibrarian(newLibrarian);
    Swal.fire({
      icon: 'success',
      title: 'Bibliotecario Registrado',
      html: `
        <p class="text-sm text-slate-600 mb-2">
          <strong>${nombre}</strong> ha sido incorporado al rol RBAC con éxito.
        </p>
        <div class="bg-[#f5faff] p-3 rounded-lg text-xs font-mono text-slate-800 border">
          Contraseña provisoria: <span class="font-bold text-[#006875]">${passwordTemp}</span>
        </div>
      `,
      confirmButtonColor: '#012535'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-[#012535]/50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative text-left border border-[#d6e4f0]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#d6e4f0]">
          <div>
            <span className="text-[10px] font-bold text-[#006875] uppercase tracking-wider block">
              Gestión de Personal RBAC
            </span>
            <h3 className="text-xl font-bold text-[#012535]">Alta de Nuevo Bibliotecario</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[#012535] mb-1">
              Nombre Completo del Funcionario *
            </label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Dra. Carmen Gloria Valenzuela"
              className="w-full h-11 px-3.5 rounded-xl bg-[#f5faff] border border-[#c2c7cc] focus:border-[#006875] outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#012535] mb-1">
                Correo Institucional *
              </label>
              <input
                type="email"
                required
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="funcionario@bibliotech.edu"
                className="w-full h-11 px-3.5 rounded-xl bg-[#f5faff] border border-[#c2c7cc] focus:border-[#006875] outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-[#012535] mb-1">
                Rol en Sistema
              </label>
              <input
                type="text"
                disabled
                value="Bibliotecario de Sala"
                className="w-full h-11 px-3.5 rounded-xl bg-slate-100 text-slate-500 font-semibold border border-[#c2c7cc] cursor-not-allowed"
              />
            </div>
          </div>

          {/* Permisos */}
          <div className="bg-[#f5faff] p-4 rounded-xl border border-[#d6e4f0]">
            <label className="block font-bold text-[#012535] mb-2 text-xs">
              Permisos Operativos Asignados
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#0f1d25]">
              {[
                'Entrega de Préstamos',
                'Recepción y Devolución',
                'Gestión de Inventario Físico',
                'Aplicación de Sanciones'
              ].map((perm) => (
                <label key={perm} className="flex items-center gap-2 cursor-pointer p-1.5 rounded hover:bg-white transition-colors">
                  <input
                    type="checkbox"
                    checked={permisos.includes(perm)}
                    onChange={() => handleTogglePermiso(perm)}
                    className="w-4 h-4 rounded text-[#006875] border-[#c2c7cc] focus:ring-[#006875]"
                  />
                  <span>{perm}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Contraseña provisoria */}
          <div>
            <label className="block font-bold text-[#012535] mb-1">
              Contraseña Provisoria (Exigirá cambio en primer login)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={passwordTemp}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 text-[#012535] font-mono font-bold border border-[#c2c7cc] select-all"
              />
              <button
                type="button"
                onClick={regenerarPassword}
                className="px-4 h-11 rounded-xl bg-[#e1f0fb] hover:bg-[#d6e4f0] text-[#012535] font-bold text-xs flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">sync</span>
                <span>Regenerar</span>
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#012535] hover:bg-[#1b3b4b] text-white font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              <span>Registrar y Emitir Token</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
