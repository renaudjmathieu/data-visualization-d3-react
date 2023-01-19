import React, { useState, useEffect, useRef } from "react"
import * as d3 from "d3"
import { getTimelineData, getScatterData, getRandomData } from "./../utils/dummyData"

import ScatterPlot from "./ScatterPlot"
import Pie from "./Pie"
import Radar from "./Radar"
import Histogram from "./Histogram"
import Timeline from "./Timeline"
import Treemap from "./Treemap"

import Box from "@mui/material/Box";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Slider from '@mui/material/Slider';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

import useOutsideClick from "./useOutsideClick";

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

    const ref = useRef();
    const [data, setData] = useState(getData())

    const selectedCharts = props.selectedCharts;
    const [charts, setCharts] = useState(selectedCharts);

    useEffect(() => {
        setCharts(selectedCharts);
    }, [selectedCharts]);

    const [animate, setAnimate] = React.useState(true);

    const handleAnimate = (event) => {
        setAnimate(event.target.checked);
    };

    useInterval(() => {
        setData(getData())
    }, animate ? 4000 : null)

    const [chosen, setChosen] = useState();

    const handleClick = (e, chart) => {
        setChosen(chart);

        document.body.classList.add("config-open")
        document.body.classList.remove("config-closed")
    };

    const handleOutsideClick = (e) => {
        if (e.target.tagName === "DIV") {
            setChosen(null);
            document.body.classList.add("config-closed")
            document.body.classList.remove("config-open")
        }
    };

    useOutsideClick(ref, () => {
        setChosen(null);
        document.body.classList.add("config-closed")
        document.body.classList.remove("config-open")
    });

    return (
        <div className="App__charts__dashboard" ref={ref} onClick={handleOutsideClick}>
            <div className="App__charts__config">
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2} className="containerOnDesktop">
                        <Grid xs={8} className="gridOnDesktop__left">

                        </Grid>
                        <Grid xs={4} className="gridOnDesktop__right">
                            <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
                                <RemoveIcon className="RemoveIcon" />
                                <Slider className="sliderOnDesktop"
                                    defaultValue={30}
                                    valueLabelDisplay="auto"
                                    step={10}
                                    marks
                                    min={10}
                                    max={110}
                                />
                                <AddIcon className="AddIcon" />
                                <FormGroup>
                                    <FormControlLabel control={
                                        <Switch
                                            checked={animate}
                                            onChange={handleAnimate}
                                            inputProps={{ 'aria-label': 'controlled' }}
                                        />
                                    } label="Animate" />
                                </FormGroup>
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
            </div>
            <div className="App__charts">
                {charts
                    .map(chart => {
                        switch (chart) {
                            case "ScatterPlot": return <ScatterPlot
                                active={chart === chosen}
                                onClick={(e) => handleClick(e, chart)}
                                data={data.scatter}
                                xAccessor={humidityAccessor}
                                yAccessor={temperatureAccessor}
                                xLabel="Humidity"
                                yLabel="Temperature"
                            />
                            case "Pie": return <Pie
                                active={chart === chosen}
                                onClick={(e) => handleClick(e, chart)}
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
                                active={chart === chosen}
                                onClick={(e) => handleClick(e, chart)}
                                data={data.scatter}
                                xAccessor={humidityAccessor}
                                xLabel="Humidity"
                            />
                            case "Timeline": return <Timeline
                                active={chart === chosen}
                                onClick={(e) => handleClick(e, chart)}
                                data={data.timeline}
                                xAccessor={dateAccessor}
                                yAccessor={temperatureAccessor}
                                label="Temperature"
                            />
                            case "Treemap": return <Treemap
                                active={chart === chosen}
                                onClick={(e) => handleClick(e, chart)}
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