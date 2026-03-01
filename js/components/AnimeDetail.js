// Renderiza detalles completos del anime (portada, sinópsis, géneros, episodios, etc.)

import { renderEpisodesList, initializeEpisodeList, createEpisodeCard } from './EpisodeList.js';
import { extractSlugFromURL } from '../pages/anime.js';


let domElementCache = {};
let listEpisodes = [];
let animeCover = ''

// Cachea referencias al DOM
function cacheDOM() {
    domElementCache = {
        cover: document.getElementById('anime-cover'),
        title: document.getElementById('anime-title'),
        type: document.getElementById('anime-type'),
        description: document.getElementById('anime-description'),
        relations: document.getElementById('anime-relations'),
        genres: document.getElementById('anime-genres'),
        popularity: document.getElementById('anime-popularity'),
        status: document.getElementById('anime-status'),
        nextEpisode: document.getElementById('anime-next'),
        episodeList: document.getElementById('anime-list'),
        episodeSort: document.getElementById('episodes-sort')
    };
}

// Renderiza todos los detalles del anime
export function renderAnimeDetail(animeData) {
    listEpisodes = animeData.episode;

    animeCover = animeData.cover;

    cacheDOM();
    initializeEpisodeList('anime-list', 'episodes-sort');

    renderCoverImage(animeData.cover);
    renderMainTitle(animeData.title);
    renderTypeAndAlternativeTitles(animeData.type, animeData.alternativeTitles);
    renderSynopsis(animeData.synopsis);
    renderGenreLinks(animeData.genres);
    renderRelatedAnimes(animeData.related);
    renderRatingWithStars(animeData.rating);
    renderAnimeStatus(animeData.status);
    renderNextEpisodeInfo(animeData.nextAiringEpisode);
    renderEpisodesList(animeData.episode, animeData.cover);

    listenerSearchRefreshButton();

}

// Renderiza portada
function renderCoverImage(coverUrl) {
    const image = document.createElement('img');
    image.src = coverUrl;
    image.className = 'main__anime-cover-img';
    image.alt = 'Portada del anime';

    domElementCache.cover.appendChild(image);
}

// Renderiza título principal
function renderMainTitle(title) {
    const titleElement = document.createElement('p');
    titleElement.className = 'main__anime-title';
    titleElement.textContent = title;

    domElementCache.title.appendChild(titleElement);
}

// Renderiza tipo y títulos alternativos
function renderTypeAndAlternativeTitles(type, alternativeTitles) {
    const typeBadge = document.createElement('span');
    typeBadge.className = 'main__anime-badge';
    typeBadge.textContent = type;
    typeBadge.setAttribute('title', `Tipo: ${type}`);

    domElementCache.type.appendChild(typeBadge);

    alternativeTitles.forEach(title => {
        const titleElement = document.createElement('p');
        titleElement.className = 'main__anime-alias';
        titleElement.textContent = title;

        domElementCache.type.appendChild(titleElement);
    });
}

// Renderiza sinópsis
function renderSynopsis(synopsis) {
    const synopsisElement = document.createElement('p');
    synopsisElement.className = 'main__anime-synopsis';
    synopsisElement.textContent = synopsis;

    domElementCache.description.appendChild(synopsisElement);
}

// Renderiza géneros como enlaces
function renderGenreLinks(genreList) {
    genreList.forEach(genre => {
        const genreLink = document.createElement('a');
        genreLink.className = 'main__anime-genre';
        genreLink.textContent = genre.toUpperCase();
        genreLink.href = `browse.html?genre=${genre.toLowerCase()}`;
        genreLink.title = `Ver animes del género ${genre}`;

        domElementCache.genres.appendChild(genreLink);
    });
}

// Renderiza animes relacionados
function renderRelatedAnimes(relatedAnimesList) {
    relatedAnimesList.forEach(relatedAnime => {
        const link = document.createElement('a');
        link.className = 'main__anime-relation';
        link.textContent = `${relatedAnime.title} (${relatedAnime.relation})`;
        link.href = `anime.html?slug=${relatedAnime.slug}`;
        link.title = `Ver ${relatedAnime.title}`;

        domElementCache.relations.appendChild(link);
    });
}

// Renderiza calificación con estrellas
function renderRatingWithStars(rating) {
    const ratingNumber = parseFloat(rating) || 0;
    const container = document.createElement('div');
    container.className = 'main__anime-rating-container';

    const label = document.createElement('p');
    label.className = 'main__anime-rating-label';
    label.textContent = `Puntuación: ${rating}/5`;

    const starsContainer = document.createElement('div');
    starsContainer.className = 'main__anime-stars';

    for (let i = 1; i <= 5; i++) {
        const starSVG = createRatingStar(i, ratingNumber);
        starsContainer.appendChild(starSVG);
    }

    container.appendChild(label);
    container.appendChild(starsContainer);
    domElementCache.popularity.appendChild(container);
}

// Crea SVG de estrella con relleno parcial
function createRatingStar(position, ratingValue) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'main__anime-star');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('width', '24');
    svg.setAttribute('height', '24');
    svg.setAttribute('aria-label', `Estrella ${position}`);

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const linearGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    linearGradient.setAttribute('id', `star-gradient-${position}`);
    linearGradient.setAttribute('x1', '0%');
    linearGradient.setAttribute('x2', '100%');

    const colorStop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    colorStop1.setAttribute('offset', '0%');
    colorStop1.setAttribute('stop-color', '#3392ff');

    const colorStop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    colorStop2.setAttribute('offset', '100%');
    colorStop2.setAttribute('stop-color', '#3392ff');

    linearGradient.appendChild(colorStop1);
    linearGradient.appendChild(colorStop2);
    defs.appendChild(linearGradient);
    svg.appendChild(defs);

    const star = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    star.setAttribute('points', '12,2 15.09,10.26 23.36,10.26 17.54,15.73 19.63,24 12,18.54 4.37,24 6.46,15.73 0.64,10.26 8.91,10.26');

    const fillPercentage = calculateStarFillPercentage(position, ratingValue);

    if (fillPercentage === 100) {
        star.setAttribute('fill', '#3392ff');
    } else if (fillPercentage === 0) {
        star.setAttribute('fill', 'rgba(255, 255, 255, 0.2)');
        star.setAttribute('stroke', '#7a9cc4');
        star.setAttribute('stroke-width', '0.5');
    } else {
        star.setAttribute('fill', `url(#star-gradient-${position})`);

        const clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
        clipPath.setAttribute('id', `clip-${position}`);

        const clipRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        clipRect.setAttribute('x', '0');
        clipRect.setAttribute('y', '0');
        clipRect.setAttribute('width', (fillPercentage / 100) * 24);
        clipRect.setAttribute('height', '24');

        clipPath.appendChild(clipRect);
        defs.appendChild(clipPath);

        star.setAttribute('fill', '#3392ff');
        star.setAttribute('clip-path', `url(#clip-${position})`);
        star.setAttribute('stroke', '#7a9cc4');
        star.setAttribute('stroke-width', '0.5');
    }

    svg.appendChild(star);
    return svg;
}

/**
 * Calcula el porcentaje de relleno de una estrella basado en el rating.
 * Si el rating es 4.5, la 5ª estrella se rellenará al 50%.
 * 
 * @param {number} starPosition - Posición de la estrella (1-5)
 * @param {number} ratingValue - Puntuación total del anime
 * @returns {number} Porcentaje de relleno (0-100)
 */
function calculateStarFillPercentage(starPosition, ratingValue) {
    const difference = ratingValue - (starPosition - 1);

    if (difference >= 1) {
        return 100;
    } else if (difference > 0) {
        return Math.round(difference * 100);
    } else {
        return 0;
    }
}

/**
 * Renderiza el estado del anime con un icono descriptivo.
 * Soporta estados como "Airing", "Completed" y "Upcoming".
 * 
 * @param {string} animeStatus - Estado del anime (ej: "Airing", "Completed")
 * @returns {void}
 */
function renderAnimeStatus(animeStatus) {
    const container = document.createElement('div');
    container.className = 'main__anime-status';

    const statusIcon = createStatusIcon(animeStatus);
    container.appendChild(statusIcon);

    const statusText = document.createElement('span');
    statusText.textContent = animeStatus;

    container.appendChild(statusText);
    domElementCache.status.appendChild(container);
}

/**
 * Crea un SVG de icono que representa el estado del anime.
 * Diferentes estados tienen diferentes iconos visuales.
 * 
 * @param {string} statusText - Texto del estado
 * @returns {SVGSVGElement} Elemento SVG del icono
 */
function createStatusIcon(statusText) {
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('width', '18');
    icon.setAttribute('height', '18');
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.setAttribute('fill', 'none');
    icon.setAttribute('stroke', 'currentColor');
    icon.setAttribute('stroke-width', '2.5');
    icon.setAttribute('stroke-linecap', 'round');
    icon.setAttribute('stroke-linejoin', 'round');
    icon.setAttribute('class', 'main__anime-status-icon');
    icon.setAttribute('aria-label', `Estado: ${statusText}`);

    const statusLower = statusText.trim().toLowerCase();

    if (statusLower.includes('airing') || statusLower === 'en emisión') {
        // Icono: Play button para "en emisión"
        const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        polygon.setAttribute('points', '5 3 19 12 5 21 5 3');
        polygon.setAttribute('fill', 'currentColor');
        icon.appendChild(polygon);
    } else if (statusLower.includes('completed') || statusLower === 'finalizado') {
        // Icono: Checkmark para "completado"
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M20 6L9 17l-5-5');
        icon.appendChild(path);
    } else if (statusLower.includes('upcoming') || statusLower === 'próximamente') {
        // Icono: Forward arrow para "próximamente"
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M5 12h14M12 5l7 7-7 7');
        icon.appendChild(path);
    } else {
        // Icono genérico: Círculo
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', '12');
        circle.setAttribute('cy', '12');
        circle.setAttribute('r', '10');
        icon.appendChild(circle);
    }

    return icon;
}

// Renderiza info del próximo episodio
function renderNextEpisodeInfo(nextAiringDate) {
    if (!nextAiringDate) {
        domElementCache.nextEpisode.style.display = 'none';
        return;
    }

    domElementCache.nextEpisode.style.display = 'block';

    const container = document.createElement('div');
    container.className = 'main__anime-next';

    const calendarIcon = createCalendarIcon();
    container.appendChild(calendarIcon);

    const text = document.createElement('span');
    text.textContent = `Próximo Episodio: ${nextAiringDate}`;

    container.appendChild(text);
    domElementCache.nextEpisode.appendChild(container);
}

// Crea icono SVG de calendario
function createCalendarIcon() {
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('width', '18');
    icon.setAttribute('height', '18');
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.setAttribute('fill', 'none');
    icon.setAttribute('stroke', 'currentColor');
    icon.setAttribute('stroke-width', '2');
    icon.setAttribute('stroke-linecap', 'round');
    icon.setAttribute('stroke-linejoin', 'round');
    icon.setAttribute('class', 'main__anime-next-icon');
    icon.setAttribute('aria-label', 'Próximo episodio');

    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', '3');
    rect.setAttribute('y', '4');
    rect.setAttribute('width', '18');
    rect.setAttribute('height', '18');
    rect.setAttribute('rx', '2');

    const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    line1.setAttribute('d', 'M16 2v4M8 2v4');

    const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    line2.setAttribute('d', 'M3 10h18');

    icon.appendChild(rect);
    icon.appendChild(line1);
    icon.appendChild(line2);

    return icon;
}

function listenerSearchRefreshButton() {
    const search = document.querySelector('.main__episodes-search-btn');
    const refresh = document.querySelector('.main__episodes-refresh-btn')

    search.addEventListener('click', () => searchEpisode())
    refresh.addEventListener('click', () => refreshEpisodesList())
}

function searchEpisode() {
    const input = document.querySelector('.main__episodes-search-input');
    const value = input.value;

    if (!(value === '')) {
        const episodeListContainer = document.getElementById('anime-list');
        episodeListContainer.innerHTML = '';
        const found = listEpisodes.some(episode => {
            if (episode.number === parseInt(value)) {
                const episodeCard = createEpisodeCard(episode, animeCover)
                episodeListContainer.appendChild(episodeCard);
                return true;
            } else {
                return false;
            }
        })
        if (!found) handleEpisodeNotFound()


    } else {
        renderEpisodesList(listEpisodes, animeCover);
    }
}

function refreshEpisodesList() {
    renderEpisodesList(listEpisodes, animeCover)
    const input = document.querySelector('.main__episodes-search-input');
    input.value = ''
}

function handleEpisodeNotFound() {
    console.error('El episodio del anime solicitado no fue encontrado');
    const mainAnimeList = document.querySelector('.main__anime-list');
    if (mainAnimeList) {
        mainAnimeList.innerHTML = '<p class="error-message">Error: No se encontró el episodio del anime solicitado.</p>';
    }
}