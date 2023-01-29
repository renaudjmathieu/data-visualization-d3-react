import React, { useState, useEffect, useRef } from "react"
import * as d3 from "d3"

import ChartContainer from "./Chart/ChartContainer"

const Dashboard = (props) => {

    const ref = useRef();

    const [charts, setCharts] = useState(props.charts);

    useEffect(() => {
        setCharts(props.charts);
    }, [props.charts]);

    const [chosen, setChosen] = useState(null);

    const handleClick1 = (e, chart, index) => {
        setChosen(index);
        document.body.classList.add("config-open")
        document.body.classList.remove("config-closed")
        props.handleDrawerOpen(chart, index);
        console.log('handleClick1')
    };

    const handleClick2 = (e, chart, index) => {
        setChosen(index);
        console.log('handleClick2')
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
                        return <ChartContainer
                            opened={props.opened}
                            onClick1={(e) => handleClick1(e, chart, index)}
                            onClick2={(e) => handleClick2(e, chart, index)}
                            chart={chart}
                            chosen={chosen}
                            index={index}
                            data={props.data.random}
                            fields={props.fields}
                        />
                    }
                    )}
            </div>
        </div>
    )
}

export default Dashboard