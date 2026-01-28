import { Exam } from '../types';
import { ExamListSchema } from '../schemas';

/**
 * Result of an exam import operation.
 */
export interface ImportResult {
    success: boolean;
    message: string;
    data?: {
        exams: Exam[];
        config?: any;
    };
}

/**
 * Parses and validates a JSON string containing exams.
 * Supports both legacy format (array of exams) and new format (object with exams and config).
 * 
 * @param jsonContent The primitive JSON string to parse.
 * @returns An ImportResult object indicating success or failure.
 */
export const parseAndValidateExams = (jsonContent: string): ImportResult => {
    try {
        const parsed = JSON.parse(jsonContent);

        // Check if it's the new format { version, config, exams }
        if (!Array.isArray(parsed) && parsed.exams) {
            const result = ExamListSchema.safeParse(parsed.exams);
            if (result.success) {
                // Return sorted exams
                const sortedExams = result.data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                return {
                    success: true,
                    message: 'Calendario y configuración importados correctamente.',
                    data: { exams: sortedExams, config: parsed.config }
                };
            }
        }

        // Legacy format (just array of exams)
        const result = ExamListSchema.safeParse(parsed);

        if (result.success) {
            const sortedExams = result.data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            return {
                success: true,
                message: 'Calendario importado correctamente.',
                data: { exams: sortedExams }
            };
        } else {
            console.error('Validation error:', result.error);
            return { success: false, message: 'El archivo no cumple con el formato requerido.' };
        }
    } catch (error) {
        console.error('JSON parse error:', error);
        return { success: false, message: 'El archivo no es un JSON válido.' };
    }
};
