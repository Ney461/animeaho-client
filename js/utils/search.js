import { searchAnimeWithText } from "../services/animeService.js";
import { hideDropdown, renderDropdown } from "../components/SearchDropdown.js";

const dropdown = document.querySelector('.header__search-dropdown');
let currentController = null;

/**
 * Inicializa los listeners del input de búsqueda.
 * - 'input': busca animes mientras el usuario escribe
 * - 'blur': oculta el dropdown al perder el foco
 */
export function addListenerInput() {
    const input = document.querySelector('.header__search-input');
    input.addEventListener('input', () => searchAnime(input.value, input));
    input.addEventListener('blur', () => {
        setTimeout(() => hideDropdown(), 150);
    });
}

/**
 * Busca animes por texto y renderiza los resultados en el dropdown.
 * Cancela peticiones anteriores si el usuario sigue escribiendo.
 * 
 * @param {string} value - Texto actual del input
 * @param {HTMLInputElement} input - Referencia al input para verificar valor actual
 */
async function searchAnime(value, input) {
    if (value.trim().length === 0) {
        hideDropdown();
        return;
    }

    if (currentController) currentController.abort();
    currentController = new AbortController();

    const animesResponse = await searchAnimeWithText(value, currentController.signal);

    if (input.value.trim().length === 0) {
        hideDropdown();
        return;
    }

    if (!animesResponse.success) {
        dropdown.innerHTML = '<p>No se encontraron coincidencias</p>';
        return;
    }

    renderDropdown(animesResponse.data.media);
}