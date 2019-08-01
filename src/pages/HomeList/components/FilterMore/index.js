import React, {Component} from 'react'

import FilterFooter from '../../../../components/FilterFooter'

import styles from './index.module.css'

export default class FilterMore extends Component {
  state = {
    selectedData: this.props.defaultValue
  }
  // 渲染标签
  renderFilters(data) {
    // 高亮类名： styles.tagActive
    if (!data) return
    return data.map(v => (
      <span
        key={v.value}
        className={[
          styles.tag,
          this.isSelected(v.value) ? styles.tagActive : ''
        ].join(' ')}
        onClick={() => {
          this.changeSelected(v.value)
        }}
      >
        {v.label}
      </span>
    ))
  }

  // 改变标签选中状态
  changeSelected = value => {
    console.log(1)
    const {selectedData} = this.state
    if (selectedData.includes(value)) {
      this.setState({
        selectedData: selectedData.filter(v => v !== value)
      })
    } else {
      this.setState({
        selectedData: [...selectedData, value]
      })
    }
  }

  // 判断标签是否选中
  isSelected = value => {
    console.log(this.state.selectedData)
    return this.state.selectedData.includes(value)
  }

  // 清除所有标签选中状态
  clearAllSelected = () => {
    this.setState({
      selectedData: []
    })
  }

  render() {
    const {onCancel, onSave, data} = this.props
    const {roomType, oriented, floor, characteristic} = data
    return (
      <div className={styles.root}>
        {/* 遮罩层 */}
        <div className={styles.mask} onClick={onCancel} />

        {/* 条件内容 */}
        <div className={styles.tags}>
          <dl className={styles.dl}>
            <dt className={styles.dt}>户型</dt>
            <dd className={styles.dd}>{this.renderFilters(roomType)}</dd>

            <dt className={styles.dt}>朝向</dt>
            <dd className={styles.dd}>{this.renderFilters(oriented)}</dd>

            <dt className={styles.dt}>楼层</dt>
            <dd className={styles.dd}>{this.renderFilters(floor)}</dd>

            <dt className={styles.dt}>房屋亮点</dt>
            <dd className={styles.dd}>{this.renderFilters(characteristic)}</dd>
          </dl>
        </div>

        {/* 底部按钮 */}
        <FilterFooter
          className={styles.footer}
          onCancel={this.clearAllSelected}
          onSave={() => {
            onSave(this.state.selectedData)
          }}
          footerText="清除"
        />
      </div>
    )
  }
}
