import React from "react"
import './styles.css'
import useWindowSize from "../components/Hooks/useWindowSize"
import LineChartViz from "../components/Viz/LineChartViz"
import data from '../data/my_weather_data.json'

const LineChart = () => {
    const [width, height] = useWindowSize()
    return (
        <div className="pages">
            <h1>Line Chart</h1>
            <LineChartViz Data={data} Width={width - 280} Height={height - 130} />
        </div>
    );
}

export default LineChart