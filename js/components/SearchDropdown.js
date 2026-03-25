import { renderDropdownSearchItem } from "../components/SearchDropdownItem.js";
import { navigateToAnimeSearchList } from "../utils/navigation.js";

const dropdown = document.querySelector('.header__search-dropdown');

/**
 * Posiciona el dropdown debajo del input de búsqueda.
 * Usa position: fixed para escapar del contexto de apilamiento del header sticky.
 */
function positionDropdown() {
    const searchInput = document.querySelector('.header__search');
    const rect = searchInput.getBoundingClientRect();
    
    dropdown.style.top = (rect.bottom + 5) + 'px';
    dropdown.style.left = rect.left + 'px';
    dropdown.style.width = rect.width + 'px';
}

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

    positionDropdown();
    dropdown.style.display = 'block';
}

/**
 * Oculta el dropdown de búsqueda.
 */
export function hideDropdown() {
    dropdown.style.display = 'none';
}

// Reposiciona el dropdown cuando se hace scroll o resize
window.addEventListener('scroll', () => {
    if (dropdown.style.display === 'block') {
        positionDropdown();
    }
}, true);

window.addEventListener('resize', () => {
    if (dropdown.style.display === 'block') {
        positionDropdown();
    }
});