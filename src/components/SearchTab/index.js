import React from 'react'
import { Input, Pagination } from 'antd'

import CardFilmContainer from '../cardFilmContainer'

const SearchTab = (props) => {
  const { searchValue, movies, currentPage, guestSessionId, totalItems, handleInputChange, handlePageChange } = props

  return (
    <>
      <Input
        value={searchValue}
        placeholder="Type to search..."
        style={{ width: '100%', margin: '0 auto' }}
        onChange={handleInputChange}
      />
      <CardFilmContainer guestSessionId={guestSessionId} movies={movies} />
      <Pagination
        itemActiveBg={'#000'}
        style={{ margin: '17px auto 36px auto' }}
        defaultCurrent={1}
        current={currentPage}
        total={totalItems}
        onChange={handlePageChange}
      />
    </>
  )
}

export default SearchTab
