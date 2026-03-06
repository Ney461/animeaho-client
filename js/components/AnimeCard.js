// AnimeCard.js
// Componente que renderiza tarjetas de anime en forma de grid.
// Cada tarjeta muestra portada, título y un badge opcional.
// Maneja navegación al detalle del anime o directamente a un episodio.

import { navigateToAnimeDetail, navigateToEpisode } from '../utils/navigation.js';

export function renderAnimeCards(animes, container) {
    const fragment = document.createDocumentFragment();
    animes.forEach(anime => {
        fragment.appendChild(renderAnimeCard(anime, anime.type, true));
    });
    container.appendChild(fragment);
}

/**
 * Crea una tarjeta de anime con portada, título y badge opcional.
 * 
 * @param {Object} anime - Datos del anime { title, cover, slug }
 * @param {string|null} badgeText - Texto del badge (ej: "Episodio 3"). null = sin badge
 * @param {boolean} isDetailView - true = navega al detalle | false = navega al episodio
 * @returns {HTMLElement} Tarjeta lista para insertar en el DOM
 */
export function renderAnimeCard(anime, badgeText = null, isDetailView = true) {
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

/**
 * Navega al detalle o al episodio según el tipo de vista.
 * 
 * @param {string} slug - Slug del anime o episodio
 * @param {boolean} isDetailView - true = detalle | false = episodio
 */
function handleCardNavigation(slug, isDetailView) {
    if (isDetailView) {
        navigateToAnimeDetail(slug);
    } else {
        navigateToEpisode(slug);
    }
}