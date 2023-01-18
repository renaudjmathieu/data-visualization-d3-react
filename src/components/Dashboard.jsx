import React, { useState, useEffect, useRef } from "react"
import * as d3 from "d3"
import { getTimelineData, getScatterData, getRandomData } from "./../utils/dummyData"

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
    timeline: getTimelineData(),
    scatter: getScatterData(),
    random: getRandomData(),
})
const Dashboard = (props) => {
    const [data, setData] = useState(getData())

    const selectedCharts = props.selectedCharts;
    const [charts, setCharts] = useState(selectedCharts);

    useEffect(() => {
        setCharts(selectedCharts);
    }, [selectedCharts]);

    const checkedAnimate = props.checkedAnimate;
    const [animate, setAnimate] = useState(checkedAnimate);

    useEffect(() => {
        setAnimate(checkedAnimate);
    }, [checkedAnimate]);

    useInterval(() => {
        setData(getData())
    }, animate ? 4000 : null)

    return (
        <div className="App__charts">
            {charts
                .map(chart => {
                    switch (chart) {
                        case "ScatterPlot": return <ScatterPlot
                            data={data.scatter}
                            xAccessor={humidityAccessor}
                            yAccessor={temperatureAccessor}
                            xLabel="Humidity"
                            yLabel="Temperature"
                        />
                        case "Pie": return <Pie
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
                            data={data.scatter}
                            xAccessor={humidityAccessor}
                            xLabel="Humidity"
                        />
                        case "Timeline": return <Timeline
                            data={data.timeline}
                            xAccessor={dateAccessor}
                            yAccessor={temperatureAccessor}
                            label="Temperature"
                        />
                        case "Treemap": return <Treemap
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