import axios from 'axios'

import {BASE_URL} from './url'
import {getToken, clearToken} from './token'

const API = axios.create({
  baseURL: BASE_URL
})

// 设置请求拦截，在/user开头的去，请求中添加请求头 除了/user/login  /user/registered
API.interceptors.request.use(config => {
  const {url} = config
  if (
    url.startsWith('/user') &&
    !url.startsWith('/user/login') &&
    !url.startsWith('/user/registered')
  ) {
    config.headers.authorization = getToken()
  }
  return config
})

// 响应拦截，当token过期或者错误时，删除token
API.interceptors.response.use(res => {
  if (res.data.status === 400) {
    console.log('token过期')
    clearToken()
  }
  return res
})

export {API}
