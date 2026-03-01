// Maneja la renderización y lógica de la lista de episodios

import { navigateToEpisode } from './AnimeCard.js';

const EPISODE_COVER_BASE_URL = 'https://cdn.animeflv.net/screenshots';

let currentEpisodesList = [];
let currentEpisodeSortOrder = 'desc';
let episodeListContainer = null;
let episodeSortSelector = null;

// Inicializa referencias al DOM
export function initializeEpisodeList(listContainerId, sortSelectorId) {
    episodeListContainer = document.getElementById(listContainerId);
    episodeSortSelector = document.getElementById(sortSelectorId);
}

// Renderiza la lista de episodios
export function renderEpisodesList(episodeList, animeCoverUrl) {
    currentEpisodesList = episodeList;
    currentEpisodeSortOrder = 'desc';

    const sortedEpisodes = getSortedEpisodes();
    renderEpisodes(sortedEpisodes, animeCoverUrl);
    attachEpisodeSortListener(animeCoverUrl);
}

// Obtiene episodios ordenados (asc o desc)
function getSortedEpisodes() {
    const sorted = [...currentEpisodesList];

    if (currentEpisodeSortOrder === 'asc') {
        sorted.sort((a, b) => a.number - b.number);
    } else {
        sorted.sort((a, b) => b.number - a.number);
    }

    return sorted;
}

// Renderiza los episodios en el DOM
function renderEpisodes(episodesToRender, animeCoverUrl) {
    if (!episodeListContainer) return;
    
    episodeListContainer.innerHTML = '';

    episodesToRender.forEach(episode => {
        const episodeCard = createEpisodeCard(episode, animeCoverUrl);
        episodeListContainer.appendChild(episodeCard);
    });
}

// Crea un card de episodio
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
        container.style.display = 'none';
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

// Construye URL de portada del episodio
function buildEpisodeCoverUrl(animeCoverUrl, episodeNumber) {
    const animeId = animeCoverUrl.split('/').pop().replace('.jpg', '');
    return `${EPISODE_COVER_BASE_URL}/${animeId}/${episodeNumber}/th_3.jpg`;
}

// Listener del selector de orden
function attachEpisodeSortListener(animeCoverUrl) {
    if (!episodeSortSelector) return;

    episodeSortSelector.addEventListener('change', (event) => {
        currentEpisodeSortOrder = event.target.value;
        const sortedEpisodes = getSortedEpisodes();
        renderEpisodes(sortedEpisodes, animeCoverUrl);
    });
}
