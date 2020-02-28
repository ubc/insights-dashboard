import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { VictoryChart, VictoryGroup, VictoryLine, VictoryLegend } from 'victory'
import { Grid, Paper, Typography } from '@material-ui/core'
import { Error, Spinner } from '../../../../components'

import { extractQuery } from '../../../../utils/parser'
import { TOP_TOOLS_EVENT_COUNT_TABLE } from '../../../../utils/constants'
import { getRandomColor } from '../../../../utils/utilities'

const GET_TOOL_EVENT_COUNT = gql`
{
  ${TOP_TOOLS_EVENT_COUNT_TABLE}(where: {date: {_gt: "2019-01-01"}}) {
    count
    date
    object_id
  }
}
`

const getDataProp = data => {
  const toolTable = {}
  if (data.length > 0) {
    data.forEach(event => {
      const { date, object_id: objectId, count } = event

      const chartProp = {
        x: new Date(date),
        y: count
      }

      if (!toolTable[objectId]) {
        toolTable[objectId] = { data: [], color: getRandomColor() }
      }

      toolTable[objectId].data.push(chartProp)
    })
  }
  return toolTable
}

function LineChart ({ toolTable }) {
  const toolNames = Object.keys(toolTable)
  return (
    <VictoryChart scale={{ x: 'time' }} width={1200}>
      {
        toolNames.map(toolId => (
          <VictoryGroup
            color={toolTable[toolId].color}
            key={toolId}
            data={toolTable[toolId].data}
          >
            <VictoryLine />
          </VictoryGroup>
        ))
      }
    </VictoryChart>
  )
}

function LineLegend ({ toolTable, handleMouseOver, handleMouseOut }) {
  const toolNames = Object.keys(toolTable)
  return (
    <VictoryLegend
      title='Tools'
      centerTitle
      gutter={20}
      data={
        toolNames.map(toolName => (
          {
            name: toolName,
            symbol: { fill: toolTable[toolName].color }
          }
        ))
      }
      events={[{
        target: "labels",
        eventHandlers: {
          onMouseOver: (e) => {
            const name = e.target.innerHTML
            handleMouseOver(name)
          },
          onMouseOut: () => {
            handleMouseOut()
          }
        }
      }]}
    />
  )
}

function TopTenTools (props) {
  const { classes } = props

  const { loading, error, data } = useQuery(GET_TOOL_EVENT_COUNT)
  const [toolTableData, setToolTableData] = useState({})

  const focusOnOneColor = (name) => {
    let data = {...toolTableData}
    for (const tool in toolTableData) {
      data[tool].color = tool !== name ? '#d0d0d0' : data[tool].color
    }
    setToolTableData(data)
  }

  const focusOut = () => {
    let data = {...toolTableData}
    for (const tool in toolTableData) {
      data[tool].color = getRandomColor()
    }
    setToolTableData(data)
  }

  useEffect(() => {
    const eventData = getDataProp(extractQuery(TOP_TOOLS_EVENT_COUNT_TABLE, data))
    if (eventData) {
      setToolTableData(eventData)
    }
  }, [loading, data])

  return (
    <Grid item xs={12}>
      <Paper className={classes.paper}>
        <Typography gutterBottom variant='h6'>Top 10 tool event activity</Typography>
        {
          error
            ? <Error />
            : Object.keys(toolTableData).length === 0
              ? <Spinner />
              : (
                <Grid container spacing={0}>
                  <Grid item xs={9}>
                    <LineChart toolTable={toolTableData} />
                  </Grid>
                  <Grid item xs={3}>
                    <LineLegend toolTable={toolTableData} handleMouseOver={focusOnOneColor} handleMouseOut={focusOut} />
                  </Grid>
                </Grid>
              )
        }
      </Paper>
    </Grid>
  )
}

TopTenTools.propTypes = {
  classes: PropTypes.object
}

export default TopTenTools
