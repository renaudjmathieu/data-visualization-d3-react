import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react"
import Container from "./chart/Container"

import * as d3 from 'd3'

const Dashboard = (props, ref) => {

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
    };

    const handleClick2 = (e, chart, index) => {

    };

    const handleOutsideClick = (e) => {
        if (e.target.tagName === "DIV" && (!e.target.classList.contains("Chart__rectangle")) && (!e.target.classList.contains("Chart__rectangle__large")) && (!e.target.classList.contains("Chart__square"))) {
            setChosen(null)
            document.body.classList.add("config-closed")
            document.body.classList.remove("config-open")
            props.handleDrawerClose();
        }
    };

    const handleOutsideOusideClick = (e) => {
        if (e.target.tagName === "HTML" || e.target.tagName === "MAIN" || e.target.tagName === "SPAN" || e.target.classList.contains("close_me")) {
            setChosen(null)
            document.body.classList.add("config-closed")
            document.body.classList.remove("config-open")
            props.handleDrawerClose();
        }
    };

    const doSomething = () => {
        setChosen(null);
    };

    useImperativeHandle(ref, () => ({ doSomething }));

    useEffect(() => {
        document.addEventListener("click", handleOutsideOusideClick);

        return () => {
            document.removeEventListener("click", handleOutsideOusideClick);
        };
    });







    const [selectedChart, setSelectedChart] = React.useState(null)
    const [selectedColumnType, setSelectedColumnType] = React.useState(null)
    const [selectedColumn1, setSelectedColumn1] = React.useState(null)
    const [selectedColumn2, setSelectedColumn2] = React.useState(null)
    const [selectedItem1, setSelectedItem1] = React.useState(null)
    const [selectedItem2, setSelectedItem2] = React.useState(null)
    const [filteredData, setFilteredData] = React.useState(
        _.map(props.data.random, (d) => {
            return {
                ...d,
                marked: true
            }
        })
    )

    const doStuff = (chartIndex, columnType, column1, column2, item1, item2) => {
        console.log('chartIndex', chartIndex)
        console.log('columnType', columnType)
        console.log('column1', column1)
        console.log('column2', column2)
        console.log('item1', item1)
        console.log('item2', item2)
        const filteredData =
            columnType === 'SingleValue' ? _.map(props.data.random, (d) => {
                return {
                    ...d,
                    marked: d[column1] === item1 ? true : false
                }
            }) :
                columnType === 'MultipleValues' ? _.map(props.data.random, (d) => {
                    return {
                        ...d,
                        marked: d[column1] === item1 && d[column2] === item2 ? true : false
                    }
                }) :
                    columnType === 'BinValues' ? _.map(props.data.random, (d) => {
                        return {
                            ...d,
                            marked: d[column1] >= d3.min([item1, item2]) && d[column1] < d3.max([item1, item2]) ? true : false
                        }
                    }) :
                        columnType === 'LastBinValues' ? _.map(props.data.random, (d) => {
                            return {
                                ...d,
                                marked: d[column1] >= d3.min([item1, item2]) && d[column1] <= d3.max([item1, item2]) ? true : false
                            }
                        }) :
                            _.map(props.data.random, (d) => {
                                return {
                                    ...d,
                                    marked: true
                                }
                            })

        console.log('columnType', columnType)

        setFilteredData(filteredData)
        setSelectedChart(chartIndex)
        setSelectedColumnType(columnType)
        setSelectedColumn1(column1)
        setSelectedColumn2(column2)
        setSelectedItem1(item1)
        setSelectedItem2(item2)
    }

    const onDoStuff = (e, chartIndex, columnType, column1, column2, item1, item2) => {
        doStuff(chartIndex, columnType, column1, column2, item1, item2)
    }

    React.useEffect(() => {
        doStuff(selectedChart, selectedColumnType, selectedColumn1, selectedColumn2, selectedItem1, selectedItem2)
    }, [])


    return (
        <div className="App__charts__dashboard" onClick={handleOutsideClick}>
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
                        return <Container
                            opened={props.opened}
                            onClick1={(e) => handleClick1(e, chart, index)}
                            onClick2={(e) => handleClick2(e, chart, index)}
                            chart={chart}
                            chosen={chosen}
                            chartIndex={index}
                            data={props.data.random}
                            filteredData={filteredData}
                            selectedChart={selectedChart}
                            selectedColumnType={selectedColumnType}
                            selectedColumn1={selectedColumn1}
                            selectedColumn2={selectedColumn2}
                            selectedItem1={selectedItem1}
                            selectedItem2={selectedItem2}
                            onDoStuff={onDoStuff}
                            fields={props.fields}
                        />
                    }
                    )}
            </div>
        </div>
    )
}

export default forwardRef(Dashboard)