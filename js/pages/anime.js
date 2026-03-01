/**
 * anime.js - Página de detalles del anime
 * 
 * Este módulo controla la carga y renderización de la página de detalles de un anime.
 * Obtiene el slug de la URL, carga la información completa del anime y muestra todos sus detalles.
 */

import { renderAnimeDetail } from '../components/AnimeDetail.js';
import { getAnimeBySlug } from '../services/animeService.js';

/**
 * Inicializa la página de detalles del anime.
 * Extrae el slug de los parámetros de la URL, carga los datos del anime y renderiza la interfaz.
 * 
 * @async
 * @returns {Promise<void>}
 */
async function initializeAnimeDetailPage() {
    try {
        const animeSlug = extractSlugFromURL();

        if (!animeSlug) {
            handleMissingSlug();
            return;
        }

        const animeData = await getAnimeBySlug(animeSlug);

        if (!animeData || !animeData.data) {
            handleAnimeNotFound();
            return;
        }

        updatePageTitle(animeData.data.title);
        renderAnimeDetail(animeData.data);
    } catch (error) {
        console.error('Error al cargar la página de detalles del anime:', error);
        handleLoadError();
    }
}

/**
 * Extrae el parámetro slug de la URL actual.
 * El slug se espera en los parámetros de consulta (?slug=...)
 * 
 * @returns {string|null} El slug del anime si existe, null en otro caso
 */
export function extractSlugFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('slug');
}

/**
 * Actualiza el título de la página del navegador.
 * 
 * @param {string} animeTitle - Título del anime a mostrar
 * @returns {void}
 */
function updatePageTitle(animeTitle) {
    document.title = `AnimeAho - ${animeTitle}`;
}

/**
 * Maneja el error cuando no se proporciona o es inválido el slug.
 * Muestra un mensaje de error al usuario.
 * 
 * @returns {void}
 */
function handleMissingSlug() {
    console.error('No se proporcionó un slug válido en la URL');
    const mainContent = document.querySelector('.main__inner');
    if (mainContent) {
        mainContent.innerHTML = '<p class="error-message">Error: Anime no especificado. Por favor, regresa a la página anterior.</p>';
    }
}

/**
 * Maneja el error cuando el anime solicitado no se encuentra.
 * Muestra un mensaje de error amigable al usuario.
 * 
 * @returns {void}
 */
function handleAnimeNotFound() {
    console.error('El anime solicitado no fue encontrado');
    const mainContent = document.querySelector('.main__inner');
    if (mainContent) {
        mainContent.innerHTML = '<p class="error-message">Error: No se encontró el anime solicitado.</p>';
    }
}

/**
 * Maneja errores generales durante la carga de la página.
 * Presenta un mensaje de error genérico al usuario.
 * 
 * @returns {void}
 */
function handleLoadError() {
    const mainContent = document.querySelector('.main__inner');
    if (mainContent) {
        mainContent.innerHTML = '<p class="error-message">Error al cargar los datos del anime. Por favor, intenta nuevamente.</p>';
    }
}

// Inicializar cuando el DOM está completamente cargado
document.addEventListener('DOMContentLoaded', initializeAnimeDetailPage);
