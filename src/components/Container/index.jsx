import React from "react"

import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

import Histogram from "../Histogram"
import ScatterPlot from "../Scatterplot"
import Timeline from "../Timeline"
import List from "../List"
import Tooltip from "../Tooltip"

import { useDataContext } from "../../providers/DataProvider"
import { useChartsContext } from "../../providers/ChartsProvider"

import "./style.css"
import { style } from "d3";

const Container = (props) => {
  const theme = useTheme();
  const { selectedChartIndex, chosenChartIndex, data } = useDataContext()
  const { charts } = useChartsContext()
  const currentChart = charts[props.chartIndex]

  const outOfFocus = chosenChartIndex !== null && props.chartIndex !== chosenChartIndex
  const active = props.chartIndex === chosenChartIndex

  const [zoomedOpen, setZoomedOpen] = React.useState(false);
  const handleZoomedOpen = () => {
    setZoomedOpen(true)
    props.handleZoomedOpen()
  }

  const handleZoomedClose = () => {
    setZoomedOpen(false)
    props.handleZoomedClose()
  }

  const renderChart = (zoomed) => {

    const styleName = `${zoomed ? 'zoomed' : active ? 'active' : ''} ${outOfFocus ? 'outOfFocus' : 'inFocus'}`
    const interactable = !outOfFocus

    switch (currentChart.type) {
      case "scatter": return <ScatterPlot
        data={selectedChartIndex == props.chartIndex ? data : _.filter(data, { highlighted: true })}
        handleHighlightData={props.handleHighlightData}
        handleShowTooltip={props.handleShowTooltip}
        handleHideTooltip={props.handleHideTooltip}
        chartIndex={props.chartIndex}
        styleName={styleName}
        interactable={interactable}
        marginPadding={zoomed ? 20 : 0}
      />
      case "histogram": return <Histogram
        data={data}
        handleHighlightData={props.handleHighlightData}
        handleShowTooltip={props.handleShowTooltip}
        handleHideTooltip={props.handleHideTooltip}
        chartIndex={props.chartIndex}
        styleName={styleName}
        interactable={interactable}
        marginPadding={zoomed ? 20 : 0}
      />
      case "timeline": return <Timeline
        data={selectedChartIndex == props.chartIndex ? data : _.filter(data, { highlighted: true })}
        handleHighlightData={props.handleHighlightData}
        handleShowTooltip={props.handleShowTooltip}
        handleHideTooltip={props.handleHideTooltip}
        chartIndex={props.chartIndex}
        styleName={styleName}
        interactable={interactable}
        marginPadding={zoomed ? 20 : 0}
      />
      case "list": return <List
        data={selectedChartIndex == props.chartIndex ? data : _.filter(data, { highlighted: true })}
        handleHighlightData={props.handleHighlightData}
        chartIndex={props.chartIndex}
        styleName={styleName}
        interactable={interactable}
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
    <div onClick={props.opened ? props.onClick1 : props.onClick2} className={`Chart__container ${active ? 'active' : ''} ${outOfFocus ? 'outOfFocus' : 'inFocus'} ${getChartClass()}`}>
      <div className="ChartIconsContainer">
        <div className="ChartIcons">
          <div className="ChartIcon">
            <IconButton onClick={props.onClick1}>
              <SettingsIcon style={{ color: theme.vars.palette.primary.main }} />
            </IconButton>
          </div>
          <div className="ChartIcon ChartIconRight">
            <IconButton onClick={handleZoomedOpen}>
              <ZoomOutMapIcon style={{ color: theme.vars.palette.primary.main }} />
            </IconButton>
          </div>
        </div>
      </div>

      <Modal
        open={zoomedOpen}
        onClose={handleZoomedClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          {zoomedOpen && props.tooltipInfo && (
            <Tooltip
              zoomed={true}
              style={{ transform: `translate(calc(-50% + ${props.tooltipInfo.x}px), calc(-100% + ${props.tooltipInfo.y}px))` }}
              {...props.tooltipInfo}
            />
          )}
          {renderChart(true)}
        </Box>
      </Modal>
      {renderChart(false)}
    </div>
  )
}

export default Container
