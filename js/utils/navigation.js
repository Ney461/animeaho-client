import { getSelectedValues } from "./filters.js";

/**
 * Navega a la página de reproducción del episodio.
 * 
 * @param {string} episodeSlug - Slug del episodio
 */
export function navigateToEpisode(episodeSlug) {
    window.location.href = `./watch.html?slug=${episodeSlug}`;
}

/**
 * Navega a la página de detalle del anime.
 *
 * @param {string} slug - Slug del anime
 */
export function navigateToAnimeDetail(slug) {
    window.location.href = `./anime.html?slug=${slug}`;
}

/**
 * Navega a la página de detalle del anime.
 *
 * @param {number} page - Número de la página
 */
export function navigateToAnimeSearchList(page, query, ) {
    if (query) {
        window.location.href = `./search.html?query=${query}&page=${page}`;
    } else {
        const input = document.querySelector('.header__search-input');
        window.location.href = `./search.html?query=${input.value}&page=${page}`;
    }
}

export function navigateToFilterSearch(page = 1) {

    const params = new URLSearchParams();
    
    const { order = ["default"], genres = [], statuses = [1, 2, 3], types = [] } = getSelectedValues();

    order.forEach(v => params.append("order[]", v));
    genres.forEach(v => params.append("genres[]", v));
    statuses.forEach(v => params.append("statuses[]", v));
    types.forEach(v => params.append("types[]", v));
    params.append("page", page);

    window.location.href = `./browse.html?${params.toString().replaceAll("%5B%5D", "[]")}`;
}