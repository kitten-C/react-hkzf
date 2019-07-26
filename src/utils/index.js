import axios from 'axios'

import {getCity, setCity} from './city'

const BMap = window.BMap

// 根据IP定位城市地点
const getCurrentCity = () => {
  //  从locationstroage里获取定位城市数据
  const curCity = getCity()

  //  如果没有
  if (!curCity) {
    // 返回一个promise
    return new Promise(resolve => {
      const myCity = new BMap.LocalCity()
      myCity.get(async ({name}) => {
        try {
          // 请求后台这个城市的数据
          const res = await axios.get('http://localhost:8080/area/info', {
            params: {name}
          })

          const {label, value} = res.data.body

          // 把获取到的数据返回出去
          resolve({label, value})

          // 把数据存入locationstorage内
          setCity({label, value})
        } catch (error) {
          // 请求出错设置默认值
          resolve({label: '上海', value: 'AREA|dbf46d32-7e76-1196'})
        }
      })
    })
  } else {
    // 把获取到的值返回出去
    return Promise.resolve(curCity)
  }
}

export {getCurrentCity, getCity, setCity}
