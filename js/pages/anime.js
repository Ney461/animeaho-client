/**
 * anime.js - Página de detalles del anime
 * 
 * Este módulo controla la carga y renderización de la página de detalles de un anime.
 * Obtiene el slug de la URL, carga la información completa del anime y muestra todos sus detalles.
 */

import { renderAnimeDetail } from '../components/AnimeDetail.js';
import { getAnimeBySlug } from '../services/animeService.js';
import { addListenerInput } from '../utils/search.js';
import { handleAnimeNotFound, handleLoadError, handleMissingSlug } from '../utils/errorHandler.js';

/**
 * Inicializa la página de detalles del anime.
 * Extrae el slug de la URL, carga los datos y renderiza la interfaz.
 *
 * @async
 * @returns {Promise<void>}
 */
async function initializeAnimeDetailPage() {
    try {
        const animeSlug = extractSlugFromURL();

        if (!animeSlug) {
            handleMissingSlug();
            return;
        }

        const animeData = await getAnimeBySlug(animeSlug);

        if (!animeData || !animeData.data) {
            handleAnimeNotFound();
            return;
        }
        
        updatePageTitle(animeData.data.title);
        renderAnimeDetail(animeData.data);
        addListenerInput();
        
    } catch (error) {
        console.error('Error al cargar la página de detalles del anime:', error);
        handleLoadError();
    }
}

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
function updatePageTitle(animeTitle) {
    document.title = `AnimeAho - ${animeTitle}`;
}

document.addEventListener('DOMContentLoaded', initializeAnimeDetailPage);