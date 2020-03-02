import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { isEmpty } from 'ramda'

import getDataProp from '../../../../utils/data'
import { ActivityChart, ChartCard, Spinner } from '../../../../components'
import { extractQuery } from '../../../../utils/parser'
import { TABLE } from '../../../../utils/constants'

const GET_COURSE_ACTIVITY = (course, startDate, endDate) => gql`
{
    ${TABLE}(where: {eventtime: {_gte: "${startDate}", _lte: "${endDate}"}, group_coursenumber: {_eq: "${course}", _is_null: false}}) {
        object_id
        eventtime
    }
}
`

const GroupChartCard = ChartCard(ActivityChart)

function Activity (props) {
  const { classes, startDate, endDate, searchValue } = props
  const [chartData, setChartData] = useState({})

  const { loading, error, data } = useQuery(GET_COURSE_ACTIVITY(searchValue, startDate, endDate), { skip: !searchValue })

  useEffect(() => {
    const eventData = getDataProp(extractQuery(TABLE, data))
    if (eventData) {
      setChartData(eventData)
    }
  }, [data])

  return (
    <GroupChartCard
      classes={classes}
      data={chartData}
      error={error}
      loading={loading ? isEmpty(chartData) : loading}
      title='Tools used in course'
      sm={false}
      md={false}
      xs={12}
    />
  )
}

Activity.propTypes = {
  classes: PropTypes.object,
  endDate: PropTypes.string.isRequired,
  searchValue: PropTypes.string.isRequired,
  startDate: PropTypes.string.isRequired
}

export default Activity
