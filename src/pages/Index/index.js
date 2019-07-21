import React from 'react'

import {Link} from 'react-router-dom'
import {Carousel, Flex} from 'antd-mobile'
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
    isSwiperLoading: false
  }

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

  componentDidMount() {
    this.getSwiperData()
  }

  render() {
    return (
      <div>
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
      </div>
    )
  }
}
