import React, { useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { makeStyles } from '@material-ui/core/styles'
import { Card } from '@material-ui/core'

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

// const GET_ALL_TOOLS = gql`
// {
//   ${TABLE}(distinct_on: object_id, where: {object_id: {_is_null: false}}) {
//     object_id
//   }
// }
// `

function Results () {
  const classes = useStyles()

  // const { loading, error, data } = useQuery(GET_ALL_TOOLS)

  // const suggestions = extractQuery(TABLE, data).map(suggestion => ({
  //   label: getValue(TOOL, suggestion)
  // }))

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <div className={classes.inner}>

          TEST

          <div className={classes.divider} />

        </div>
      </Card>
    </div>
  )
}

export default Results
