import { renderDropdownFilter, buildDropdownFilter } from "../components/FilterDropdown.js";
import { ANIME_GENRES, ORDER, STATUSES, TYPES } from "../config/constants.js";
import { addListenerInput } from "../utils/search.js";
import { displayErrorMessage, handleNoFilterResults } from "../utils/errorHandler.js";
import { searchAnimeFilter } from "../services/animeService.js";
import { navigateToFilterSearch } from "../utils/navigation.js";
import { extractFilterFromURL } from "../utils/urlParams.js";
import { renderAnimeCards } from "../components/AnimeCard.js";
import { renderPagination } from "../components/Navbar.js";


async function initializeAnimeBrowsePage() {
    try {
        addListenerInput();
        addListenerButtonFilter();
        renderAllDropdowns();
        restoreFiltersFromURL();
        limitGenreSelection(4);
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
                renderDropdownFilter(ORDER, parent, 'radio');
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
        order:    { data: ORDER,        type: 'radio'    },
        genres:   { data: ANIME_GENRES, type: 'checkbox' },
        statuses: { data: STATUSES,     type: 'checkbox' },
        types:    { data: TYPES,        type: 'checkbox' },
    };

    Object.entries(map).forEach(([name, { data, type }]) => {
        const parent = filterContainer.querySelector(`button[value="${name}"]`)?.closest('.filters__item');
        if (parent) buildDropdownFilter(data, parent, type);
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
    try {
        const { order, genres, statuses, types, page } = extractFilterFromURL();
        const response = await searchAnimeFilter( {order, types, genres, statuses, page} );
        const section = document.querySelector('.main__animes-container');
        const sectionNav = document.querySelector('.main__pagination');
        const { currentPage, foundPages } = response.data; 

        renderAnimeCards(response.data.media, section);
        renderPagination(currentPage, foundPages, '',sectionNav, true);
    } catch (error) {
        handleNoFilterResults();
    }
}

function limitGenreSelection(max = 4) {
    const genreDropdown = document.querySelector('.filters__dropdown[data-name="genres"]');
    if (!genreDropdown) return;

    genreDropdown.addEventListener('change', (e) => {
        if (e.target.type !== 'checkbox') return;

        const checkboxes = genreDropdown.querySelectorAll('input[type="checkbox"]');
        const checkedCount = [...checkboxes].filter(c => c.checked).length;

        checkboxes.forEach(cb => {
            if (!cb.checked) cb.disabled = checkedCount >= max;
        })
    });

}

document.addEventListener('DOMContentLoaded', initializeAnimeBrowsePage);