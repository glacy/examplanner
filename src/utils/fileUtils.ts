/**
 * Generates a safe filename from a subtitle, prefix, and extension.
 * Handles accent normalization (NFD) and removes special characters.
 * 
 * @param subtitle The user-configured subtitle (e.g. "Física General I")
 * @param prefix The prefix for the file (e.g. "calendario", "estudiantes")
 * @param extension The file extension (e.g. "json", "html")
 * @returns A clean, URL-safe filename (e.g. "calendario-fisica-general-i-2023-10-27.json")
 */
export const getFilename = (subtitle: string, prefix: string, extension: string): string => {
    const date = new Date().toISOString().split('T')[0];
    const cleanSubtitle = subtitle
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove accents
        .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
        .replace(/^-+|-+$/g, ''); // Trim leading/trailing hyphens

    return cleanSubtitle
        ? `${prefix}-${cleanSubtitle}-${date}.${extension}`
        : `${prefix}-${date}.${extension}`;
};
