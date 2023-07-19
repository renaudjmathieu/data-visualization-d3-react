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

const Container = ({ opened, onClick1, onClick2, chart, chosen, index, data, fields }) => {

  const theme = useTheme();

  const outOfFocus = chosen !== null && index !== chosen
  const active = index === chosen
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

  const xAxisFormat = xAxis ? fields.find(field => field.id === xAxis).format : null
  const yAxisFormat = yAxis ? fields.find(field => field.id === yAxis).format : null
  const categoryFormat = category ? fields.find(field => field.id === category).format : null
  const valueFormat = value ? fields.find(field => field.id === value).format : null

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [selectedColumn, setSelectedColumn] = React.useState('icon')
  const [selectedItem, setSelectedItem] = React.useState('rain')
  const [filteredData, setFilteredData] = React.useState(data)

  const doStuff = (column, item) => {
    const filteredData = item ? _.filter(data, { [column]: item }) : data

    setFilteredData(filteredData)
    setSelectedColumn(column)
    setSelectedItem(item)
  }

  const onDoStuff = (e, column, item) => {
    //doStuff(column, item)
    doStuff('icon', 'rain')
  }

  React.useEffect(() => {
    doStuff(selectedColumn, selectedItem)
  }, [])

  const renderChart = (zoomed) => {
    switch (chart.id) {
      case "scatter": return <ScatterPlot
        zoomed={zoomed}
        active={active}
        outOfFocus={outOfFocus}
        data={filteredData}
        xAxis={xAxis}
        yAxis={yAxis}
        xAxisParser={xAxisParser}
        yAxisParser={yAxisParser}
        xAxisFormat={xAxisFormat}
        yAxisFormat={yAxisFormat}
      />
      case "histogram": return <Histogram
        zoomed={zoomed}
        active={active}
        outOfFocus={outOfFocus}
        data={filteredData}
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
        data={filteredData}
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
        data={filteredData}
        selectedItem={null}
        selectedColumn="metric"
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
