import * as React from 'react';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Box from "@mui/material/Box";
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LightMode from "@mui/icons-material/LightMode";
import DarkMode from "@mui/icons-material/DarkMode";
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Slider from '@mui/material/Slider';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

import Dashboard from "./components/Dashboard"

import "./styles.css"

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
        ...(open && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
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
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const chartsAvailable = [
    'ScatterPlot',
    'Pie',
    'Radar',
    'Histogram',
    'Timeline',
    'Treemap',
];

const App = (props) => {
    const { window } = props;
    const storedDarkMode = localStorage.getItem("DARK_MODE");
    const [mode, setMode] = React.useState(storedDarkMode ?? "light");
    const colorMode = React.useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
            },
        }),
        []
    );

    // Whenever dark mode changes, update the localStorage DARK_MODE item
    React.useEffect(() => {
        localStorage.setItem("DARK_MODE", mode);

        let resizeTimer;
        document.body.classList.add("resize-animation-stopper");
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            document.body.classList.remove("resize-animation-stopper");
        }, 300);
        if (mode !== "light") {
            document.body.classList.add("dark")
            document.body.classList.remove("light")
        }
        else {
            document.body.classList.add("light")
            document.body.classList.remove("dark")
        }
    }, [mode]);

    // Whenever the mode changes, change the theme 
    const theme = React.useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    primary: {
                        ...(mode === "light"
                            ? {
                                light: "#ff34ac",
                                main: "#ec008c",
                                dark: "#a50062",
                                contrastText: "#f8f9fa",
                            }
                            : {
                                light: "#f3df61",
                                main: "#edd018",
                                dark: "#a9940d",
                                contrastText: "#212529",
                            }),
                    },
                    text: {
                        ...(mode === "light"
                            ? {
                                primary: "#212529",
                            }
                            : {
                                primary: "#f8f9fa",
                            }),
                    },
                    background: {
                        ...(mode === "light"
                            ? {
                                default: "#eceff1",
                                primary: "#eceff1",
                                secondary: "#fff",
                            }
                            : {
                                paper: "#1b1a19",
                                default: "#161C24",
                                primary: "#161C24",
                                secondary: "#252423",
                            }),
                    },
                },
            }),
        [mode]
    );
    const [open, setOpen] = React.useState(false);
    const [selectedChart, setSelectedChart] = React.useState(null);
    const [selectedChartIndex, setSelectedChartIndex] = React.useState(null);

    const handleDrawerOpen = (chart, index) => {
        setSelectedChart(chart)
        setSelectedChartIndex(index)
        setOpen(true);
        document.body.classList.add("open")
        document.body.classList.remove("closed")
    };

    const handleDrawerClose = () => {
        setSelectedChart(null)
        setSelectedChartIndex(null)
        setOpen(false);
        document.body.classList.add("closed")
        document.body.classList.remove("open")
    };

    const container = window !== undefined ? () => window().document.body : undefined;

    const [animate, setAnimate] = React.useState(true);

    const handleAnimate = (event) => {
        setAnimate(event.target.checked);
    };

    const [charts, setCharts] = React.useState(['ScatterPlot', 'Histogram', 'Timeline']);

    const handleReplaceChart = (event) => {
        setSelectedChart(event.target.value)
        setCharts(charts.map((chart, index) => index === selectedChartIndex ? event.target.value : chart));
    };

    const handleRemoveSelectedChart = (event) => {
        setCharts(charts.filter((chart, index) => index !== selectedChartIndex));
    };

    const handleAddChart = () => {
        setCharts([...charts, chartsAvailable[Math.floor(Math.random() * chartsAvailable.length)]]);
    };

    const handleRemoveChart = () => {
        setCharts(charts.slice(0, charts.length - 1));
    };

    const dashboardRef = React.useRef();

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className="App">
                <AppBar position="fixed" open={open} style={{ background: open ? mode === "light" ? '#EAA2D0' : '#242323' : '' }}>
                    <Toolbar className="close_me">
                        <Typography className="close_me" variant="h6" noWrap component="div" style={{ color: open && mode === "dark" ? '#8B8E91' : '' }}>
                            D3 Dashboard
                        </Typography>
                        <Box sx={{ flexGrow: 1 }} />
                        <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
                            <IconButton
                                color="inherit"
                                style={{ color: open && mode === "dark" ? '#8B8E91' : '' }}
                                onClick={colorMode.toggleColorMode}
                            >
                                {mode === "dark" ? <LightMode /> : <DarkMode />}
                            </IconButton>
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
                                    <Button disabled={open} onClick={handleRemoveChart}>Remove Last Chart</Button>
                                </ButtonGroup>
                            </Grid>
                            <Grid xs={4} className="gridOnDesktop__right close_me">
                                <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
                                    <FormGroup className="close_me">
                                        <FormControlLabel disabled={open} control={
                                            <Switch
                                                checked={animate}
                                                onChange={handleAnimate}
                                                inputProps={{ 'aria-label': 'controlled' }}
                                            />
                                        } label="Monochrome" />
                                    </FormGroup>
                                    <FormGroup className="close_me">
                                        <FormControlLabel disabled={open} control={
                                            <Switch
                                                checked={animate}
                                                onChange={handleAnimate}
                                                inputProps={{ 'aria-label': 'controlled' }}
                                            />
                                        } label="Animated" />
                                    </FormGroup>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Box>
                    <Dashboard ref={dashboardRef}
                        selectedCharts={charts}
                        checkedAnimate={animate}
                        handleDrawerOpen={handleDrawerOpen}
                        handleDrawerClose={handleDrawerClose} />
                </Main>
                <Drawer
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                        },
                    }}
                    variant="persistent"
                    anchor="left"
                    open={open}
                >
                    <Toolbar />
                    <Divider />
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton onClick={colorMode.toggleColorMode}>
                                <ListItemIcon>
                                    {mode === "dark" ? <LightMode /> : <DarkMode />}
                                </ListItemIcon>
                                <ListItemText primary={mode === "dark" ? "Turn on the lights" : "Turn off the lights"} />
                            </ListItemButton>
                        </ListItem>
                    </List>
                    <Divider />

                </Drawer>
                <Drawer
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                        },
                    }}
                    variant="persistent"
                    anchor="left"
                    open={open}
                >
                    <DrawerHeader>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                        </IconButton>
                    </DrawerHeader>
                    <FormControl fullWidth>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            className="config__select"
                            value={selectedChart}
                            onChange={handleReplaceChart}
                        >
                            {chartsAvailable.map((chart) => (
                                <MenuItem value={chart}>{chart}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Divider />
                    <Button variant="contained" className="config__button close_me" onClick={handleRemoveSelectedChart}>Remove Chart</Button>
                </Drawer>
            </div>
        </ThemeProvider>
    );
}

export default App;