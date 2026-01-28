import React, { useEffect, useRef } from 'react';
import { X, CheckCircle, AlertOctagon } from 'lucide-react';

interface ResultModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    type: 'success' | 'error';
}

import clsx from 'clsx';

const ResultModal: React.FC<ResultModalProps> = ({
    isOpen,
    onClose,
    title,
    message,
    type
}) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (isOpen && buttonRef.current) {
            buttonRef.current.focus();
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;
            if (e.key === 'Escape') onClose();
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const isSuccess = type === 'success';

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div
                ref={modalRef}
                className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 border border-slate-200 dark:border-slate-800"
                role="dialog"
                aria-modal="true"
            >
                <div className="p-6 text-center">
                    <div className={clsx(
                        "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4",
                        isSuccess
                            ? "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                            : "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                    )}>
                        {isSuccess ? <CheckCircle size={32} /> : <AlertOctagon size={32} />}
                    </div>

                    <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                        {title}
                    </h2>

                    <p className="text-slate-500 dark:text-slate-400 mb-8">
                        {message}
                    </p>

                    <div className="flex justify-center">
                        <button
                            ref={buttonRef}
                            onClick={onClose}
                            className={clsx(
                                "px-6 py-2.5 rounded-xl font-bold text-white transition-colors shadow-lg focus:outline-none focus:ring-4",
                                isSuccess
                                    ? "bg-green-600 hover:bg-green-700 shadow-green-200 dark:shadow-none focus:ring-green-500/30"
                                    : "bg-red-600 hover:bg-red-700 shadow-red-200 dark:shadow-none focus:ring-red-500/30"
                            )}
                        >
                            {isSuccess ? 'Continuar' : 'Entendido'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultModal;
