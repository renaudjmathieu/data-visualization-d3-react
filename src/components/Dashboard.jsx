import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react"
import Container from "./chart/Container"

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







    const [selectedColumn, setSelectedColumn] = React.useState(null)
    const [selectedItem, setSelectedItem] = React.useState(null)
    const [filteredData, setFilteredData] = React.useState(props.data.random)

    const doStuff = (column, item) => {
        const filteredData = item ? _.filter(props.data.random, { [column]: item }) : props.data.random
        //const filteredData = data

        setFilteredData(filteredData)
        setSelectedColumn(column)
        setSelectedItem(item)

        console.log('data', props.data.random)
        console.log('filteredData', filteredData)
    }

    const onDoStuff = (e, column, item) => {
        doStuff(column, item)
        //doStuff('icon', 'rain')
        console.log('onDoStuff', column, item)
    }

    React.useEffect(() => {
        doStuff(selectedColumn, selectedItem)
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
                            index={index}
                            data={props.data.random}
                            filteredData={filteredData}
                            selectedColumn={selectedColumn}
                            selectedItem={selectedItem}
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