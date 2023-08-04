import React from "react"

import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

import Histogram from "../Histogram"
import ScatterPlot from "../ScatterPlot"
import Timeline from "../Timeline"
import List from "../List/List"

import { useDataContext } from "../../providers/DataProvider"
import { useChartsContext } from "../../providers/ChartsProvider"

const Container = ({ opened, onClick1, onClick2, chartIndex, handleHighlightData, fields }) => {
  const theme = useTheme();
  const { selectedChartIndex, chosenChartIndex, data } = useDataContext()
  const { charts } = useChartsContext()
  const currentChart = charts[chartIndex]

  const outOfFocus = chosenChartIndex !== null && chartIndex !== chosenChartIndex
  const active = chartIndex === chosenChartIndex

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const renderChart = (zoomed) => {
    switch (currentChart.type) {
      case "scatter": return <ScatterPlot
        zoomed={zoomed}
        active={active}
        outOfFocus={outOfFocus}
        data={selectedChartIndex == chartIndex ? data : _.filter(data, { highlighted: true })}
        handleHighlightData={handleHighlightData}
        chartIndex={chartIndex}
      />
      case "histogram": return <Histogram
        zoomed={zoomed}
        active={active}
        outOfFocus={outOfFocus}
        data={data}
        handleHighlightData={handleHighlightData}
        chartIndex={chartIndex}
      />
      case "timeline": return <Timeline
        zoomed={zoomed}
        active={active}
        outOfFocus={outOfFocus}
        data={selectedChartIndex == chartIndex ? data : _.filter(data, { highlighted: true })}
        handleHighlightData={handleHighlightData}
        chartIndex={chartIndex}
      />
      case "list": return <List
        zoomed={zoomed}
        active={active}
        outOfFocus={outOfFocus}
        data={selectedChartIndex == chartIndex ? data : _.filter(data, { highlighted: true })}
        handleHighlightData={handleHighlightData}
        chartIndex={chartIndex}
      />
      default: return null;
    }
  }

  const getChartClass = () => {
    switch (currentChart.type) {
      case "scatter": return 'Chart__square__container';
      case "histogram": return 'Chart__rectangle__container';
      case "timeline": return 'Chart__rectangle__large__container';
      case "list": return 'Chart__rectangle__container';
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
    <div onClick={opened ? onClick1 : onClick2} className={`Chart__container ${active ? 'active' : ''} ${outOfFocus ? 'outOfFocus' : 'inFocus'} ${getChartClass()}`}>
      <div className="ChartIconsContainer">
        <div className="ChartIcons">
          <div className="ChartIcon">
            <IconButton onClick={onClick1}>
              <SettingsIcon style={{ color: theme.vars.palette.primary.main }} />
            </IconButton>
          </div>
          <div className="ChartIcon ChartIconRight">
            <IconButton onClick={handleOpen}>
              <ZoomOutMapIcon style={{ color: theme.vars.palette.primary.main }} />
            </IconButton>
          </div>
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
            <div className="tooltipD3-value3">
              <span id="tooltipD3zoomed-value3"></span>
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
