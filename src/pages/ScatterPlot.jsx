import React from "react";
import './styles.css';
import ScatterPlotViz from "../components/Viz/ScatterPlotViz";
import data from '../data/my_weather_data.json';

const ScatterPlot = () => {
    return (
        <div className="pages">
            <h1>Scatter Plot</h1>
            <ScatterPlotViz Data={data} />
        </div>
    );
}

export default ScatterPlot;