export function renderDropdownFilter(options, parent) {
    
    const menu = parent.querySelector('.filters__dropdown');
    const isOpen = menu.style.display === "block";

    document.querySelectorAll('.filters__dropdown').forEach(menu => {
        menu.style.display = "none";
    });

    if(!isOpen) {
        menu.innerHTML = "";
        for (let [key, value] of Object.entries(options)){
            const item = document.createElement("div");
            item.textContent = value;
            menu.appendChild(item);
            
        }
        menu.style.display = "block";
    }
    
}