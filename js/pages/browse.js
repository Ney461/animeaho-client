import { addListenerInput } from "../utils/search.js";

async function initializeAnimeBrowsePage() {
    try {
        addListenerInput();
    } catch (error) {
        console.error('Error al inicializar la página de búsqueda:', error);
        displayErrorMessage('Error al cargar el contenido. Intenta recargar la página.');
    }
}

document.addEventListener('DOMContentLoaded', initializeAnimeBrowsePage);