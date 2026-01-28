
### 34. Refactorización Estructural y Optimización
**Problema:** El hook `useExams.ts` estaba creciendo demasiado, mezclando lógica de estado, validación de esquemas (Zod) y manipulación de DOM strings (para exportaciones), lo que dificultaba el mantenimiento y testing.
**Solución:** Desacoplamiento de responsabilidades.
*   **Módulos de Utilidad:** Se extrajo la lógica pesada a archivos dedicados en `src/utils/`:
    *   `examExport.ts`: Maneja la generación de JSON y tablas HTML.
    *   `examImport.ts`: Centraliza el parsing de JSON y la validación con Zod.
    *   `studentBuild.ts`: Contiene la lógica de "Quine" para autogenerar la build estudiantil.
*   **Resultado:** `useExams.ts` se redujo significativamente, actuando ahora como un orquestador de estado limpio.

### 35. Simplificación del Modelo de Datos (Single Source of Truth)
**Problema:** El campo `status` ('upcoming' | 'completed') en el objeto `Exam` era redundante, ya que el estado real depende implícitamente de la fecha actual vs la fecha del examen. Esto podía llevar a estados inconsistentes (ej. status 'upcoming' para una fecha pasada).
**Solución:** Eliminación del campo explícito.
*   **Refactor:** Se eliminó `status` del esquema Zod y de los tipos TS.
*   **Cálculo Dinámico:** En los reportes estáticos (HTML), el estatus se calcula en tiempo de ejecución comparando `exam.date < today`. Esto garantiza consistencia absoluta sin necesidad de "cron jobs" o actualizaciones de estado manuales.

### 36. Accesibilidad: Trampa de Foco (Focus Trap)
**Problema:** Al abrir el modal de Ayuda, un usuario navegando con teclado (Tab) podía salirse del modal e interactuar con elementos "bloqueados" por el overlay, lo cual viola principios de WAI-ARIA.
**Solución:** Implementación de Focus Trap manual.
*   **Lógica:** Se interceptan los eventos `keydown` (Tab / Shift+Tab). Si el foco está en el último elemento interactivo y se presiona Tab, se mueve al primero; y viceversa.
*   **Beneficio:** Mejora sustancial en la experiencia para usuarios que dependen de teclados o lectores de pantalla.
