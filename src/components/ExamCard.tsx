
import React, { useState } from 'react';
import { Exam } from '../types';
import { CalendarRange, Clock, MapPin, Trash2, Edit, ExternalLink } from 'lucide-react';
import clsx from 'clsx';

interface ExamCardProps {
  /** Objeto con los datos del examen */
  exam: Exam;
  /** Función para solicitar la eliminación */
  onDelete: (id: string) => void;
  /** Función para iniciar la edición */
  onEdit: (exam: Exam) => void;
  /** Si es true, muestra una animación de resaltado temporal */
  isHighlighted?: boolean;
  /** Si es true, oculta botones de edición */
  isReadOnly: boolean;
}

/**
 * Tarjeta individual que muestra la información de un examen.
 * Incluye botones de acción (Editar, Eliminar) y formato de fechas condicional.
 */
const ExamCard: React.FC<ExamCardProps> = ({ exam, onDelete, onEdit, isHighlighted, isReadOnly }) => {
  const [showPlan, setShowPlan] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [studyPlan, setStudyPlan] = useState<{ plan: any[], tips: string[] } | null>(null);

  // Calculate date difference for styling
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to midnight local
  const examDateObj = new Date(exam.date + 'T00:00:00');
  const diffTime = examDateObj.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const isPast = diffDays < 0;
  const isToday = diffDays === 0;
  const isUpcoming = diffDays > 0 && diffDays <= 10;
  const isFuture = diffDays > 10;
  const isExtraordinario = exam.title.includes('Extraordinario');

  const formattedDate = examDateObj.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className={clsx(
      "bg-white dark:bg-slate-900 rounded-2xl shadow-sm border overflow-hidden transition-all duration-500 hover:shadow-md",
      isHighlighted && "ring-4 ring-indigo-500 shadow-xl shadow-indigo-200 dark:shadow-indigo-900/50 scale-[1.02]",
      !isHighlighted && isPast && "border-slate-200 dark:border-slate-800 opacity-75 grayscale-[0.5]",
      !isHighlighted && isToday && "ring-2 ring-green-500 border-green-500 shadow-green-100 dark:shadow-none",
      !isHighlighted && isUpcoming && "ring-2 ring-amber-400 border-amber-400 shadow-amber-100 dark:shadow-none",
      !isHighlighted && isFuture && "ring-2 ring-blue-500 border-blue-500 shadow-blue-100 dark:shadow-none"
    )}>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="min-w-0 pr-2">
            <span className={clsx(
              "inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2",
              isExtraordinario
                ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                : "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
            )}>
              {exam.subject}
            </span>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white truncate" title={exam.title}>{exam.title}</h3>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            {!isReadOnly && (
              <>
                <button
                  onClick={() => onEdit(exam)}
                  className="text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 p-1 rounded-lg"
                  aria-label={`Editar ${exam.title}`}
                  title={`Editar ${exam.title}`}
                >
                  <Edit size={18} aria-hidden="true" />
                </button>
                <button
                  onClick={() => onDelete(exam.id)}
                  className="text-slate-400 hover:text-red-500 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 p-1 rounded-lg"
                  aria-label={`Eliminar ${exam.title}`}
                  title={`Eliminar ${exam.title}`}
                >
                  <Trash2 size={18} aria-hidden="true" />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center text-slate-600 dark:text-slate-300 text-sm">
            <CalendarRange size={18} className="text-indigo-500 dark:text-indigo-400 mr-2" aria-hidden="true" />
            <span className="">{formattedDate}</span>
          </div>
          <div className="flex items-center text-slate-600 dark:text-slate-300 text-sm">
            <Clock size={18} className="text-indigo-500 dark:text-indigo-400 mr-2" aria-hidden="true" />
            <span>{exam.time}</span>
          </div>
          <div className="flex items-center text-slate-600 dark:text-slate-300 text-sm">
            <MapPin size={18} className="text-indigo-500 dark:text-indigo-400 mr-2" aria-hidden="true" />
            <span>{exam.location || 'Ubicación no especificada'}</span>
          </div>
        </div>
        {exam.distributionUrl && (
          <a
            href={exam.distributionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full p-2 mt-2 mb-6 text-sm font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-4 focus:ring-slate-500/30"
            aria-label={`Ver distribución de aulas para ${exam.title}`}
          >
            <span>📍 Ver distribución de aulas</span>
          </a>
        )}
        {exam.topics && exam.topics.length > 0 && (
          <div className="mb-6">
            <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Temario Principal</h4>
            <div className="flex flex-wrap gap-2">
              {exam.topics.map((topic, idx) => (
                <span key={idx} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded text-xs">
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}

        {
          exam.notes && (
            <div className="mb-6 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-sm text-slate-500 dark:text-slate-400 italic">
              "{exam.notes}"
            </div>
          )
        }

        {exam.formUrl && (
          <a
            href={exam.formUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full p-2 mt-4 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-4 focus:ring-indigo-500/30"
            aria-label={`Ir al formulario del examen de ${exam.subject} (se abre en una nueva pestaña)`}
          >
            <span>Ir al formulario del examen</span>
            <ExternalLink size={16} className="ml-2" aria-hidden="true" />
          </a>
        )}
      </div >
    </div >
  );
};

export default ExamCard;
