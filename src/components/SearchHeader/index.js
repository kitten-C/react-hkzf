import React from 'react'

import {Flex} from 'antd-mobile'

import {Link} from 'react-router-dom'

import {withRouter} from 'react-router'

// import PropTypes from 'prop-types'

import style from './index.module.scss'

const Searchheader = ({history, curCity, className = ''}) => {
  return (
    <Flex className={[style.serchBar, className].join(' ')} justify="between">
      <Flex className={style.serchBarLeft}>
        <Link className={style.location} to="/citylist">
          <span>{curCity}</span>
          <i className="iconfont icon-arrow" />
        </Link>
        <div className={style.locationSearch}>
          <i className="iconfont icon-seach" />
          <span>请输入小区或地址</span>
        </div>
      </Flex>
      <i className="iconfont icon-map" onClick={() => history.push('/map')} />
    </Flex>
  )
}

export default withRouter(Searchheader)
