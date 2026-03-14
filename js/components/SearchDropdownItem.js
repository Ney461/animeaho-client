import { navigateToAnimeDetail } from "../utils/navigation.js"

/**
 * Crea un item del dropdown de búsqueda con portada y título del anime.
 *
 * @param {Object} anime - Datos del anime
 * @param {string} anime.cover - URL de la portada
 * @param {string} anime.title - Título del anime
 * @param {string} anime.slug - Slug del anime
 * @returns {HTMLElement} Item listo para insertar en el dropdown
 */
export function renderDropdownSearchItem(anime) {
    const item = document.createElement('div');
    const link = document.createElement('a');
    const cover = document.createElement('img');
    const title = document.createElement('span');

    item.className = 'header__search-dropdown-item';
    cover.src = anime.cover;
    cover.alt = anime.title;
    title.textContent = anime.title;

    link.addEventListener('click', (event) => {
        event.preventDefault();
        navigateToAnimeDetail(anime.slug);
    });

    link.append(cover, title);
    item.appendChild(link);

    return item;
}

