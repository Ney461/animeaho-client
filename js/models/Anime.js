//TODO -------------------- ANIME --------------------
//! Error 400 - 404
export class ResponseError {
    constructor(data) {
        this.data = data.data ? new DataError(data) : null
        this.error = data.error
        this.message = data.message
        this.statusCode = data.statusCode
        this.url = data.url
    }
}

class DataError {
    constructor(data) {
        this.error = data.error
        this.success = data.success
    }
}


//* Anime por Slug - Response wrapper
export class AnimeBySlugResponse  {
    constructor(data) {
        this.success = data.success
        this.data = data.data ? new AnimeDetail (data.data) : null
    }
}

//* Detalle completo de un anime
class AnimeDetail  {
    constructor(data) {
        this.alternativeTitles = data.alternative_titles || []
        this.cover = data.cover || ''
        this.episode = (data.episodes || []).map(episode => new AnimeEpisodeItem (episode))
        this.genres = data.genres || []
        this.rating = data.rating || ''
        this.status = data.status || ''
        this.synopsis = data.synopsis || ''
        this.title = data.title || ''
        this.type = data.type || ''
        this.url = data.url || ''
        this.nextAiringEpisode = data.next_airing_episode || null
        this.related = (data.related || []).map(related => new RelatedAnime (related))
    }
}

//* Item de episodio dentro del detalle del anime
class AnimeEpisodeItem  {
    constructor(episodeData) {
        this.number = episodeData.number || 0
        this.slug = episodeData.slug || ''
        this.url = episodeData.url || ''
    }
}

//* Anime relacionado
class RelatedAnime  {
    constructor(relatedData) {
        this.slug = relatedData.slug || ''
        this.title = relatedData.title || ''
        this.url = relatedData.url || ''
        this.relation = relatedData.relation || ''
    }
}

//* Episodio por Slug - Response wrapper
export class EpisodeBySlugResponse {
    constructor(data) {
        this.success = data.success
        this.data = data.data ? new EpisodeDetail (data.data) : null
    }
}

//* Detalle completo de un episodio con servidores
class EpisodeDetail  {
    constructor(data) {
        this.title = data.title || ''
        this.number = data.number || 0
        this.servers = (data.servers || []).map(server => new VideoServer (server))
    }
}

//* Servidor de video
class VideoServer  {
    constructor(data) {
        this.name = data.name
        this.download = data.download
        this.embed = data.embed
    }
}

//* Episodio por Slug y Número - Response wrapper (usa EpisodeDetail)
export class EpisodeBySlugNumberResponse  {
    constructor(data) {
        this.success = data.success
        this.data = data.data ? new EpisodeDetail (data.data) : null
    }
}

//TODO -------------------- LIST --------------------
//* Lista de animes en emisión - Response wrapper
export class AiringAnimesResponse {
    constructor(data) {
        this.success = data.success
        this.data = (data.data || []).map(anime => new AiringAnimeItem(anime))
    }
}

class AiringAnimeItem {
    constructor(data) {
        this.slug = data.slug
        this.title = data.title
        this.type = data.type
        this.url = data.url
    }
}

//* Lista de últimos episodios - Response wrapper
export class LatestEpisodesResponse  {
    constructor(data) {
        this.success = data.success
        this.data = (data.data || []).map(item => new LatestEpisodeItem(item))
    }
}

class LatestEpisodeItem {
    constructor(data) {
        this.cover = data.cover || ''
        this.number = data.number || 0
        this.slug = data.slug || ''
        this.title = data.title || ''
        this.url = data.url || ''
    }
}

//TODO -------------------- SEARCH --------------------
//* Busca un anime con texto - Wrapper
export class SearchAnimeResponse {
    constructor(data) {
        this.success = data.success
        this.data = data.data ? new SearchAnimeDetail(data.data) : null
    }
}

class SearchAnimeDetail {
    constructor(data) {
        this.currentPage = data.currentPage || 0
        this.foundPages = data.foundPages || 0
        this.hasNextPage = data.hasNextPage || false
        this.media = (data.media || []).map(item => new MediaAnime(item))
        this.nextPage = data.nextPage || null
        this.previousPage = data.previousPage || null
        
    }
}

class MediaAnime {
    constructor(data) {
        this.cover = data.cover || ''
        this.rating = data.rating || ''
        this.slug = data.slug || ''
        this.synopsis = data.synopsis || ''
        this.title = data.title || ''
        this.type = data.type || ''
        this.url = data.url || ''
    }
}

