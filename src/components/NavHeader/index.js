import React from 'react'

import {NavBar} from 'antd-mobile'

const NavHeader = () => {
  return (
    <NavBar
      className="nvaBar"
      mode="light"
      icon={<i className="iconfont icon-back" />}
      onLeftClick={() => this.props.history.go(-1)}
    >
      城市选择
    </NavBar>
  )
}
