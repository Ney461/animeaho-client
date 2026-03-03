import { navigateToAnimeDetail } from './AnimeLink.js';
import { BASE_URL } from '../config/app.config.js';

/**
 * Renderiza los botones de navegación entre episodios (anterior y siguiente).
 * Solo renderiza el botón si existe el slug correspondiente.
 *
 * @param {string|null} prevEpisodeSlug - Slug del episodio anterior
 * @param {string|null} nextEpisodeSlug - Slug del episodio siguiente
 * @param {Object} domElementCache - Cache de referencias al DOM
 * @param {HTMLElement} domElementCache.navigationButtons - Contenedor de los botones
 */
export function renderEpisodeNavigation(prevEpisodeSlug, nextEpisodeSlug, domElementCache) {
    domElementCache.navigationButtons.innerHTML = '';
    
    if (prevEpisodeSlug) {
        const prevButton = createNavigationButton('Episodio anterior', prevEpisodeSlug, 'prev');
        domElementCache.navigationButtons.appendChild(prevButton);
    }

    if (nextEpisodeSlug) {
        const nextButton = createNavigationButton('Episodio siguiente', nextEpisodeSlug, 'next');
        domElementCache.navigationButtons.appendChild(nextButton);
    }
}

/**
 * Crea un botón de navegación con ícono SVG según la dirección.
 *
 * @param {string} label - Texto del botón (ej: "Episodio anterior")
 * @param {string} episodeSlug - Slug del episodio destino
 * @param {'prev'|'next'} direction - Dirección de navegación
 * @returns {HTMLButtonElement} Botón listo para insertar en el DOM
 */
function createNavigationButton(label, episodeSlug, direction) {
    const button = document.createElement('button');
    button.className = `main__nav-btn main__nav-btn--${direction}`;
    
    if (direction === 'prev') {
        button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M360-200 80-480l280-280 56 56-183 184h647v80H233l184 184-57 56Z"/></svg>
        ${label}
        `;
    } else {
        button.innerHTML = `
        ${label}
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="m600-200-57-56 184-184H80v-80h647L544-704l56-56 280 280-280 280Z"/></svg>
        `;
        }


    button.setAttribute('aria-label', `Ir a ${label.toLowerCase()}`);
    
    button.addEventListener('click', () => {
        navigateToEpisode(episodeSlug);
    });
    
    return button;
}

/**
 * Navega a la página de reproducción de un episodio.
 *
 * @param {string} episodeSlug - Slug del episodio destino
 */
function navigateToEpisode(episodeSlug) {
    window.location.href = `${BASE_URL}/client/watch.html?slug=${episodeSlug}`;
}

/**
 * Renderiza el botón para volver a la página del anime.
 *
 * @param {string} animeSlug - Slug del anime
 * @param {Object} domElementCache - Cache de referencias al DOM
 * @param {HTMLElement} domElementCache.backButton - Contenedor del botón
 */
export function renderReturnButton(animeSlug, domElementCache) {
    const button = document.createElement('button');
    button.className = 'main__back-btn';
    button.setAttribute('aria-label', 'Volver a la página del anime');

    button.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/></svg>
    Volver al anime
    `
    
    button.addEventListener('click', () => {
        navigateToAnimeDetail(animeSlug);
    });
    
    domElementCache.backButton.appendChild(button);
}