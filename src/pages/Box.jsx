import React from "react"
import './styles.css'
import useWindowSize from "../components/Hooks/useWindowSize"
import BoxViz from "../components/Viz/BoxViz"
import data from '../data/my_weather_data.json'

const Box = () => {
    const [width, height] = useWindowSize()
    return (
        <div className="pages">
            <h1>A Box</h1>
            <BoxViz Data={data} Width={width} Height={height} />
        </div>
    );
}

export default Box