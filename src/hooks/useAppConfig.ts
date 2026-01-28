import { useState, useEffect } from 'react';
import { AppConfig } from '../types';

const DEFAULT_CONFIG: AppConfig = {
    titleName: 'Calendario de exámenes',
    subtitleName: 'colegiados',
    semester: 'II semestre 2026',
    footerText: 'Cátedra de Física General I - Escuela de Física'
};

export const useAppConfig = () => {
    const [config, setConfig] = useState<AppConfig>(() => {
        // 1. Check for Student Build injection
        if (typeof window !== 'undefined' && window.PLANNER_CONFIG) {
            return window.PLANNER_CONFIG;
        }

        // 2. Check localStorage
        const saved = localStorage.getItem('app_config');
        if (saved) {
            try {
                return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
            } catch (e) {
                console.error('Error parsing app config:', e);
            }
        }

        return DEFAULT_CONFIG;
    });

    useEffect(() => {
        if (typeof window !== 'undefined' && !window.PLANNER_CONFIG) {
            localStorage.setItem('app_config', JSON.stringify(config));
        }
    }, [config]);

    const updateConfig = (newConfig: Partial<AppConfig>) => {
        setConfig(prev => ({ ...prev, ...newConfig }));
    };

    return { config, updateConfig, defaultConfig: DEFAULT_CONFIG };
};
