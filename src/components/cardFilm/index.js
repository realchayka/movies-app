import React from 'react'
import { Col, Row, Card, Typography, Rate } from 'antd'
import { format, parseISO } from 'date-fns'
import { enGB } from 'date-fns/locale'

import './cardFilm.css'
import { GenreConsumer } from '../../services/genreContext'
import MoviesService from '../../services/movies-service'
import assets from '../../assets/index'

const { Title, Text } = Typography

export default class CardFilm extends React.Component {
  movieService = new MoviesService()

  truncateText(text, maxCharacters) {
    if (text.length <= maxCharacters) return text

    const words = text.split(' ')
    let truncatedText = words.slice(0, maxCharacters).join(' ')
    return truncatedText + '...'
  }

  getRatingColor(rating) {
    if (rating > 0 && rating < 3) return '#E9000'
    if (rating >= 3 && rating < 5) return '#E97E00'
    if (rating >= 5 && rating < 7) return '#E9D100'
    return '#66E900'
  }

  handleRateFilm = async (value) => {
    try {
      const { film, guestSessionId } = this.props
      await this.movieService.addRating(film.id, guestSessionId, value)
      const updatedRatedMovies = [...this.props.ratedMovies]
      const movieIndex = updatedRatedMovies.findIndex((movie) => movie.id === film.id)

      if (movieIndex !== -1) {
        updatedRatedMovies[movieIndex].userRating = value
      }

      this.props.onRateFilm(updatedRatedMovies)
    } catch (error) {
      console.error('Ошибка при установке оценки фильма:', error)
    }
  }

  render() {
    const { title, overview, releaseDate, posterPath, voteAverage, genreIds, rating } = this.props.film
    const roundedRating = parseFloat(voteAverage.toFixed(1))
    const ratingColor = this.getRatingColor(roundedRating)
    const formattedDate = releaseDate
      ? format(parseISO(releaseDate), 'MMMM dd, yyyy', { locale: enGB })
      : 'Дата не указана'
    const truncatedOverview = this.truncateText(overview, 70)

    return (
      <Card
        style={{
          height: '100%',
          position: 'relative',
          borderRadius: '0',
          maxWidth: '451px',
          width: '100%',
          paddingRight: '10px',
          boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.15)',
        }}
        bordered={false}
      >
        <div className="rating" style={{ borderColor: ratingColor }}>
          <span>{roundedRating}</span>
        </div>
        <Row style={{ height: '100%' }} gutter={16}>
          <Col style={{ height: '100%' }} span={10}>
            <img
              style={{ height: '100%', width: '100%', objectFit: 'cover' }}
              src={posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : assets.noImage}
              alt="фото"
            />
          </Col>
          <Col span={14}>
            <Row>
              <Title style={{ width: '88%', marginTop: '12px' }} level={3}>
                {title}
              </Title>
            </Row>
            <Text style={{ color: '#827E7E' }}>{formattedDate}</Text>
            <Col style={{ padding: '0', paddingTop: '10px', paddingBottom: '10px' }}>
              <GenreConsumer>
                {(context) => {
                  const { genres } = context
                  if (genres) {
                    const movieGenres = genres.genres.filter((genre) => genreIds.includes(genre.id))
                    return (
                      <div className="filtersContainer">
                        {movieGenres.map(({ name, id }) => (
                          <span className="filters" key={id}>
                            {name}
                          </span>
                        ))}
                      </div>
                    )
                  }
                }}
              </GenreConsumer>
            </Col>
            <Text className="card-film-text">{truncatedOverview}</Text>
            <Rate value={rating} onChange={this.handleRateFilm} count={10} allowHalf style={{ marginTop: '12px' }} />
          </Col>
        </Row>
      </Card>
    )
  }
}
