import React from 'react'
import { Pagination } from 'antd'

import CardFilmContainer from '../cardFilmContainer'

const RatedTab = (props) => {
  const { ratedMovies, currentPage = 1, guestSessionId, ratedTotalPages = 100, handlePageChange } = props
  console.log(props)

  return (
    <>
      <CardFilmContainer guestSessionId={guestSessionId} movies={ratedMovies} />
      {ratedTotalPages > 1 && (
        <Pagination
          itemActiveBg={'#000'}
          style={{ margin: '17px auto 36px auto' }}
          defaultCurrent={1}
          current={currentPage}
          total={ratedTotalPages * 10}
          onChange={handlePageChange}
        />
      )}
    </>
  )
}

export default RatedTab
