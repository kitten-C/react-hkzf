import React from 'react'

import {Flex} from 'antd-mobile'
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
    currentCity: {},
    houseList: []
  }
  // 从filter获取数据

  // 处理过滤数据
  handleFilterData = async (v, start = 1, end = 20) => {
    const {area, mode, price, more} = v
    const {value} = await getCurrentCity()

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
    const res = await API.get('/houses', {
      params: {
        ...filterData
      }
    })
    // console.log(res.data.body)
    this.setState({
      houseList: res.data.body
    })
  }

  rowRenderer = ({key, index, style}) => {
    const {houseList} = this.state
    return <HouseList item={houseList.list[index]} key={key} style={style} />
  }

  isRowLoaded = ({index}) => {
    return !!this.state.houseList[index]
  }

  loadMoreRows = ({startIndex, stopIndex}) => {
    return fetch(
      `path/to/api?startIndex=${startIndex}&stopIndex=${stopIndex}`
    ).then(response => {
      // Store response data in list...
    })
  }

  renderHouseList = () => {
    const {houseList} = this.state
    console.log(houseList)
    if (houseList.length === 0) return
    return (
      <InfiniteLoader
        isRowLoaded={this.isRowLoaded}
        loadMoreRows={this.loadMoreRows}
        rowCount={houseList.count}
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
                    rowCount={houseList.count}
                    rowHeight={120}
                    rowRenderer={this.rowRenderer}
                    // ref={this.listRef}
                    scrollToAlignment="start"
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
    const currentCity = await getCurrentCity()
    this.setState({
      currentCity
    })
  }
  render() {
    const {houseList, currentCity} = this.state
    return (
      <>
        <Flex className={styles.header}>
          <i
            className="iconfont icon-back"
            onClick={() => this.props.history.go(-1)}
          />
          <SearchHeader
            curCity={currentCity.label}
            className={styles.listSearch}
          />
        </Flex>
        <Filter searchHouseList={this.searchHouseList} />
        {this.renderHouseList()}
      </>
    )
  }
}
