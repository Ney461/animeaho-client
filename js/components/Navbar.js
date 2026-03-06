import { navigateToAnimeDetail, navigateToAnimeSearchList, navigateToEpisode } from '../utils/navigation.js';

const NAVIGATION_ICONS = {
    prev: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M360-200 80-480l280-280 56 56-183 184h647v80H233l184 184-57 56Z"/></svg>`,
    next: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="m600-200-57-56 184-184H80v-80h647L544-704l56-56 280 280-280 280Z"/></svg>`,
    home: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/></svg>`
};

/**
 * Renderiza los botones de navegación entre episodios.
 * @param {string|null} prevSlug - Slug del episodio anterior
 * @param {string|null} nextSlug - Slug del episodio siguiente
 * @param {{ navigationButtons: HTMLElement }} dom - Cache del DOM
 */
export function renderEpisodeNavigation(prevSlug, nextSlug, dom) {
    dom.navigationButtons.innerHTML = '';

    if (prevSlug) dom.navigationButtons.appendChild(createEpisodeBtn('Episodio anterior', prevSlug, 'prev'));
    if (nextSlug) dom.navigationButtons.appendChild(createEpisodeBtn('Episodio siguiente', nextSlug, 'next'));
}

/**
 * Renderiza el botón para volver a la página del anime.
 * @param {string} animeSlug - Slug del anime
 * @param {{ backButton: HTMLElement }} dom - Cache del DOM
 */
export function renderReturnButton(animeSlug, dom) {
    const button = document.createElement('button');
    button.className = 'main__back-btn';
    button.setAttribute('aria-label', 'Volver a la página del anime');
    button.innerHTML = `${NAVIGATION_ICONS.home} Volver al anime`;
    button.addEventListener('click', () => navigateToAnimeDetail(animeSlug));

    dom.backButton.appendChild(button);
}

/**
 * Renderiza la paginación completa en el contenedor dado.
 * @param {number} currentPage - Página actual
 * @param {number} totalPages - Total de páginas
 * @param {string} query - Término de búsqueda
 * @param {HTMLElement} container - Contenedor donde se insertan los botones
 */
export function renderPagination(currentPage, totalPages, query, container) {
    const fragment = document.createDocumentFragment();

    for (const page of getPages(currentPage, totalPages)) {
        fragment.appendChild(createPageBtn(query, page, page, currentPage == page));
    }

    container.appendChild(fragment);
}

/**
 * Crea un botón de navegación de episodio con ícono según la dirección.
 * @param {string} label - Texto del botón
 * @param {string} episodeSlug - Slug del episodio destino
 * @param {'prev'|'next'} direction - Dirección de navegación
 * @returns {HTMLButtonElement}
 */
function createEpisodeBtn(label, episodeSlug, direction) {
    const button = document.createElement('button');
    button.className = `main__nav-btn main__nav-btn--${direction}`;
    button.setAttribute('aria-label', `Ir a ${label.toLowerCase()}`);
    button.innerHTML = direction === 'prev'
        ? `${NAVIGATION_ICONS.prev} ${label}`
        : `${label} ${NAVIGATION_ICONS.next}`;

    button.addEventListener('click', () => navigateToEpisode(episodeSlug));
    return button;
}

/**
 * Crea un botón individual de paginación.
 * @param {string} query - Término de búsqueda
 * @param {number|string} page - Número de página o '...'
 * @param {number|string} content - Contenido visible del botón
 * @param {boolean} isCurrentPage - Si es la página activa
 * @returns {HTMLButtonElement}
 */
function createPageBtn(query, page, content, isCurrentPage) {
    const button = document.createElement('button');
    button.textContent = `${content}`;
    button.className = isCurrentPage ? 'main__pagination-btn--active' : 'main__pagination-btn';

    if (page === '...') {
        button.classList.add('main__pagination-btn--disabled');
        button.disabled = true;
    }

    button.addEventListener('click', () => navigateToAnimeSearchList(page, query));
    return button;
}

/**
 * Calcula qué páginas mostrar en la paginación con truncado inteligente.
 * @param {number} current - Página actual
 * @param {number} total - Total de páginas
 * @returns {(number|string)[]} Array de páginas y separadores '...'
 */
function getPages(current, total) {
    if (total <= 9) return Array.from({ length: total }, (_, i) => i + 1);

    if (current <= 5)        return [1, 2, 3, 4, 5, 6, 7, 8, 9, '...', total];
    if (current >= total - 4) return [1, '...', total-8, total-7, total-6, total-5, total-4, total-3, total-2, total-1, total];

    return [1, '...', current-4, current-3, current-2, current-1, current, current+1, current+2, current+3, current+4, '...', total];
}