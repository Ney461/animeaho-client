// Reproductor de video con selector de servidores y navegación de episodios

import { renderEpisodeNavigation, renderReturnButton } from "./Navbar.js";

let domElementCache = {};
let animeTitle = '';

// Cachea referencias al DOM
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

// Renderiza el reproductor completo
export function renderVideoPlayer(episodeData, prevEpisodeSlug, nextEpisodeSlug, animeSlug) {
    cacheDOM();

    renderEpisodeTitle(episodeData.title, episodeData.number);
    renderInitialVideo(episodeData.servers);
    renderServerButtons(episodeData.servers);
    renderEpisodeNavigation(prevEpisodeSlug, nextEpisodeSlug, domElementCache);
    renderReturnButton(animeSlug, domElementCache);
}

// Renderiza el título del episodio
function renderEpisodeTitle(title, episodeNumber) {
    animeTitle = title;
    
    const titleElement = document.createElement('p');
    titleElement.textContent = `${title} - Episodio ${episodeNumber}`;
    titleElement.className = 'video-title';
    
    domElementCache.videoTitle.appendChild(titleElement);
}

// Renderiza el video del primer servidor
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

// Crea el iframe del video
function createVideoIframe(embedUrl) {
    const iframe = document.createElement('iframe');
    iframe.src = embedUrl;
    iframe.className = 'main__player-iframe';
    iframe.allowFullscreen = true;
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
    
    return iframe;
}

// Crea botones para cambiar servidores
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

// Crea un botón de servidor
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
 * Maneja el cambio de servidor activo y actualiza el video
 * 
 * @param {HTMLButtonElement} serverButton - Botón del servidor seleccionado
 * @param {string} embedUrl - URL del video embed del nuevo servidor
 * @returns {void}
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
 * Actualiza el origen del video en el iframe
 * 
 * @param {string} embedUrl - Nueva URL del embed
 * @returns {void}
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

