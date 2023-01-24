import React from "react"
import PropTypes from "prop-types"
import * as d3 from "d3"

import Chart from "./chart/Chart"
import Rectangles from "./chart/Rectangles"
import Texts from "./chart/Texts"
import { useChartDimensions, accessorPropsType } from "./chart/utils"

const Treemap = ({ outOfFocus, active, onClick, data, valueAccessor, entityAccessor, valueLabel, entityLabel, entityFormat }) => {
  const [ref, dimensions] = useChartDimensions({
    marginTop: 0,
    marginRight: 20,
    marginBottom: 34,
    marginLeft: 30,
  })

  const grandParent = [
    {
      id: "Root",
    }
  ]

  const parents = [...new Set(data.map(entityAccessor))].map(d => ({
    parentId: "Root",
    id: d,
  }))

  data = [
    ...grandParent,
    ...parents,
    ...data.map(d => ({
      ...d,
      parentId: entityAccessor(d),
      id: d.date,
      value: valueAccessor(d),
    }))
  ];

  const root = d3.stratify()
    .id(d => d.id)
    .parentId(d => d.parentId)
    (data)
    .sum(valueAccessor)

  const treemap = d3.treemap()
    .size([dimensions.boundedWidth, dimensions.boundedHeight])
    .paddingTop(28)
    .paddingRight(7)
    .paddingInner(3)
    .round(true)(root)

  const keyAccessor = (d, i) => i

  return (
    <div onClick={onClick} className={active ? "Chart__rectangle active" : outOfFocus ? "Chart__rectangle outOfFocus" : "Chart__rectangle"} ref={ref}>
      <Chart dimensions={dimensions}>
        <Rectangles
          data={root.leaves()}
          keyAccessor={keyAccessor}
          xAccessor={d => (d.x0)}
          yAccessor={d => (d.y0)}
          widthAccessor={d => (d.x1) - (d.x0)}
          heightAccessor={d => (d.y1) - (d.y0)}
        />
        <Texts
          data={root.descendants().filter(function(d){return d.depth==1})}
          keyAccessor={keyAccessor}
          xAccessor={d => (d.x0)}
          yAccessor={d => (d.y0 + 21)}
          textAccessor={d => d.data.id}
        />
      </Chart>
    </div>
  )
}

Treemap.propTypes = {
  valueAccessor: accessorPropsType,
  entityAccessor: accessorPropsType,
  valueLabel: PropTypes.string,
  entityLabel: PropTypes.string,
  entityFormat: PropTypes.func,
}
export default Treemap
