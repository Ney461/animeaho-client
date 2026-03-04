// Crea enlaces a animes en listas

import { navigateToAnimeDetail } from "../utils/navigation.js";

/**
 * Crea un item de lista con enlace al detalle del anime.
 *
 * @param {Object} anime - Datos del anime
 * @param {string} anime.title - Título del anime
 * @param {string} anime.slug - Slug del anime
 * @returns {HTMLLIElement} Item de lista listo para insertar en el DOM
 */
export function createAnimeLinks(anime) {
    const listItem = document.createElement('li');
    const link = document.createElement('a');

    link.className = 'anime-link';
    link.textContent = anime.title;
    link.href = '#';
    link.setAttribute('title', `Ver detalles de ${anime.title}`);

    link.addEventListener('click', (event) => {
        event.preventDefault();
        navigateToAnimeDetail(anime.slug);
    });

    listItem.appendChild(link);
    return listItem;
}