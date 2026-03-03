// Maneja la renderización y lógica de la lista de episodios

import { navigateToEpisode } from './AnimeCard.js';

const EPISODE_COVER_BASE_URL = 'https://cdn.animeflv.net/screenshots';

let currentEpisodesList = [];
let currentEpisodeSortOrder = 'desc';
let episodeListContainer = null;
let episodeSortSelector = null;

/**
 * Inicializa las referencias al DOM para la lista de episodios.
 *
 * @param {string} listContainerId - ID del contenedor de la lista
 * @param {string} sortSelectorId - ID del selector de orden
 */
export function initializeEpisodeList(listContainerId, sortSelectorId) {
    episodeListContainer = document.getElementById(listContainerId);
    episodeSortSelector = document.getElementById(sortSelectorId);
}

/**
 * Renderiza la lista completa de episodios y activa el listener de ordenamiento.
 *
 * @param {Object[]} episodeList - Lista de episodios
 * @param {string} animeCoverUrl - URL de la portada del anime
 */
export function renderEpisodesList(episodeList, animeCoverUrl) {
    currentEpisodesList = episodeList;
    currentEpisodeSortOrder = 'desc';

    const sortedEpisodes = getSortedEpisodes();
    renderEpisodes(sortedEpisodes, animeCoverUrl);
    attachEpisodeSortListener(animeCoverUrl);
}

/**
 * Retorna los episodios ordenados según `currentEpisodeSortOrder`.
 *
 * @returns {Object[]} Lista de episodios ordenada
 */
function getSortedEpisodes() {
    const sorted = [...currentEpisodesList];

    if (currentEpisodeSortOrder === 'asc') {
        sorted.sort((a, b) => a.number - b.number);
    } else {
        sorted.sort((a, b) => b.number - a.number);
    }

    return sorted;
}

/**
 * Renderiza los episodios en el contenedor del DOM.
 *
 * @param {Object[]} episodesToRender - Episodios a renderizar
 * @param {string} animeCoverUrl - URL de la portada del anime
 */
function renderEpisodes(episodesToRender, animeCoverUrl) {
    if (!episodeListContainer) return;
    
    episodeListContainer.innerHTML = '';

    episodesToRender.forEach(episode => {
        const episodeCard = createEpisodeCard(episode, animeCoverUrl);
        episodeListContainer.appendChild(episodeCard);
    });
}

/**
 * Crea una tarjeta de episodio con portada y número.
 *
 * @param {Object} episode - Datos del episodio
 * @param {number} episode.number - Número del episodio
 * @param {string} episode.slug - Slug del episodio
 * @param {string} animeCoverUrl - URL de la portada del anime
 * @returns {HTMLElement} Tarjeta de episodio lista para insertar en el DOM
 */
export function createEpisodeCard(episode, animeCoverUrl) {
    const container = document.createElement('div');
    container.className = 'main__anime-episode';

    const link = document.createElement('a');
    link.href = '#';
    link.setAttribute('title', `Ver episodio ${episode.number}`);

    const image = document.createElement('img');
    image.className = 'main__anime-episode-cover';
    image.src = buildEpisodeCoverUrl(animeCoverUrl, episode.number);
    image.alt = `Portada del episodio ${episode.number}`;
    image.loading = 'lazy';

    image.onerror = () => {
        image.src = 'assets/images/broken_image.png';
        image.style.width = '161px';
        image.style.height = '140px';
        image.style.objectFit = 'contain';
        link.style.display = 'flex';
        link.style.alignItems = 'center';
        link.style.justifyContent = 'center';
        link.style.backgroundColor = '#071e45';
    };

    link.appendChild(image);

    link.addEventListener('click', (event) => {
        event.preventDefault();
        navigateToEpisode(episode.slug);
    });

    const episodeNumber = document.createElement('p');
    episodeNumber.className = 'main__anime-episode-number';
    episodeNumber.textContent = `Episodio ${episode.number}`;

    container.appendChild(link);
    container.appendChild(episodeNumber);

    return container;
}

/**
 * Construye la URL de la portada de un episodio a partir de la portada del anime.
 *
 * @param {string} animeCoverUrl - URL de la portada del anime
 * @param {number} episodeNumber - Número del episodio
 * @returns {string} URL de la portada del episodio
 */
function buildEpisodeCoverUrl(animeCoverUrl, episodeNumber) {
    const animeId = animeCoverUrl.split('/').pop().replace('.jpg', '');
    return `${EPISODE_COVER_BASE_URL}/${animeId}/${episodeNumber}/th_3.jpg`;
}

/**
 * Inicializa el listener del selector de orden de episodios.
 *
 * @param {string} animeCoverUrl - URL de la portada del anime
 */
function attachEpisodeSortListener(animeCoverUrl) {
    if (!episodeSortSelector) return;

    episodeSortSelector.addEventListener('change', (event) => {
        currentEpisodeSortOrder = event.target.value;
        const sortedEpisodes = getSortedEpisodes();
        renderEpisodes(sortedEpisodes, animeCoverUrl);
    });
}
