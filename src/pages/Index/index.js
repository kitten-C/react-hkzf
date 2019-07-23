import React from 'react'

import {Link} from 'react-router-dom'
import {Carousel, Flex, Grid} from 'antd-mobile'
import axios from 'axios'

// 引入导航图片
import Nav1 from '../../assets/images/nav-1.png'
import Nav2 from '../../assets/images/nav-2.png'
import Nav3 from '../../assets/images/nav-3.png'
import Nav4 from '../../assets/images/nav-4.png'

import './index.scss'

// 主页导航的静态数据
const IndexVanDate = [
  {path: '/home/list', src: Nav1, text: '整租'},
  {path: '/home/list', src: Nav2, text: '合租'},
  {path: '/home/map', src: Nav3, text: '地图找房'},
  {path: '/rent/add', src: Nav4, text: '去出租'}
]

export default class extends React.Component {
  state = {
    swiperData: [],
    imgHeight: 176,
    isSwiperLoading: false,
    groupData: [],
    newsData: []
  }

  // 获取轮播图数据
  async getSwiperData() {
    const res = await axios({
      url: 'http://localhost:8080/home/swiper'
    })
    // console.log(res.data.body)
    this.setState({
      swiperData: res.data.body,
      isSwiperLoading: true
    })
  }

  // 获取租房小组数据
  async getGroupData() {
    const res = await axios({
      url: 'http://localhost:8080/home/groups?area=AREA%7C88cff55c-aaa4-e2e0'
    })
    this.setState({
      groupData: res.data.body
    })
  }

  // 获取最新资讯数据
  async getNewsData() {
    const res = await axios({
      url: 'http://localhost:8080/home/news?area=AREA%7C88cff55c-aaa4-e2e0'
    })
    this.setState({
      newsData: res.data.body
    })
  }

  renderSwipers() {
    return this.state.swiperData.map(v => (
      <a
        key={v.id}
        href="baidu.com"
        style={{
          display: 'inline-block',
          width: '100%',
          height: this.state.imgHeight
        }}
      >
        <img
          src={`http://localhost:8080${v.imgSrc}`}
          alt=""
          style={{width: '100%', verticalAlign: 'top'}}
          onLoad={() => {
            window.dispatchEvent(new Event('resize'))
            this.setState({imgHeight: 'auto'})
          }}
        />
      </a>
    ))
  }

  renderIndexVan() {
    return IndexVanDate.map((v, i) => {
      return (
        <Flex.Item key={i}>
          <Link to={v.path}>
            <img src={v.src} alt="" />
            <p>{v.text}</p>
          </Link>
        </Flex.Item>
      )
    })
  }

  renderGroupItem(v) {
    return (
      <Flex justify="between">
        <div className="group_item_text">
          <div className="group_item_text_title">{v.title}</div>
          <div className="group_item_text_info">{v.desc}</div>
        </div>
        <img src={`http://localhost:8080${v.imgSrc}`} alt="" />
      </Flex>
    )
  }

  componentDidMount() {
    // 获取轮播图数据
    this.getSwiperData()

    // 获取租房小组数据
    this.getGroupData()

    // 获取最新资讯数据
    this.getNewsData()
  }

  render() {
    return (
      <div>
        {/* 定位 */}
        <Flex className="serch_bar" justify="between">
          <Flex className="serch_bar_left">
            <div className="location">
              <span>上海</span>
              <i className="iconfont icon-arrow" />
            </div>
            <div className="location_search">
              <i className="iconfont icon-seach" />
              <span>请输入小区或地址</span>
            </div>
          </Flex>
          <i className="iconfont icon-map" />
        </Flex>
        {/* 数据载入后，再渲染轮播图，解决没有数据时就渲染，不会自动播放的bug */}
        {this.state.isSwiperLoading && (
          <Carousel autoplay={true} infinite>
            {this.renderSwipers()}
          </Carousel>
        )}

        <Flex className="index_nav">
          {/* 主页导航渲染 */}
          {this.renderIndexVan()}
        </Flex>

        {/* 租房小组 */}
        <div className="group">
          <Flex className="group_title" justify="between">
            <h3>租房小组</h3>
            <p>更多</p>
          </Flex>
          <Grid
            columnNum={2}
            hasLine={false}
            activeStyle={true}
            data={this.state.groupData}
            itemStyle={{height: '85px'}}
            // 自定义渲染grid中的内容
            renderItem={this.renderGroupItem}
          />
        </div>
      </div>
    )
  }
}
