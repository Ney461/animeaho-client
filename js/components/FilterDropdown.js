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
    const isOpen = menu.classList.contains("filters__dropdown--open");

    document.querySelectorAll('.filters__dropdown').forEach(m => {
        m.classList.remove("filters__dropdown--open");
    });

    buildDropdownItems(options, menu, type);

    if (!isOpen) menu.classList.add("filters__dropdown--open");
}

export function buildDropdownFilter(options, parent, type = 'checkbox') {
    const menu = parent.querySelector('.filters__dropdown');
    buildDropdownItems(options, menu, type);
}