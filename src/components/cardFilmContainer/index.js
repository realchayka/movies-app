/* eslint-disable indent */
/* eslint-disable prettier/prettier */
import { Col, Row, Spin, Alert } from 'antd'
import { Offline, Online } from 'react-detect-offline'
import React from 'react'

import CardFilm from '../cardFilm'
import MoviesService from '../../services/movies-service'

export default class CardFilmContainer extends React.Component {
  movieService = new MoviesService()

  constructor() {
    super()
    this.state = {
      loading: true,
      error: false,
    }
  }

  componentDidMount() {
    this.updateMovies()
  }

  onMoviesLoaded = (movies) => {
    this.setState({
      movies,
      loading: false,
      error: false,
    })
  }

  onError = () => {
    this.setState({
      error: true,
      loading: false,
    })
  }

  updateMovies() {
    this.movieService.getAllMovies().then(this.onMoviesLoaded).catch(this.onError)
  }

  render() {
    const { movies, guestSessionId } = this.props
    const { loading, error } = this.state
    const hasResults = movies && movies.length > 0
    const pairsOfFilms = hasResults
      ? movies.reduce((pairs, film, index) => {
          if (index % 2 === 0) {
            pairs.push([film])
          } else {
            pairs[pairs.length - 1].push(film)
          }
          return pairs
        }, [])
      : []

    return (
      <>
        <Online>
          {loading && (
            <Spin
              style={{
                width: '100%',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            />
          )}
          {error && (
            <Alert
              message="Ошибка при загрузке данных"
              description="Пожалуйста, попробуйте снова позже."
              type="error"
            />
          )}
          {hasResults ? (
            pairsOfFilms.map((pair, index) => (
              // eslint-disable-next-line prettier/prettier
              <div key={index}>
                <Row
                  style={{
                    paddingTop: '20px',
                    justifyContent: 'space-between',
                    paddingBottom: '20px',
                    display: 'flex',
                    alignItems: 'stretch',
                  }}
                  gutter={36}
                  justify="center"
                >
                  {pair.map((film, filmIndex) => (
                    <Col key={filmIndex} span={11}>
                      <CardFilm guestSessionId={guestSessionId} film={film} />
                    </Col>
                  ))}
                </Row>
              </div>
            ))
          ) : (
            <Alert message="Нет результатов" description="Попробуйте изменить запрос для поиска фильмов." type="info" />
          )}
        </Online>
        <Offline>
          <Alert
            message="Отсутствует подключение к интернету"
            description="Пожалуйста, проверьте ваше соединение и попробуйте снова."
            type="error"
          />
        </Offline>
      </>
    )
  }
}
