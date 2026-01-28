
import { z } from 'zod';

const ExamSchema = z.object({
    id: z.string(),
    title: z.string().min(1, 'El título es obligatorio'),
    subject: z.string().min(1, 'La materia es obligatoria'),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)'),
    time: z.string().min(1, 'La hora es obligatoria'),
    location: z.string().min(1, 'El lugar es obligatorio'),
    topics: z.array(z.string()),
    notes: z.string().optional(),
    status: z.enum(['upcoming', 'ongoing', 'completed']),
    formUrl: z.string().url('Debe ser una URL válida').optional().or(z.literal('')),
});

const ExamListSchema = z.array(ExamSchema);

const getTodayISO = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const defaultExams = [
    {
        id: '1',
        title: 'Primer Parcial',
        subject: 'Arquitectura de Datos',
        date: getTodayISO(),
        time: '10:00 AM',
        location: 'Laboratorio de Cómputo 3',
        topics: ['SQL', 'NoSQL', 'ETL', 'Data Warehousing'],
        notes: 'Traer identificación oficial.',
        status: 'upcoming'
    },
    {
        id: '2',
        title: 'Segundo Parcial',
        subject: 'Inteligencia Artificial',
        date: '2026-06-15',
        time: '12:30 PM',
        location: 'Aula 201',
        topics: ['Deep Learning', 'Neural Networks', 'NLP'],
        notes: 'Examen a libro abierto.',
        status: 'upcoming'
    },
    {
        id: '3',
        title: 'Examen con campos vacios',
        subject: 'Historia',
        date: '2026-10-10',
        time: '09:00',
        location: 'Aula 1',
        topics: [],
        notes: '', // Empty string
        status: 'upcoming',
        formUrl: '' // Empty string
    },
    {
        id: '4',
        title: 'Examen sin ubicacion',
        subject: 'Filosofia',
        date: '2026-11-11',
        time: '10:00',
        location: '', // Empty location - should fail current schema
        topics: [],
        notes: '',
        status: 'upcoming',
        formUrl: ''
    }
];

// Simulate JSON.stringify and JSON.parse (which removes undefined)
const jsonContent = JSON.stringify(defaultExams);
const parsed = JSON.parse(jsonContent);

console.log("Testing validation...");
const result = ExamListSchema.safeParse(parsed);

if (result.success) {
    console.log("Validation SUCCESS");
} else {
    console.log("Validation FAILED");
    console.log(JSON.stringify(result.error, null, 2));
}
