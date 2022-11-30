import React from "react"
import '../index.css'
import useWindowSize from "../components/Hooks/useWindowSize"
import ScatterPlotViz from "../components/Viz/ScatterPlotViz"
import data from '../data/my_weather_data.json'
import Grid from '@mui/material/Unstable_Grid2';

const ScatterPlot = () => {
    const [width, height] = useWindowSize()
    return (
        <div className="page">
            <Grid container spacing={2}>
                <Grid xs={12}>
                    <ScatterPlotViz
                        data={data}
                        xAccessor={(d) => d.dewPoint}
                        yAccessor={(d) => d.humidity}
                        colorAccessor={(d) => d.cloudCover}
                        xAxisLabel="Dew point (&deg;F)"
                        yAxisLabel="Relative humidity"
                        colorLegendLabel="Cloud cover"
                        width={width - 240}
                        height={height - 130} />
                </Grid>
            </Grid>
        </div>
    );
}

export default ScatterPlot