// Crea enlaces a animes en listas

// Crea un item de lista con link al anime
export function createAnimeLinks(anime) {
    const listItem = document.createElement('li');
    const link = document.createElement('a');

    link.className = 'anime-link';
    link.textContent = anime.title;
    link.href = '#';
    link.setAttribute('title', `Ver detalles de ${anime.title}`);

    link.addEventListener('click', (event) => {
        event.preventDefault();
        navigateToAnimeDetail(anime.slug);
    });

    listItem.appendChild(link);
    return listItem;
}

// Navega a anime.html con el slug
export function navigateToAnimeDetail(slug) {
    window.location.href = `anime.html?slug=${slug}`;
}