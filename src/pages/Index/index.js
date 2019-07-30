import React from 'react'

import {Link} from 'react-router-dom'
import {Carousel, Flex, Grid} from 'antd-mobile'

import {getCurrentCity, BASE_URL, API} from '../../utils/index'

// 引入搜索导航
import SearchHeader from '../../components/SearchHeader'

// console.log(API)
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
    newsData: [],
    curCity: ''
  }

  // 获取轮播图数据
  async getSwiperData() {
    // const res = await axios({
    //   url: 'http://localhost:8080/home/swiper'
    // })
    const res = await API.get('/home/swiper')
    this.setState({
      swiperData: res.data.body,
      isSwiperLoading: true
    })
  }

  // 获取租房小组数据
  async getGroupData() {
    const res = await API({
      url: 'http://localhost:8080/home/groups?area=AREA%7C88cff55c-aaa4-e2e0'
    })
    this.setState({
      groupData: res.data.body
    })
  }

  // 获取最新资讯数据
  async getNewsData() {
    const res = await API({
      url: 'http://localhost:8080/home/news?area=AREA%7C88cff55c-aaa4-e2e0'
    })
    this.setState({
      newsData: res.data.body
    })
  }

  // 渲染定位城市
  async getLocationCity() {
    // 定位城市
    const {label} = await getCurrentCity()
    this.setState({
      curCity: label
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
          src={`${BASE_URL}${v.imgSrc}`}
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
        <img src={`${BASE_URL}${v.imgSrc}`} alt="" />
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
    // console.log(12)s

    // 渲染定位城市
    this.getLocationCity()
  }

  render() {
    return (
      <div>
        {/* 定位 */}
        {/* <Flex className="serch_bar" justify="between">
          <Flex className="serch_bar_left">
            <Link className="location" to="/citylist">
              <span>{this.state.curCity}</span>
              <i className="iconfont icon-arrow" />
            </Link>
            <div className="location_search">
              <i className="iconfont icon-seach" />
              <span>请输入小区或地址</span>
            </div>
          </Flex>
          <i
            className="iconfont icon-map"
            onClick={() => this.props.history.push('/map')}
          />
        </Flex> */}
        <SearchHeader curCity={this.state.curCity} />
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
