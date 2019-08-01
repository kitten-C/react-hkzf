import React, {Component} from 'react'

import {API, getCurrentCity} from '../../../../utils/index'

import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'

import styles from './index.module.css'

const titleSelectedStatus = {
  area: false,
  mode: false,
  price: false,
  more: false
}
const defaultFilterResult = {
  area: ['area', 'null'],
  mode: ['null'],
  price: ['null'],
  more: []
}
export default class Filter extends Component {
  state = {
    titleSelectedStatus,
    openType: '',
    filterData: {},
    defaultFilterResult
  }

  // 点击标题
  clickTitle = (type, boolean) => {
    Object.keys(defaultFilterResult).forEach(v => this.changeDefault(v))

    this.changeTitleSelected(type, boolean)

    this.setState({
      openType: type
    })
  }

  // 改变标题高亮
  changeTitleSelected = (type, boolean) => {
    // setTimeout(() => {
    this.setState((state, props) => ({
      titleSelectedStatus: {
        ...state.titleSelectedStatus,
        [type]: boolean
      }
    }))
    // }, 0)
  }

  // 修改默认值后高亮
  changeDefault = (openType = this.state.openType) => {
    const {defaultFilterResult: newFilterResult} = this.state
    if (!newFilterResult[openType]) {
      return console.log(newFilterResult)
    }
    let result = newFilterResult[openType].every(
      (v, i) =>
        newFilterResult[openType][i] === defaultFilterResult[openType][i]
    )

    this.changeTitleSelected(openType, !result)
  }

  // 打开遮罩层
  openMask = () => {
    const {openType} = this.state
    if (openType === 'more' || openType === '') return
    return <div className={styles.mask} onClick={this.closeMask} />
  }

  // 关闭遮罩层
  closeMask = () => {
    this.changeDefault()
    this.setState({
      openType: ''
    })
  }

  // 取消按钮
  onCancel = () => {
    this.closeMask()
  }

  // 确认按钮
  onSave = async v => {
    await this.changeDefaultFilterResult(v)
    this.closeMask()
  }

  // 修改默认值
  changeDefaultFilterResult = v => {
    const {defaultFilterResult, openType} = this.state
    this.setState({
      defaultFilterResult: {
        ...defaultFilterResult,
        [openType]: v
      }
    })
  }

  // 渲染前三个菜单
  renderPicker = () => {
    const {openType, defaultFilterResult, filterData} = this.state
    const {area, subway, rentType, price} = filterData
    if (openType === '' || openType === 'more') return
    let data = []
    let cols = 1
    switch (openType) {
      case 'area':
        data = [area, subway]
        cols = 3
        break
      case 'mode':
        data = rentType
        break
      case 'price':
        data = price
        break

      default:
        break
    }
    return (
      <FilterPicker
        key={this.state.openType}
        data={data}
        cols={cols}
        defaultValue={defaultFilterResult[openType]}
        onSave={this.onSave}
        changeDefault={this.changeDefault}
        onCancel={this.onCancel}
      />
    )
  }

  // 渲染最后一个菜单
  renderMore = () => {
    const {openType, filterData, defaultFilterResult} = this.state
    const {roomType, oriented, floor, characteristic} = filterData
    const data = {roomType, oriented, floor, characteristic}

    if (openType === 'more')
      return (
        <FilterMore
          onCancel={this.onCancel}
          onSave={this.onSave}
          data={data}
          defaultValue={defaultFilterResult[openType]}
        />
      )
    return null
  }

  // 获取菜单数据
  getFilterData = async () => {
    const {value: id} = await getCurrentCity()
    const res = await API.get('/houses/condition', {
      params: {
        id
      }
    })
    // console.log(res)
    this.setState({
      filterData: res.data.body
    })
  }

  componentDidMount() {
    this.getFilterData()
  }

  render() {
    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        {/* <div className={styles.mask} /> */}
        {this.openMask()}

        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle
            titleSelectedStatus={this.state.titleSelectedStatus}
            clickTitle={this.clickTitle}
          />
          {/* 前三个菜单对应的内容： */}
          {this.renderPicker()}

          {/* 最后一个菜单对应的内容： */}
          {this.renderMore()}
        </div>
      </div>
    )
  }
}
