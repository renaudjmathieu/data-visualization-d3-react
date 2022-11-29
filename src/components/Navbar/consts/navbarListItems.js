import React from "react";
import ShowChartIcon from '@mui/icons-material/ShowChart';
import ScatterPlotIcon from '@mui/icons-material/ScatterPlot';
import BarChartIcon from '@mui/icons-material/BarChart';

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
        title: 'Scatter Chart',
        link: '/scatter-chart',
    },
    {
        id: 3,
        icon: <BarChartIcon />,
        title: 'Bar Chart',
        link: '/bar-chart'
    }
];