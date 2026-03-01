import { navigateToAnimeDetail } from './AnimeLink.js';

// Renderiza botones de navegación entre episodios
export function renderEpisodeNavigation(prevEpisodeSlug, nextEpisodeSlug, domElementCache) {
    domElementCache.navigationButtons.innerHTML = '';
    
    if (prevEpisodeSlug) {
        const prevButton = createNavigationButton('← Episodio anterior', prevEpisodeSlug, 'prev');
        domElementCache.navigationButtons.appendChild(prevButton);
    }

    if (nextEpisodeSlug) {
        const nextButton = createNavigationButton('Episodio siguiente →', nextEpisodeSlug, 'next');
        domElementCache.navigationButtons.appendChild(nextButton);
    }
}

// Crea un botón de navegación
function createNavigationButton(label, episodeSlug, direction) {
    const button = document.createElement('button');
    button.className = `main__nav-btn main__nav-btn--${direction}`;
    button.textContent = label;
    button.setAttribute('aria-label', `Ir a ${label.toLowerCase()}`);
    
    button.addEventListener('click', () => {
        navigateToEpisode(episodeSlug);
    });
    
    return button;
}

// Navega a un episodio
function navigateToEpisode(episodeSlug) {
    window.location.href = `/client/watch.html?slug=${episodeSlug}`;
}

// Botón para volver a la página del anime
export function renderReturnButton(animeSlug, domElementCache) {
    const button = document.createElement('button');
    button.className = 'main__back-btn';
    button.textContent = '← Volver al anime';
    button.setAttribute('aria-label', 'Volver a la página del anime');
    
    button.addEventListener('click', () => {
        navigateToAnimeDetail(animeSlug);
    });
    
    domElementCache.backButton.appendChild(button);
}