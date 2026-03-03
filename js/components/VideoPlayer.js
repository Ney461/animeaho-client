// Reproductor de video con selector de servidores y navegación de episodios

import { renderEpisodeNavigation, renderReturnButton } from "./Navbar.js";

let domElementCache = {};
let animeTitle = ''

/**
 * Cachea referencias a los elementos del DOM del reproductor.
 */
function cacheDOM() {
    domElementCache = {
        videoTitle: document.getElementById('video-title'),
        videoWrapper: document.getElementById('video-wrapper'),
        serversList: document.getElementById('video-servers'),
        downloadList: document.getElementById('video-downloads'),
        controls: document.getElementById('video-controls'),
        navigationButtons: document.getElementById('video-nav'),
        backButton: document.getElementById('video-back')
    };
}

/**
 * Renderiza el reproductor completo: título, video, servidores y navegación.
 *
 * @param {Object} episodeData - Datos del episodio
 * @param {string} episodeData.title - Título del anime
 * @param {number} episodeData.number - Número del episodio
 * @param {Object[]} episodeData.servers - Lista de servidores disponibles
 * @param {string|null} prevEpisodeSlug - Slug del episodio anterior
 * @param {string|null} nextEpisodeSlug - Slug del episodio siguiente
 * @param {string} animeSlug - Slug del anime
 */
export function renderVideoPlayer(episodeData, prevEpisodeSlug, nextEpisodeSlug, animeSlug) {
    cacheDOM();

    renderEpisodeTitle(episodeData.title, episodeData.number);
    renderInitialVideo(episodeData.servers);
    renderServerButtons(episodeData.servers);
    renderEpisodeNavigation(prevEpisodeSlug, nextEpisodeSlug, domElementCache);
    renderReturnButton(animeSlug, domElementCache);
}

/**
 * Renderiza el título del episodio en el DOM.
 *
 * @param {string} title - Título del anime
 * @param {number} episodeNumber - Número del episodio
 */
function renderEpisodeTitle(title, episodeNumber) {
    animeTitle = title;
    
    const titleElement = document.createElement('p');
    titleElement.textContent = `${title} - Episodio ${episodeNumber}`;
    titleElement.className = 'video-title';
    
    domElementCache.videoTitle.appendChild(titleElement);
}

/**
 * Renderiza el video del primer servidor disponible.
 * Si no hay servidores, muestra un mensaje de error.
 *
 * @param {Object[]} servers - Lista de servidores
 */
function renderInitialVideo(servers) {
    if (!servers || servers.length === 0) {
        const errorMsg = document.createElement('p');
        errorMsg.textContent = 'No hay servidores disponibles para este episodio.';
        domElementCache.videoWrapper.appendChild(errorMsg);
        return;
    }

    const iframe = createVideoIframe(servers[0].embed);
    domElementCache.videoWrapper.appendChild(iframe);
}

/**
 * Crea un iframe para reproducir el video.
 *
 * @param {string} embedUrl - URL del embed del video
 * @returns {HTMLIFrameElement} Iframe listo para insertar en el DOM
 */
function createVideoIframe(embedUrl) {
    const iframe = document.createElement('iframe');
    iframe.src = embedUrl;
    iframe.className = 'main__player-iframe';
    iframe.allowFullscreen = true;
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
    
    return iframe;
}

/**
 * Renderiza los botones de selección de servidor.
 * Omite servidores sin URL de embed.
 *
 * @param {Object[]} servers - Lista de servidores
 */
function renderServerButtons(servers) {
    servers.forEach((server, index) => {
        if (!server.embed) return;

        const button = createServerButton(server, index === 0);
        
        button.addEventListener('click', () => {
            handleServerChange(button, server.embed);
        });
        
        domElementCache.serversList.appendChild(button);
    });
}

/**
 * Crea un botón de servidor con su estado activo inicial.
 *
 * @param {Object} server - Datos del servidor
 * @param {string} server.name - Nombre del servidor
 * @param {string} server.embed - URL del embed
 * @param {boolean} isActive - true = botón marcado como activo
 * @returns {HTMLButtonElement} Botón listo para insertar en el DOM
 */
function createServerButton(server, isActive) {
    const button = document.createElement('button');
    button.className = 'main__servers-btn';
    button.textContent = server.name;
    button.dataset.embedUrl = server.embed;
    button.setAttribute('aria-label', `Seleccionar servidor ${server.name}`);
    button.setAttribute('title', `Ver en ${server.name}`);
    
    if (isActive) {
        button.classList.add('main__servers-btn--active');
        button.setAttribute('aria-pressed', 'true');
    }
    
    return button;
}

/**
 * Maneja el cambio de servidor activo y actualiza el video.
 *
 * @param {HTMLButtonElement} serverButton - Botón del servidor seleccionado
 * @param {string} embedUrl - URL del embed del nuevo servidor
 */
function handleServerChange(serverButton, embedUrl) {
    // Remover estado activo de todos los botones
    document.querySelectorAll('.main__servers-btn').forEach(btn => {
        btn.classList.remove('main__servers-btn--active');
        btn.setAttribute('aria-pressed', 'false');
    });
    
    // Marcar nuevo botón como activo
    serverButton.classList.add('main__servers-btn--active');
    serverButton.setAttribute('aria-pressed', 'true');
    
    // Actualizar video
    updateVideoSource(embedUrl);
}

/**
 * Actualiza la URL del iframe del reproductor.
 * Resetea el src brevemente para forzar la recarga del video.
 *
 * @param {string} embedUrl - Nueva URL del embed
 */
function updateVideoSource(embedUrl) {
    const iframe = document.querySelector('.main__player-iframe');
    
    if (iframe) {
        iframe.src = '';
        setTimeout(() => {
            iframe.src = embedUrl;
        }, 100);
    }
}

