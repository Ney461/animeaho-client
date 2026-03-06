import { addListenerInput } from "../utils/search.js";
import { displayErrorMessage } from "../utils/errorHandler.js";
import { extractQueryFromURL } from "../utils/urlParams.js";
import { searchAnimeWithText } from "../services/animeService.js";
import { renderAnimeCards } from "../components/AnimeCard.js";
import { renderPagination } from "../components/Navbar.js";

async function initializeAnimeSearchPage() {
    try {
        const sectionAnimes = document.querySelector('.main__animes-container');
        const sectionNav = document.querySelector('.main__pagination');
        const h3 = document.querySelector('.main__section-title');

        if (!sectionAnimes || !sectionNav || !h3) {
            console.error('No se encontraron los elementos del DOM');
            return;
        }

        addListenerInput();

        const { query, page } = extractQueryFromURL();

        if (!query) {
            displayErrorMessage('No has ingresado ningún anime para buscar');
            return;
        }

        const animes = await searchAnimeWithText(query, page);

        if (animes.error) {
            displayErrorMessage('No se ha podido encontrar el anime especificado');
            return;
        }

        const { currentPage, foundPages } = animes.data; 

        h3.textContent = 'Búsqueda Relacionada';

        renderAnimeCards(animes.data.media, sectionAnimes);
        renderPagination(currentPage, foundPages, query, sectionNav);

    } catch (error) {
        displayErrorMessage('Error al cargar el contenido. Intenta recargar la página.');
        console.error('Error al inicializar la página de búsqueda:', error);
    }
}

document.addEventListener('DOMContentLoaded', initializeAnimeSearchPage);