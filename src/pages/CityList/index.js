import React from 'react'

import axios from 'axios'

import {NavBar} from 'antd-mobile'

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
          onLeftClick={() => console.log('onLeftClick')}
        >
          城市选择
        </NavBar>
      </div>
    )
  }
}
