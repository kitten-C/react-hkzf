import React from 'react'

import {Carousel} from 'antd-mobile'
import axios from 'axios'

import './index.scss'

export default class extends React.Component {
  state = {
    swiperData: [],
    imgHeight: 176,
    isSwiperLoading: false
  }

  getSwiperData = async () => {
    const res = await axios({
      url: 'http://localhost:8080/home/swiper'
    })
    console.log(res.data.body)
    this.setState({
      swiperData: res.data.body,
      isSwiperLoading: true
    })
  }

  componentDidMount() {
    console.log(1)
    this.getSwiperData()
  }

  renderSwipers = () => {
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

  render() {
    return (
      this.state.isSwiperLoading && (
        <Carousel autoplay={true} infinite>
          {this.renderSwipers()}
        </Carousel>
      )
    )
  }
}
