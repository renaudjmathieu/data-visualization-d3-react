import React, { useState, useEffect, useRef } from "react"
import * as d3 from "d3"

import ScatterPlot from "./ScatterPlot"
import Pie from "./Pie"
import Radar from "./Radar"
import Histogram from "./Histogram"
import Timeline from "./Timeline"

const Dashboard = (props) => {

    const ref = useRef();

    const [charts, setCharts] = useState(props.charts);

    useEffect(() => {
        setCharts(props.charts);
    }, [props.charts]);

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
            <div id="tooltipD3" className="tooltipD3">
                <div className="tooltipD3-value1">
                    <span id="tooltipD3-value1"></span>
                </div>
                <div className="tooltipD3-value2">
                    <span id="tooltipD3-value2"></span>
                </div>
            </div>
            <div className="App__charts">
                {charts
                    .map((chart, index) => {
                        switch (chart.id) {
                            case "scatter": return <ScatterPlot
                                outOfFocus={chosen !== null && index !== chosen}
                                active={index === chosen}
                                onClick={(e) => handleClick(e, chart, index)}
                                data={props.data.random}
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
                                data={props.data.random}
                                xAxis={chart.xAxis}
                                yAxis={chart.yAxis}
                                xAxisParser={props.fields.find(field => field.id === chart.xAxis).parser}
                                xAxisFormatter={props.fields.find(field => field.id === chart.xAxis).formatter}
                                yAxisSummarization={chart.yAxisSummarization}
                            />
                            case "timeline": return <Timeline
                                outOfFocus={chosen !== null && index !== chosen}
                                active={index === chosen}
                                onClick={(e) => handleClick(e, chart, index)}
                                data={props.data.random}
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