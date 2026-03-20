import { renderDropdownFilter } from "../components/FilterDropdown.js";
import { ANIME_GENRES, ORDER, STATUSES, TYPES } from "../config/constants.js";
import { addListenerInput } from "../utils/search.js";
import { displayErrorMessage } from "../utils/errorHandler.js";

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
    const filterContainer = document.querySelector('.filters');

    filterContainer.addEventListener('click', (e) => {

        const button = e.target.closest("button");
        if (!button) return;

        const parent = button.closest(".filters__item");

        switch (button.value) {

            case "order":
                renderDropdownFilter(ORDER, parent);
                break;
                
            case "genres":
                renderDropdownFilter(ANIME_GENRES, parent);
                break;
                
            case "statuses":
                renderDropdownFilter(STATUSES, parent);
                break;
                
            case "types":
                renderDropdownFilter(TYPES, parent);
                break;
                
            case "search":
                search();
                break;
                
        }
    });
}

function search() {}

document.addEventListener('DOMContentLoaded', initializeAnimeBrowsePage);