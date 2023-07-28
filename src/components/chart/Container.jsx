import React from "react"

import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';

import Histogram from "../Histogram"
import ScatterPlot from "../ScatterPlot"
import Timeline from "../Timeline"
import List from "../List/List"

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

const Container = ({ opened, onClick1, onClick2, chart, chosen, chartIndex, data, filteredData, selectedChart, selectedColumnType, selectedColumn1, selectedColumn2, selectedItem1, selectedItem2, onDoStuff, fields }) => {

  const theme = useTheme();

  const outOfFocus = chosen !== null && chartIndex !== chosen
  const active = chartIndex === chosen
  const xAxis = chart.xAxis
  const yAxis = chart.yAxis
  const yAxisSummarization = chart.yAxisSummarization
  const category = chart.category
  const value = chart.value
  const valueSummarization = chart.valueSummarization

  const xAxisParser = xAxis ? fields.find(field => field.id === xAxis).parser : null
  const yAxisParser = yAxis ? fields.find(field => field.id === yAxis).parser : null
  const categoryParser = category ? fields.find(field => field.id === category).parser : null
  const valueParser = value ? fields.find(field => field.id === value).parser : null

  const xAccessor = xAxisParser ? d => xAxisParser(d[xAxis]) : d => d[xAxis]
  const yAccessor = yAxisParser ? d => yAxisParser(d[yAxis]) : d => d[yAxis]
  const categoryAccessor = categoryParser ? d => categoryParser(d[category]) : d => d[category]
  const valueAccessor = valueParser ? d => valueParser(d[value]) : d => d[value]

  const xAxisFormat = xAxis && fields.find(field => field.id === xAxis).format ? fields.find(field => field.id === xAxis).format : typeof xAccessor(filteredData[0])
  const yAxisFormat = yAxis ? fields.find(field => field.id === yAxis).format : null
  const categoryFormat = category ? fields.find(field => field.id === category).format : null
  const valueFormat = value ? fields.find(field => field.id === value).format : null

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const renderChart = (zoomed) => {
    switch (chart.id) {
      case "scatter": return <ScatterPlot
        zoomed={zoomed}
        active={active}
        outOfFocus={outOfFocus}
        data={selectedChart == chartIndex ? filteredData : _.filter(filteredData, { marked: true })}
        xAxis={xAxis}
        yAxis={yAxis}
        xAxisParser={xAxisParser}
        yAxisParser={yAxisParser}
        xAxisFormat={xAxisFormat}
        yAxisFormat={yAxisFormat}
        onMouseDown={onDoStuff}
        selectedChart={selectedChart}
        chartIndex={chartIndex}
        selectedColumnType={selectedColumnType}
        selectedColumn1={selectedColumn1}
        selectedColumn2={selectedColumn2}
        selectedItem1={selectedItem1}
        selectedItem2={selectedItem2}
      />
      case "histogram": return <Histogram
        zoomed={zoomed}
        active={active}
        outOfFocus={outOfFocus}
        data={filteredData}
        onMouseDown={onDoStuff}
        xAxis={xAxis}
        yAxis={yAxis}
        xAccessor={xAccessor}
        yAccessor={yAccessor}
        xAxisParser={xAxisParser}
        xAxisFormat={xAxisFormat}
        yAxisSummarization={yAxisSummarization}
        selectedChart={selectedChart}
        chartIndex={chartIndex}
        selectedColumnType={selectedColumnType}
        selectedColumn1={selectedColumn1}
        selectedColumn2={selectedColumn2}
        selectedItem1={selectedItem1}
        selectedItem2={selectedItem2}
      />
      case "timeline": return <Timeline
        zoomed={zoomed}
        active={active}
        outOfFocus={outOfFocus}
        data={selectedChart == chartIndex ? filteredData : _.filter(filteredData, { marked: true })}
        xAxis={xAxis}
        yAxis={yAxis}
        xAxisParser={xAxisParser}
        yAxisParser={yAxisParser}
        xAxisFormat={xAxisFormat}
        yAxisFormat={yAxisFormat}
      />
      case "list": return <List
        zoomed={zoomed}
        active={active}
        outOfFocus={outOfFocus}
        data={selectedChart == chartIndex ? filteredData : _.filter(filteredData, { marked: true })}
        selectedChart={selectedChart}
        chartIndex={chartIndex}
        selectedColumnType={selectedColumnType}
        selectedColumn1={selectedColumn1}
        selectedColumn2={selectedColumn2}
        selectedItem1={selectedItem1}
        selectedItem2={selectedItem2}
        onMouseDown={onDoStuff}
        category={category}
        value={value}
        categoryParser={categoryParser}
        valueParser={valueParser}
        categoryFormat={categoryFormat}
        valueFormat={valueFormat}
        valueSummarization={valueSummarization}
      />
      default: return null;
    }
  }

  const getChartClass = () => {
    switch (chart.id) {
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
          </div>
          {renderChart(true)}
        </Box>
      </Modal>
      {renderChart(false)}
    </div>
  )
}

export default Container
