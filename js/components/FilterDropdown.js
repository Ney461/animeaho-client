/**
 * Posiciona un dropdown fijo debajo del botón de filtros.
 * Calcula dinámicamente la posición para que respete el header sticky.
 */
function positionDropdown(button, dropdown) {
    const rect = button.getBoundingClientRect();
    dropdown.style.top = (rect.bottom + 5) + 'px';
    dropdown.style.left = rect.left + 'px';
}

function buildDropdownItems(options, menu, type = 'checkbox') {
    
    if (menu.innerHTML.trim() !== "") return;
    
    for (let [key, value] of Object.entries(options)){
        const div = document.createElement('div');
        const label = document.createElement('label');
        const input = document.createElement('input');

        input.type = type;
        input.name = menu.dataset.name;
        input.className = 'filters__dropdown-option'
        input.value = key;
        input.id = key;
                
        label.textContent = value;
        label.htmlFor = key;

        div.appendChild(input);
        div.appendChild(label);

        menu.appendChild(div);
                
    }
}

export function renderDropdownFilter(options, parent, type = 'checkbox') {
    const menu = parent.querySelector('.filters__dropdown');
    const button = parent.querySelector('button'); // El botón que abre el dropdown
    const isOpen = menu.classList.contains("filters__dropdown--open");

    document.querySelectorAll('.filters__dropdown').forEach(m => {
        m.classList.remove("filters__dropdown--open");
    });

    buildDropdownItems(options, menu, type);

    if (!isOpen) {
        positionDropdown(button, menu);
        menu.classList.add("filters__dropdown--open");
    }
}

export function buildDropdownFilter(options, parent, type = 'checkbox') {
    const menu = parent.querySelector('.filters__dropdown');
    buildDropdownItems(options, menu, type);
}

/**
 * Reposiciona todos los dropdowns abiertos cuando hay scroll o resize.
 * Esto mantiene los dropdowns fixed alineados correctamente con sus botones.
 */
function updateAllDropdownPositions() {
    document.querySelectorAll('.filters__dropdown--open').forEach(dropdown => {
        const parent = dropdown.parentElement;
        const button = parent.querySelector('button');
        if (button) {
            positionDropdown(button, dropdown);
        }
    });
}

// Event listeners para mantener dropdowns posicionados correctamente
window.addEventListener('scroll', updateAllDropdownPositions, true);
window.addEventListener('resize', updateAllDropdownPositions);