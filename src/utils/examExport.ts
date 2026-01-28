import { Exam } from '../types';

/**
 * Exports exams and configuration to a JSON string.
 * @param exams The list of exams to export.
 * @param config Optional configuration object to include.
 * @returns A formatted JSON string.
 */
export const exportExamsToJson = (exams: Exam[], config?: any): string => {
    if (config) {
        return JSON.stringify({
            version: 1,
            config,
            exams
        }, null, 2);
    }
    return JSON.stringify(exams, null, 2);
};

/**
 * Generates a printable HTML string from the list of exams.
 * Determines the status (Pending/Completed) dynamically based on the current date.
 * 
 * @param exams The list of exams to include in the table.
 * @returns A complete HTML document string.
 */
export const exportExamsToHtml = (exams: Exam[]): string => {
    const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Calendario de Exámenes</title>
        <style>
            body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.5; color: #1e293b; max-width: 800px; margin: 0 auto; padding: 2rem; }
            h1 { color: #4f46e5; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.5rem; }
            table { width: 100%; border-collapse: collapse; margin-top: 2rem; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); border-radius: 0.5rem; overflow: hidden; }
            th, td { padding: 1rem; text-align: left; border-bottom: 1px solid #e2e8f0; }
            th { background-color: #f8fafc; font-weight: 600; color: #475569; }
            tr:last-child td { border-bottom: none; }
            .status-upcoming { background-color: #f0fdf4; color: #166534; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem; font-weight: 500; }
            .status-ongoing { background-color: #fff7ed; color: #9a3412; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem; font-weight: 500; }
            .status-completed { background-color: #f1f5f9; color: #475569; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem; font-weight: 500; }
            @media print { body { padding: 0; } table { box-shadow: none; } }
        </style>
    </head>
    <body>
        <h1>Calendario de Exámenes</h1>
        <table>
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Materia</th>
                    <th>Examen</th>
                    <th>Ubicación</th>
                    <th>Estado</th>
                </tr>
            </thead>
            <tbody>
                ${exams.map(exam => {
        const today = new Date().toISOString().split('T')[0];
        const isPast = exam.date < today;
        const statusClass = isPast ? 'status-completed' : 'status-upcoming';
        const statusLabel = isPast ? 'Completado' : 'Pendiente';

        return `
                    <tr>
                        <td>
                            <div style="font-weight: 500;">${new Date(exam.date + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}</div>
                            <div style="font-size: 0.875rem; color: #64748b;">${exam.time}</div>
                        </td>
                        <td>${exam.subject}</td>
                        <td>${exam.title}</td>
                        <td>${exam.location}</td>
                        <td><span class="${statusClass}">${statusLabel}</span></td>
                    </tr>
                `;
    }).join('')}
            </tbody>
        </table>
        <div style="margin-top: 2rem; font-size: 0.875rem; color: #64748b; text-align: center;">
            Generado el ${new Date().toLocaleDateString('es-ES')} con ExamPlanner Pro
        </div>
    </body>
    </html>
    `;
    return html;
};
