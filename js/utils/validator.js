/**
 * Verifica si un episodio existe y retorna su slug completo.
 *
 * @async
 * @param {string} animeSlug - Slug del anime
 * @param {number} episodeNumber - Número del episodio a validar
 * @returns {Promise<string|null>} Slug del episodio (ej: "anime-slug-3") o null si no existe
 */
export async function validateAndGetEpisodeSlug(animeSlug, episodeNumber) {
    if (episodeNumber < 1) return null;
    
    try {
        const response = await getEpisodeBySlugNumber(animeSlug, episodeNumber);
        if (!response || !response.success || !response.data) return null;
        return `${animeSlug}-${episodeNumber}`;
    } catch (error) {
        console.warn(`No se pudo validar episodio ${animeSlug}-${episodeNumber}:`, error);
        return null;
    }
}