import React, {Component} from 'react'

import {PickerView} from 'antd-mobile'

import FilterFooter from '../../../../components/FilterFooter'

export default class FilterPicker extends Component {
  state = {
    defaultValue: this.props.defaultValue
  }

  getNewDefaultFilterResult = v => {
    this.setState({
      defaultValue: v
    })
  }

  componentDidMount() {}

  render() {
    const {data, cols, onSave, onCancel} = this.props
    const {defaultValue} = this.state
    return (
      <>
        {/* 选择器组件： */}
        <PickerView
          data={data}
          value={defaultValue}
          cols={cols}
          onChange={v => this.getNewDefaultFilterResult(v)}
          onCancel={onCancel}
        />

        {/* 底部按钮 */}
        <FilterFooter
          onSave={() => {
            onSave(defaultValue)
          }}
          onCancel={onCancel}
        />
      </>
    )
  }
}
