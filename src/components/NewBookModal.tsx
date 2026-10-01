import React, { useState } from 'react';
import { Libro } from '../types';
import Swal from 'sweetalert2';

interface NewBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveBook: (newBook: Partial<Libro>) => void;
}

export const NewBookModal: React.FC<NewBookModalProps> = ({
  isOpen,
  onClose,
  onSaveBook,
}) => {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [categoria, setCategoria] = useState('Ingeniería de Software');
  const [stockTotal, setStockTotal] = useState(5);
  const [ubicacion, setUbicacion] = useState('Pabellón TIC - Estante 04-B (Nivel 2)');
  const [sinopsis, setSinopsis] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo || !autor || !isbn) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos requeridos',
        text: 'Por favor completa título, autor e ISBN.',
        confirmButtonColor: '#012535'
      });
      return;
    }

    const codeNum = Math.floor(1000 + Math.random() * 9000);
    const bookData: Partial<Libro> = {
      id: Date.now().toString(),
      codigo: `LIB-${codeNum}`,
      titulo,
      autor,
      isbn,
      categoria,
      stockTotal: Number(stockTotal),
      stockDisponible: Number(stockTotal),
      ubicacion,
      sinopsis: sinopsis || 'Sinopsis catalogada por el equipo de administración bibliotecaria CGTI.',
      estado: 'DISPONIBLE',
      portadaUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      badge: `Disponible: ${stockTotal} ejs.`
    };

    onSaveBook(bookData);
    Swal.fire({
      icon: 'success',
      title: '¡Libro Catalogado!',
      text: `"${titulo}" ha sido ingresado al catálogo oficial con código LIB-${codeNum}.`,
      confirmButtonColor: '#012535'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-[#012535]/50 animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl p-6 text-left border border-[#d6e4f0] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#d6e4f0]">
          <div>
            <span className="text-[10px] font-bold text-[#006875] uppercase tracking-wider block">
              Catálogo &amp; Acervo
            </span>
            <h3 className="text-xl font-bold text-[#012535]">Catalogar Nuevo Libro</h3>
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
            <label className="block font-bold text-[#012535] mb-1">Título de la Obra *</label>
            <input
              type="text"
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej. Introduction to Algorithms (CLRS)"
              className="w-full h-10 px-3 rounded-lg bg-[#f5faff] border border-[#c2c7cc] focus:border-[#006875] outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#012535] mb-1">Autor(es) / Investigador *</label>
              <input
                type="text"
                required
                value={autor}
                onChange={(e) => setAutor(e.target.value)}
                placeholder="Ej. Thomas H. Cormen"
                className="w-full h-10 px-3 rounded-lg bg-[#f5faff] border border-[#c2c7cc] focus:border-[#006875] outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-[#012535] mb-1">ISBN Normalizado *</label>
              <input
                type="text"
                required
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                placeholder="978-0262033848"
                className="w-full h-10 px-3 rounded-lg bg-[#f5faff] border border-[#c2c7cc] focus:border-[#006875] outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#012535] mb-1">Categoría Temática</label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-[#f5faff] border border-[#c2c7cc] focus:border-[#006875] outline-none cursor-pointer"
              >
                <option value="Ingeniería de Software">Ingeniería de Software</option>
                <option value="Bases de Datos & Sistemas">Bases de Datos & Sistemas</option>
                <option value="Inteligencia Artificial">Inteligencia Artificial</option>
                <option value="Redes y Telecomunicaciones">Redes y Telecomunicaciones</option>
                <option value="Ciencias Computacionales">Ciencias Computacionales</option>
                <option value="Literatura Universal">Literatura Universal</option>
                <option value="Filosofía / Ficción">Filosofía / Ficción</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-[#012535] mb-1">Stock de Ejemplares Físicos</label>
              <input
                type="number"
                min={1}
                max={50}
                value={stockTotal}
                onChange={(e) => setStockTotal(Number(e.target.value))}
                className="w-full h-10 px-3 rounded-lg bg-[#f5faff] border border-[#c2c7cc] focus:border-[#006875] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#012535] mb-1">Ubicación Física en Sala</label>
            <input
              type="text"
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              placeholder="Pabellón TIC - Estante 02-B (Nivel 2)"
              className="w-full h-10 px-3 rounded-lg bg-[#f5faff] border border-[#c2c7cc] focus:border-[#006875] outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-[#012535] mb-1">Sinopsis / Resumen Institucional</label>
            <textarea
              rows={3}
              value={sinopsis}
              onChange={(e) => setSinopsis(e.target.value)}
              placeholder="Breve reseña sobre el valor académico y temas abordados en este volumen..."
              className="w-full p-3 rounded-lg bg-[#f5faff] border border-[#c2c7cc] focus:border-[#006875] outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#012535] hover:bg-[#1b3b4b] text-white font-bold shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">add_circle</span>
              <span>Guardar en Catálogo</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
