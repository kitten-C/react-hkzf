import React from 'react'
import {Route} from 'react-router-dom'

import Index from '../../pages/Index'
import List from '../../pages/List'
import News from '../../pages/News'
import Profile from '../../pages/Profile'

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
      <div>
        <Route path="/home" exact component={Index} />
        <Route path="/home/list" exact component={List} />
        <Route path="/home/news" exact component={News} />
        <Route path="/home/profile" exact component={Profile} />
      </div>
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
            console.log(this.props)
            this.props.history.push(v.path)
            this.setState({
              selectedTab: v.path
            })
          }}
          data-seed="logId"
        >
          {this.renderContent()}
        </TabBar.Item>
      )
    })
  }

  render() {
    return (
      <div
        className="tabBar"
        // style={{position: 'fixed', height: '100%', width: '100%', top: 0}}
      >
        <TabBar
          unselectedTintColor="#949494"
          tintColor="#33A3F4"
          barTintColor="white"
          hidden={this.state.hidden}
        >
          {// 下方标签栏导航渲染
          this.renderTabBarItem()}
        </TabBar>
      </div>
    )
  }
}
