import React from 'react'

import {Flex} from 'antd-mobile'

import {getCurrentCity, API} from '../../utils'

// 引入搜索头部
import SearchHeader from '../../components/SearchHeader'

// 筛选栏
import Filter from './components/Filter'

import styles from './index.module.scss'

export default class extends React.Component {
  state = {
    currentCity: {}
  }
  // 从filter获取数据

  // 处理过滤数据
  handleFilterData = async (v, start = 1, end = 20) => {
    const {area, mode, price, more} = v
    const {value} = await getCurrentCity()
    // console.log(area, mode, price, more)

    let areaCity
    if (area.length === 2) {
      areaCity = area[1]
    } else {
      areaCity = area[2] === 'null' ? area[1] : area[2]
    }

    const filterData = {
      cityId: value,
      [area[0]]: areaCity,
      rentType: mode[0],
      price: price[0],
      more: more.join(),
      start,
      end
    }
    return filterData
  }

  // 获取城市列表
  searchHouseList = async v => {
    const filterData = await this.handleFilterData(v)
    console.log(filterData)
    const res = await API.get('/houses', {
      params: {
        ...filterData
      }
    })
    console.log(res.data.body.list)
  }
  async componentDidMount() {
    const currentCity = await getCurrentCity()
    this.setState({
      currentCity
    })
  }
  render() {
    return (
      <>
        <Flex className={styles.header}>
          <i
            className="iconfont icon-back"
            onClick={() => this.props.history.go(-1)}
          />
          <SearchHeader
            curCity={this.state.currentCity.label}
            className={styles.listSearch}
          />
        </Flex>
        <Filter searchHouseList={this.searchHouseList} />
      </>
    )
  }
}
