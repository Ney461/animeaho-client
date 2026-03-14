import { renderDropdownFilter } from "../components/FilterDropdown.js";
import { ANIME_GENRES, ORDER, STATUSES, TYPES } from "../config/constants.js";
import { addListenerInput } from "../utils/search.js";

async function initializeAnimeBrowsePage() {
    try {
        addListenerInput();
        addListenerButtonFilter();
    } catch (error) {
        console.error('Error al inicializar la página de búsqueda:', error);
        displayErrorMessage('Error al cargar el contenido. Intenta recargar la página.');
    }
}

function addListenerButtonFilter() {
    const filterContainer = document.querySelector('.main__section-filters');

    filterContainer.addEventListener('click', (e) => {
        if (e.target.tagName === "BUTTON") {
            switch (e.target.value) {
                case "order":
                    renderDropdownFilter(ORDER);
                    break;
                
                case "genres":
                    renderDropdownFilter(ANIME_GENRES);
                    break;
                
                case "statuses":
                    renderDropdownFilter(STATUSES);
                    break;
                
                case "types":
                    renderDropdownFilter(TYPES);
                    break;
                
                case "search":
                    search();
                    break;
                
            }
        }
    });
}

function search() {}

document.addEventListener('DOMContentLoaded', initializeAnimeBrowsePage);