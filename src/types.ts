import { Exam as ZodExam } from './schemas';

export type Exam = ZodExam;

export type ExamType = 'Primer Parcial' | 'Segundo Parcial' | 'Tercer Parcial'|'Extraordinario' | 'Final' | 'Otro';

export interface AppConfig {
    titleName: string;
    subtitleName: string;
    semester: string;
    footerText: string;
}
