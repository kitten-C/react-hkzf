import React from 'react'

import {NavBar} from 'antd-mobile'

import {withRouter} from 'react-router'

import PropTypes from 'prop-types'

import style from './index.module.scss'

// 引入用到的组件
// 没有this直接用props
// 没有加入路由的组件可以通过withRouter高阶组件来获取到路由信息
// 进行属性的验证

const NavHeader = ({children, history}) => {
  return (
    <NavBar
      className={style.nvaBar}
      mode="light"
      icon={<i className="iconfont icon-back" />}
      onLeftClick={() => history.go(-1)}
    >
      {children}
    </NavBar>
  )
}
NavHeader.propTypes = {
  children: PropTypes.string.isRequired
}

export default withRouter(NavHeader)
