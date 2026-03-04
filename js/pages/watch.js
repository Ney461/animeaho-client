// Página de visualización de episodios
// Carga datos del episodio y maneja navegación

import { renderVideoPlayer } from '../components/VideoPlayer.js';
import { getEpisodeBySlugNumber } from '../services/animeService.js';
import { addListenerInput } from '../utils/search.js';
import { handleMissingSlug, handleEpisodeNotFound, handleLoadError } from '../utils/errorHandler.js'
import { validateAndGetEpisodeSlug } from '../utils/validator.js'
import { updatePageTitle, extractSlugFromURL } from '../utils/urlParams.js';

/**
 * Inicializa la página de visualización: extrae el slug, carga el episodio
 * y renderiza el reproductor con navegación.
 *
 * @async
 * @returns {Promise<void>}
 */
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
        addListenerInput();
    } catch (error) {
        console.error('Error al inicializar la página de visualización:', error);
        handleLoadError();
    }
}



/**
 * Parsea el slug completo del episodio en slug del anime y número de episodio.
 * Formato esperado: "anime-slug-numero" → { animeSlug, episodeNumber }
 *
 * @param {string} fullSlug - Slug completo del episodio
 * @returns {{ animeSlug: string, episodeNumber: number }|null} Objeto parseado o null si el formato es inválido
 */
function parseEpisodeSlug(fullSlug) {
    const match = fullSlug.match(/^(.+)-(\d+)$/);
    if (!match) return null;
    
    return {
        animeSlug: match[1],
        episodeNumber: parseInt(match[2], 10)
    };
}

// Inicializar cuando el DOM está listo
document.addEventListener('DOMContentLoaded', initializeWatchPage);
