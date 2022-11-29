import React from "react";
import './styles.css';
import BoxViz from "../components/Viz/BoxViz";
import data from '../data/my_weather_data.json';

const Box = () => {
    return (
        <div className="pages">
            <h1>A Box</h1>
            <BoxViz Data={data} />
        </div>
    );
}

export default Box;