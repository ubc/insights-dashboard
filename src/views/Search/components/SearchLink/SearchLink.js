import React from 'react'
import Button from '@material-ui/core/Button'

import { TableCard } from '../../../../components'

function SearchLink (props) {
  const { searchValue, error } = props

  const searchData = searchValue === '' ? [] : [{
    'Search Value': searchValue,
    Href: `/results?searchValue=${searchValue}`,
    Link: <Button variant='contained' color='primary' href={`/results?searchValue=${searchValue}`}> Link </Button>
  }]

  return (
    <TableCard
      data={searchData}
      error={error}
      headers={['Search Value', 'Href', 'Link']}
      loading={false}
    />
  )
}

export default SearchLink
