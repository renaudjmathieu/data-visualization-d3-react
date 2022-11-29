import React from "react"
import './styles.css'
import useWindowSize from "../components/Hooks/useWindowSize"
import BoxViz from "../components/Viz/BoxViz"
import data from '../data/my_weather_data.json'

const Box = () => {
    const [width, height] = [window.innerWidth, window.innerHeight]
    return (
        <div className="pages">
            <h1>A Box</h1>
            <BoxViz Data={data} Width={width - 280} Height={height - 130} />
        </div>
    );
}

export default Box