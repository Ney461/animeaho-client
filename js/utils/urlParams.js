/**
 * Extrae el parámetro slug de la URL actual (?slug=...).
 *
 * @returns {string|null} Slug del anime o null si no existe
 */
export function extractSlugFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('slug');
}

/**
 * Actualiza el título de la pestaña del navegador.
 *
 * @param {string} animeTitle - Título del anime
 */
export function updatePageTitle(animeTitle) {
    document.title = `AnimeAho - ${animeTitle}`;
}

/**
 * Extrae los parámetros query y page de la URL actual.
 *
 * @returns {{ query: string|null, page: number|1 }} Parámetros de la URL
 */
export function extractQueryFromURL() {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('query');
    const page = Number(params.get('page')) || 1;
    return { query, page };
}

/**
 * Extrae los parámetros de filtro de la URL actual.
 * Soporta múltiples valores por parámetro (arrays).
 *
 * @returns {{
 *   order: string[],
 *   genres: string[],
 *   statuses: number[],
 *   types: string[],
 *   page: number
 * }} Objeto con los filtros extraídos de la URL
 */
export function extractFilterFromURL() {
    const params = new URLSearchParams(window.location.search);
    const order = params.getAll('order[]');
    const genres = params.getAll('genres[]');
    
    const statusesRaw = params.getAll('statuses[]');
    const statuses = statusesRaw.length > 0
        ? statusesRaw.map(Number)
        : [1, 2, 3];

    const types = params.getAll('types[]');
    const page = Number(params.get('page')) || 1;
    return { order, genres, statuses, types, page };
}

