import React, { useState, useEffect, useRef } from 'react';
import { AppConfig } from '../types';
import { X, Settings, RotateCcw } from 'lucide-react';
import { createPortal } from 'react-dom';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    config: AppConfig;
    onSave: (config: AppConfig) => void;
    onReset: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, config, onSave, onReset }) => {
    const [formData, setFormData] = useState<AppConfig>(config);
    const modalRef = useRef<HTMLDivElement>(null);

    // Sync form with config when opening
    useEffect(() => {
        if (isOpen) {
            setFormData(config);
        }
    }, [isOpen, config]);

    // Focus Management
    useEffect(() => {
        if (isOpen) {
            // 1. Initial Focus
            const firstInput = modalRef.current?.querySelector('input');
            if (firstInput) {
                firstInput.focus();
            }

            // 2. Focus Trap
            const handleTabKey = (e: KeyboardEvent) => {
                const focusableElements = modalRef.current?.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );

                if (!focusableElements || focusableElements.length === 0) return;

                const firstElement = focusableElements[0] as HTMLElement;
                const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

                if (e.key === 'Tab') {
                    if (e.shiftKey) { // Shift + Tab
                        if (document.activeElement === firstElement) {
                            e.preventDefault();
                            lastElement.focus();
                        }
                    } else { // Tab
                        if (document.activeElement === lastElement) {
                            e.preventDefault();
                            firstElement.focus();
                        }
                    }
                }
            };

            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'Escape') onClose();
                if (e.key === 'Tab') handleTabKey(e);
            };

            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [isOpen, onClose]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
            <div
                ref={modalRef}
                className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 border border-slate-200 dark:border-slate-800"
            >
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300">
                            <Settings size={20} aria-hidden="true" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Configuración</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg p-1"
                        aria-label="Cerrar configuración"
                        title="Cerrar configuración"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label htmlFor="titleName" className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                            Título
                        </label>
                        <input
                            id="titleName"
                            type="text"
                            required
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 text-slate-800 dark:text-white outline-none transition-all"
                            value={formData.titleName}
                            onChange={e => setFormData({ ...formData, titleName: e.target.value })}
                        />
                    </div>

                    <div>
                        <label htmlFor="subtitleName" className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                            Subtítulo (Resaltado)
                        </label>
                        <input
                            id="subtitleName"
                            type="text"
                            required
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 text-slate-800 dark:text-white outline-none transition-all"
                            value={formData.subtitleName}
                            onChange={e => setFormData({ ...formData, subtitleName: e.target.value })}
                        />
                    </div>

                    <div>
                        <label htmlFor="semester" className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                            Semestre / Subtítulo
                        </label>
                        <input
                            id="semester"
                            type="text"
                            required
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 text-slate-800 dark:text-white outline-none transition-all"
                            value={formData.semester}
                            onChange={e => setFormData({ ...formData, semester: e.target.value })}
                        />
                    </div>

                    <div>
                        <label htmlFor="footerText" className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                            Texto Pie de Página
                        </label>
                        <input
                            id="footerText"
                            type="text"
                            required
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 text-slate-800 dark:text-white outline-none transition-all"
                            value={formData.footerText}
                            onChange={e => setFormData({ ...formData, footerText: e.target.value })}
                        />
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                onReset();
                                onClose();
                            }}
                            className="px-4 py-3 rounded-xl font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            title="Restaurar valores por defecto"
                        >
                            <RotateCcw size={18} aria-hidden="true" />
                            <span>Restaurar</span>
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-200 dark:shadow-none focus:outline-none focus:ring-4 focus:ring-indigo-500/50"
                            title="Guardar cambios"
                        >
                            Guardar cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.getElementById('planner-root') || document.body
    );
};

export default SettingsModal;
