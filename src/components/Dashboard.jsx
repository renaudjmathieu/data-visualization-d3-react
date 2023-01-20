import React, { useState, useEffect, useRef } from "react"
import * as d3 from "d3"
import { getRandomData } from "./../utils/dummyData"

import ScatterPlot from "./ScatterPlot"
import Pie from "./Pie"
import Radar from "./Radar"
import Histogram from "./Histogram"
import Timeline from "./Timeline"
import Treemap from "./Treemap"

const parseDate = d3.timeParse("%m/%d/%Y")
const formatMonth = d3.timeFormat("%b")
const dateAccessor = d => parseDate(d.date)
const monthAccessor = d => formatMonth(parseDate(d.date))
const temperatureAccessor = d => d.temperature
const humidityAccessor = d => d.humidity
const numberAccessor = d => d.number
const categoryAccessor = d => d.category

const getData = () => ({
    random: getRandomData(),
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
        console.log(e.target.tagName);
        console.log(e.target);
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
                        switch (chart) {
                            case "ScatterPlot": return <ScatterPlot
                                outOfFocus={chosen !== null && index !== chosen}
                                active={index === chosen}
                                onClick={(e) => handleClick(e, chart, index)}
                                data={data.random}
                                xAccessor={humidityAccessor}
                                yAccessor={temperatureAccessor}
                                xLabel="Humidity"
                                yLabel="Temperature"
                            />
                            case "Pie": return <Pie
                                outOfFocus={chosen !== null && index !== chosen}
                                active={index === chosen}
                                onClick={(e) => handleClick(e, chart, index)}
                                data={data.random}
                                valueAccessor={numberAccessor}
                                entityAccessor={categoryAccessor}
                            />
                            case "Radar": return <Radar
                                data={data.random}
                                valueAccessor={numberAccessor}
                                entityAccessor={categoryAccessor}
                            />
                            case "Histogram": return <Histogram
                                outOfFocus={chosen !== null && index !== chosen}
                                active={index === chosen}
                                onClick={(e) => handleClick(e, chart, index)}
                                data={data.random}
                                xAccessor={humidityAccessor}
                                xLabel="Humidity"
                            />
                            case "Timeline": return <Timeline
                                outOfFocus={chosen !== null && index !== chosen}
                                active={index === chosen}
                                onClick={(e) => handleClick(e, chart, index)}
                                data={data.random}
                                xAccessor={dateAccessor}
                                yAccessor={temperatureAccessor}
                                label="Temperature"
                            />
                            case "Treemap": return <Treemap
                                outOfFocus={chosen !== null && index !== chosen}
                                active={index === chosen}
                                onClick={(e) => handleClick(e, chart, index)}
                                data={data.random}
                                valueAccessor={numberAccessor}
                                entityAccessor={categoryAccessor}
                                valueLabel="Number"
                                entityLabel="Category"
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