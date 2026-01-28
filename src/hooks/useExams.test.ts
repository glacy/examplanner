import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useExams } from './useExams';

// Mock types
import { Exam } from '../types';

describe('useExams Hook - Read Only Logic', () => {

    const mockExam: Exam = {
        id: '1',
        title: 'Test Exam',
        subject: 'Testing',
        date: '2026-01-01',
        time: '12:00',
        location: 'Room 1',
        topics: [],
        notes: ''
    };

    const originalWindow = globalThis.window;
    const originalEnv = process.env; // Vitest populates process.env from import.meta.env in some setups, but we might need to mock import.meta.env directly if possible or use vi.stubEnv

    beforeEach(() => {
        // Reset window and env before each test
        vi.stubGlobal('window', { ...originalWindow, PLANNER_DATA: undefined });
        vi.stubEnv('VITE_READ_ONLY', '');
        localStorage.clear();
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.unstubAllEnvs();
    });

    it('should default to EDITABLE mode (Teacher) when no data or env var is present', () => {
        const { result } = renderHook(() => useExams());
        expect(result.current.isReadOnly).toBe(false);
    });

    it('should switch to READ-ONLY mode when window.PLANNER_DATA is present (Injection)', () => {
        // Mock Injected Data
        vi.stubGlobal('window', {
            ...originalWindow,
            PLANNER_DATA: [mockExam]
        });

        const { result } = renderHook(() => useExams());

        expect(result.current.isReadOnly).toBe(true);
        expect(result.current.exams).toHaveLength(1);
        expect(result.current.exams[0].title).toBe('Test Exam');
    });

    it('should switch to READ-ONLY mode when VITE_READ_ONLY is "true"', () => {
        vi.stubEnv('VITE_READ_ONLY', 'true');

        const { result } = renderHook(() => useExams());

        expect(result.current.isReadOnly).toBe(true);
    });

    it('should prioritize Injected Data over LocalStorage', () => {
        // Setup LocalStorage with "Old" data
        const oldExam = { ...mockExam, title: 'Old Local Data' };
        localStorage.setItem('exams', JSON.stringify([oldExam]));

        // Setup Injection with "New" data
        const newExam = { ...mockExam, title: 'New Injected Data' };
        vi.stubGlobal('window', {
            ...originalWindow,
            PLANNER_DATA: [newExam]
        });

        const { result } = renderHook(() => useExams());

        expect(result.current.isReadOnly).toBe(true);
        expect(result.current.exams[0].title).toBe('New Injected Data'); // Should ignore localStorage
    });

    it('should load from LocalStorage in TEACHER mode', () => {
        // Setup LocalStorage
        localStorage.setItem('exams', JSON.stringify([mockExam]));

        const { result } = renderHook(() => useExams());

        expect(result.current.isReadOnly).toBe(false);
        expect(result.current.exams).toHaveLength(1);
        expect(result.current.exams[0].title).toBe('Test Exam');
    });

    it('should generate a valid student build HTML string', () => {
        // Mock alert to avoid jsdom "not implemented" error
        vi.stubGlobal('alert', vi.fn());
        // Force DEV to false effectively for this test to bypass the guard
        // Note: import.meta.env is read-only in ESM, but Vitest might respect NODE_ENV
        vi.stubEnv('NODE_ENV', 'production');

        // Setup a fake DOM
        document.documentElement.innerHTML = `
            <head>
                <script src="main.js"></script>
            </head>
            <body>
                <div id="planner-root">
                    <div>Content that should be removed</div>
                </div>
            </body>
        `;

        // Setup valid data in LocalStorage so useExams loads it (and not defaults)
        localStorage.setItem('exams', JSON.stringify([mockExam]));

        vi.stubGlobal('window', {
            ...originalWindow,
            PLANNER_DATA: undefined
        });

        const { result } = renderHook(() => useExams());

        const html = result.current.generateStudentBuild();

        // 1. Check for data injection
        expect(html).toContain('window.PLANNER_DATA =');
        expect(html).toContain('Test Exam'); // Should contain our mock data

        // 2. Check for root cleanup
        expect(html).toContain('<div id="planner-root"></div>');
        expect(html).not.toContain('Content that should be removed');

        // 3. Check injection placement (after script)
        expect(html).toMatch(/<\/script>.*<script>window.PLANNER_DATA/s);
    });
});

