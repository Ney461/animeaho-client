function buildDropdownItems(options, menu) {
    
    if (menu.innerHTML.trim() !== "") return;
    
    for (let [key, value] of Object.entries(options)){
        const div = document.createElement('div');
        const form = document.createElement('form');
        const label = document.createElement('label');
        const input = document.createElement('input');

        input.type = 'checkbox';
        input.name = 'genres';
        input.className = 'filters__dropdown-option'
        input.value = key;
        input.id = key;
                
        label.textContent = value;
        label.htmlFor = key;

        form.appendChild(input);
        form.appendChild(label);
        div.appendChild(form);

        menu.appendChild(div);
                
    }
}

export function renderDropdownFilter(options, parent) {
    const menu = parent.querySelector('.filters__dropdown');
    const isOpen = menu.classList.contains("filters__dropdown--open");

    document.querySelectorAll('.filters__dropdown').forEach(m => {
        m.classList.remove("filters__dropdown--open");
    });

    buildDropdownItems(options, menu);

    if (!isOpen) menu.classList.add("filters__dropdown--open");
}

export function buildDropdownFilter(options, parent) {
    const menu = parent.querySelector('.filters__dropdown');
    buildDropdownItems(options, menu);
}