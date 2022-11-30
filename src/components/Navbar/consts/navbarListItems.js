import React from "react"
import ShowChartIcon from '@mui/icons-material/ShowChart'
import ScatterPlotIcon from '@mui/icons-material/ScatterPlot'
import BarChartIcon from '@mui/icons-material/BarChart'
import PieChartIcon from '@mui/icons-material/PieChart'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'

export const mainNavbarListItems = [
    {
        id: 1,
        icon: <ShowChartIcon />,
        title: 'Line Chart',
        link: '/line-chart',
    },
    {
        id: 2,
        icon: <ScatterPlotIcon />,
        title: 'Scatter Plot',
        link: '/scatter-plot',
    },
    {
        id: 3,
        icon: <BarChartIcon />,
        title: 'Histogram',
        link: '/histogram'
    },
    {
        id: 4,
        icon: <CheckBoxOutlineBlankIcon />,
        title: 'A Box',
        link: '/box'
    }
]