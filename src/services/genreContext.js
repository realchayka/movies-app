import React, { createContext } from 'react'

import MoviesService from './movies-service'

const GenreContext = createContext()

export class GenreProvider extends React.Component {
  movieService = new MoviesService()

  state = {
    genres: [],
    loadingGenres: true,
  }

  async componentDidMount() {
    try {
      const genres = await this.movieService.getGenres()
      this.setState({ genres, loadingGenres: false })
    } catch (error) {
      console.error('Ошибка при получении данных', error)
      this.setState({ loadingGenres: false })
    }
  }

  render() {
    const { children } = this.props
    const { genres, loadingGenres } = this.state

    return <GenreContext.Provider value={{ genres, loadingGenres }}>{children}</GenreContext.Provider>
  }
}

export const GenreConsumer = GenreContext.Consumer
