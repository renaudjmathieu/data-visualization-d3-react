import React, { useState, useEffect, useRef } from "react"
import * as d3 from "d3"

import ScatterPlot from "./ScatterPlot"
import Pie from "./Pie"
import Radar from "./Radar"
import Histogram from "./Histogram"
import Timeline from "./Timeline"

import data from '../../my_weather_data.json'

const getData = () => ({
    random: data
    
})
const Dashboard = (props) => {

    const ref = useRef();
    const [data, setData] = useState(getData())

    const [charts, setCharts] = useState(props.charts);

    useEffect(() => {
        setCharts(props.charts);
    }, [props.charts]);

    const checkedAnimate = props.checkedAnimate;
    const [animate, setAnimate] = useState(checkedAnimate);

    useEffect(() => {
        setAnimate(checkedAnimate);
    }, [checkedAnimate]);

    useInterval(() => {
        setData(getData())
    }, animate ? 4000 : null)

    const [chosen, setChosen] = useState(null);

    const handleClick = (e, chart, index) => {
        setChosen(index);
        document.body.classList.add("config-open")
        document.body.classList.remove("config-closed")
        props.handleDrawerOpen(chart, index);
    };

    const handleOutsideClick = (e) => {
        if (e.target.tagName === "DIV" && (!e.target.classList.contains("Chart__rectangle")) && (!e.target.classList.contains("Chart__rectangle__large")) && (!e.target.classList.contains("Chart__square"))) {
            setChosen(null);
            document.body.classList.add("config-closed")
            document.body.classList.remove("config-open")
            props.handleDrawerClose();
        }
    };

    const handleOutsideOusideClick = (e) => {
        if (e.target.tagName === "HTML" || e.target.tagName === "MAIN" || e.target.tagName === "SPAN" || e.target.classList.contains("close_me")) {
            setChosen(null);
            document.body.classList.add("config-closed")
            document.body.classList.remove("config-open")
            props.handleDrawerClose();
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleOutsideOusideClick);

        return () => {
            document.removeEventListener("click", handleOutsideOusideClick);
        };
    });

    return (
        <div className="App__charts__dashboard" ref={ref} onClick={handleOutsideClick}>
            <div className="App__charts__config">

            </div>
            <div className="App__charts">
                {charts
                    .map((chart, index) => {
                        switch (chart.id) {
                            case "scatter": return <ScatterPlot
                                outOfFocus={chosen !== null && index !== chosen}
                                active={index === chosen}
                                onClick={(e) => handleClick(e, chart, index)}
                                data={data.random}
                                xAxis={chart.xAxis}
                                yAxis={chart.yAxis}
                                xAxisParser={props.fields.find(field => field.id === chart.xAxis).parser}
                                yAxisParser={props.fields.find(field => field.id === chart.yAxis).parser}
                                xAxisFormatter={props.fields.find(field => field.id === chart.xAxis).formatter}
                                yAxisFormatter={props.fields.find(field => field.id === chart.yAxis).formatter}
                            />
                            case "histogram": return <Histogram
                                outOfFocus={chosen !== null && index !== chosen}
                                active={index === chosen}
                                onClick={(e) => handleClick(e, chart, index)}
                                data={data.random}
                                xAxis={chart.xAxis}
                                yAxis={chart.yAxis}
                                xAxisParser={props.fields.find(field => field.id === chart.xAxis).parser}
                                yAxisParser={props.fields.find(field => field.id === chart.yAxis).parser}
                                xAxisFormatter={props.fields.find(field => field.id === chart.xAxis).formatter}
                                yAxisFormatter={props.fields.find(field => field.id === chart.yAxis).formatter}
                                yAxisSummarization={chart.yAxisSummarization}
                            />
                            case "timeline": return <Timeline
                                outOfFocus={chosen !== null && index !== chosen}
                                active={index === chosen}
                                onClick={(e) => handleClick(e, chart, index)}
                                data={data.random}
                                xAxis={chart.xAxis}
                                yAxis={chart.yAxis}
                                xAxisParser={props.fields.find(field => field.id === chart.xAxis).parser}
                                yAxisParser={props.fields.find(field => field.id === chart.yAxis).parser}
                                xAxisFormatter={props.fields.find(field => field.id === chart.xAxis).formatter}
                                yAxisFormatter={props.fields.find(field => field.id === chart.yAxis).formatter}
                            />
                            default: return null
                        }
                    })
                }
            </div>
        </div>
    )
}

export default Dashboard

function useInterval(callback, delay) {
    const savedCallback = useRef()

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback
    })

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current()
        }
        if (delay !== null) {
            let id = setInterval(tick, delay)
            return () => clearInterval(id)
        }
    }, [delay])
}