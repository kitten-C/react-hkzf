import {Toast} from 'antd-mobile'

const loading = () => {
  Toast.loading('加载中...', 0)
}

const closeLoading = () => {
  Toast.hide()
}

export {loading, closeLoading}
