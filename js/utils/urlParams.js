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
 * Extrae el parámetro query de la URL actual (?query=...).
 *
 * @returns {string|null} Query del anime o null si no existe
 */
export function extractQueryFromURL() {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('query');
    const page = params.get('page');
    return { query: query, page: page };
}