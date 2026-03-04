import { addListenerInput } from "../utils/search.js";
import { displayErrorMessage } from "../utils/errorHandler.js";

async function initializeAnimeSearchPage() {
    try {
        addListenerInput();
    } catch (error) {
        displayErrorMessage('Error al cargar el contenido. Intenta recargar la página.');
        console.error('Error al inicializar la página de búsqueda:', error);
    }
}



document.addEventListener('DOMContentLoaded', initializeAnimeSearchPage);