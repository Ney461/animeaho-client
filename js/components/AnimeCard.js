// Renderiza tarjetas de anime en forma de grid
// Cada tarjeta tiene portada, título y badge opcional

import { navigateToAnimeDetail } from './AnimeLink.js';

// Crea una tarjeta de anime
// anime: {title, cover, slug}
// badgeText: texto opcional del badge
// isDetailView: true=detalle, false=primer episodio
export function createAnimeCard(anime, badgeText = null, isDetailView = true) {
    const article = document.createElement('article');
    article.className = 'anime-card';
    article.setAttribute('data-anime-slug', anime.slug);

    const imageLink = document.createElement('a');
    imageLink.className = 'anime-card__a';
    imageLink.href = '#';
    imageLink.setAttribute('title', `Ver ${isDetailView ? 'detalles de' : 'episodios de'} ${anime.title}`);

    const image = document.createElement('img');
    image.className = 'anime-card__image';
    image.src = anime.cover;
    image.alt = `Portada de ${anime.title}`;
    image.loading = 'lazy';

    imageLink.appendChild(image);

    if (badgeText) {
        const badge = document.createElement('div');
        badge.className = 'anime-card__badge';
        badge.textContent = badgeText;
        imageLink.appendChild(badge);
    }

    const titleElement = document.createElement('p');
    titleElement.className = 'anime-card__name';
    titleElement.textContent = anime.title;
    titleElement.setAttribute('title', anime.title);

    article.appendChild(imageLink);
    article.appendChild(titleElement);

    imageLink.addEventListener('click', (event) => {
        event.preventDefault();
        handleCardNavigation(anime.slug, isDetailView);
    });

    return article;
}

// Navega según el tipo de vista (detalle o episodio)
function handleCardNavigation(slug, isDetailView) {
    if (isDetailView) {
        navigateToAnimeDetail(slug);
    } else {
        navigateToEpisode(slug);
    }
}

// Navega a watch.html con el slug del episodio
export function navigateToEpisode(episodeSlug) {
    window.location.href = `watch.html?slug=${episodeSlug}`;
}

