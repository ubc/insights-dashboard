import React from 'react'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { Error, Spinner } from '../../components'

const ChartCard = ChartComponent => props => {
  const {
    classes,
    loaded,
    data,
    title,
    xs = 12,
    sm = 6,
    md = 4
  } = props

  return (
    <Grid item xs={xs} sm={sm} md={md}>
      <Paper className={classes.paper}>
        {props.children}
        <Grid item xs={xs}>
          <Typography gutterBottom variant='h6'>{title}</Typography>
          {loaded ? (data ? <ChartComponent {...props} /> : <Error />) : <Spinner />}
        </Grid>
      </Paper>
    </Grid>
  )
}

export default ChartCard
