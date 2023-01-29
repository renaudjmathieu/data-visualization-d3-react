import React from "react"

import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';

import Histogram from "../Histogram"
import ScatterPlot from "../ScatterPlot"
import Timeline from "../Timeline"

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

const Container = ({ opened, onClick1, onClick2, chart, chosen, index, data, fields }) => {

  const theme = useTheme();

  const outOfFocus = chosen !== null && index !== chosen
  const active = index === chosen
  const xAxis = chart.xAxis
  const yAxis = chart.yAxis
  const yAxisSummarization = chart.yAxisSummarization
  const xAxisParser = fields.find(field => field.id === chart.xAxis).parser
  const yAxisParser = fields.find(field => field.id === chart.yAxis).parser
  const xAxisFormat = fields.find(field => field.id === chart.xAxis).format
  const yAxisFormat = fields.find(field => field.id === chart.yAxis).format

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const renderChart = (zoomed) => {
    switch (chart.id) {
      case "scatter": return <ScatterPlot
        zoomed={zoomed}
        active={active}
        outOfFocus={outOfFocus}
        data={data}
        xAxis={xAxis}
        yAxis={yAxis}
        xAxisParser={xAxisParser}
        yAxisParser={yAxisParser}
        xAxisFormat={xAxisFormat}
        yAxisFormat={yAxisFormat}
      />;
      case "histogram": return <Histogram
        zoomed={zoomed}
        active={active}
        outOfFocus={outOfFocus}
        data={data}
        xAxis={xAxis}
        yAxis={yAxis}
        xAxisParser={xAxisParser}
        xAxisFormat={xAxisFormat}
        yAxisSummarization={yAxisSummarization}
      />
      case "timeline": return <Timeline
        zoomed={zoomed}
        active={active}
        outOfFocus={outOfFocus}
        data={data}
        xAxis={xAxis}
        yAxis={yAxis}
        xAxisParser={xAxisParser}
        yAxisParser={yAxisParser}
        xAxisFormat={xAxisFormat}
        yAxisFormat={yAxisFormat}
      />
      default: return null;
    }
  }

  const getChartClass = () => {
    switch (chart.id) {
      case "scatter": return 'Chart__square__container';
      case "histogram": return 'Chart__rectangle__container';
      case "timeline": return 'Chart__rectangle__large__container';
      default: return null;
    }
  }

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    height: getChartClass() === "Chart__square__container" && window.innerHeight > window.innerWidth ? window.innerWidth * 0.9 : window.innerHeight * 0.9,
    width: getChartClass() === "Chart__square__container" && window.innerWidth > window.innerHeight ? window.innerHeight * 0.9 : window.innerWidth * 0.9,
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: `2px solid ${theme.vars.palette.primary.main}`,
    boxShadow: 24,
    p: 4,
  };

  return (
    <div onClick={opened ? onClick1 : onClick2} className={`Chart__container ${active ? 'active' : '' } ${outOfFocus ? 'outOfFocus' : 'inFocus'} ${getChartClass()}`}>
      <div className="ChartIconsContainer">
        <div className="ChartIcons">
          <IconButton onClick={onClick1}>
            <SettingsIcon style={{ color: theme.vars.palette.primary.main }} />
          </IconButton>
          <IconButton onClick={handleOpen}>
            <ZoomOutMapIcon style={{ color: theme.vars.palette.primary.main }} />
          </IconButton>
        </div>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <div id="tooltipD3zoomed" className="tooltipD3">
            <div className="tooltipD3-value1">
              <span id="tooltipD3zoomed-value1"></span>
            </div>
            <div className="tooltipD3-value2">
              <span id="tooltipD3zoomed-value2"></span>
            </div>
          </div>
          {renderChart(true)}
        </Box>
      </Modal>
      {renderChart(false)}
    </div>
  )
}

export default Container
