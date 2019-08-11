import React, {Component} from 'react'
import {ImagePicker, WingBlank} from 'antd-mobile'

export default class index extends Component {
  state = {
    tempSlides: [],
    multiple: true
  }
  onChange = (files, type, index) => {
    console.log(files, type, index)
    this.setState({
      files
    })
  }
  onSegChange = e => {
    const index = e.nativeEvent.selectedSegmentIndex
    this.setState({
      multiple: index === 1
    })
  }

  handleSubmit = () => {
    const {tempSlides} = this.state
    // let form = new FormData()
    // tempSlides.forEach(v => {
    //   form.append('file', v.file)
    //   console.log(form, v.file)
    // })
    const form = new FormData()
    tempSlides.forEach(item => form.append('file', item.file))
    console.log(form)
  }

  render() {
    const {tempSlides} = this.state
    return (
      <WingBlank>
        <ImagePicker
          files={tempSlides} // 数据
          onChange={this.onChange}
          onImageClick={(index, fs) => console.log(index, fs)}
          multiple={this.state.multiple}
        />
        <button onClick={this.handleSubmit}> 提交</button>
      </WingBlank>
    )
  }
}
