import React from "react"
import * as d3 from "d3"
import './styles.css'
import useWindowSize from "../components/Hooks/useWindowSize"
import LineChartViz from "../components/Viz/LineChartViz"
import data from '../data/my_weather_data.json'

const LineChart = () => {
    const [width, height] = useWindowSize()

    // Accessors
    const parseDate = d3.timeParse("%Y-%m-%d")
    const xAccessor = (d) => parseDate(d.date)
    const yAccessor = (d) => d.temperatureMin

    // Labels
    const xAxisLabel = "Date"
    const yAxisLabel = "Min temperature (&deg;F)"

    return (
        <div className="pages">
            <h1>Line Chart</h1>
            <LineChartViz 
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

export default LineChart