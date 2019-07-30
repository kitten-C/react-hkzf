import React, {Component} from 'react'

import {PickerView} from 'antd-mobile'

import FilterFooter from '../../../../components/FilterFooter'

export default class FilterPicker extends Component {
  render() {
    const {data, cols} = this.props
    return (
      <>
        {/* 选择器组件： */}
        <PickerView
          data={data}
          value={null}
          cols={cols}
          onChange={v => console.log(v)}
        />

        {/* 底部按钮 */}
        <FilterFooter />
      </>
    )
  }
}
