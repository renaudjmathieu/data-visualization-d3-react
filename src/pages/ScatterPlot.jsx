import React from "react"
import './styles.css'
import useWindowSize from "../components/Hooks/useWindowSize"
import ScatterPlotViz from "../components/Viz/ScatterPlotViz"
import data from '../data/my_weather_data.json'

const ScatterPlot = () => {
    const [width, height] = useWindowSize()
    return (
        <div className="pages">
            <h1>Scatter Plot</h1>
            <ScatterPlotViz Data={data} Width={width - 280} Height={height - 130} />
        </div>
    );
}

export default ScatterPlot