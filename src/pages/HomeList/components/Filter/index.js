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
export default class Filter extends Component {
  state = {
    titleSelectedStatus,
    openType: '',
    filterData: {},
    defaultFilterResult: {
      area: false,
      mode: false,
      price: false,
      more: false
    }
  }

  // 点击标题高亮
  changeTitleSelected = type => {
    this.setState({
      titleSelectedStatus: {
        ...titleSelectedStatus,
        [type]: true
      },
      openType: type
    })
  }
  // 打开遮罩层
  openMask = () => {
    const {openType} = this.state
    if (openType === 'more' || openType === '') return
    return <div className={styles.mask} onClick={this.closeMask} />
  }

  // 关闭遮罩层
  closeMask = () => {
    this.setState({
      openType: ''
    })
  }

  // 渲染前三个菜单
  renderPicker = () => {
    const {openType} = this.state
    const {area, subway, rentType, price} = this.state.filterData
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
    return <FilterPicker data={data} cols={cols} />
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
            changeTitleSelected={this.changeTitleSelected}
          />
          {/* 前三个菜单对应的内容： */}
          {this.renderPicker()}

          {/* 最后一个菜单对应的内容： */}
          {/* <FilterMore /> */}
        </div>
      </div>
    )
  }
}
