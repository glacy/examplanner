/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_READ_ONLY: string
    // more env variables...
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

interface Window {
    PLANNER_DATA?: import('./types').Exam[];
    PLANNER_CONFIG?: import('./types').AppConfig;
}
