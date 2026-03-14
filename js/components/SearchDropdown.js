import { renderDropdownSearchItem } from "../components/SearchDropdownItem.js";
import { navigateToAnimeSearchList } from "../utils/navigation.js";

const dropdown = document.querySelector('.header__search-dropdown');

/**
 * Renderiza los items del dropdown con los resultados de búsqueda.
 * Muestra un máximo de 5 resultados.
 * 
 * @param {Array} media - Lista de animes encontrados
 */
export function renderDropdownSearch(media) {
    dropdown.innerHTML = '';
    const total = Math.min(5, media.length);
    for (let i = 0; i < total; i++) {
        dropdown.appendChild(renderDropdownSearchItem(media[i]));
    }

    if (media.length > 5) {
        const button = document.createElement('button');
        button.className = 'header__search-more'
        button.textContent = 'Ver más'
        
        button.addEventListener('click', () => navigateToAnimeSearchList(1))

        dropdown.appendChild(button)

    }

    dropdown.style.display = 'block';
}

/**
 * Oculta el dropdown de búsqueda.
 */
export function hideDropdown() {
    dropdown.style.display = 'none';
}