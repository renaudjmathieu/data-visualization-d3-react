import React from "react"

import { useChartsContext } from "../../providers/ChartsProvider"
import { useDataContext } from "../../providers/DataProvider"

import Container from "../Container"
import Tooltip from "../Tooltip"

import "./style.css"

const Dashboard = (props) => {

    const { charts } = useChartsContext()
    const { selectedChartIndex, selectedColumnType, selectedColumn1, selectedColumn2, selectedItem1, selectedItem2, selectedFormat1, selectedFormat2, setHighlightedData, setChosenChartIndex } = useDataContext()

    const OpenDrawer = (chart, index) => {
        setChosenChartIndex(index)
        document.body.classList.add("config-open")
        document.body.classList.remove("config-closed")
        props.handleDrawerOpen(chart, index)
    }

    const CloseDrawer = () => {
        setChosenChartIndex(null)
        document.body.classList.add("config-closed")
        document.body.classList.remove("config-open")
        props.handleDrawerClose()
    }

    const handleClick1 = (e, chart, index) => {
        OpenDrawer(chart, index)
    }

    const handleClick2 = (e, chart, index) => {
    }

    const handleOutsideClick1 = (e) => {
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

    const handleOutsideClick2 = (e) => {
        if (e.target.tagName === "HTML" || e.target.tagName === "MAIN" || e.target.tagName === "SPAN" || e.target.classList.contains("close_me")) {
            CloseDrawer()
        }
    }

    React.useEffect(() => {
        document.addEventListener("click", handleOutsideClick2)

        return () => {
            document.removeEventListener("click", handleOutsideClick2)
        }
    })

    const handleHighlightData = (e, chartIndex, columnType, column1, column2, item1, item2, format1, format2) => {
        setHighlightedData(chartIndex, columnType, column1, column2, item1, item2, format1, format2)
    }

    React.useEffect(() => {
        setHighlightedData(selectedChartIndex, selectedColumnType, selectedColumn1, selectedColumn2, selectedItem1, selectedItem2, selectedFormat1, selectedFormat2)
    }, [])

    return (
        <div className="App__charts__dashboard" onClick={handleOutsideClick1}>
            <div className="App__charts__config">
            </div>
            <Tooltip
                zoomed={false}
            />
            <div className="App__charts">
                {charts
                    .map((chart, index) => {
                        return <Container
                            opened={props.opened}
                            onClick1={(e) => handleClick1(e, chart, index)}
                            onClick2={(e) => handleClick2(e, chart, index)}
                            chartIndex={index}
                            handleHighlightData={handleHighlightData}
                        />
                    }
                    )}
            </div>
        </div>
    )
}

export default Dashboard