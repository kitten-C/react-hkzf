import React from 'react'

import axios from 'axios'

import {Toast} from 'antd-mobile'
import {List, AutoSizer} from 'react-virtualized'

import {getCurrentCity, setCity} from '../../utils'

// 引入头部
import NavHeader from '../../components/NavHeader'

import './index.scss'

// 处理城市列表数据
// 1. 引入示例
// 2. 修改示例数据
// 3. 导入高阶组件(AutoSizer)处理自动宽高
// 4. 父盒子设置高度100%
// 5. 解决高度超过视口问题
//  5.1 父盒子设施padding-top45px
//  5.2 bar设置margin-top -45px
//  5.3 解释 自动获取宽高不会获取padding值
// 6. 替换真实数据，把函数放入组件中，并修改格式
// 7. 计算高度
// 8. 添加右侧索引
// 9. 滚动高亮
// 10. 点击轮到相应的位置

// 设置常量
// 索引高度
const TITLE_HEIGHT = 36
// 城市列表高度
const CITY_HEIGHT = 50

// 有城市数据的城市
const hasCity = ['北京', '上海', '广州', '深圳']

// 处理所有城市数据
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

// 处理列表城市头部索引
const formatCityIndex = initial => {
  switch (initial) {
    case '#':
      return '本地城市'
    case 'hot':
      return '热门城市'

    default:
      return initial.toUpperCase()
  }
}
// react-virtualized插件示例代码
// const list = Array.from(new Array(10000)).map((v, i) => {
//   return `假数据 20点58分${i}`
// })

export default class extends React.Component {
  state = {
    cityList: {},
    cityInitial: [],
    activeInitial: 0
  }
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
    cityList['#'] = [{label, value}]
    cityInitial.unshift('#')

    // console.log()
    this.setState({
      cityList,
      cityInitial
    })
  }

  listRef = React.createRef()

  // 动态获取高度
  calcRowHeight = ({index}) => {
    const {cityInitial, cityList} = this.state

    const initial = cityInitial[index]
    const list = cityList[initial]

    return TITLE_HEIGHT + CITY_HEIGHT * list.length
  }

  // 插件中的方法 城市数据渲染
  rowRenderer = ({key, index, style}) => {
    const {cityInitial, cityList} = this.state

    const initial = cityInitial[index]
    const list = cityList[initial]
    // console.log(list)
    return (
      <div key={key} style={style} className="city">
        <div className="title">{formatCityIndex(initial)}</div>
        {list.map(v => (
          <div
            className="name"
            key={v.label}
            onClick={() => this.showToast(v)}
            mask="false"
          >
            {v.label}
          </div>
        ))}
      </div>
    )
  }

  //渲染索引值
  renderCityIntial = () => {
    const {cityInitial, activeInitial} = this.state
    return cityInitial.map((v, i) => (
      <div
        className="city-index-item"
        key={i}
        onClick={() => this.goCityList(i)}
      >
        <span className={activeInitial === i ? 'index-active' : ''}>
          {v === 'hot' ? '热' : v.toUpperCase()}
        </span>
      </div>
    ))
  }
  // 页面滚动时触发的函数
  onRowsRendered = ({startIndex}) => {
    if (this.state.activeInitial === startIndex) return
    this.setState({
      activeInitial: startIndex
    })
  }

  // 点击右侧索引
  goCityList = i => {
    this.listRef.current.scrollToRow(i)
  }

  // 点击城市，修改城市定位，没有数据的城市弹框提示
  showToast = ({label, value}) => {
    if (hasCity.indexOf(label) === -1)
      return Toast.info('无此城市数据', 1, null, false)
    setCity({label, value})
    this.props.history.go(-1)
  }

  async componentDidMount() {
    // 获取所有城市数据
    await this.fetchCityList()
  }

  render() {
    return (
      <div className="city_list">
        {/* 导航栏 */}
        {/* <NavBar
          className="nvaBar"
          mode="light"
          icon={<i className="iconfont icon-back" />}
          onLeftClick={() => this.props.history.go(-1)}
        >
          城市选择
        </NavBar> */}
        <NavHeader>城市列表</NavHeader>
        {/* 城市数据渲染 */}
        <AutoSizer>
          {({height, width}) => (
            <List
              width={width}
              height={height}
              rowCount={this.state.cityInitial.length}
              rowHeight={this.calcRowHeight}
              rowRenderer={this.rowRenderer}
              onRowsRendered={this.onRowsRendered}
              ref={this.listRef}
              scrollToAlignment="start"
            />
          )}
        </AutoSizer>
        {/* 右侧索引 */}
        <div className="city-index">{this.renderCityIntial()}</div>
      </div>
    )
  }
}
