import clsx from 'clsx';

interface FiltersProps {
    /** Filtro activo actual */
    currentFilter: 'all' | 'upcoming' | 'today';
    /** Callback cuando cambia el filtro seleccionado */
    onFilterChange: (filter: 'all' | 'upcoming' | 'today') => void;
}

/**
 * Componente de barra de filtros.
 * Permite al usuario filtrar la lista de exámenes visible.
 */
const Filters: React.FC<FiltersProps> = ({ currentFilter, onFilterChange }) => {

    const filters: { id: 'all' | 'upcoming' | 'today'; label: string }[] = [
        { id: 'all', label: 'Todos' },
        { id: 'today', label: 'Hoy' },
        { id: 'upcoming', label: 'Pendientes' },
    ];

    const activeIndex = filters.findIndex(f => f.id === currentFilter);

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 gap-4 sm:gap-0">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white self-start sm:self-auto">Cronograma</h2>
            <div className="relative bg-slate-200/50 dark:bg-slate-800 p-1 rounded-xl w-full sm:w-[320px] grid grid-cols-3">
                {/* Animated Background Pill */}
                <div
                    className="absolute top-1 bottom-1 left-1 w-[calc(33.33%-0.5rem)] bg-white dark:bg-slate-700 rounded-lg shadow-sm transition-transform duration-300 ease-in-out"
                    style={{
                        transform: `translateX(${activeIndex * 100}%)`,
                        width: 'calc(33.33% - 0.33rem)', // Adjust width slightly for gaps
                        left: '0.25rem' // Initial padding offset
                    }}
                />

                {filters.map((filter) => (
                    <button
                        key={filter.id}
                        onClick={() => onFilterChange(filter.id)}
                        className={clsx(
                            "relative z-10 py-1.5 text-xs font-bold transition-colors duration-300 text-center rounded-lg focus:outline-none",
                            currentFilter === filter.id
                                ? "text-indigo-600 dark:text-indigo-400"
                                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                        )}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Filters;
