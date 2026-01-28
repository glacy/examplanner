import { z } from 'zod';

export const ExamSchema = z.object({
    id: z.string(),
    title: z.string().min(1, 'El título es obligatorio'),
    subject: z.string().min(1, 'La materia es obligatoria'),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)'),
    time: z.string(),
    location: z.string(),
    topics: z.array(z.string()),
    notes: z.string().optional(),
    // status removed - calculated dynamically
    formUrl: z.string().url('Debe ser una URL válida').optional().or(z.literal('')),
    distributionUrl: z.string().url('Debe ser una URL válida').optional().or(z.literal('')),
});

export const ExamListSchema = z.array(ExamSchema);

export type Exam = z.infer<typeof ExamSchema>;
