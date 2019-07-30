import React from 'react'

import {Flex} from 'antd-mobile'

import styles from './index.module.css'

// 条件筛选栏标题数组：
const titleList = [
  {title: '区域', type: 'area'},
  {title: '方式', type: 'mode'},
  {title: '租金', type: 'price'},
  {title: '筛选', type: 'more'}
]

export default function FilterTitle({
  titleSelectedStatus,
  changeTitleSelected
}) {
  // 渲染标题
  const renderTitle = () => {
    return titleList.map(v => (
      <Flex.Item key={v.type} className={styles.titleList}>
        <span
          className={[
            styles.dropdown,
            titleSelectedStatus[v.type] ? styles.selected : ''
          ].join(' ')}
          onClick={() => {
            changeTitleSelected(v.type)
          }}
        >
          <span>{v.title}</span>
          <i className="iconfont icon-arrow" />
        </span>
      </Flex.Item>
    ))
  }
  return (
    <Flex align="center" className={styles.root}>
      {/* 选中类名： selected */}
      {renderTitle()}
    </Flex>
  )
}
