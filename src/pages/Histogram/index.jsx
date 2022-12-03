import React, { useState } from 'react';
import '../../index.css'
import './styles.css'
import useWindowSize from "../../components/Hooks/useWindowSize"
import HistogramViz from "../../components/Viz/HistogramViz"
import data from '../../data/my_weather_data.json'
import Grid from '@mui/material/Unstable_Grid2';

const Histogram = () => {
  const [width, height] = useWindowSize()
  const [selectedMetricIndex, setSelectedMetricIndex] = useState(0)
  const metrics = [
    "windSpeed",
    "moonPhase",
    "dewPoint",
    "humidity",
    "uvIndex",
    "windBearing",
    "temperatureMin",
    "temperatureMax",
  ]
  return (
    <div className="page">
      <Grid container spacing={2}>
        <Grid xs display="flex" justifyContent="flex-end">
          <button
            variant="contained"
            onClick={() => { setSelectedMetricIndex((selectedMetricIndex + 1) % metrics.length) }}
          >Change metric</button>
        </Grid>
        <Grid xs={12}>
          <HistogramViz
            data={data}
            xAccessor={(d) => d[metrics[selectedMetricIndex]]}
            yAccessor={(d) => d.length}
            xAxisLabel={metrics[selectedMetricIndex]}
            width={window.innerWidth - 240}
            height={window.innerHeight - 130} />
        </Grid>
      </Grid>
    </div>
  );
}

export default Histogram