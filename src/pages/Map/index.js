import React from 'react'

import {getCurrentCity} from '../../utils'

// 导入头部
import NavHeader from '../../components/NavHeader'

import styles from './index.module.scss'
import axios from 'axios'

const BMap = window.BMap

// 覆盖物样式
const labelStyle = {
  cursor: 'pointer',
  border: '0px solid rgb(255, 0, 0)',
  padding: '0px',
  whiteSpace: 'nowrap',
  fontSize: '12px',
  color: 'rgb(255, 255, 255)',
  textAlign: 'center'
}

export default class extends React.Component {
  state = {}
  // 展示地图
  renderMap = ({label, value}) => {
    const map = new BMap.Map('container')
    this.map = map
    var myGeo = new BMap.Geocoder()
    myGeo.getPoint(
      label,
      point => {
        if (point) {
          // 根据point渲染地图，后面的值为放大比例
          map.centerAndZoom(point, 11)
          // 添加比例尺
          map.addControl(new BMap.ScaleControl())
          // 添加缩放控件
          map.addControl(new BMap.NavigationControl())

          // *渲染覆盖物
          this.renderOverLays(value)

          var opts = {
            position: point, // 指定文本标注所在的地理位置
            offset: new BMap.Size(-35, -35) //设置文本偏移量
          }
          var label = new BMap.Label(
            '欢迎使用百度地图，这是一个简单的文本标注哦~',
            opts
          ) // 创建文本标注对象
          label.setStyle(labelStyle)

          label.setContent(`
          <div class="${styles.bubble}">
            <p class="${styles.name}">浦东新区</p>
            <p>388套</p>
          </div>
          `)
          map.addOverlay(label)
        }
      },
      label
    )
  }

  // 渲染覆盖物
  async renderOverLays(id) {
    const res = await axios.get('http://localhost:8080/area/map', {
      params: {id}
    })
    console.log(res)
    // *创建覆盖物
    this.createOverlays(res.data.body)
  }

  // 创建覆盖物
  // 逻辑：verlayShape为circle创建区、镇覆盖物，rect创建小区覆盖物
  createOverlays() {
    if (this.verlayShape === 'circle') {
      // *创建区、镇覆盖物
      this.createCircle()
    } else {
      // *创建小区覆盖物
      this.createRect()
    }
  }

  // 计算类型和缩放级别
  // 区   -> 11 ，范围：>=10 <12
  // 镇   -> 13 ，范围：>=12 <14
  // 小区 -> 15 ，范围：>=14 <16
  getTypeAndZoom() {
    // 调用getZoom方法获取当前缩放
    const zoom = map.getZoom()
    let type, nextZoom
    if (zoom >= 10 && zoom < 12) {
      nextZoom = 13
      type = 'circle'
    } else if (zoom >= 12 && zoom < 14) {
      nextZoom = 14
      type = 'circle'
    } else {
      type = 'reat'
    }
    return {nextZoom, type}
  }

  // 创建区、镇覆盖物
  createCircle() {}

  // 创建小区覆盖物
  createRect() {}

  async componentDidMount() {
    // 获取地区
    const {label, value} = await getCurrentCity()
    // 渲染地图
    this.renderMap({label, value})
  }

  render() {
    return (
      <div className={styles.map}>
        <NavHeader>地图</NavHeader>
        <div id="container" />
      </div>
    )
  }
}
