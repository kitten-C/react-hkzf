import React, {Component} from 'react'

import {Spring} from 'react-spring/renderprops'

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

    this.htmlBody.classList.add(styles.hidden)

    this.setState({
      openType: type
    })
  }

  // 改变标题高亮
  changeTitleSelected = (type, boolean) => {
    this.setState(state => ({
      titleSelectedStatus: {
        ...state.titleSelectedStatus,
        [type]: boolean
      }
    }))
  }

  // 修改默认值后高亮
  changeDefault = (openType = this.state.openType) => {
    const {defaultFilterResult: newFilterResult} = this.state
    // if (!newFilterResult[openType]) {
    //   return console.log(newFilterResult)
    // }
    if (!newFilterResult[openType]) return
    let result = newFilterResult[openType].every(
      (v, i) =>
        newFilterResult[openType][i] === defaultFilterResult[openType][i]
    )

    this.changeTitleSelected(openType, !result)
  }

  // 打开遮罩层
  openMask = () => {
    // console.log(this.htmlBody)
    const {openType} = this.state
    // if (openType === 'more' || openType === '') return
    return (
      <Spring
        from={{opacity: 0}}
        to={{opacity: openType === 'more' || openType === '' ? 0 : 1}}
      >
        {props => {
          console.log(props.opacity)
          if (props.opacity === 0) return null
          return (
            <div
              className={styles.mask}
              style={props}
              onClick={this.closeMask}
            />
          )
        }}
      </Spring>
    )
  }

  // 关闭遮罩层
  closeMask = () => {
    console.log(1)
    this.htmlBody.classList.remove(styles.hidden)
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
    this.props.onFilter(this.state.defaultFilterResult)
    window.scroll(0, 0)
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
      <Spring from={{height: 0}} to={{height: 309}}>
        {props => (
          <FilterPicker
            key={this.state.openType}
            data={data}
            cols={cols}
            defaultValue={defaultFilterResult[openType]}
            onSave={this.onSave}
            changeDefault={this.changeDefault}
            onCancel={this.onCancel}
            // style={props}
          />
        )}
      </Spring>
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
    // 把筛选数据发送给hoseList
    this.htmlBody = document.body
    // this.props.onFilter(this.state.defaultFilterResult)
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
