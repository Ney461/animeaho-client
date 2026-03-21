export function getSelectedValues() {
    const result = {};
    document.querySelectorAll('.filters__dropdown').forEach(dropdown => {
        const name = dropdown.dataset.name;
        const checked = dropdown.querySelectorAll('input:checked');
        if (name) {
            result[name] = Array.from(checked).map(input => input.value);
        }
    });
    return result;
}
