import { Exam } from '../types';

/**
 * Generates a self-contained copy of the current application (Student Build)
 * by injecting the current exam data.
 * 
 * WARNING: This assumes the app is running from a "SingleFile" build (or at least relative).
 * If running in dev (Vite server), logic prevents execution unless in test mode.
 * 
 * @param exams The current list of exams to inject.
 * @returns The generated HTML string, or an empty string if blocked.
 */
export const generateStudentBuild = (exams: Exam[]): string => {
    if (import.meta.env.DEV && import.meta.env.MODE !== 'test') {
        alert("⚠️ No puedes exportar la App desde el modo de desarrollo (localhost).\n\nLa versión 'Student Build' requiere que todos los scripts estén empaquetados e integrados.\n\nPor favor, genera un build de producción ('npm run build'), abre 'dist/index.html' en tu navegador y prueba la exportación desde ahí.");
        return '';
    }

    // 1. Clone the current document to avoid modifying the user view
    const clone = document.documentElement.cloneNode(true) as HTMLElement;

    // 2. Clean current visual state (Revert to "skeleton")
    // Find the root container in the clone and empty it
    const root = clone.querySelector('#planner-root');
    if (root) {
        root.innerHTML = '';
    }

    // 3. Get serialized HTML of the clone
    let html = clone.outerHTML;

    // 4. Inject Data ( window.PLANNER_DATA )
    const dataScript = `<script>window.PLANNER_DATA = ${JSON.stringify(exams)};</script>`;

    // Insert after the last script tag to ensure it doesn't break anything
    const scriptCloseTag = '</script>';
    const lastScriptIndex = html.lastIndexOf(scriptCloseTag);

    if (lastScriptIndex !== -1) {
        const insertPos = lastScriptIndex + scriptCloseTag.length;
        html = html.substring(0, insertPos) + dataScript + html.substring(insertPos);
    } else {
        html += dataScript;
    }

    return html;
};
