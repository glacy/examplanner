import { describe, it, expect } from 'vitest';
import { ExamListSchema } from '../schemas';
import { Exam } from '../types';

describe('Exam Import/Export Validation', () => {
    it('should validate the default exam data correctly', () => {
        const defaultExams: Exam[] = [
            {
                id: '1',
                title: 'Primer Parcial',
                subject: 'Arquitectura de Datos',
                date: new Date().toLocaleDateString('en-CA'),
                time: '10:00 AM',
                location: 'Laboratorio de Cómputo 3',
                topics: ['SQL', 'NoSQL', 'ETL', 'Data Warehousing'],
                notes: 'Traer identificación oficial.'
            },
            {
                id: '2',
                title: 'Segundo Parcial',
                subject: 'Inteligencia Artificial',
                date: '2026-06-15',
                time: '12:30 PM',
                location: 'Aula 201',
                topics: ['Deep Learning', 'Neural Networks', 'NLP'],
                notes: 'Examen a libro abierto.'
            }
        ];

        const json = JSON.stringify(defaultExams);
        const parsed = JSON.parse(json);

        const result = ExamListSchema.safeParse(parsed);

        if (!result.success) {
            console.error('Validation Error:', JSON.stringify(result.error.format(), null, 2));
            console.log('Tested Data:', JSON.stringify(parsed, null, 2));
        }

        expect(result.success).toBe(true);
    });

    it('should fail validation if date format is incorrect', () => {
        const invalidExams = [
            {
                id: '3',
                title: 'Bad Date Exam',
                subject: 'Testing',
                date: '01/24/2026', // Invalid format
                time: '10:00 AM',
                location: 'Nowhere',
                topics: []
            }
        ];

        const result = ExamListSchema.safeParse(invalidExams);
        expect(result.success).toBe(false);
    });

    it('should allow empty strings for optional fields (time, location, formUrl, notes)', () => {
        const examsWithEmptyFields = [
            {
                id: '3',
                title: 'Optional Fields Exam',
                subject: 'Testing',
                date: '2026-10-10',
                time: '',       // Should be valid now
                location: '',   // Should be valid now
                topics: [],
                notes: '',
                formUrl: ''
            }
        ];

        const result = ExamListSchema.safeParse(examsWithEmptyFields);
        expect(result.success).toBe(true);
    });
});
