import React from "react"
import './styles.css'
import useWindowSize from "../components/Hooks/useWindowSize"
import ScatterPlotViz from "../components/Viz/ScatterPlotViz"
import data from '../data/my_weather_data.json'

const ScatterPlot = () => {
    const [width, height] = useWindowSize()

    // Accessors
    const xAccessor = (d) => d.dewPoint
    const yAccessor = (d) => d.humidity

    // Labels
    const xAxisLabel = "Dew point (&deg;F)"
    const yAxisLabel = "Relative humidity"

    return (
        <div className="pages">
            <h1>Scatter Plot</h1>
            <ScatterPlotViz 
                data={data}
                xAccessor={xAccessor}
                yAccessor={yAccessor}
                xAxisLabel={xAxisLabel}
                yAxisLabel={yAxisLabel}
                width={width - 280}
                height={height - 130} />
        </div>
    );
}

export default ScatterPlot