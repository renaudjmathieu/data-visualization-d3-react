import React from "react"
import ShowChartIcon from '@mui/icons-material/ShowChart'
import ScatterPlotIcon from '@mui/icons-material/ScatterPlot'
import BarChartIcon from '@mui/icons-material/BarChart'
import PieChartIcon from '@mui/icons-material/PieChart'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import LineChart from '../../../pages/LineChart'
import ScatterPlot from '../../../pages/ScatterPlot'
import Box from '../../../pages/Box'
import Histogram from '../../../pages/Histogram'
import ScrollingLineChart from '../../../pages/ScrollingLineChart'

export const mainNavbarListItems = [
    {
        id: 1,
        icon: <ShowChartIcon />,
        element: <LineChart />,
        title: 'Line Chart',
        path: '/line-chart',
    },
    {
        id: 2,
        icon: <ScatterPlotIcon />,
        element: <ScatterPlot />,
        title: 'Scatter Plot',
        path: '/scatter-plot',
    },
    {
        id: 3,
        icon: <CheckBoxOutlineBlankIcon />,
        element: <Box />,
        title: 'A Box',
        path: '/box'
    },
    {
        id: 4,
        icon: <BarChartIcon />,
        element: <Histogram />,
        title: 'Histogram',
        path: '/histogram'
    },
    {
        id: 5,
        icon: <AutoGraphIcon />,
        element: <ScrollingLineChart />,
        title: 'ScrollingLineChart',
        path: '/scrolling-linechart'
    }
]