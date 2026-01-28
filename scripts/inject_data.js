
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Arguments
// Usage: node scripts/inject_data.js --data=./path/to/data.json
const args = process.argv.slice(2);
const dataArg = args.find(arg => arg.startsWith('--data='));

if (!dataArg) {
    console.error('Error: --data argument is required');
    process.exit(1);
}

const dataPath = path.resolve(process.cwd(), dataArg.split('=')[1]);

if (!fs.existsSync(dataPath)) {
    console.error(`Error: Data file not found at ${dataPath}`);
    process.exit(1);
}

try {
    // Read Data
    const jsonData = fs.readFileSync(dataPath, 'utf-8');
    // Validate JSON
    JSON.parse(jsonData);

    // Read HTML Template (dist/index.html)
    const distDir = path.resolve(process.cwd(), 'dist');
    const indexHtmlPath = path.join(distDir, 'index.html');
    const outputHtmlPath = path.join(distDir, 'student-calendar.html');

    if (!fs.existsSync(indexHtmlPath)) {
        console.error(`Error: dist/index.html not found. Run 'npm run build' first.`);
        process.exit(1);
    }

    let htmlContent = fs.readFileSync(indexHtmlPath, 'utf-8');

    // Inject Script
    const injectionScript = `<script>window.PLANNER_DATA = ${jsonData};</script>`;

    // Insert before closing head tag, or body if head not found (unlikely)
    // Inject after the last script tag to ensure we don't break the main bundle
    // The main script likely contains template strings with </head> and </body> which confuses simple search.
    const scriptCloseTag = '</script>';
    const lastScriptIndex = htmlContent.lastIndexOf(scriptCloseTag);

    if (lastScriptIndex !== -1) {
        // Insert AFTER the closing script tag
        const insertPosition = lastScriptIndex + scriptCloseTag.length;
        htmlContent = htmlContent.substring(0, insertPosition) + injectionScript + htmlContent.substring(insertPosition);
    } else {
        // If no script tag found (weird for a singlefile build), append to end
        htmlContent += injectionScript;
    }

    // Write Output
    fs.writeFileSync(outputHtmlPath, htmlContent);
    console.log(`✅ Success! Student build generated at: ${outputHtmlPath}`);

} catch (error) {
    console.error('Error injecting data:', error);
    process.exit(1);
}
