// Maneja la renderización y lógica de la lista de episodios

import { getEpisodeBySlug } from '../services/animeService.js';
import { navigateToEpisode } from '../utils/navigation.js';
import { extractSlugFromURL } from '../utils/urlParams.js';

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
 * El card permanece oculto hasta que la imagen cargue correctamente.
 * Si el episodio no existe, el card se elimina del DOM.
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
    container.style.display = 'none';

    const link = createEpisodeLink(episode);
    const image = createEpisodeImage(animeCoverUrl, episode, container, link);
    const episodeNumber = createEpisodeNumber(episode.number);

    link.appendChild(image);
    container.appendChild(link);
    container.appendChild(episodeNumber);

    return container;
}

/**
 * Crea el enlace del episodio con su listener de navegación.
 *
 * @param {Object} episode - Datos del episodio
 * @returns {HTMLAnchorElement} Enlace del episodio
 */
function createEpisodeLink(episode) {
    const link = document.createElement('a');
    link.href = '#';
    link.setAttribute('title', `Ver episodio ${episode.number}`);
    link.addEventListener('click', (event) => {
        event.preventDefault();
        navigateToEpisode(episode.slug);
    });
    return link;
}

/**
 * Crea la imagen del episodio con manejo de carga y error.
 * Si hay error, verifica si el episodio existe antes de mostrar el fallback.
 *
 * @param {string} animeCoverUrl - URL de la portada del anime
 * @param {Object} episode - Datos del episodio
 * @param {HTMLElement} container - Contenedor del card
 * @param {HTMLAnchorElement} link - Enlace del episodio
 * @returns {HTMLImageElement} Imagen del episodio
 */
function createEpisodeImage(animeCoverUrl, episode, container, link) {
    const image = document.createElement('img');
    image.className = 'main__anime-episode-cover';
    image.alt = `Portada del episodio ${episode.number}`;
    
    image.src = buildEpisodeCoverUrl(animeCoverUrl, episode.number);

    image.onload = () => {
        container.style.display = 'block';
    };

    image.onerror = async () => {
        const exists = await existEpisode(episode.number);
        if (!exists) {
            container.remove();
            return;
        }
        applyFallbackImage(image, link);
        container.style.display = 'block';
    };

    return image;
}

/**
 * Aplica la imagen y estilos de fallback cuando la portada no está disponible.
 *
 * @param {HTMLImageElement} image - Elemento imagen
 * @param {HTMLAnchorElement} link - Enlace contenedor de la imagen
 */
function applyFallbackImage(image, link) {
    image.src = 'assets/images/broken_image.png';
    image.style.width = '161px';
    image.style.height = '140px';
    image.style.objectFit = 'contain';
    link.style.cssText = 'display:flex; align-items:center; justify-content:center; background-color:#071e45;';
}

/**
 * Crea el elemento con el número del episodio.
 *
 * @param {number} number - Número del episodio
 * @returns {HTMLParagraphElement} Párrafo con el número del episodio
 */
function createEpisodeNumber(number) {
    const p = document.createElement('p');
    p.className = 'main__anime-episode-number';
    p.textContent = `Episodio ${number}`;
    return p;
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

async function existEpisode(number) {
    const slug = `${extractSlugFromURL()}-${number}`;

    const episodeData = await getEpisodeBySlug(slug);
    if (episodeData.error){
        return false;
    } else {
        return true;
    }

}