
import React, { useState, useEffect, useRef } from 'react';
import { Exam } from '../types';
import { X } from 'lucide-react';

interface AddExamModalProps {
  /** Función callback al guardar el examen */
  onSave: (exam: Exam) => void;
  /** Función para cerrar el modal */
  onClose: () => void;
  /** Datos iniciales (si es edición) o null (si es nuevo) */
  initialData?: Exam | null;
}

/**
 * Modal formulario para crear o editar exámenes.
 * Maneja el estado local del formulario y validaciones básicas.
 */
const AddExamModal: React.FC<AddExamModalProps> = ({ onSave, onClose, initialData }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || 'Primer Parcial',
    subject: initialData?.subject || '',
    date: initialData?.date || '',
    time: initialData?.time || '08:00',
    location: initialData?.location || '',
    topics: initialData?.topics.join(', ') || '',
    notes: initialData?.notes || '',
    formUrl: initialData?.formUrl || '',
    distributionUrl: initialData?.distributionUrl || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject || !formData.date) return;

    const examData: Exam = {
      id: initialData?.id || crypto.randomUUID(),
      title: formData.title,
      subject: formData.subject,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      topics: formData.topics.split(',').map(t => t.trim()).filter(t => t !== ''),
      notes: formData.notes,
      formUrl: formData.formUrl,
      distributionUrl: formData.distributionUrl,
    };

    onSave(examData);
    onClose();
  };

  const modalRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }

      if (e.key === 'Tab') {
        const modalElement = modalRef.current;
        if (!modalElement) return;

        const focusableElements = modalElement.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div ref={modalRef} className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 border border-slate-200 dark:border-slate-800">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">{initialData ? 'Editar examen' : 'Añadir nuevo examen'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors" aria-label="Cerrar modal" title="Cerrar modal">
            <X size={24} aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="exam-title" className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Tipo de examen</label>
              <input
                id="exam-title"
                name="title"
                autoFocus
                required
                type="text"
                placeholder="Ej. Primer Parcial"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 text-slate-800 dark:text-white outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="exam-subject" className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Materia</label>
              <input
                id="exam-subject"
                name="subject"
                required
                type="text"
                placeholder="Ej. Matemáticas II"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 text-slate-800 dark:text-white outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600"
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="exam-date" className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Fecha</label>
              <input
                id="exam-date"
                name="date"
                required
                type="date"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 text-slate-800 dark:text-white outline-none calendar-picker"
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="exam-time" className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Hora</label>
              <input
                id="exam-time"
                name="time"
                type="time"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 text-slate-800 dark:text-white outline-none"
                value={formData.time}
                onChange={e => setFormData({ ...formData, time: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label htmlFor="exam-location" className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Ubicación</label>
            <input
              id="exam-location"
              name="location"
              type="text"
              placeholder="Ej. Aula 402, Edificio B"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 text-slate-800 dark:text-white outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600"
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="exam-topics" className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Temas (separados por coma)</label>
            <textarea
              id="exam-topics"
              name="topics"
              rows={2}
              placeholder="Ej. Derivadas, Integrales, Límites"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 text-slate-800 dark:text-white outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600"
              value={formData.topics}
              onChange={e => setFormData({ ...formData, topics: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="exam-notes" className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Notas Adicionales</label>
            <input
              id="exam-notes"
              name="notes"
              type="text"
              placeholder="Cualquier recordatorio importante..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 text-slate-800 dark:text-white outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600"
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="exam-form-url" className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Enlace al Examen (Opcional)</label>
            <input
              id="exam-form-url"
              name="formUrl"
              type="url"
              placeholder="https://forms.gle/..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 text-slate-800 dark:text-white outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600"
              value={formData.formUrl}
              onChange={e => setFormData({ ...formData, formUrl: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="exam-distribution-url" className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Enlace a distribución de aulas (Opcional)</label>
            <input
              id="exam-distribution-url"
              name="distributionUrl"
              type="url"
              placeholder="https://drive.google.com/file/..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 text-slate-800 dark:text-white outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600"
              value={formData.distributionUrl}
              onChange={e => setFormData({ ...formData, distributionUrl: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-indigo-200 dark:shadow-none focus:outline-none focus:ring-4 focus:ring-indigo-500/50"
          >
            {initialData ? 'Guardar cambios' : 'Agendar examen'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddExamModal;
