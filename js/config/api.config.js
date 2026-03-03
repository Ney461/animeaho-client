/**
 * api.config.js - Configuración de endpoints de API
 * 
 * Este módulo centraliza la configuración de todas las URLs y endpoints
 * utilizados en la aplicación cliente. Facilita el mantenimiento y cambios globales.
 */

// API pública de AnimeFlv
export const ANIME_API_BASE_URL = 'https://animeflv.ahmedrangel.com';

/**
 * Endpoints de la API pública de AnimeFlv
 * Proporciona acceso a información de animes, episodios y búsqueda
 */
export const ANIME_ENDPOINTS = {
    ANIME_SLUG: (slug) => `/api/anime/${slug}`,
    EPISODE_SLUG: (slug) => `/api/anime/episode/${slug}`,
    EPISODE_SLUG_NUMER: (slug, number) => `/api/anime/${slug}/episode/${number}`,
    LIST_ANIMES_ON_AIR: '/api/list/animes-on-air',
    LATEST_EPISODES: '/api/list/latest-episodes',
    SEARCH_ANIME: '/api/search',
    SEARCH_BY_URL: '/api/search/by-url'
};

// API backend de AnimeAho (proxy y autenticación)
export const BACKEND_API_BASE_URL = 'https://animeaho-backend.vercel.app/api';

/**
 * Endpoints del backend de AnimeAho
 * Incluye proxies, autenticación, perfiles de usuario, favoritos y comentarios
 */
export const BACKEND_ENDPOINTS = {
    // Búsqueda por proxy
    PROXY_SEARCH_BY_FILTER: '/proxy/anime/search-filter',
    PROXY_SEARCH_BY_URL: '/proxy/search/by-url',

    // Autenticación
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    VERIFY_TOKEN: '/auth/verify',

    // Perfil de usuario
    GET_PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',

    // Favoritos
    GET_FAVORITES: '/favorites',
    ADD_FAVORITE: '/favorites',
    REMOVE_FAVORITE: (id) => `/favorites/${id}`,
    CHECK_FAVORITE: (animeId) => `/favorites/check/${animeId}`,

    // Comentarios
    GET_COMMENTS: (animeId, episodeId) => `/comments/${animeId}/${episodeId}`,
    ADD_COMMENT: '/comments',
    UPDATE_COMMENT: (id) => `/comments/${id}`,
    DELETE_COMMENT: (id) => `/comments/${id}`
};