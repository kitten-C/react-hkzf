import React from 'react'

// 引入吸顶功能
import Sticky from '../../components/Sticky'

import {Flex, Toast} from 'antd-mobile'
import {
  List,
  AutoSizer,
  WindowScroller,
  InfiniteLoader
} from 'react-virtualized'

import {getCurrentCity, API} from '../../utils'

// 引入搜索头部
import SearchHeader from '../../components/SearchHeader'

// 引入城市列表
import HouseList from '../../components/HouseItem'

// 筛选栏
import Filter from './components/Filter'

import styles from './index.module.scss'

export default class extends React.Component {
  state = {
    houseList: [],
    count: 0
  }
  // 这是默认值
  label = '上海'
  filter = {}
  // 从filter获取数据
  onFilter = filter => {
    this.filter = filter

    this.searchHouseList()
  }

  // 处理过滤数据
  handleFilterData = (start = 1, end = 20) => {
    const {area, mode, price, more} = this.filter
    let filterData
    if (!area) {
      return (filterData = {
        cityId: this.value,
        start,
        end
      })
    }
    let areaCity

    if (area.length === 2) {
      areaCity = area[1]
    } else {
      areaCity = area[2] === 'null' ? area[1] : area[2]
    }

    filterData = {
      cityId: this.value,
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
  searchHouseList = async (start, end) => {
    // console.log(start, end)
    // 加载提示
    // Toast.loading('Loading...', 0)

    const filterData = this.handleFilterData(start, end)
    const res = await API.get('/houses', {
      params: {
        ...filterData
      }
    })
    // console.log(res.data.body)
    this.setState({
      houseList: res.data.body.list,
      count: res.data.body.count
    })
    Toast.hide()
  }

  rowRenderer = ({key, index, style}) => {
    const {houseList} = this.state

    if (!houseList[index]) {
      return <div key={key}>1213</div>
    }
    return (
      <HouseList
        item={houseList[index]}
        key={key}
        style={style}
        onClick={code => this.props.history.push(`/detail/${code}`)}
      />
    )
  }

  isRowLoaded = ({index}) => {
    return !!this.state.houseList[index]
  }

  loadMoreRows = ({startIndex, stopIndex}) => {
    return new Promise(async resolve => {
      const filterData = this.handleFilterData(startIndex, stopIndex)

      const res = await API.get('/houses', {
        params: {
          ...filterData
        }
      })
      console.log(res)
      this.setState({
        houseList: [...this.state.houseList, ...res.data.body.list],
        count: res.data.body.count
      })
      resolve()
    })
  }

  renderHouseList = () => {
    const {houseList, count} = this.state
    if (houseList.length === 0) return
    return (
      <InfiniteLoader
        isRowLoaded={this.isRowLoaded}
        loadMoreRows={this.loadMoreRows}
        rowCount={count}
        minimumBatchSize={20}
      >
        {({onRowsRendered, registerChild}) => (
          <WindowScroller>
            {({height, isScrolling, scrollTop}) => (
              <AutoSizer>
                {({width}) => (
                  <List
                    autoHeight
                    isScrolling={isScrolling}
                    scrollTop={scrollTop}
                    width={width}
                    onRowsRendered={onRowsRendered}
                    ref={registerChild}
                    height={height}
                    rowCount={count}
                    rowHeight={120}
                    rowRenderer={this.rowRenderer}
                  />
                )}
              </AutoSizer>
            )}
          </WindowScroller>
        )}
      </InfiniteLoader>
    )
  }

  async componentDidMount() {
    const {label, value} = await getCurrentCity()
    this.label = label
    this.value = value
    this.searchHouseList()
  }
  render() {
    return (
      <>
        <Flex className={styles.header}>
          <i
            className="iconfont icon-back"
            onClick={() => this.props.history.go(-1)}
          />
          <SearchHeader curCity={this.label} className={styles.listSearch} />
        </Flex>
        <Sticky>
          <Filter onFilter={this.onFilter} />
        </Sticky>
        {this.renderHouseList()}
      </>
    )
  }
}
