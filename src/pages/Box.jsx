import React from "react"
import '../index.css'
import BoxViz from "../components/Viz/BoxViz"
import Grid from '@mui/material/Unstable_Grid2';

const Box = () => {
    return (
        <div className="page">
            <Grid container spacing={2}>
                <Grid xs={12}>
                    <BoxViz />
                </Grid>
            </Grid>
        </div>
    );
}

export default Box