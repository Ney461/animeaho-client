/**
 * Maneja el error cuando no se proporciona o se proporciona un slug inválido.
 * Muestra un mensaje de error al usuario.
 * 
 * @returns {void}
 */
export function handleMissingSlug() {
    console.error('No se proporcionó un slug válido en la URL');
    const mainContent = document.querySelector('.main__inner');
    if (mainContent) {
        mainContent.innerHTML = '<p class="error-message">Error: Episodio no especificado. Por favor, regresa a la página anterior.</p>';
    }
}

/**
 * Maneja el error cuando el episodio solicitado no se encuentra.
 * Muestra un mensaje de error amigable al usuario.
 * 
 * @returns {void}
 */
export function handleEpisodeNotFound() {
    console.error('El episodio solicitado no fue encontrado');
    const mainContent = document.querySelector('.main__inner');
    if (mainContent) {
        mainContent.innerHTML = '<p class="error-message">Error: No se encontró el episodio solicitado.</p>';
    }
}

/**
 * Maneja errores generales durante la carga de la página.
 * Presenta un mensaje de error genérico al usuario.
 * 
 * @returns {void}
 */
export function handleLoadError() {
    const mainContent = document.querySelector('.main__inner');
    if (mainContent) {
        mainContent.innerHTML = '<p class="error-message">Error al cargar los datos del episodio. Por favor, intenta nuevamente.</p>';
    }
}

/**
 * Maneja el error cuando el anime solicitado no se encuentra.
 * Muestra un mensaje de error amigable al usuario.
 * 
 * @returns {void}
 */
export function handleAnimeNotFound() {
    console.error('El anime solicitado no fue encontrado');
    const mainContent = document.querySelector('.main__inner');
    if (mainContent) {
        mainContent.innerHTML = '<p class="error-message">Error: No se encontró el anime solicitado.</p>';
    }
}

/**
 * Muestra un mensaje de error genérico al usuario.
 * 
 * @param {string} message - Mensaje de error a mostrar
 * @returns {void}
 */
export function displayErrorMessage(message) {
    const mainContent = document.querySelector('.main__content') || document.querySelector('main');
    if (mainContent) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message-container';
        errorDiv.innerHTML = `<p class="error-message">${message}</p>`;
        mainContent.prepend(errorDiv);
    }
}