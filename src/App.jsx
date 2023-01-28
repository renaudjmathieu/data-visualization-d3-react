import * as React from 'react';
import * as d3 from "d3"
import { styled } from '@mui/material/styles';
import {
    Experimental_CssVarsProvider as CssVarsProvider,
    experimental_extendTheme as extendTheme,
    useColorScheme,
} from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Box from "@mui/material/Box";
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import GitHubSvg from './github.svg';

import Dashboard from "./components/Dashboard"

import "./styles.css"

import data from '../my_weather_data.json'

const getData = () => ({
    random: data
})

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginRight: -drawerWidth,
        ...(open && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginRight: -drawerWidth,
        }),
    }),
);

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginRight: drawerWidth,
    }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
}));

const summarizationAvailable = [
    { id: 'sum', name: 'Sum', numberOnly: true },
    { id: 'average', name: 'Average', numberOnly: true },
    { id: 'min', name: 'Min', numberOnly: true },
    { id: 'max', name: 'Max', numberOnly: true },
    { id: 'distinct', name: 'Count (Distinct)', numberOnly: false },
    { id: 'count', name: 'Count', numberOnly: false },
    { id: 'median', name: 'Median', numberOnly: true },
]

const chartsAvailable = [
    { id: 'scatter', name: "Scatter chart", xAxis: 'humidity', yAxis: 'temperatureMin', yAxisSummarization: '', category: '', playAxis: '' },
    { id: 'histogram', name: "Column chart", xAxis: 'humidity', yAxis: 'humidity', yAxisSummarization: 'count', category: '', playAxis: '' },
    { id: 'timeline', name: "Line chart", xAxis: 'date', yAxis: 'temperatureMin', yAxisSummarization: '', category: '', playAxis: '' },
]

function ModeToggle() {
    const { mode, setMode } = useColorScheme();
    return (
        <Button
            onClick={() => {
                setMode(mode === 'light' ? 'dark' : 'light');

                let resizeTimer;
                document.body.classList.add("resize-animation-stopper");
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => {
                    document.body.classList.remove("resize-animation-stopper");
                }, 300);
                if (mode === "light") {
                    document.body.classList.add("dark")
                    document.body.classList.remove("light")
                }
                else {
                    document.body.classList.add("light")
                    document.body.classList.remove("dark")
                }
            }}
        >
            {mode === 'light' ? 'Turn dark' : 'Turn light'}
        </Button>
    );
}

const themeColors = [
    { id: 'red', color: '#f44336', complementaryColor: '#36E7F4' },
    { id: 'pink', color: '#e91e63', complementaryColor: '#1EE9A4' },
    { id: 'purple', color: '#9c27b0', complementaryColor: '#3BB027' },
    { id: 'deepPurple', color: '#673ab7', complementaryColor: '#8AB73A' },
    { id: 'indigo', color: '#3f51b5', complementaryColor: '#B5A33F' },
    { id: 'blue', color: '#2196f3', complementaryColor: '#F37E21' },
    { id: 'lightBlue', color: '#03a9f4', complementaryColor: '#F44E03' },
    { id: 'cyan', color: '#00bcd4', complementaryColor: '#D41800' },
    { id: 'teal', color: '#009688', complementaryColor: '#96000E' },
    { id: 'green', color: '#4caf50', complementaryColor: '#AF4CAB' },
    { id: 'lightGreen', color: '#8bc34a', complementaryColor: '#824AC3' },
    { id: 'lime', color: '#cddc39', complementaryColor: '#4839DC' },
    { id: 'yellow', color: '#ffeb3b', complementaryColor: '#3B4FFF' },
    { id: 'amber', color: '#ffc107', complementaryColor: '#0745FF' },
    { id: 'orange', color: '#ff9800', complementaryColor: '#0067FF' },
    { id: 'deepOrange', color: '#ff5722', complementaryColor: '#22CAFF' },
    { id: 'brown', color: '#795548', complementaryColor: '#486C79' },
    { id: 'grey', color: '#9e9e9e', complementaryColor: '#9E9E9E' },
    { id: 'blueGrey', color: '#607d8b', complementaryColor: '#8B6E60' },
]

const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * themeColors.length)
    return themeColors[randomIndex]
}

const getThemeExtender = (color) => {
    const theme = extendTheme({
        colorSchemes: {
            light: {
                palette: {
                    primary: {
                        main: color.color,
                        complementaryColor: color.complementaryColor,
                        contrastText: "#f8f9fa",
                    },
                    background: {
                        default: "#eceff1",
                        primary: "#eceff1",
                    }
                },
            }
        }
    });

    return theme
}


const App = (props) => {
    const { window } = props;

    const [data, setData] = React.useState(getData())

    const [theme, setTheme] = React.useState(getThemeExtender(getRandomColor()))

    const handleThemeChange = () => {
        let resizeTimer;
        document.body.classList.add("resize-animation-stopper");
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            document.body.classList.remove("resize-animation-stopper");
        }, 300);

        setTheme(getThemeExtender(getRandomColor()))
    }

    const [open, setOpen] = React.useState(false);
    const [selectedChartId, setSelectedChartId] = React.useState(null);
    const [selectedChartIndex, setSelectedChartIndex] = React.useState(null);

    const handleDrawerOpen = (chart, index) => {
        setSelectedChartId(chart.id)
        setSelectedChartIndex(index)
        setOpen(true);
        document.body.classList.add("open")
        document.body.classList.remove("closed")
    };

    const handleDrawerClose = () => {
        setSelectedChartId(null)
        setSelectedChartIndex(null)
        setOpen(false);
        document.body.classList.add("closed")
        document.body.classList.remove("open")
    };

    const container = window !== undefined ? () => window().document.body : undefined;

    const [charts, setCharts] = React.useState(
        chartsAvailable.filter((chart) => ['scatter', 'histogram', 'timeline'].includes(chart.id))
    );

    const handleReplaceChart = (event) => {
        setSelectedChartId(event.target.value)
        setCharts(charts.map((chart, index) => index === selectedChartIndex ? { ...chart, id: event.target.value, name: chartsAvailable.find((chart) => chart.id === event.target.value).name } : chart));
    };

    const handleRemoveSelectedChart = () => {
        setSelectedChartId(null)
        setCharts(charts.filter((chart, index) => index !== selectedChartIndex));
    };

    const handleAddChart = () => {
        setCharts([...charts, chartsAvailable[Math.floor(Math.random() * chartsAvailable.length)]]);
    };

    const handleRemoveChart = () => {
        setCharts(charts.slice(0, charts.length - 1));
    };

    const dashboardRef = React.useRef();

    const handleFieldChange = (event, keyName) => {
        setCharts(charts.map((chart, index) => index === selectedChartIndex ? { ...chart, [keyName]: event.target.value } : chart));
    };

    const parsersAndFormatters = [
        { id: 'date', parser: d3.timeParse("%Y-%m-%d"), formatter: d3.timeFormat("%b %Y") },
        { id: 'time', parser: d3.timeParse("%s"), formatter: d3.timeFormat("%H:%M") },
        { id: 'sunriseTime', parser: d3.timeParse("%s"), formatter: d3.timeFormat("%H:%M") },
        { id: 'sunsetTime', parser: d3.timeParse("%s"), formatter: d3.timeFormat("%H:%M") },
        { id: 'temperatureHighTime', parser: d3.timeParse("%s"), formatter: d3.timeFormat("%H:%M") },
        { id: 'temperatureLowTime', parser: d3.timeParse("%s"), formatter: d3.timeFormat("%H:%M") },
        { id: 'apparentTemperatureHighTime', parser: d3.timeParse("%s"), formatter: d3.timeFormat("%H:%M") },
        { id: 'apparentTemperatureLowTime', parser: d3.timeParse("%s"), formatter: d3.timeFormat("%H:%M") },
        { id: 'windGustTime', parser: d3.timeParse("%s"), formatter: d3.timeFormat("%H:%M") },
        { id: 'uvIndexTime', parser: d3.timeParse("%s"), formatter: d3.timeFormat("%H:%M") },
        { id: 'temperatureMinTime', parser: d3.timeParse("%s"), formatter: d3.timeFormat("%H:%M") },
        { id: 'temperatureMaxTime', parser: d3.timeParse("%s"), formatter: d3.timeFormat("%H:%M") },
        { id: 'apparentTemperatureMinTime', parser: d3.timeParse("%s"), formatter: d3.timeFormat("%H:%M") },
        { id: 'apparentTemperatureMaxTime', parser: d3.timeParse("%s"), formatter: d3.timeFormat("%H:%M") },
    ]

    const fieldsAvailable = Object.keys(data.random[0])
        .map(id => (
            {
                id,
                type: typeof data.random[0][id],
                name: id.charAt(0).toUpperCase() + id.slice(1).replace(/([A-Z])/g, ' $1'),
                ...(parsersAndFormatters.find(f => f.id === id) ? {
                    parser: parsersAndFormatters.find(f => f.id === id).parser,
                    formatter: parsersAndFormatters.find(f => f.id === id).formatter
                } : {})
            }
        ))
        .sort((a, b) => a.name.localeCompare(b.name))

    return (
        <CssVarsProvider theme={theme}>
            <CssBaseline />
            <div className="App">
                <AppBar position="fixed" open={open} style={{ background: open ? "mode" === "light" ? '#EAA2D0' : '#242323' : '' }}>
                    <Toolbar className="close_me">
                        <Typography className="close_me" variant="h6" noWrap sx={{ flexGrow: 1 }} component="div" style={{ color: open && "mode" === "dark" ? '#8B8E91' : '' }}>
                            D3 Dashboard
                        </Typography>
                        <Box sx={{ flexGrow: 1 }} />
                        <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
                            <a href="https://github.com/renaudjmathieu/data-visualization-d3-react" target="_blank" className='imgLink' rel="noreferrer" aria-label="GitHub">
                                <GitHubSvg className='headerSvg' alt="GitHub logo" />
                            </a>
                        </Box>
                    </Toolbar>
                </AppBar>
                <Main open={open}>
                    <DrawerHeader className="close_me" />
                    <Box sx={{ flexGrow: 1 }} className="close_me">
                        <Grid container spacing={2} className="containerOnDesktop">
                            <Grid xs={8} className="gridOnDesktop__left close_me">
                                <ButtonGroup variant="contained" aria-label="outlined primary button group" className="close_me">
                                    <Button disabled={open} onClick={handleAddChart}>Add New Chart</Button>
                                    <Button disabled={open || (charts.length === 0)} onClick={handleRemoveChart}>Remove Last Chart</Button>
                                </ButtonGroup>
                            </Grid>
                            <Grid xs={4} className="gridOnDesktop__right close_me" justifyContent="right" alignItems="right">
                                <div className="textright close_me">
                                    <Button
                                        onClick={handleThemeChange}
                                    >
                                        Change theme color
                                    </Button>
                                </div>
                            </Grid>
                        </Grid>
                    </Box>
                    <Dashboard ref={dashboardRef}
                        data={data}
                        charts={charts}
                        fields={fieldsAvailable}
                        handleDrawerOpen={handleDrawerOpen}
                        handleDrawerClose={handleDrawerClose} />
                </Main>
                <Drawer
                    sx={{
                        width: drawerWidth,
                        position: 'absolute',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                        },
                    }}
                    variant="persistent"
                    anchor="right"
                    open={open}
                >
                    <DrawerHeader>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                        </IconButton>
                    </DrawerHeader>

                    <FormControl fullWidth>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            className="config__select"
                            value={selectedChartId}
                            onChange={handleReplaceChart}
                        >
                            {chartsAvailable
                                .map((chart) => (
                                    <MenuItem value={chart.id}>{chart.name}</MenuItem>
                                ))}
                        </Select>
                    </FormControl>

                    {chartsAvailable
                        .filter(chart => chart.id === selectedChartId)
                        .map(chart => (
                            Object.keys(chart)
                                .filter((keyName, i) => keyName !== 'id' && keyName !== 'name' && chart[keyName] !== '')
                                .map((keyName, i) => (
                                    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                                        <InputLabel id={`demo-simple-select-helper-label-${keyName}`}>{keyName}</InputLabel>
                                        <Select
                                            labelId={`demo-simple-select-helper-label-${keyName}`}
                                            id={`demo-simple-select-helper-${keyName}`}
                                            value={charts.filter((chart, index) => index === selectedChartIndex)[0][keyName]}
                                            label={keyName}
                                            onChange={(e) => handleFieldChange(e, keyName)}
                                        >
                                            {!keyName.includes('Summarization') ?
                                                fieldsAvailable
                                                    .map(field => (
                                                        <MenuItem value={field.id}>{field.name}</MenuItem>
                                                    ))
                                                :
                                                summarizationAvailable
                                                    .filter(
                                                        summarization => summarization.numberOnly === false ||
                                                            (fieldsAvailable.filter(field => field.id === charts.filter((chart, index) => index === selectedChartIndex)[0][keyName.replace('Summarization', '')]))[0].type === 'number'
                                                    )
                                                    .map(summarization => (
                                                        <MenuItem value={summarization.id}>{summarization.name}</MenuItem>
                                                    ))
                                            }
                                        </Select>
                                    </FormControl>
                                ))
                        ))}

                    <Divider className="config__divider" />

                    <Button variant="contained" className="config__button close_me" onClick={handleRemoveSelectedChart}>Remove Chart</Button>
                </Drawer>
            </div>
        </CssVarsProvider>
    );
}

export default App;

function useInterval(callback, delay) {
    const savedCallback = useRef()

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback
    })

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current()
        }
        if (delay !== null) {
            let id = setInterval(tick, delay)
            return () => clearInterval(id)
        }
    }, [delay])
}