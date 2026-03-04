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