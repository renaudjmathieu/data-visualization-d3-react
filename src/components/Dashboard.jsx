import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react"
import Container from "./chart/Container"

import * as d3 from 'd3'

const Dashboard = (props, ref) => {

    const [charts, setCharts] = useState(props.charts)

    useEffect(() => {
        setCharts(props.charts)
    }, [props.charts])

    const [chosen, setChosen] = useState(null);

    const OpenDrawer = (chart, index) => {
        setChosen(index)
        document.body.classList.add("config-open")
        document.body.classList.remove("config-closed")
        props.handleDrawerOpen(chart, index)
    }

    const CloseDrawer = () => {
        setChosen(null)
        document.body.classList.add("config-closed")
        document.body.classList.remove("config-open")
        props.handleDrawerClose()
    }

    const handleClick1 = (e, chart, index) => {
        OpenDrawer(chart, index)
    }

    const handleClick2 = (e, chart, index) => {

    }

    const handleOutsideClick = (e) => {
        console.log('handleOutsideClick - e.target', e.target.classList)
        if (e.target.tagName === "DIV" &&
        (!e.target.classList.contains("SelectableList__column-headers")) &&
        (!e.target.classList.contains("SelectableList__column-header")) &&
        (!e.target.classList.contains("SelectableList__item")) &&
        (!e.target.classList.contains("SelectableList__item__label")) &&
        (!e.target.classList.contains("SelectableList__item__bar")) &&
        (!e.target.classList.contains("SelectableList__item__value")) &&
            (!e.target.classList.contains("Chart__rectangle")) &&
            (!e.target.classList.contains("Chart__rectangle__large")) &&
            (!e.target.classList.contains("Chart__square"))) {
            CloseDrawer()
        }
    }

    const handleOutsideOutsideClick = (e) => {
        if (e.target.tagName === "HTML" || e.target.tagName === "MAIN" || e.target.tagName === "SPAN" || e.target.classList.contains("close_me")) {
            CloseDrawer()
        }
    }

    const doSomething = () => {
        setChosen(null)
    }

    useImperativeHandle(ref, () => ({ doSomething }))

    useEffect(() => {
        document.addEventListener("click", handleOutsideOutsideClick)

        return () => {
            document.removeEventListener("click", handleOutsideOutsideClick)
        }
    })







    const [selectedChart, setSelectedChart] = React.useState(null)
    const [selectedColumnType, setSelectedColumnType] = React.useState(null)
    const [selectedColumn1, setSelectedColumn1] = React.useState(null)
    const [selectedColumn2, setSelectedColumn2] = React.useState(null)
    const [selectedItem1, setSelectedItem1] = React.useState(null)
    const [selectedItem2, setSelectedItem2] = React.useState(null)
    const [selectedFormat1, setSelectedFormat1] = React.useState(null)
    const [selectedFormat2, setSelectedFormat2] = React.useState(null)
    const [filteredData, setFilteredData] = React.useState(
        _.map(props.data.random, (d) => {
            return {
                ...d,
                marked: true
            }
        })
    )

    const doStuff = (chartIndex, columnType, column1, column2, item1, item2, format1, format2) => {
        console.log('chartIndex', chartIndex)
        console.log('columnType', columnType)
        console.log('column1', column1)
        console.log('column2', column2)
        console.log('item1', item1)
        console.log('item2', item2)
        console.log('format1', format1)
        console.log('format2', format2)

        const formatter = format1 ? d3.timeFormat(format1) : null

        const filteredData =
            columnType === 'SingleValue' ? _.map(props.data.random, (d) => {
                return {
                    ...d,
                    marked: (format1 ? formatter(item1) : item1) === d[column1] ? true : false
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

        console.log('date?!?', _.filter(filteredData, { marked: true }))

        setFilteredData(filteredData)
        setSelectedChart(chartIndex)
        setSelectedColumnType(columnType)
        setSelectedColumn1(column1)
        setSelectedColumn2(column2)
        setSelectedItem1(item1)
        setSelectedItem2(item2)
        setSelectedFormat1(format1)
        setSelectedFormat2(format2)
    }

    const onDoStuff = (e, chartIndex, columnType, column1, column2, item1, item2, format1, format2) => {
        doStuff(chartIndex, columnType, column1, column2, item1, item2, format1, format2)
    }

    React.useEffect(() => {
        doStuff(selectedChart, selectedColumnType, selectedColumn1, selectedColumn2, selectedItem1, selectedItem2, selectedFormat1, selectedFormat2)
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
                <div className="tooltipD3-value3">
                    <span id="tooltipD3-value3"></span>
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