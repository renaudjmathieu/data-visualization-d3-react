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

import * as d3 from 'd3'

const Container = ({ opened, onClick1, onClick2, chart, chosen, data, filteredData, selectedChart, selectedColumnType, selectedColumn1, selectedColumn2, selectedItem1, selectedItem2, onDoStuff, fields }) => {

  const theme = useTheme();

  const outOfFocus = chosen !== null && chart.id !== chosen
  const active = chart.id === chosen
  const xAxis = chart.xAxis
  const yAxis = chart.yAxis
  const yAxisSummarization = chart.yAxisSummarization
  const category1 = chart.category1
  const category2 = chart.category2
  const category3 = chart.category3
  const value = chart.value
  const valueSummarization = chart.valueSummarization

  const xAxisFormat = xAxis ? fields.find(field => field.id === xAxis).format : null
  const xAxisParser = xAxisFormat ? d3.timeParse(xAxisFormat) : null
  const yAxisFormat = yAxis ? fields.find(field => field.id === yAxis).format : null
  const yAxisParser = yAxisFormat ? d3.timeParse(yAxisFormat) : null
  const category1Format = category1 ? fields.find(field => field.id === category1).format : null
  const category2Format = category2 ? fields.find(field => field.id === category2).format : null
  const category3Format = category3 ? fields.find(field => field.id === category3).format : null
  const category1Parser = category1Format ? d3.timeParse(category1Format) : null
  const category2Parser = category2Format ? d3.timeParse(category2Format) : null
  const category3Parser = category3Format ? d3.timeParse(category3Format) : null
  const valueFormat = value ? fields.find(field => field.id === value).format : null
  const valueParser = valueFormat ? d3.timeParse(valueFormat) : null

  const xAccessor = xAxisParser ? d => xAxisParser(d[xAxis]) : d => d[xAxis]
  const yAccessor = yAxisParser ? d => yAxisParser(d[yAxis]) : d => d[yAxis]
  const category1Accessor = category1Parser ? d => category1Parser(d[category1]) : d => d[category1]
  const category2Accessor = category2Parser ? d => category2Parser(d[category2]) : d => d[category2]
  const category3Accessor = category3Parser ? d => category3Parser(d[category3]) : d => d[category3]
  const valueAccessor = valueParser ? d => valueParser(d[value]) : d => d[value]

  const xAxisType = xAxis && fields.find(field => field.id === xAxis).type ? fields.find(field => field.id === xAxis).type : typeof xAccessor(filteredData[0])
  const yAxisType = yAxis ? fields.find(field => field.id === yAxis).type : null
  const category1Type = category1 ? fields.find(field => field.id === category1).type : null
  const category2Type = category2 ? fields.find(field => field.id === category2).type : null
  const category3Type = category3 ? fields.find(field => field.id === category3).type : null
  const valueType = value ? fields.find(field => field.id === value).type : null

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const renderChart = (zoomed) => {
    switch (chart.type) {
      case "scatter": return <ScatterPlot
        zoomed={zoomed}
        active={active}
        outOfFocus={outOfFocus}
        data={selectedChart == chart.id ? filteredData : _.filter(filteredData, { marked: true })}
        xAxis={xAxis}
        yAxis={yAxis}
        xAxisParser={xAxisParser}
        yAxisParser={yAxisParser}
        xAxisType={xAxisType}
        yAxisType={yAxisType}
        onMouseDown={onDoStuff}
        selectedChart={selectedChart}
        chartId={chart.id}
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
        xAxisType={xAxisType}
        yAxisSummarization={yAxisSummarization}
        selectedChart={selectedChart}
        chartId={chart.id}
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
        data={selectedChart == chart.id ? filteredData : _.filter(filteredData, { marked: true })}
        xAxis={xAxis}
        yAxis={yAxis}
        xAxisFormat={xAxisFormat}
        xAxisParser={xAxisParser}
        yAxisParser={yAxisParser}
        xAxisType={xAxisType}
        yAxisType={yAxisType}
        onMouseDown={onDoStuff}
        selectedChart={selectedChart}
        chartId={chart.id}
        selectedColumnType={selectedColumnType}
        selectedColumn1={selectedColumn1}
        selectedColumn2={selectedColumn2}
        selectedItem1={selectedItem1}
        selectedItem2={selectedItem2}
      />
      case "list": return <List
        zoomed={zoomed}
        active={active}
        outOfFocus={outOfFocus}
        data={selectedChart == chart.id ? filteredData : _.filter(filteredData, { marked: true })}
        selectedChart={selectedChart}
        chartId={chart.id}
        selectedColumnType={selectedColumnType}
        selectedColumn1={selectedColumn1}
        selectedColumn2={selectedColumn2}
        selectedItem1={selectedItem1}
        selectedItem2={selectedItem2}
        onMouseDown={onDoStuff}
        category1={category1}
        category2={category2}
        category3={category3}
        value={value}
        category1Parser={category1Parser}
        category2Parser={category2Parser}
        category3Parser={category3Parser}
        valueParser={valueParser}
        category1Type={category1Type}
        category2Type={category2Type}
        category3Type={category3Type}
        valueType={valueType}
        valueSummarization={valueSummarization}
      />
      default: return null;
    }
  }

  const getChartClass = () => {
    switch (chart.type) {
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
