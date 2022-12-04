import React, { useState, useEffect, useRef } from "react"
import * as d3 from "d3"
import { getTimelineData, getScatterData } from "./../utils/dummyData"

import Timeline from "./Timeline"
import ScatterPlot from "./ScatterPlot"
import Histogram from "./Histogram"

const parseDate = d3.timeParse("%m/%d/%Y")
const dateAccessor = d => parseDate(d.date)
const temperatureAccessor = d => d.temperature
const humidityAccessor = d => d.humidity

const getData = () => ({
    timeline: getTimelineData(),
    scatter: getScatterData(),
})
const Dashboard = () => {
    const [data, setData] = useState(getData())

    useInterval(() => {
        setData(getData())
    }, 4000)

    return (
        <div className="App__charts">
            <Timeline
                data={data.timeline}
                xAccessor={dateAccessor}
                yAccessor={temperatureAccessor}
                label="Temperature"
            />
            <ScatterPlot
                data={data.scatter}
                xAccessor={humidityAccessor}
                yAccessor={temperatureAccessor}
                xLabel="Humidity"
                yLabel="Temperature"
            />
            <Histogram
                data={data.scatter}
                xAccessor={humidityAccessor}
                label="Humidity"
            />
        </div>
    )
}

export default Dashboard

function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    });

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}