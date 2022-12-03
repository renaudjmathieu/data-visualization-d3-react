import React, { useState } from 'react'
import { timeParse } from 'd3'
import '../../index.css'
import './styles.css'
import useWindowSize from "../../components/Hooks/useWindowSize"
import ScrollingLineChartViz from "../../components/Viz/ScrollingLineChartViz"
import data from '../../data/my_weather_data.json'
import Grid from '@mui/material/Unstable_Grid2'

const ScrollingLineChart = () => {
    const [width, height] = useWindowSize()
    const parseDate = timeParse("%Y-%m-%d")
    return (
        <div className="page">
            <Grid container spacing={2}>
                <Grid xs={12}>
                    <ScrollingLineChartViz
                        data={data}
                        xAccessor={(d) => parseDate(d.date)}
                        yAccessor={(d) => d.temperatureMax}
                        xAxisLabel="Date"
                        yAxisLabel="Max temperature (&deg;F)"
                        width={window.innerWidth - 240}
                        height={window.innerHeight - 130} />
                </Grid>
            </Grid>
        </div>
    );
}

export default ScrollingLineChart