import React from "react"
import PropTypes from "prop-types"

import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';

import ScatterPlotVisuals from "./ScatterPlotVisuals"

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

const ScatterPlot = ({ outOfFocus, active, onClick, data, xAxis, yAxis, xAxisParser, yAxisParser, xAxisFormatter, yAxisFormatter }) => {

  const theme = useTheme();


  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    height: window.innerHeight * 0.9,
    width: window.innerHeight * 0.9,
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: `2px solid ${theme.vars.palette.primary.main}`,
    boxShadow: 24,
    p: 4,
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div onClick={outOfFocus ? onClick : null} className={`Chart__container ${outOfFocus ? 'outOfFocus' : 'inFocus'}`}>
      <div className="ChartIconsContainer">
        <div className="ChartIcons">
          <IconButton onClick={onClick}>
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
          <ScatterPlotVisuals
            zoomed={true}
            active={active}
            outOfFocus={outOfFocus}
            data={data}
            xAxis={xAxis}
            yAxis={yAxis}
            xAxisParser={xAxisParser}
            yAxisParser={yAxisParser}
            xAxisFormatter={xAxisFormatter}
            yAxisFormatter={yAxisFormatter}
          />
        </Box>
      </Modal>
      <ScatterPlotVisuals
        zoomed={false}
        active={active}
        outOfFocus={outOfFocus}
        data={data}
        xAxis={xAxis}
        yAxis={yAxis}
        xAxisParser={xAxisParser}
        yAxisParser={yAxisParser}
        xAxisFormatter={xAxisFormatter}
        yAxisFormatter={yAxisFormatter}
      />
    </div>
  )
}

ScatterPlot.propTypes = {
  xAxis: PropTypes.string,
  yAxis: PropTypes.string,
  xAxisParser: PropTypes.func,
  yAxisParser: PropTypes.func,
  xAxisFormatter: PropTypes.func,
  yAxisFormatter: PropTypes.func,
}

export default ScatterPlot
