import React from "react"
import PropTypes from "prop-types"
import * as d3 from "d3"

import Chart from "./chart/Chart"
import Rectangles from "./chart/Rectangles"
import { useChartDimensions, accessorPropsType } from "./chart/utils"

const Treemap = ({ data, valueAccessor, entityAccessor, valueLabel, entityLabel }) => {
  const [ref, dimensions] = useChartDimensions({
    marginBottom: 77,
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

  //stratify data where the sum is the number of children
  const root = d3.stratify()
    .id(d => d.id)
    .parentId(d => d.parentId)
    (data)
    .sum(valueAccessor)

  const treemap = d3.treemap()
    .size([dimensions.boundedWidth, dimensions.boundedHeight])
    .padding(1)
    .round(true)(root)

  /*
  const xAccessorScaled = d => xScale(d.x0)
  const yAccessorScaled = d => yScale(d.y0)
  const widthAccessorScaled = d => xScale(d.x1) - xScale(d.x0)
  const heightAccessorScaled = d => xScale(d.y1) - xScale(d.y0)
  */
  const keyAccessor = (d, i) => i

  return (
    <div className="Treemap" ref={ref}>
      <Chart dimensions={dimensions}>
        <Rectangles
          data={root.leaves()}
          keyAccessor={keyAccessor}
          xAccessor={d => d.x0}
          yAccessor={d => d.y0}
          widthAccessor={d => d.x1 - d.x0}
          heightAccessor={d => d.y1 - d.y0}
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
}
export default Treemap
