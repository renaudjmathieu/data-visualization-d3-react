import React from "react"
import * as d3 from "d3"
import '../index.css'
import useWindowSize from "../components/Hooks/useWindowSize"
import LineChartViz from "../components/Viz/LineChartViz"
import data from '../data/my_weather_data.json'
import Grid from '@mui/material/Unstable_Grid2';

const LineChart = () => {
    const [width, height] = useWindowSize()
    const parseDate = d3.timeParse("%Y-%m-%d")
    return (
        <div className="page">
            <Grid container spacing={2}>
                <Grid xs={12}>
                    <LineChartViz
                        data={data}
                        xAccessor={(d) => parseDate(d.date)}
                        yAccessor={(d) => d.temperatureMin}
                        xAxisLabel="Date"
                        yAxisLabel="Min temperature (&deg;F)"
                        width={width - 240}
                        height={height - 130} />
                </Grid>
            </Grid>
        </div>
    );
}

export default LineChart