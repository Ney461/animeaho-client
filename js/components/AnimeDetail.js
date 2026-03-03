// Renderiza detalles completos del anime (portada, sinópsis, géneros, episodios, etc.)

import { renderEpisodesList, initializeEpisodeList, createEpisodeCard } from './EpisodeList.js';

let domElementCache = {};
let listEpisodes = [];
let animeCover = ''

/**
 * Cachea referencias a los elementos del DOM necesarios para renderizar el detalle del anime.
 * Almacena los elementos en `domElementCache` para evitar múltiples consultas al DOM.
 */
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

/**
 * Renderiza todos los detalles del anime en el DOM.
 * Orquesta el renderizado de portada, título, sinopsis, géneros, relaciones,
 * rating, estado, próximo episodio y lista de episodios.
 *
 * @param {Object} animeData - Datos completos del anime
 * @param {string} animeData.cover - URL de la portada
 * @param {string} animeData.title - Título principal
 * @param {string} animeData.type - Tipo (TV, Movie, OVA, etc.)
 * @param {string[]} animeData.alternativeTitles - Títulos alternativos
 * @param {string} animeData.synopsis - Sinopsis
 * @param {string[]} animeData.genres - Lista de géneros
 * @param {Object[]} animeData.related - Animes relacionados
 * @param {string} animeData.rating - Puntuación (ej: "4.5")
 * @param {string} animeData.status - Estado del anime
 * @param {string|null} animeData.nextAiringEpisode - Fecha del próximo episodio
 * @param {Object[]} animeData.episode - Lista de episodios
 */
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

/**
 * Renderiza la portada del anime.
 *
 * @param {string} coverUrl - URL de la imagen de portada
 */
function renderCoverImage(coverUrl) {
    const image = document.createElement('img');
    image.src = coverUrl;
    image.className = 'main__anime-cover-img';
    image.alt = 'Portada del anime';

    domElementCache.cover.appendChild(image);
}

/**
 * Renderiza el título principal del anime.
 *
 * @param {string} title - Título del anime
 */
function renderMainTitle(title) {
    const titleElement = document.createElement('p');
    titleElement.className = 'main__anime-title';
    titleElement.textContent = title;

    domElementCache.title.appendChild(titleElement);
}

/**
 * Renderiza el badge de tipo y los títulos alternativos del anime.
 *
 * @param {string} type - Tipo del anime (TV, Movie, OVA, etc.)
 * @param {string[]} alternativeTitles - Lista de títulos alternativos
 */
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

/**
 * Renderiza la sinopsis del anime.
 *
 * @param {string} synopsis - Texto de la sinopsis
 */
function renderSynopsis(synopsis) {
    const synopsisElement = document.createElement('p');
    synopsisElement.className = 'main__anime-synopsis';
    synopsisElement.textContent = synopsis;

    domElementCache.description.appendChild(synopsisElement);
}

/**
 * Renderiza los géneros del anime como enlaces navegables.
 *
 * @param {string[]} genreList - Lista de géneros
 */
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

/**
 * Renderiza los animes relacionados como enlaces.
 *
 * @param {Object[]} relatedAnimesList - Lista de animes relacionados
 * @param {string} relatedAnimesList[].title - Título del anime relacionado
 * @param {string} relatedAnimesList[].relation - Tipo de relación (Precuela, Secuela, etc.)
 * @param {string} relatedAnimesList[].slug - Slug del anime relacionado
 */
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

/**
 * Renderiza la calificación del anime con estrellas SVG de relleno parcial.
 *
 * @param {string|number} rating - Puntuación del anime (0-5)
 */
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

/**
 * Crea un elemento SVG de estrella con relleno parcial según el rating.
 *
 * @param {number} position - Posición de la estrella (1-5)
 * @param {number} ratingValue - Puntuación total del anime
 * @returns {SVGSVGElement} Elemento SVG de la estrella
 */
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
 * Ejemplo: rating 4.5 → estrella 5 se rellena al 50%.
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
 * Renderiza el estado del anime con un ícono SVG descriptivo.
 * Soporta: "Airing", "Completed" y "Upcoming".
 *
 * @param {string} animeStatus - Estado del anime
 */
function renderAnimeStatus(animeStatus) {
    const container = document.createElement('div');
    container.className = 'main__anime-status';

    const {statusIcon, statusText} = createStatusIcon(animeStatus);
    container.appendChild(statusIcon);
    container.appendChild(statusText);

    domElementCache.status.appendChild(container);
}


/**
 * Crea el ícono SVG y el texto correspondiente al estado del anime.
 *
 * @param {string} statusText - Texto del estado (ej: "Airing", "Completed")
 * @returns {{ statusIcon: HTMLElement, statusText: HTMLElement }}
 */
function createStatusIcon(statusText) {
    const statusSpan = document.createElement('span');
    const status = document.createElement('span');

    statusSpan.setAttribute('class', 'main__anime-status-icon');
    statusSpan.setAttribute('aria-label', `Estado: ${statusText}`);

    const statusLower = statusText.trim().toLowerCase();

    if (statusLower.includes('airing') || statusLower === 'en emisión' || statusLower === 'en emision') {
        // Icono: Play button para "en emisión"
        statusSpan.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#2D8AF9"><path d="M204-150q-57-55-90.5-129.5T80-440q0-83 31.5-156T197-723q54-54 127-85.5T480-840q83 0 156 31.5T763-723q54 54 85.5 127T880-440q0 86-33.5 161T756-150l-56-56q46-44 73-104.5T800-440q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 69 27 129t74 104l-57 57Zm113-113q-35-33-56-78.5T240-440q0-100 70-170t170-70q100 0 170 70t70 170q0 53-21 99t-56 78l-57-57q25-23 39.5-54t14.5-66q0-66-47-113t-113-47q-66 0-113 47t-47 113q0 36 14.5 66.5T374-320l-57 57Zm106.5-120.5Q400-407 400-440t23.5-56.5Q447-520 480-520t56.5 23.5Q560-473 560-440t-23.5 56.5Q513-360 480-360t-56.5-23.5Z"/></svg>
        `
        status.className = 'status--airing'
        status.textContent = 'En Emisión';
        
    } else if (statusLower.includes('completed') || statusLower === 'finalizado') {
        // Icono: Checkmark para "completado"
        statusSpan.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#22C55E"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q65 0 123 19t107 53l-58 59q-38-24-81-37.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q133 0 226.5-93.5T800-480q0-18-2-36t-6-35l65-65q11 32 17 66t6 70q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-56-216L254-466l56-56 114 114 400-401 56 56-456 457Z"/></svg>
        `
        status.textContent = 'Finalizado';
        status.className = 'status--completed'
    } else if (statusLower.includes('upcoming') || statusLower === 'proximamente' || statusLower === 'próximamente') {
        // Icono: Forward arrow para "próximamente"
        statusSpan.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#F59E0B"><path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z"/></svg>
        `
        status.textContent = 'Próximamente';
        status.className = 'status--upcoming'
    } else {
        
    }

    return { statusIcon: statusSpan, statusText: status };
}

/**
 * Renderiza la información del próximo episodio.
 * Si no hay fecha, oculta el contenedor.
 *
 * @param {string|null} nextAiringDate - Fecha del próximo episodio o null
 */
function renderNextEpisodeInfo(nextAiringDate) {
    if (!nextAiringDate) {
        domElementCache.nextEpisode.style.display = 'none';
        return;
    }

    domElementCache.nextEpisode.style.display = 'block';

    const container = document.createElement('div');
    container.className = 'main__anime-next';

    const calendarIcon = document.createElement('span');
    calendarIcon.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#3392FF"><path d="M509-269q-29-29-29-71t29-71q29-29 71-29t71 29q29 29 29 71t-29 71q-29 29-71 29t-71-29ZM200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z"/></svg>
    `

    container.appendChild(calendarIcon);

    const text = document.createElement('span');
    text.textContent = `Próximo Episodio: ${nextAiringDate}`;

    container.appendChild(text);
    domElementCache.nextEpisode.appendChild(container);
}

/**
 * Inicializa los listeners de los botones de búsqueda y refresco de episodios.
 */
function listenerSearchRefreshButton() {
    const search = document.querySelector('.main__episodes-search-btn');
    const refresh = document.querySelector('.main__episodes-refresh-btn')

    search.addEventListener('click', () => searchEpisode())
    refresh.addEventListener('click', () => refreshEpisodesList())
}

/**
 * Busca un episodio por número y lo renderiza.
 * Si el input está vacío, restaura la lista completa.
 */
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

/**
 * Restaura la lista completa de episodios y limpia el input de búsqueda.
 */
function refreshEpisodesList() {
    renderEpisodesList(listEpisodes, animeCover)
    const input = document.querySelector('.main__episodes-search-input');
    input.value = ''
}

/**
 * Muestra un mensaje de error cuando el episodio buscado no existe.
 */
function handleEpisodeNotFound() {
    console.error('El episodio del anime solicitado no fue encontrado');
    const mainAnimeList = document.querySelector('.main__anime-list');
    if (mainAnimeList) {
        mainAnimeList.innerHTML = '<p class="error-message">Error: No se encontró el episodio del anime solicitado.</p>';
    }
}