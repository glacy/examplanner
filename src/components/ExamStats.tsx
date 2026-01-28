import React from 'react';
import { ClipboardList, Hourglass, Star } from 'lucide-react';

interface ExamStatsProps {
    /** Cantidad total de exámenes */
    total: number;
    /** Cantidad de exámenes futuros */
    upcoming: number;
    /** Cantidad de exámenes programados para la fecha actual */
    today: number;
}

/**
 * Componente de estadísticas.
 * Muestra tarjetas con métricas clave: Total, Próximos y Para Hoy.
 */
import clsx from 'clsx';

/**
 * Componente de estadísticas.
 * Muestra tarjetas con métricas clave: Total, Próximos y Para Hoy.
 */
const ExamStats: React.FC<ExamStatsProps> = ({ total, upcoming, today }) => {

    const StatCard: React.FC<{
        icon: React.ReactNode,
        value: number,
        label: string,
        colorClass: string
    }> = ({ icon, value, label, colorClass }) => (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className={clsx(
                "w-12 h-12 rounded-full flex items-center justify-center text-xl",
                colorClass
            )}>
                {icon}
            </div>
            <div>
                <p className="text-2xl font-black text-slate-800 dark:text-white">{value}</p>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">{label}</p>
            </div>
        </div>
    );

    return (
        <div className="grid grid-cols-1 min-[500px]:grid-cols-3 gap-4">
            <StatCard
                icon={<ClipboardList size={24} aria-hidden="true" />}
                value={total}
                label="Total Exámenes"
                colorClass="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
            />
            <StatCard
                icon={<Hourglass size={24} aria-hidden="true" />}
                value={upcoming}
                label="Próximos"
                colorClass="bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400"
            />
            <StatCard
                icon={<Star size={24} aria-hidden="true" />}
                value={today}
                label="Para Hoy"
                colorClass="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
            />
        </div>
    );
};

export default ExamStats;
