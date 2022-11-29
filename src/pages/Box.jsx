import React from "react"
import './styles.css'
import BoxViz from "../components/Viz/BoxViz"

const Box = () => {
    return (
        <div className="pages">
            <h1>A Box</h1>
            <BoxViz />
        </div>
    );
}

export default Box