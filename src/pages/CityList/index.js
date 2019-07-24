import React from 'react'

import axios from 'axios'

import {NavBar} from 'antd-mobile'
import {List} from 'react-virtualized'

import {getCurrentCity} from '../../utils'

import './index.scss'

// 处理城市列表数据
const formatCityList = res => {
  const cityList = {}
  res.forEach(v => {
    const initial = v.short[0]
    if (initial in cityList) {
      cityList[initial].push(v)
    } else {
      cityList[initial] = [v]
    }
  })
  const cityInitial = Object.keys(cityList).sort()
  return {cityList, cityInitial}
}

// react-virtualized插件示例代码
const list = Array.from(new Array(10000)).map((v, i) => {
  return `假数据 20点58分${i}`
})
console.log(list)

function rowRenderer({
  key, // Unique key within array of rows
  index, // Index of row within collection
  isScrolling, // The List is currently being scrolled
  isVisible, // This row is visible within the List (eg it is not an overscanned row)
  style // Style object to be applied to row (to position it)
}) {
  return (
    <div key={key} style={style}>
      {list[index]}
    </div>
  )
}

export default class extends React.Component {
  state = {}
  // 1 获取处理好的城市数据
  async fetchCityList() {
    // 1.1 获取所有城市列表数据
    const res = await axios.get('http://localhost:8080/area/city', {
      params: {
        level: 1
      }
    })

    // 1.1.1 处理城市数据
    const {cityList, cityInitial} = formatCityList(res.data.body)

    // 1.2 获取热门城市数据
    const hotCityRes = await axios.get('http://localhost:8080/area/hot')

    // 1.2.1 热门数据城市添加进数据中
    cityList['hot'] = hotCityRes.data.body
    cityInitial.unshift('hot')

    // 1.3 获取本地城市数据
    const {label, value} = await getCurrentCity()

    // 1.3.1 热门数据城市添加进数据中
    cityList['curCity'] = [{label, value}]
    cityInitial.unshift('#')

    console.log(cityList, cityInitial)
  }

  componentDidMount() {
    // 获取所有城市数据
    this.fetchCityList()
  }

  render() {
    return (
      <div>
        {/* 导航栏 */}
        <NavBar
          className="nvaBar"
          mode="light"
          icon={<i className="iconfont icon-back" />}
          onLeftClick={() => this.props.history.go(-1)}
        >
          城市选择
        </NavBar>
        {/* 城市数据渲染 */}
        <List
          width={300}
          height={300}
          rowCount={list.length}
          rowHeight={20}
          rowRenderer={rowRenderer}
        />
      </div>
    )
  }
}
