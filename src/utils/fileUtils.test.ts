import { describe, it, expect } from 'vitest';
import { getFilename } from './fileUtils';

describe('getFilename', () => {
    it('should generate a basic filename correctly', () => {
        const result = getFilename('My Subtitle', 'prefix', 'json');
        expect(result).toMatch(/^prefix-my-subtitle-\d{4}-\d{2}-\d{2}\.json$/);
    });

    it('should normalize accents and special characters', () => {
        const result = getFilename('Física General I', 'cal', 'html');
        // Física -> fisica, I -> i
        expect(result).toMatch(/^cal-fisica-general-i-\d{4}-\d{2}-\d{2}\.html$/);
    });

    it('should handle special characters and punctuation', () => {
        const result = getFilename('Exam #1: Intro!', 'test', 'txt');
        expect(result).toMatch(/^test-exam-1-intro-\d{4}-\d{2}-\d{2}\.txt$/);
    });

    it('should handle empty subtitles', () => {
        const result = getFilename('', 'export', 'csv');
        expect(result).toMatch(/^export-\d{4}-\d{2}-\d{2}\.csv$/);
    });

    it('should handle multiple consecutive spaces or hyphens', () => {
        const result = getFilename('  Space   --   Test  ', 'file', 'json');
        expect(result).toMatch(/^file-space-test-\d{4}-\d{2}-\d{2}\.json$/);
    });
});
