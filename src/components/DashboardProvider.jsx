
//todo

import React from 'react'

const DashboardContext = React.createContext()

const DashboardProvider = ({children}) => {

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

    return (
        <DashboardContext.Provider value={{filteredData}}>
            {children}
        </DashboardContext.Provider>
    )
}

export const useDashboardContext = () => React.useContext(DashboardContext)

export default DashboardProvider


    