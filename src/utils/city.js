// 设置一个默认的key值
const CITY_KEY = 'hkzf_city'

// 获取城市信息
export const getCity = () => JSON.parse(localStorage.getItem(CITY_KEY))

// 设置选中城市信息
export const setCity = v => localStorage.setItem(CITY_KEY, JSON.stringify(v))
