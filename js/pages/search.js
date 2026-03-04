import { addListenerInput } from "../utils/search.js";
import { displayErrorMessage } from "../utils/errorHandler.js";
import { extractQueryFromURL } from "../utils/urlParams.js";
import { searchAnimeWithText } from "../services/animeService.js";
import { createAnimeCard } from "../components/AnimeCard.js";

async function initializeAnimeSearchPage() {
    try {
        addListenerInput();
        
        const query = extractQueryFromURL();
        const animes = await searchAnimeWithText(query);
        
        const section = document.querySelector('.main__animes-container');

        animes.data.media.forEach(anime => {
            const animeCard = createAnimeCard(
                anime,
                anime.type,
                true
            );
            section.appendChild(animeCard);
        });

    } catch (error) {
        displayErrorMessage('Error al cargar el contenido. Intenta recargar la página.');
        console.error('Error al inicializar la página de búsqueda:', error);
    }
}



document.addEventListener('DOMContentLoaded', initializeAnimeSearchPage);