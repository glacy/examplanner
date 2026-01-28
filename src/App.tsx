import React, { useState } from 'react';
import { Exam } from './types';
import ExamCard from './components/ExamCard';
import AddExamModal from './components/AddExamModal';
import ConfirmModal from './components/ConfirmModal';
import ResultModal from './components/ResultModal';
import Navbar from './components/Navbar';
import ExamStats from './components/ExamStats';
import Filters from './components/Filters';
import { CalendarX, Github } from 'lucide-react';
import { useTheme } from './providers/ThemeContext';
import { useExams } from './hooks/useExams';

import SettingsModal from './components/SettingsModal';
import HelpModal from './components/HelpModal';
import { useAppConfig } from './hooks/useAppConfig';
import { getFilename } from './utils/fileUtils';

const App: React.FC = () => {
  /* Force Rebuild */
  const { theme, toggleTheme } = useTheme();
  const { exams, addOrUpdateExam, deleteExam, stats, importExams, exportExams, exportExamsToHtml, generateStudentBuild, isReadOnly } = useExams();
  const { config, updateConfig, defaultConfig } = useAppConfig();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [examToDelete, setExamToDelete] = useState<string | null>(null);
  const [highlightedExamId, setHighlightedExamId] = useState<string | null>(null);
  const [resultModal, setResultModal] = useState<{ isOpen: boolean; type: 'success' | 'error'; message: string; title: string }>({
    isOpen: false,
    type: 'success',
    message: '',
    title: ''
  });
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'today'>('all');

  const handleDeleteRequest = (id: string) => {
    setExamToDelete(id);
    setConfirmModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (examToDelete) {
      deleteExam(examToDelete);
      setExamToDelete(null);
      setConfirmModalOpen(false);
    }
  };

  const handleEditRequest = (exam: Exam) => {
    setEditingExam(exam);
    setIsModalOpen(true);
  };

  const handleSaveWrapper = (exam: Exam) => {
    addOrUpdateExam(exam);
    // Trigger highlight animation
    setHighlightedExamId(exam.id);
    setTimeout(() => {
      setHighlightedExamId(null);
    }, 2000);
  };

  const filteredExams = exams.filter(exam => {
    if (filter === 'all') return true;
    const today = new Date().toLocaleDateString('en-CA');
    if (filter === 'today') return exam.date === today;
    if (filter === 'upcoming') return exam.date > today;
    return true;
  });



  return (
    // Reverted to min-h-screen but adding w-full to ensure width
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 pb-20 transition-colors duration-300">
      <Navbar
        onNewExam={() => {
          setEditingExam(null);
          setIsModalOpen(true);
        }}
        onExport={() => {
          const json = exportExams(config);
          const blob = new Blob([json], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = getFilename(config.subtitleName, 'calendario', 'json');
          a.click();
          URL.revokeObjectURL(url);
        }}
        onImport={(content) => {
          const result = importExams(content);
          if (result.success && result.data?.config) {
            updateConfig(result.data.config);
          }
          setResultModal({
            isOpen: true,
            type: result.success ? 'success' : 'error',
            title: result.success ? 'Importación exitosa' : 'Error de importación',
            message: result.message
          });
        }}
        onExportHtml={() => {
          const html = exportExamsToHtml();
          const blob = new Blob([html], { type: 'text/html' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = getFilename(config.subtitleName, 'calendario', 'html');
          a.click();
          URL.revokeObjectURL(url);
        }}
        onExportStudent={() => {
          const html = generateStudentBuild();
          if (!html) return; // Si retornó vacío (ej. warning en dev), no hacer nada

          const blob = new Blob([html], { type: 'text/html' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = getFilename(config.subtitleName, 'estudiantes', 'html');
          a.click();
          URL.revokeObjectURL(url);
        }}
        isReadOnly={isReadOnly}
        config={config}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        onSave={updateConfig}
        onReset={() => updateConfig(defaultConfig)}
      />

      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Main Content Area */}
          <div className="lg:col-span-12 space-y-8">
            {!isReadOnly && (
              <ExamStats
                total={stats.total}
                upcoming={stats.upcoming}
                today={stats.today}
              />
            )}

            <Filters
              currentFilter={filter}
              onFilterChange={setFilter}
            />

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredExams.length > 0 ? (
                filteredExams.map(exam => (
                  <ExamCard
                    key={exam.id}
                    exam={exam}
                    onDelete={handleDeleteRequest}
                    onEdit={handleEditRequest}

                    isHighlighted={exam.id === highlightedExamId}
                    isReadOnly={isReadOnly}
                  />
                ))
              ) : (
                <div className="col-span-full py-20 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600 mb-4">
                    <CalendarX size={32} aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-600 dark:text-slate-400">No hay exámenes para mostrar</h3>
                  <p className="text-sm text-slate-400 dark:text-slate-500 max-w-xs mx-auto mt-2">

                    {isReadOnly
                      ? 'No hay exámenes programados por el momento. Consulta con tu docente para más detalles.'
                      : 'Añade tu primer examen haciendo clic en el botón superior para empezar a organizarte.'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Area */}


        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 py-10 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-4">
          <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">© {config.footerText}</p>
          <a
            href="https://github.com/glacy/examplanner"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Ver repositorio en GitHub"
          >
            <Github size={20} />
          </a>
        </div>
      </footer>

      {isModalOpen && (
        <AddExamModal
          onSave={handleSaveWrapper}
          onClose={() => {
            setIsModalOpen(false);
            setEditingExam(null);
          }}
          initialData={editingExam}
        />
      )}

      <ConfirmModal
        isOpen={confirmModalOpen}
        onClose={() => {
          setConfirmModalOpen(false);
          setExamToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="¿Eliminar examen?"
        message="Esta acción no se puede deshacer. ¿Estás seguro de que quieres eliminar este examen de tu planificación?"
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
      />

      <ResultModal
        isOpen={resultModal.isOpen}
        onClose={() => setResultModal(prev => ({ ...prev, isOpen: false }))}
        title={resultModal.title}
        message={resultModal.message}
        type={resultModal.type}
      />
    </div>
  );
};

export default App;

