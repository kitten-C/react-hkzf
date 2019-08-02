import React from 'react'
import {Route} from 'react-router-dom'

// 其他页面组件
import Index from '../Index'
import HomeList from '../HomeList'
import News from '../News'
import Profile from '../Profile'

import './index.scss'

// 使用antd-mobile中的TabBar组件
import {TabBar} from 'antd-mobile'

// 下方标签栏导航渲染使用的静态数据
const TABBARITEMS = [
  {title: '首页', icon: 'ind', path: '/home'},
  {title: '找房', icon: 'findHouse', path: '/home/list'},
  {title: '此讯', icon: 'infom', path: '/home/news'},
  {title: '我的', icon: 'my', path: '/home/profile'}
]

export default class extends React.Component {
  state = {
    selectedTab: this.props.location.pathname,
    hidden: false
  }

  renderContent() {
    return (
      <>
        <Route path="/home" exact component={Index} />
        <Route path="/home/list" exact component={HomeList} />
        <Route path="/home/news" exact component={News} />
        <Route path="/home/profile" exact component={Profile} />
      </>
    )
  }

  renderTabBarItem = () => {
    return TABBARITEMS.map(v => {
      return (
        <TabBar.Item
          title={v.title}
          key={v.path}
          icon={<i className={`iconfont icon-${v.icon}`} />}
          selectedIcon={<i className={`iconfont icon-${v.icon}`} />}
          selected={this.state.selectedTab === v.path}
          onPress={() => {
            this.props.history.push(v.path)
            // this.setState({
            //   selectedTab: v.path
            // })
          }}
          data-seed="logId"
        />
      )
    })
  }

  componentDidUpdate(preProps) {
    // 当历史路径和现在路径不同时，修改selecteTab，实现tabBar选中
    if (this.props.location.pathname === preProps.location.pathname) return
    this.setState({
      selectedTab: this.props.location.pathname
    })
  }

  render() {
    return (
      <>
        {/* 路由内容渲染 */}
        {this.renderContent()}
        <div className="tabBar">
          <TabBar
            unselectedTintColor="#949494"
            barTintColor="white"
            hidden={this.state.hidden}
            tintColor="#21b97a"
          >
            {// 下方标签栏导航渲染
            this.renderTabBarItem()}
          </TabBar>
        </div>
      </>
    )
  }
}
