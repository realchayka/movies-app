export default class MoviesService {
  constructor() {
    this.apiKey = '7ca23a72a829dfd222ff9dcc8eec6865'
    this.baseUrl = 'https://api.themoviedb.org/3'
  }

  async fetchJSON(url, options = {}) {
    const response = await fetch(url, options)

    if (!response.ok) {
      throw new Error(`Ошибка при выполнении запроса ${url}`)
    }

    return await response.json()
  }

  async getGenres() {
    const url = `${this.baseUrl}/genre/movie/list?language=en&api_key=${this.apiKey}`
    return await this.fetchJSON(url)
  }

  async addRating(id, guestSessionId, rating) {
    const url = `${this.baseUrl}/movie/${id}/rating?api_key=${this.apiKey}&guest_session_id=${guestSessionId}`
    const requestBody = { value: rating }
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        accept: 'application/json',
      },
      body: JSON.stringify(requestBody),
    }

    await this.fetchJSON(url, options)
  }

  async getRatedMovies(guestSessionId, pageValue = 1) {
    const url = `${this.baseUrl}/guest_session/${guestSessionId}/rated/movies?api_key=${this.apiKey}&page=${pageValue}`
    const data = await this.fetchJSON(url)
    const ratedMovies = data.results.map(this.transformMovie)
    return {
      ratedMovies,
      totalPages: data.total_pages,
    }
  }

  async createGuestSession() {
    const url = `${this.baseUrl}/authentication/guest_session/new?api_key=${this.apiKey}`
    const data = await this.fetchJSON(url)
    return data.guest_session_id
  }

  async getResource(path, searchValue = 'return', page = 1) {
    const url = `${this.baseUrl}${path}?query=${searchValue}&include_adult=false&language=en-US&page=${page}&api_key=${this.apiKey}`
    return await this.fetchJSON(url)
  }

  async getAllMovies(searchValue, page) {
    const res = await this.getResource('/search/movie', searchValue, page)
    const movies = res.results.map(this.transformMovie)
    return {
      movies,
      totalPages: res.total_pages,
    }
  }

  transformMovie(movie) {
    return {
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      releaseDate: movie.release_date,
      posterPath: movie.poster_path,
      voteAverage: movie.vote_average,
      genreIds: movie.genre_ids,
      rating: movie.rating,
    }
  }
}
