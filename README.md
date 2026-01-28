# ExamPlanner 🎓

**ExamPlanner** es una herramienta de organización académica diseñada para ayudar a docentes/estudiantes a gestionar y visualizar sus exámenes de manera eficiente. Construida con tecnologías web modernas, ofrece una interfaz limpia y responsiva para mantener el control de tu agenda académica.

## 🚀 Características principales

### 📊 Panel de control (Dashboard)
- **Resumen estadístico**: Visualiza rápidamente el total de exámenes, los próximos eventos y los exámenes programados para el día de hoy.
- **Filtrado inteligente**: Organiza tu vista con filtros para ver "Todos", "Hoy" o "Pendientes" (Próximos).
- **Indicadores visuales**: Iconografía clara y códigos de colores para identificar el estado de tus evaluaciones.

### 📅 Gestión de exámenes
- **Crear exámenes**: Formulario intuitivo para añadir nuevos exámenes con detalles completos:
  - Título y Asignatura
  - Fecha y Hora
  - Ubicación (Aula/Laboratorio)
  - Temas a estudiar
  - Notas adicionales
- **Listado y Ordenamiento**: Los exámenes se ordenan automáticamente por fecha para priorizar los más cercanos.
- **Eliminar**: Facilidad para remover exámenes completados o cancelados.

### 💾 Persistencia de datos
- **Almacenamiento local**: Tus datos se guardan automáticamente en el navegador (`localStorage`), por lo que no perderás tu información al cerrar la pestaña.
- **Datos de ejemplo**: Incluye un conjunto inicial de datos para demostrar la funcionalidad si es tu primera vez usando la app.
- **Exportación e importación**: Respalda y comparte tus calendarios mediante archivos JSON.
  - **Validación estricta**: Utiliza un esquema Zod para garantizar la integridad de los datos importados.
  - **Feedback visual**: El sistema informa claramente mediante un modal si la importación fue exitosa o si hubo errores de formato.
- **Generador de entregables (Student Build)**: Exporta una versión HTML autocontenida de tu calendario con un solo clic, lista para enviar a tus alumnos (sin edición permitida).

### 🎨 Interfaz de usuario (UI/UX)
- **Diseño responsivo**: Adaptable a dispositivos móviles y de escritorio.
- **Modo oscuro/claro**: Soporte nativo para temas claro y oscuro, respetando tu preferencia visual.
- **Configuración personalizable (Nuevo ⚙️)**: Puedes editar el nombre de la institución, el título de la app, el semestre y el pie de página directamente desde la interfaz, sin tocar código.
- **Estética moderna**: Utiliza una paleta de colores profesional (Indigo/Slate) y efectos de desenfoque (backdrop-blur) en la navegación.
- **Micro-interacciones**: Feedback visual sutil al interactuar con elementos (hover, focus, active).

### ♿ Accesibilidad (A11y)
El proyecto ha sido diseñado siguiendo pautas WCAG para ser inclusivo:
- **Navegación por teclado**: Todos los elementos interactivos son accesibles mediante tabulación (Tab).
- **Trampa de Foco (Focus Trap)**: Al abrir modales (Ayuda, Configuración), el foco del teclado se mantiene dentro de la ventana emergente para evitar navegación errática.
- **Etiquetas ARIA**: Implementación semántica de `aria-label`, `aria-expanded` y `role` en componentes complejos como el menú móvil y modales.
- **Semántica HTML**: Uso correcto de etiquetas (`<main>`, `<header>`, `<article>`) para facilitar la lectura por tecnologías de asistencia.

---

## 🛠️ Tecnologías utilizadas

Este proyecto está construido con un stack moderno y eficiente:

- **[React](https://react.dev/)**: Biblioteca para interfaces de usuario.
- **[TypeScript](https://www.typescriptlang.org/)**: Tipado estático para un código más robusto.
- **[Vite](https://vitejs.dev/)**: Entorno de desarrollo ultrarrápido.
- **[Tailwind CSS](https://tailwindcss.com/)**: Framework de utilidades para el diseño.
- **FontAwesome**: Iconografía vectorial.

---

## 💻 Instalación y uso local

Sigue estos pasos para ejecutar el proyecto en tu máquina local:

1.  **Prerrequisitos**: Asegúrate de tener instalado [Node.js](https://nodejs.org/) (versión 18 o superior recomendada).

2.  **Clonar el repositorio** (o descargar los archivos):
    ```bash
    git clone https://github.com/glacy/examplanner.git
    cd examplanner
    ```

3.  **Instalar dependencias**:
    ```bash
    npm install
    ```

4.  **Iniciar el servidor de desarrollo**:
    ```bash
    npm run dev
    ```
    La aplicación estará disponible en `http://localhost:5173` (o el puerto que indique la terminal).

5.  **Construir para producción**:
    Para generar los archivos optimizados para despliegue:
    ```bash
    npm run build
    ```

---

## 📁 Estructura del proyecto

```
planner/
├── src/
│   ├── components/      # Componentes de UI (ExamCard, Modales, Navbar)
│   ├── hooks/           # Hooks personalizados (useExams, useAppConfig)
│   ├── providers/       # Context Providers (ThemeContext)
│   ├── utils/           # Utilidades y Lógica de Negocio
│   │   ├── examExport.ts    # Generación de exportaciones (JSON/HTML)
│   │   ├── examImport.ts    # Parsing y validación de importaciones
│   │   ├── studentBuild.ts  # Generador de "Student App" autocontenida
│   │   └── fileUtils.ts     # Normalización de nombres de archivo
│   ├── tests/           # Pruebas de integración
│   ├── App.tsx          # Componente raíz y Layout principal
│   ├── main.tsx         # Punto de entrada
│   ├── types.ts         # Definiciones de tipos TypeScript
│   └── schemas.ts       # Esquemas de validación Zod
├── public/              # Archivos estáticos
├── package.json         # Dependencias y scripts
└── tsconfig.json        # Configuración de TypeScript
```

---


## 🏗️ Estrategias de distribución (Solo Lectura)
Existen tres formas de distribuir el calendario a los estudiantes en modo "Solo Lectura":

### 1. Generación desde la UI (Recomendado) 🏆
Como se menciona en las características, el docente puede hacer clic en **"Exportar HTML para Estudiantes"** desde la propia aplicación. Esto genera un archivo `.html` autocontenido con la configuración y exámenes actuales.

### 2. Inyección de Datos (CLI)
Para flujos automatizados, puedes usar el script de build con datos inyectados:
```bash
npm run build:student -- --data=./datos.json
```

### 3. Variable de Entorno (Desarrollo)
Para probar la apariencia de "Solo Lectura" mientras desarrollas:
```bash
VITE_READ_ONLY=true npm run dev
```

---

---

## 🤖 Uso de IA

Este proyecto ha sido desarrollado en colaboración con tecnologías de Inteligencia Artificial de vanguardia:

- **Antigravity**: Agente de codificación autónomo desarrollado por el equipo de Google DeepMind. Actuó como *Pair Programmer* y Arquitecto de Software, encargándose de:
    - Refactorización de código y optimización de estructura.
    - Implementación de pruebas unitarias (Vitest).
    - Creación de utilidades complejas (generación de builds, visualización de datos).
    - Mantenimiento de la documentación técnica.

- **Gemini**: Modelo de lenguaje que potenció la capacidad de razonamiento y generación de código contextual.

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
