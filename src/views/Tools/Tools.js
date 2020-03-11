import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { makeStyles } from '@material-ui/core/styles'
import { Card } from '@material-ui/core'
import { withRouter } from 'react-router-dom'

import { Activity } from './components'
import { SearchWithDate } from '../../components'
import { TABLE, TOOL } from '../../utils/constants'
import { usePreviousDate } from '../../hooks'
import { extractQuery, getValue } from '../../utils/parser'
import { formatDate } from '../../utils/utilities'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3)
  },
  card: {
    flexGrow: 1,
    padding: theme.spacing(8)
  },
  paper: {
    color: theme.palette.text.secondary,
    flexGrow: 1,
    padding: theme.spacing(2)
  },
  divider: {
    height: theme.spacing(2)
  }
}))

const GET_ALL_TOOLS = gql`
{
  ${TABLE}(distinct_on: object_id, where: {object_id: {_is_null: false}}) {
    object_id
  }
}
`

function Tools (props) {
  const url = new URL(window.location.href)

  const [searchValue, setSearchValue] = useState(url.searchParams.get("searchValue")? url.searchParams.get("searchValue") : '')
  const [startDate, setStartDate] = useState(url.searchParams.get("startDate") ? new Date(url.searchParams.get("startDate")) : new Date('2018-08-02'))
  const [endDate, setEndDate] = useState(url.searchParams.get("endDate") ? new Date(url.searchParams.get("endDate")) : new Date())

  const classes = useStyles()

  const startDateResolver = formatDate(usePreviousDate(startDate), startDate)
  const endDateResolver = formatDate(usePreviousDate(endDate), endDate)

  const { loading, error, data } = useQuery(GET_ALL_TOOLS)

  const suggestions = extractQuery(TABLE, data).map(suggestion => ({
    label: getValue(TOOL, suggestion)
  }))

  useEffect(() => {
    const startDateStr = formatDate(new Date(), startDate)
    const endDateStr = formatDate(new Date(), endDate)
    props.history.push(`tools?searchValue=${searchValue}&startDate=${startDateStr}&endDate=${endDateStr}`)
  }, [searchValue, startDate, endDate])

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <div className={classes.inner}>

          <SearchWithDate
            endDate={endDate}
            searchError={error}
            searchLoad={loading}
            setEndDate={setEndDate}
            setSearchValue={setSearchValue}
            setStartDate={setStartDate}
            startDate={startDate}
            suggestions={suggestions}
            label='Tool'
          />

          <div className={classes.divider} />

          <Activity
            classes={classes}
            startDate={startDateResolver}
            endDate={endDateResolver}
            searchValue={searchValue}
          />

        </div>
      </Card>
    </div>
  )
}

export default withRouter(Tools)
