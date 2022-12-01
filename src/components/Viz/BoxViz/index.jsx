import React, { useEffect, useRef } from 'react'
import './styles.css'

const BoxViz = () => {
  const ref = useRef(null)

  return <div class="box" ref={ref}></div>
}

export default BoxViz