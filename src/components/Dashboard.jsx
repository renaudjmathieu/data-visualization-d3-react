import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react"

import { useChartsContext } from "../providers/ChartsProvider"
import { useDataContext } from "../providers/DataProvider"

import Container from "./chart/Container"

import * as d3 from 'd3'

const Dashboard = (props, ref) => {

    const { charts } = useChartsContext()
    const { selectedChartIndex, selectedColumnType, selectedColumn1, selectedColumn2, selectedItem1, selectedItem2, selectedFormat1, selectedFormat2, highlightedData, setHighlightedData } = useDataContext()

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
        if (e.target.tagName === "DIV" &&
            (!e.target.classList.contains("SelectableList")) &&
            (!e.target.classList.contains("SelectableList__column-headers")) &&
            (!e.target.classList.contains("SelectableList__column-header")) &&
            (!e.target.classList.contains("SelectableList__items")) &&
            (!e.target.classList.contains("SelectableList__item")) &&
            (!e.target.classList.contains("SelectableList__item--is-selected")) &&
            (!e.target.classList.contains("SelectableList__item--is-next-to-selected")) &&
            (!e.target.classList.contains("SelectableList__item--is-not-selected")) &&
            (!e.target.classList.contains("SelectableList__item__left")) &&
            (!e.target.classList.contains("SelectableList__item__right")) &&
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

    const handleHighlightData = (e, chartIndex, columnType, column1, column2, item1, item2, format1, format2) => {
        setHighlightedData(chartIndex, columnType, column1, column2, item1, item2, format1, format2)
    }

    React.useEffect(() => {
        setHighlightedData(selectedChartIndex, selectedColumnType, selectedColumn1, selectedColumn2, selectedItem1, selectedItem2, selectedFormat1, selectedFormat2)
    }, [])

    console.log('highlightedData - 1', highlightedData)

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
                            chartIndex={index}
                            chosen={chosen}
                            handleHighlightData={handleHighlightData}
                            fields={props.fields}
                        />
                    }
                    )}
            </div>
        </div>
    )
}

export default forwardRef(Dashboard)