import React from "react"
import './styles.css'
import useWindowSize from "../components/Hooks/useWindowSize"
import HistogramViz from "../components/Viz/HistogramViz"
import data from '../data/my_weather_data.json'

const Histogram = () => {
    const [width, height] = useWindowSize()

    // Accessors
    const xAccessor = (d) => d.humidity
    const yAccessor = (d) => d.length

    // Labels
    const xAxisLabel = "Relative humidity"
    const yAxisLabel = "Length of day"

    return (
        <div className="pages">
            <h1>Histogram</h1>
            <HistogramViz 
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

export default Histogram