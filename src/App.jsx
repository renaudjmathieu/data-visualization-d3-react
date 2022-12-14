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
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import LightMode from "@mui/icons-material/LightMode";
import DarkMode from "@mui/icons-material/DarkMode";
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

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
    'Timeline',
    'ScatterPlot',
    'Histogram',
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
                            }
                            : {
                                paper: "#1b1a19",
                                default: "#161C24",
                            }),
                    },
                },
            }),
        [mode]
    );
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
        document.body.classList.add("open")
        document.body.classList.remove("closed")
    };

    const handleDrawerClose = () => {
        setOpen(false);
        document.body.classList.add("closed")
        document.body.classList.remove("open")
    };

    const container = window !== undefined ? () => window().document.body : undefined;

    const [charts, setCharts] = React.useState(['Timeline', 'ScatterPlot', 'Histogram']);

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setCharts(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className="App">
                <AppBar position="fixed" open={open}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            sx={{ mr: 2, ...(open) }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap component="div">
                            D3 Dashboard
                        </Typography>
                        <Box sx={{ flexGrow: 1 }} />
                        <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
                            <IconButton
                                color="inherit"
                                onClick={colorMode.toggleColorMode}
                            >
                                {mode === "dark" ? <LightMode /> : <DarkMode />}
                            </IconButton>
                        </Box>
                    </Toolbar>
                </AppBar>
                <Main open={open}>
                    <DrawerHeader />
                    <FormControl sx={{ m: 1, width: 300 }} className='formOnDesktop'>
                        <InputLabel id="demo-multiple-checkbox-label">Charts</InputLabel>
                        <Select
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            value={charts}
                            onChange={handleChange}
                            input={<OutlinedInput label="Charts" />}
                            renderValue={(selected) => selected.join(', ')}
                            MenuProps={MenuProps}
                        >
                            {chartsAvailable.map((chart) => (
                                <MenuItem className='menuItemOnDesktop' key={chart} value={chart}>
                                    <Checkbox checked={charts.indexOf(chart) > -1} />
                                    <ListItemText primary={chart} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Dashboard selectedCharts={charts} />
                </Main>
                <Drawer
                    container={container}
                    variant="temporary"
                    open={open}
                    onClose={handleDrawerClose}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
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
                    <FormControl sx={{ m: 1, width: 220 }} className='formOnMobile'>
                        <InputLabel id="demo-multiple-checkbox-label">Charts</InputLabel>
                        <Select
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            value={charts}
                            onChange={handleChange}
                            input={<OutlinedInput label="Charts" />}
                            renderValue={(selected) => selected.join(', ')}
                            MenuProps={MenuProps}
                        >
                            {chartsAvailable.map((chart) => (
                                <MenuItem key={chart} value={chart}>
                                    <Checkbox checked={charts.indexOf(chart) > -1} />
                                    <ListItemText primary={chart} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
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
                </Drawer>
            </div>
        </ThemeProvider>
    );
}

export default App;