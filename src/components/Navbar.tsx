import React, { useRef, useState } from 'react';
import { CalendarCheck, Plus, Moon, Sun, Download, Upload, Table, Menu, X, FileBracesCorner, FileCodeCorner, Settings, Info } from 'lucide-react';
import { useTheme } from '../providers/ThemeContext';
import clsx from 'clsx';
import ConfirmModal from './ConfirmModal';

interface NavbarProps {
    /** Tema actual de la aplicación ('light' o 'dark') */
    theme: string;
    /** Función para alternar entre temas */
    toggleTheme: () => void;
    /** Callback para abrir el modal de nuevo examen */
    onNewExam: () => void;
    /** Callback para exportar exámenes */
    onExport: () => void;
    /** Callback para importar exámenes (texto JSON) */
    onImport: (content: string) => void;
    /** Callback para exportar a HTML */
    /** Callback para exportar a HTML (Tabla imprimible) */
    onExportHtml: () => void;
    /** Callback para exportar App Autocontenida (Student Build) */
    onExportStudent: () => void;
    /** Si es true, oculta acciones de edición */
    /** Si es true, oculta acciones de edición */
    isReadOnly: boolean;
    /** Configuración de la aplicación (textos) */
    config: {
        titleName: string;
        subtitleName: string;
        semester: string;
    };
    /** Callback para abrir configuración */
    onOpenSettings: () => void;
    /** Callback para abrir ayuda */
    onOpenHelp: () => void;
}

/**
 * Barra de navegación superior.
 * Incluye el logo, el botón de cambio de tema, exportar/importar y el botón para crear nuevos exámenes.
 */
const NavbarItem: React.FC<{
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
    className?: string;
    active?: boolean;
}> = ({ onClick, icon, label, className, active }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <button
            onClick={onClick}
            className={clsx(
                "p-1.5 sm:p-2 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500",
                isDark ? "text-slate-400 hover:text-indigo-400" : "text-slate-500 hover:text-indigo-600",
                active && (isDark ? "bg-slate-800 text-indigo-400" : "bg-slate-100 text-indigo-600"),
                className
            )}
            aria-label={label}
            title={label}
        >
            {icon}
        </button>
    );
};

const Navbar: React.FC<Omit<NavbarProps, 'theme' | 'toggleTheme'>> = ({ onNewExam, onExport, onImport, onExportHtml, onExportStudent, isReadOnly, config, onOpenSettings, onOpenHelp }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const themeContext = useTheme();
    const { theme, toggleTheme } = themeContext;
    const isDark = theme === 'dark';

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showImportWarning, setShowImportWarning] = useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            if (content) {
                onImport(content);
            }
            // Clear input so we can upload the same file again if needed
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        };
        reader.readAsText(file);
    };

    return (
        <nav className={clsx(
            "sticky top-0 z-40 backdrop-blur-md border-b px-6 py-4 transition-colors duration-300",
            isDark ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-slate-200"
        )}>
            <div className="max-w-7xl mx-auto flex justify-between items-center relative">
                <div className="flex items-center gap-2">
                    <div className={clsx(
                        "w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg transition-colors",
                        isDark ? "bg-indigo-600 shadow-none" : "bg-indigo-600 shadow-indigo-200"
                    )}>
                        <CalendarCheck size={20} aria-hidden="true" />
                    </div>
                    <div>
                        <h1 className={clsx("text-xl font-black tracking-tight", isDark ? "text-white" : "text-slate-800")}>
                            {config.titleName} <span className={clsx(isDark ? "text-indigo-400" : "text-indigo-600")}>{config.subtitleName}</span>
                        </h1>
                        <p className={clsx("text-[9px] sm:text-[10px] font-bold uppercase tracking-widest", isDark ? "text-slate-500" : "text-slate-400")}>
                            {config.semester}
                        </p>
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
                    aria-expanded={isMenuOpen}
                    aria-controls="mobile-menu"
                >
                    {isMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
                </button>

                {/* Desktop Actions (Always Visible Strategy -> Now Responsive) */}
                <div className="hidden md:flex items-center gap-2 sm:gap-4">
                    {!isReadOnly && (
                        <div className="flex items-center gap-4">
                            <NavbarItem
                                onClick={onExport}
                                icon={<FileBracesCorner size={20} aria-hidden="true" />}
                                label="Exportar JSON"
                            />
                            <NavbarItem
                                onClick={onExportStudent}
                                icon={<FileCodeCorner size={20} aria-hidden="true" />} // Usamos Download icon pero distinto tooltip
                                label="Exportar App Estudiante (.html)"
                            />
                            <NavbarItem
                                onClick={onExportHtml}
                                icon={<Table size={20} aria-hidden="true" />}
                                label="Exportar tabla HTML"
                            />
                            <NavbarItem
                                onClick={() => setShowImportWarning(true)}
                                icon={<Upload size={20} aria-hidden="true" />}
                                label="Importar JSON"
                            />
                            <input
                                type="file"
                                id="import-json"
                                name="import-json"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept=".json"
                                className="hidden"
                            />
                        </div>
                    )}

                    {!isReadOnly && (
                        <NavbarItem
                            onClick={onOpenHelp}
                            icon={<Info size={20} aria-hidden="true" />}
                            label="Ayuda"
                        />
                    )}

                    <NavbarItem
                        onClick={toggleTheme}
                        icon={isDark ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}
                        label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                    />

                    {!isReadOnly && (
                        <NavbarItem
                            onClick={onOpenSettings}
                            icon={<Settings size={20} aria-hidden="true" />}
                            label="Configuración"
                        />
                    )}

                    {!isReadOnly && (
                        <button
                            onClick={onNewExam}
                            className={clsx(
                                "px-4 py-2 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 focus:outline-none focus:ring-4",
                                isDark
                                    ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-none focus:ring-indigo-500/30"
                                    : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100 focus:ring-indigo-500/30"
                            )}
                            aria-label="Crear nuevo examen"
                            title="Crear nuevo examen"
                        >
                            <Plus size={16} aria-hidden="true" />
                            <span className="hidden sm:inline">Nuevo examen</span>
                        </button>
                    )}
                </div>

                {/* Mobile Menu Dropdown */}
                {isMenuOpen && (
                    <div className={clsx(
                        "absolute top-full left-0 right-0 mt-4 p-4 rounded-2xl shadow-xl md:hidden flex flex-col gap-4 border",
                        isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
                    )}>
                        {!isReadOnly && (
                            <>
                                <button onClick={() => { onExport(); setIsMenuOpen(false); }} className={clsx("flex items-center gap-3 p-3 rounded-xl transition-colors", isDark ? "hover:bg-slate-700 text-slate-300" : "hover:bg-slate-100 text-slate-600")}>
                                    <Download size={20} />
                                    <span className="font-medium">Exportar JSON</span>
                                </button>
                                <button onClick={() => { onExportHtml(); setIsMenuOpen(false); }} className={clsx("flex items-center gap-3 p-3 rounded-xl transition-colors", isDark ? "hover:bg-slate-700 text-slate-300" : "hover:bg-slate-100 text-slate-600")}>
                                    <Table size={20} />
                                    <span className="font-medium">Exportar Tabla HTML</span>
                                </button>
                                <button onClick={() => { onExportStudent(); setIsMenuOpen(false); }} className={clsx("flex items-center gap-3 p-3 rounded-xl transition-colors", isDark ? "hover:bg-slate-700 text-slate-300" : "hover:bg-slate-100 text-slate-600")}>
                                    <Download size={20} />
                                    <span className="font-medium">Exportar App Estudiante</span>
                                </button>
                                <button onClick={() => { setShowImportWarning(true); setIsMenuOpen(false); }} className={clsx("flex items-center gap-3 p-3 rounded-xl transition-colors", isDark ? "hover:bg-slate-700 text-slate-300" : "hover:bg-slate-100 text-slate-600")}>
                                    <Upload size={20} />
                                    <span className="font-medium">Importar JSON</span>
                                </button>
                                <button onClick={() => { onOpenHelp(); setIsMenuOpen(false); }} className={clsx("flex items-center gap-3 p-3 rounded-xl transition-colors", isDark ? "hover:bg-slate-700 text-slate-300" : "hover:bg-slate-100 text-slate-600")}>
                                    <Info size={20} />
                                    <span className="font-medium">Ayuda</span>
                                </button>
                                <button onClick={() => { onOpenSettings(); setIsMenuOpen(false); }} className={clsx("flex items-center gap-3 p-3 rounded-xl transition-colors", isDark ? "hover:bg-slate-700 text-slate-300" : "hover:bg-slate-100 text-slate-600")}>
                                    <Settings size={20} />
                                    <span className="font-medium">Configuración</span>
                                </button>
                            </>
                        )}
                        <button onClick={() => { toggleTheme(); }} className={clsx("flex items-center gap-3 p-3 rounded-xl transition-colors", isDark ? "hover:bg-slate-700 text-slate-300" : "hover:bg-slate-100 text-slate-600")}>
                            {isDark ? <Sun size={20} /> : <Moon size={20} />}
                            <span className="font-medium">{isDark ? 'Modo Claro' : 'Modo Oscuro'}</span>
                        </button>

                        {!isReadOnly && (
                            <button
                                onClick={() => { onNewExam(); setIsMenuOpen(false); }}
                                className={clsx(
                                    "px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 focus:outline-none",
                                    isDark
                                        ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                                        : "bg-indigo-600 hover:bg-indigo-700 text-white"
                                )}
                            >
                                <Plus size={16} />
                                <span>Nuevo examen</span>
                            </button>
                        )}
                    </div>
                )}
            </div>

            <ConfirmModal
                isOpen={showImportWarning}
                onClose={() => setShowImportWarning(false)}
                onConfirm={() => {
                    setShowImportWarning(false);
                    // Pequeño timeout para mejorar la transición visual
                    setTimeout(() => fileInputRef.current?.click(), 100);
                }}
                title="¿Importar planificación?"
                message="⚠️ ADVERTENCIA: Importar un archivo reemplazará TODOS los exámenes actuales. Se perderán los cambios no guardados. ¿Deseas continuar?"
                confirmText="Sí, seleccionar archivo"
                cancelText="Cancelar"
            />
        </nav>
    );
};

export default Navbar;

