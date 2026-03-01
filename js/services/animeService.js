// Servicio para llamadas HTTP a APIs de anime

import { BACKEND_ENDPOINTS, BACKEND_API_BASE_URL, ANIME_API_BASE_URL, ANIME_ENDPOINTS } from "../config/api.config.js";
import { LatestEpisodesResponse, AnimeBySlugResponse, EpisodeBySlugResponse, 
        EpisodeBySlugNumberResponse, AiringAnimesResponse, SearchAnimeResponse,
        ResponseError } from "../models/Anime.js";

// Obtiene información completa de un anime
export async function getAnimeBySlug(animeSlug) {
    const endpoint = ANIME_API_BASE_URL + ANIME_ENDPOINTS.ANIME_SLUG(animeSlug);
    try {
        const response = await fetch(endpoint);
        const data = await response.json();
        if (!response.ok) return new ResponseError(data);
        if (!data.success) return new ResponseError(data);
        return new AnimeBySlugResponse(data);
    } catch (error) {
        console.error("Error al obtener anime:", error);
        return new ResponseError({
            data: null, error: true,
            message: error.message || "Error de conexión",
            statusCode: 0, url: endpoint
        });
    }
}

// Obtiene información de un episodio por slug
export async function getEpisodeBySlug(episodeSlug) {
    const endpoint = ANIME_API_BASE_URL + ANIME_ENDPOINTS.EPISODE_SLUG(episodeSlug);
    try {
        const response = await fetch(endpoint);
        const data = await response.json();
        if (!response.ok) return new ResponseError(data);
        if (!data.success) return new ResponseError(data);
        return new EpisodeBySlugResponse(data);
    } catch (error) {
        console.error("Error al obtener episodio:", error);
        return new ResponseError({
            data: null, error: true,
            message: error.message || "Error de conexión",
            statusCode: 0, url: endpoint
        });
    }
}

// Obtiene episodio por anime slug + número
export async function getEpisodeBySlugNumber(animeSlug, episodeNumber) {
    const endpoint = ANIME_API_BASE_URL + ANIME_ENDPOINTS.EPISODE_SLUG_NUMER(animeSlug, episodeNumber);
    try {
        const response = await fetch(endpoint);
        const data = await response.json();
        if (!response.ok) return new ResponseError(data);
        if (!data.success) return new ResponseError(data);
        return new EpisodeBySlugNumberResponse(data);
    } catch (error) {
        console.error("Error al obtener episodio por número:", error);
        return new ResponseError({
            data: null, error: true,
            message: error.message || "Error de conexión",
            statusCode: 0, url: endpoint
        });
    }
}

/**
 * Obtiene animes actualmente en emisión
 * @async
 * @returns {Promise<AiringAnimesResponse|ResponseError>}
 */
export async function getAiringAnimes() {
    const endpoint = ANIME_API_BASE_URL + ANIME_ENDPOINTS.LIST_ANIMES_ON_AIR;
    try {
        const response = await fetch(endpoint);
        const data = await response.json();
        if (!response.ok) return new ResponseError(data);
        if (!data.success) return new ResponseError(data);
        return new AiringAnimesResponse(data);
    } catch (error) {
        console.error("Error al obtener animes en emisión:", error);
        return new ResponseError({
            data: null, error: true,
            message: error.message || "Error de conexión",
            statusCode: 0, url: endpoint
        });
    }
}

// Obtiene últimos episodios lanzados
export async function getLatestEpisodes() {
    const endpoint = ANIME_API_BASE_URL + ANIME_ENDPOINTS.LATEST_EPISODES;
    try {
        const response = await fetch(endpoint);
        const data = await response.json();
        if (!response.ok) return new ResponseError(data);
        if (!data.success) return new ResponseError(data);
        return new LatestEpisodesResponse(data);
    } catch (error) {
        console.error("Error al obtener últimos episodios:", error);
        return new ResponseError({
            data: null, error: true,
            message: error.message || "Error de conexión",
            statusCode: 0, url: endpoint
        });
    }
}

// Búsqueda simple de animes por texto
export async function searchAnimeWithText(searchQuery) {
    const params = new URLSearchParams({ query: searchQuery, page: 1 });
    const endpoint = `${ANIME_API_BASE_URL}${ANIME_ENDPOINTS.SEARCH_ANIME}?${params}`;
    try {
        const response = await fetch(endpoint);
        const data = await response.json();
        if (!response.ok) return new ResponseError(data);
        if (!data.success) return new ResponseError(data);
        return new SearchAnimeResponse(data);
    } catch (error) {
        console.error("Error al buscar anime:", error);
        return new ResponseError({
            data: null, error: true,
            message: error.message || "Error de conexión",
            statusCode: 0, url: endpoint
        });
    }
}

// Búsqueda con filtros avanzados
export async function searchAnimeFilter({ order = 'default', types = [], genres = [], statuses = [], page = 1 } = {}) {
    const params = new URLSearchParams({ order, page });
    const endpoint = `${BACKEND_API_BASE_URL}${BACKEND_ENDPOINTS.PROXY_SEARCH_BY_FILTER}?${params}`;
    try {
        const requestBody = { order, types, genres, statuses, page };
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });
        const data = await response.json();
        if (!response.ok) return new ResponseError(data);
        if (!data.success) return new ResponseError(data);
        return new SearchAnimeResponse(data);
    } catch (error) {
        console.error("Error al buscar con filtros:", error);
        return new ResponseError({
            data: null, error: true,
            message: error.message || "Error de conexión",
            statusCode: 0, url: endpoint
        });
    }
}

// Búsqueda de animes por URL
export async function searchAnimeWithUrl(searchUrl) {
    const params = new URLSearchParams({ url: searchUrl });
    const endpoint = `${ANIME_API_BASE_URL}${ANIME_ENDPOINTS.SEARCH_BY_URL}?${params}`;
    try {
        const response = await fetch(endpoint);
        const data = await response.json();
        if (!response.ok) return new ResponseError(data);
        if (!data.success) return new ResponseError(data);
        return new SearchAnimeResponse(data);
    } catch (error) {
        console.error("Error al buscar por URL:", error);
        return new ResponseError({
            data: null, error: true,
            message: error.message || "Error de conexión",
            statusCode: 0, url: endpoint
        });
    }
}
