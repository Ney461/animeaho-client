// Página principal - carga animes en emisión, últimos episodios y últimos animes

import {
    getAiringAnimes,
    getLatestEpisodes,
    searchAnimeFilter,
} from '../services/animeService.js';
import { renderAnimeCard } from '../components/AnimeCard.js';
import { createAnimeLinks } from '../components/AnimeLink.js';
import { addListenerInput } from '../utils/search.js';
import { displayErrorMessage } from '../utils/errorHandler.js';

/**
 * Inicializa la página principal cargando todas las secciones.
 *
 * @async
 * @returns {Promise<void>}
 */
async function initializeHomePage() {
    try {
        await loadAiringAnimes();
        await loadLatestEpisodes();
        await loadLatestAnimes();
        addListenerInput();

    } catch (error) {
        console.error('Error al inicializar la página principal:', error);
        displayErrorMessage('Error al cargar el contenido. Intenta recargar la página.');
    }
}

/**
 * Carga y renderiza los animes actualmente en emisión en la sección lateral.
 *
 * @async
 * @returns {Promise<void>}
 */
async function loadAiringAnimes() {
    try {
        const response = await getAiringAnimes();
        const section = document.getElementById('airing-animes');

        if (!section) {
            console.warn('Sección "airing-animes" no encontrada en el DOM');
            return;
        }

        if (!response.data || response.data.length === 0) {
            section.innerHTML = '<p>No hay animes en emisión en este momento.</p>';
            return;
        }

        response.data.forEach(anime => {
            const animeLink = createAnimeLinks(anime);
            section.appendChild(animeLink);
        });
    } catch (error) {
        console.error('Error al cargar animes en emisión:', error);
    }
}

/**
 * Carga y renderiza los últimos episodios lanzados como tarjetas.
 *
 * @async
 * @returns {Promise<void>}
 */
async function loadLatestEpisodes() {
    try {
        const response = await getLatestEpisodes();
        const section = document.getElementById('latest-episodes');

        if (!section) {
            console.warn('Sección "latest-episodes" no encontrada en el DOM');
            return;
        }

        if (!response.data || response.data.length === 0) {
            section.innerHTML = '<p>No hay episodios recientes disponibles.</p>';
            return;
        }

        response.data.forEach(episode => {
            const episodeCard = renderAnimeCard(
                episode,
                `Episodio: ${episode.number}`,
                false
            );
            episodeCard.classList.add('anime-card--episode');
            section.appendChild(episodeCard);
        });
    } catch (error) {
        console.error('Error al cargar últimos episodios:', error);
    }
}

/**
 * Carga y renderiza los últimos animes agregados al catálogo.
 * Usa filtros predefinidos para obtener animes de todos los tipos y estados.
 *
 * @async
 * @returns {Promise<void>}
 */
async function loadLatestAnimes() {
    try {
        const filterOptions = {
            types: ['tv', 'movie', 'special', 'ova'],
            order: 'added',
            genres: [],
            statuses: [1, 2, 3]
        };

        const response = await searchAnimeFilter(filterOptions);
        const section = document.getElementById('latest-animes');

        if (!section) {
            console.warn('Sección "latest-animes" no encontrada en el DOM');
            return;
        }

        if (!response.data || !response.data.media || response.data.media.length === 0) {
            section.innerHTML = '<p>No hay animes disponibles en este momento.</p>';
            return;
        }

        response.data.media.forEach(anime => {
            const animeCard = renderAnimeCard(
                anime,
                anime.type,
                true
            );
            section.appendChild(animeCard);
        });
    } catch (error) {
        displayErrorMessage(`Error al cargar últimos animes: ${error}`)
    }
}

// Inicializar cuando el DOM está completamente cargado
document.addEventListener('DOMContentLoaded', initializeHomePage);


