import React from 'react'

import {getCurrentCity, loading, closeLoading} from '../../utils'

// 导入头部
import NavHeader from '../../components/NavHeader'

// 导入城市列表
import HouseItem from '../../components/HouseItem'

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
  state = {
    isShowHouseList: false,
    houseList: []
  }
  // 展示地图
  renderMap = ({label, value}) => {
    const map = new BMap.Map('container')
    this.map = map
    var myGeo = new BMap.Geocoder()
    myGeo.getPoint(
      label,
      point => {
        if (point) {
          // console.log(point)
          // 根据point渲染地图，后面的值为放大比例
          map.centerAndZoom(point, 11)
          // 添加比例尺
          map.addControl(new BMap.ScaleControl())
          // 添加缩放控件
          map.addControl(new BMap.NavigationControl())

          // *渲染覆盖物
          this.renderOverLays(value)
        }
      },
      label
    )
    map.addEventListener('movestart', () => {
      this.setState({
        isShowHouseList: false
      })
    })
  }

  // 渲染覆盖物
  async renderOverLays(id) {
    loading()
    const res = await axios.get('http://localhost:8080/area/map', {
      params: {id}
    })

    // *计算类型和缩放级别
    const {nextZoom, type} = this.getTypeAndZoom()

    // *创建覆盖物
    const data = res.data.body

    this.createOverlays(data, nextZoom, type)
    closeLoading()
  }

  // 创建覆盖物
  // 逻辑：verlayShape为circle创建区、镇覆盖物，rect创建小区覆盖物
  createOverlays(data, nextZoom, type) {
    if (type === 'circle') {
      // *创建区、镇覆盖物
      data.forEach(v => {
        this.createCircle(v, nextZoom)
      })
    } else {
      // *创建小区覆盖物
      data.forEach(v => {
        this.createRect(v)
      })
    }
  }

  // 计算类型和缩放级别
  // 区   -> 11 ，范围：>=10 <12
  // 镇   -> 13 ，范围：>=12 <14
  // 小区 -> 15 ，范围：>=14 <16
  getTypeAndZoom() {
    // 调用getZoom方法获取当前缩放
    const zoom = this.map.getZoom()
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
  createCircle(
    {
      label,
      count,
      value,
      coord: {latitude, longitude}
    },
    nextZoom
  ) {
    const point = new BMap.Point(longitude, latitude)

    // 创建文本标注对象 命名冲突 label改成area
    const area = new BMap.Label('', {
      // 指定文本标注所在的地理位置
      position: point,
      //设置文本偏移量
      offset: new BMap.Size(-35, -35)
    })

    area.setStyle(labelStyle)
    area.setContent(`
          <div class="${styles.bubble}">
            <p class="${styles.name}">${label}</p>
            <p>${count}套</p>
          </div>
          `)

    // 注册点击事件

    area.addEventListener('click', () => {
      // 修改地图大小
      this.map.centerAndZoom(point, nextZoom)

      // 删除所有覆盖物
      setTimeout(() => {
        this.map.clearOverlays()
      }, 0)

      // 渲染新的遮盖物
      this.renderOverLays(value)
    })
    this.map.addOverlay(area)
  }

  // 创建小区覆盖物
  createRect({label, count, value, coord: {latitude, longitude}}) {
    const point = new BMap.Point(longitude, latitude)

    // 创建文本标注对象 命名冲突 label改成area
    const area = new BMap.Label('', {
      // 指定文本标注所在的地理位置
      position: point,
      //设置文本偏移量
      offset: new BMap.Size(-35, -35)
    })

    area.setStyle(labelStyle)
    area.setContent(`
      <div class="${styles.rect}">
        <span class="${styles.housename}">${label}</span>
        <span class="${styles.housenum}">${count}套</span>
        <i class="${styles.arrow}"></i>
      </div>
    `)

    // 注册点击事件
    area.addEventListener('click', e => {
      console.log(e.changedTouches[0])
      const {clientX, clientY} = e.changedTouches[0]
      const x = window.innerWidth / 2 - clientX
      const y = (window.innerHeight - 330) / 2 - clientY
      this.map.panBy(x, y)
      this.getHoseList(value)
    })
    this.map.addOverlay(area)
  }

  async getHoseList(cityId) {
    loading()
    console.log(cityId)
    const res = await axios.get('http://localhost:8080/houses', {
      params: {
        cityId
      }
    })
    console.log(res.data.body.list)
    this.setState({
      houseList: res.data.body.list,
      isShowHouseList: true
    })
    closeLoading()
  }

  renderHouseList = () => {
    console.log(this.state.houseList)
    return this.state.houseList.map((item, i) => (
      <HouseItem item={item} key={i} />
    ))
  }

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

        {/* 房源列表结构 */}
        {/* 如果要展示列表结构，只需要添加 styles.show 类名即可 */}
        {/* <div
          className={[
            styles.houseList,
            this.state.isShowHouseList ? styles.show : ''
          ].join(' ')}
        > */}
        <div
          className={[
            styles.houseList,
            this.state.isShowHouseList ? styles.show : ''
          ].join(' ')}
        >
          <div className={styles.titleWrap}>
            <h1 className={styles.listTitle}>房屋列表</h1>
            <a className={styles.titleMore} href="/house/list">
              更多房源
            </a>
          </div>
          <div className={styles.houseItems}>{this.renderHouseList()}</div>
        </div>
      </div>
    )
  }
}
