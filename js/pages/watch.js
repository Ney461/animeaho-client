// Página de visualización de episodios
// Carga datos del episodio y maneja navegación

import { renderVideoPlayer } from '../components/VideoPlayer.js';
import { getEpisodeBySlugNumber } from '../services/animeService.js';

// Inicializa la página: parsea URL, carga episodio y renderiza
async function initializeWatchPage() {
    try {
        const episodeSlug = extractSlugFromURL();
        if (!episodeSlug) {
            handleMissingSlug();
            return;
        }

        const parsedSlug = parseEpisodeSlug(episodeSlug);
        if (!parsedSlug) {
            handleMissingSlug();
            return;
        }

        const { animeSlug, episodeNumber } = parsedSlug;

        // Obtener episodio actual y anteriores/siguientes
        const [episodeData, previousEpisodeSlug, nextEpisodeSlug] = await Promise.all([
            getEpisodeBySlugNumber(episodeSlug),
            validateAndGetEpisodeSlug(animeSlug, episodeNumber - 1),
            validateAndGetEpisodeSlug(animeSlug, episodeNumber + 1)
        ]);

        if (!episodeData || !episodeData.data) {
            handleEpisodeNotFound();
            return;
        }
        
        updatePageTitle(episodeData.data.title);
        renderVideoPlayer(episodeData.data, previousEpisodeSlug, nextEpisodeSlug, animeSlug);
    } catch (error) {
        console.error('Error al inicializar la página de visualización:', error);
        handleLoadError();
    }
}

// Verifica si un episodio existe, retorna su slug o null
async function validateAndGetEpisodeSlug(animeSlug, episodeNumber) {
    if (episodeNumber < 1) return null;
    
    try {
        const response = await getEpisodeBySlugNumber(animeSlug, episodeNumber);
        if (!response || !response.success || !response.data) return null;
        return `${animeSlug}-${episodeNumber}`;
    } catch (error) {
        console.warn(`No se pudo validar episodio ${animeSlug}-${episodeNumber}:`, error);
        return null;
    }
}

// Parsea 'anime-slug-numero' -> {animeSlug, episodeNumber}
function parseEpisodeSlug(fullSlug) {
    const match = fullSlug.match(/^(.+)-(\d+)$/);
    if (!match) return null;
    
    return {
        animeSlug: match[1],
        episodeNumber: parseInt(match[2], 10)
    };
}

// Obtiene el parámetro 'slug' de la query string
function extractSlugFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('slug');
}

/**
 * Actualiza el título de la página del navegador.
 * 
 * @param {string} animeTitle - Título del anime a mostrar
 * @returns {void}
 */
function updatePageTitle(animeTitle) {
    document.title = `AnimeAho - ${animeTitle}`;
}

/**
 * Maneja el error cuando no se proporciona o se proporciona un slug inválido.
 * Muestra un mensaje de error al usuario.
 * 
 * @returns {void}
 */
function handleMissingSlug() {
    console.error('No se proporcionó un slug válido en la URL');
    const mainContent = document.querySelector('.main__inner');
    if (mainContent) {
        mainContent.innerHTML = '<p class="error-message">Error: Episodio no especificado. Por favor, regresa a la página anterior.</p>';
    }
}

/**
 * Maneja el error cuando el episodio solicitado no se encuentra.
 * Muestra un mensaje de error amigable al usuario.
 * 
 * @returns {void}
 */
function handleEpisodeNotFound() {
    console.error('El episodio solicitado no fue encontrado');
    const mainContent = document.querySelector('.main__inner');
    if (mainContent) {
        mainContent.innerHTML = '<p class="error-message">Error: No se encontró el episodio solicitado.</p>';
    }
}

/**
 * Maneja errores generales durante la carga de la página.
 * Presenta un mensaje de error genérico al usuario.
 * 
 * @returns {void}
 */
function handleLoadError() {
    const mainContent = document.querySelector('.main__inner');
    if (mainContent) {
        mainContent.innerHTML = '<p class="error-message">Error al cargar los datos del episodio. Por favor, intenta nuevamente.</p>';
    }
}

// Inicializar cuando el DOM está listo
document.addEventListener('DOMContentLoaded', initializeWatchPage);
