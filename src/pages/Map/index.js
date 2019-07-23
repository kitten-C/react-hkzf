import React from 'react'

import './index.scss'

const BMap = window.BMap

export default class extends React.Component {
  componentDidMount() {
    const map = new BMap.Map('container')
    const point = new BMap.Point(116.404, 39.915)
    map.centerAndZoom(point, 15)
    window.setTimeout(function() {
      map.panTo(new BMap.Point(116.409, 39.918))
    }, 2000)
  }

  render() {
    return (
      <div className="map">
        <div id="container" />
      </div>
    )
  }
}
