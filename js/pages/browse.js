import { renderDropdownFilter, buildDropdownFilter } from "../components/FilterDropdown.js";
import { ANIME_GENRES, ORDER, STATUSES, TYPES } from "../config/constants.js";
import { addListenerInput } from "../utils/search.js";
import { displayErrorMessage } from "../utils/errorHandler.js";
import { searchAnimeFilter } from "../services/animeService.js";
import { navigateToFilterSearch } from "../utils/navigation.js";
import { extractFilterFromURL } from "../utils/urlParams.js";
import { renderAnimeCard, renderAnimeCards } from "../components/AnimeCard.js";
import { getSelectedValues } from "../utils/filters.js";

async function initializeAnimeBrowsePage() {
    try {
        addListenerInput();
        addListenerButtonFilter();
        renderAllDropdowns();
        restoreFiltersFromURL();
        search();

    } catch (error) {
        console.error('Error al inicializar la página de búsqueda:', error);
        displayErrorMessage('Error al cargar el contenido. Intenta recargar la página.');
    }
}

function addListenerButtonFilter() {
    const filterContainer = document.querySelector('.filters');

    if (!filterContainer) {
        return;
    }

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
                uploadFilterParams();
                break;
                
        }
    });
}

function uploadFilterParams() {
    navigateToFilterSearch(1);
}

function renderAllDropdowns() {
    const filterContainer = document.querySelector('.filters');

    const map = {
        order : ORDER,
        genres : ANIME_GENRES,
        statuses : STATUSES,
        types : TYPES
    };

    Object.entries(map).forEach(([name, data]) => {
        const parent = filterContainer.querySelector(`button[value="${name}"]`)?.closest('.filters__item');
        if (parent) buildDropdownFilter(data, parent);
    })
}

function restoreFiltersFromURL() {
    const { order, genres, statuses, types, page } = extractFilterFromURL();
    
    const setChecked = (name, values) => {
        values.forEach(value => {
            const checkbox = document.querySelector(`.filters__dropdown[data-name="${name}"] input[value="${value}"]`);
            if (checkbox) checkbox.checked = true;
        })
    }

    setChecked("order", order);
    setChecked("genres", genres);
    setChecked("statuses", statuses);
    setChecked("types", types);
}

async function search() {
    const { order, genres, statuses, types, page } = extractFilterFromURL();
    const response = await searchAnimeFilter( {order, types, genres, statuses, page} );
    console.log(response)
    console.log(statuses)
    const section = document.querySelector('.main__animes-container');

    renderAnimeCards(response.data.media, section);
    console.log(order, genres, statuses, types, page)
    console.log(response)

}

document.addEventListener('DOMContentLoaded', initializeAnimeBrowsePage);