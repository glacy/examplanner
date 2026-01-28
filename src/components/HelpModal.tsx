import React, { useRef, useEffect } from 'react';
import { X, Info, FileJson, Table, ShieldCheck, Download } from 'lucide-react';
import { createPortal } from 'react-dom';

interface HelpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    // Focus Management
    useEffect(() => {
        if (isOpen) {
            const modalElement = modalRef.current;
            if (!modalElement) return;

            // Find all focusable elements
            const focusableElements = modalElement.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0] as HTMLElement;
            const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

            // Focus the close button initially (or the first element)
            // setTimeout to ensure render is complete
            setTimeout(() => {
                firstElement?.focus();
            }, 50);

            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'Escape') {
                    onClose();
                    return;
                }

                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        // Shift + Tab
                        if (document.activeElement === firstElement) {
                            e.preventDefault();
                            lastElement.focus();
                        }
                    } else {
                        // Tab
                        if (document.activeElement === lastElement) {
                            e.preventDefault();
                            firstElement.focus();
                        }
                    }
                }
            };

            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
            <div
                ref={modalRef}
                className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]"
            >
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
                            <Info size={24} aria-hidden="true" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Guía de uso</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg p-1"
                        aria-label="Cerrar ayuda"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-8">

                    <section>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
                            <ShieldCheck size={20} className="text-emerald-500" />
                            Gestión de exámenes
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm leading-relaxed">
                            Organiza tus evaluaciones de manera eficiente. Puedes <strong>crear</strong>, <strong>editar</strong> y <strong>eliminar</strong> exámenes fácilmente.
                            Utiliza el botón <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">Nuevo examen</span> para agregar una evaluación al calendario.
                        </p>
                    </section>

                    <section className="grid md:grid-cols-2 gap-6">
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-2 text-sm">
                                <FileJson size={16} className="text-indigo-500" />
                                Respaldo (.json)
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                Descarga tu planificación completa en un archivo <code>.json</code>. Este archivo sirve como copia de seguridad y puedes importarlo nuevamente en cualquier momento o en otro dispositivo para restaurar tus datos.
                            </p>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-2 text-sm">
                                <Table size={16} className="text-indigo-500" />
                                Exportar tabla HTML
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                Genera una vista de tabla simple y limpia, ideal para imprimir o compartir como un documento estático. Incluye todas las fechas clave ordenadas cronológicamente.
                            </p>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 md:col-span-2">
                            <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-2 text-sm">
                                <Download size={16} className="text-indigo-500" />
                                Aplicación estudiante (portátil)
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                Exporta una versión <strong>autocontenida</strong> de este planificador en un solo archivo <code>.html</code>.
                                Esta versión es perfecta para compartir con estudiantes: es de solo lectura, no requiere internet y mantiene toda la interactividad y diseño moderno.
                            </p>
                        </div>
                    </section>
                </div>

                <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 shrink-0">
                    <p className="text-center text-xs text-slate-400 dark:text-slate-500">
                        Exam Planner Pro v1.0 • ©gerardolacymora
                    </p>
                </div>
            </div>
        </div>,
        document.getElementById('planner-root') || document.body
    );
};

export default HelpModal;
