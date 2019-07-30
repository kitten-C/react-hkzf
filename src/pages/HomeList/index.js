import React from 'react'

import {Flex} from 'antd-mobile'

// 引入搜索头部
import SearchHeader from '../../components/SearchHeader'

import Filter from './components/Filter'

import styles from './index.module.scss'

export default class extends React.Component {
  render() {
    return (
      <>
        <Flex className={styles.header}>
          <i
            className="iconfont icon-back"
            onClick={() => this.props.history.go(-1)}
          />
          <SearchHeader curCity="上海" className={styles.listSearch} />
        </Flex>
        <Filter />
      </>
    )
  }
}
