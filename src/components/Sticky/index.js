import React, {Component, createRef} from 'react'

import styles from './index.module.scss'

export default class extends Component {
  // 占位符
  placeholderRef = createRef()
  // 内容
  contRef = createRef()

  handleScroll = () => {
    const placeholderRef = this.placeholderRef.current
    const contRef = this.contRef.current
    const {top} = placeholderRef.getBoundingClientRect()

    if (top > 0) {
      placeholderRef.style.height = '0'
      contRef.classList.remove(styles.fixed)
    } else {
      contRef.classList.add(styles.fixed)
      placeholderRef.style.height = '40px'
    }
  }

  componentDidMount() {
    console.log(styles)
    window.addEventListener('scroll', this.handleScroll)
  }

  render() {
    return (
      <>
        <div ref={this.placeholderRef} />
        <div ref={this.contRef}>{this.props.children}</div>
      </>
    )
  }
}
