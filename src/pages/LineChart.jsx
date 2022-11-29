import React from "react";
import './styles.css'; 
import LineChartViz from "../components/Viz/LineChartViz";
import data from '../data/my_weather_data.json';

const LineChart = () => {
    return (
        <div className="pages">
            <h1>Line Chart</h1>
            <LineChartViz Data={data} />
        </div>
    );
}

export default LineChart;